import { Meteor } from 'meteor/meteor'
import { Migrations } from 'meteor/percolate:migrations'
// import { Roles } from 'meteor/alanning:roles'
// import { rawCollectionOp } from 'meteor/goingnowhere:volunteers'

// import { EventSettings } from '../both/collections/settings'
// import { Volunteers } from '../both/init'

Migrations.config({
  log: true,
  logIfLatest: false,
  // Need to rename the collection if we want to base this DB on the old one
  collectionName: 'fistMigrations',
})

Migrations.add({
  version: 16,
  up() {
    // Last run migration needs to still exist for some reason
  },
})

// Make anyone who was a 2024 admin one for 2025
Migrations.add({
  version: 17,
  up() {
    Meteor.users.update(
      {
        roles: { $elemMatch: { _id: 'admin', scope: 'nowhere2024' } },
      },
      { $addToSet: { roles: { _id: 'admin', scope: 'nowhere2025', assigned: true } } },
      { multi: true },
    )
    Meteor.users.update(
      {
        roles: { $elemMatch: { _id: 'manager', scope: 'nowhere2024' } },
      },
      { $addToSet: { roles: { _id: 'manager', scope: 'nowhere2025', assigned: true } } },
      { multi: true },
    )
  },
})

// Make anyone who was a 2025 admin/manager one for 2026
Migrations.add({
  version: 18,
  up() {
    Meteor.users.update(
      {
        roles: { $elemMatch: { _id: 'admin', scope: 'nowhere2025' } },
      },
      { $addToSet: { roles: { _id: 'admin', scope: 'fixme2026', assigned: true } } },
      { multi: true },
    )
    Meteor.users.update(
      {
        roles: { $elemMatch: { _id: 'manager', scope: 'nowhere2025' } },
      },
      { $addToSet: { roles: { _id: 'manager', scope: 'fixme2026', assigned: true } } },
      { multi: true },
    )
  },
})

// Convert old-format roles (object with scope keys) to array-of-objects format
// expected by alanning:roles 2.2.0, then rename event scopes
Migrations.add({
  version: 19,
  up() {
    // Fix any old-format roles
    Meteor.users.find({ roles: { $exists: true, $not: { $type: 'array' } } })
      .forEach((user) => {
        const oldRoles = user.roles
        if (!oldRoles || typeof oldRoles !== 'object') return
        const newRoles = []
        Object.entries(oldRoles).forEach(([scope, roleNames]) => {
          if (!Array.isArray(roleNames)) return
          const actualScope = scope === '__global_roles__' ? null : scope
          roleNames.forEach((roleName) => {
            newRoles.push({ _id: roleName, scope: actualScope, assigned: true })
          })
        })
        Meteor.users.update(user._id, { $set: { roles: newRoles } })
        console.log(`Migrated old-format roles for user ${user._id}`)
      })
  },
})

// Rename event: fixme2026 → elsewhere2026 in user roles
Migrations.add({
  version: 20,
  up() {
    Meteor.users.find({ 'roles.scope': 'fixme2026' }).forEach((user) => {
      const newRoles = user.roles.map((role) => (
        role.scope === 'fixme2026' ? { ...role, scope: 'elsewhere2026' } : role
      ))
      Meteor.users.update(user._id, { $set: { roles: newRoles } })
    })
  },
})
