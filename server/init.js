import { Meteor } from 'meteor/meteor'
import { Migrations } from 'meteor/percolate:migrations'
import { Roles } from 'meteor/alanning:roles'
import { Volunteers } from '../both/init'
import { runFixtures } from '../imports/fixtures/index'
import './email'
import './migrations'
import './rateLimiter'

// startup function - MAIN

Meteor.startup(() => {
  // The top-level division must always exist — it's a structural requirement,
  // not fixture data. Without it, managers can't create departments.
  if (Volunteers.collections.division.find().count() === 0) {
    const divId = Volunteers.collections.division.insert({
      name: 'NOrg',
      policy: 'public',
      parentId: 'TopEntity',
    })
    Roles.createRole(divId, { unlessExists: true })
  }

  if (Meteor.isDevelopment) {
    runFixtures(Volunteers)
  }
})

Meteor.startup(() => {
  /* Migrations.unlock() */
  Migrations.migrateTo('latest')
})
