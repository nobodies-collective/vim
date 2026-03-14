import React, {
  useEffect, useState, useMemo, useCallback,
} from 'react'
import Blaze from 'meteor/gadicc:blaze-react-component'
import { AutoForm } from 'meteor/aldeed:autoform'
import { useHistory } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import moment from 'moment'

import { EventSettings } from '../../../both/collections/settings'
import { Volunteers } from '../../../both/init'

const FORM_ID = 'EventSettingsEdit'

// Derive ISO-week-aligned weeks that overlap the build period
const getBuildWeeks = (buildPeriod) => {
  if (!buildPeriod?.start || !buildPeriod?.end) return []
  const weeks = []
  // Start from the Monday of the week containing buildPeriod.start
  let current = moment(buildPeriod.start).startOf('isoWeek')
  const end = moment(buildPeriod.end)
  while (current.isBefore(end)) {
    weeks.push(current.clone().toDate())
    current.add(1, 'week')
  }
  return weeks
}

const weekKey = (date) => moment(date).format('YYYY-MM-DD')

const BuildLimitsSection = ({ settings }) => {
  const departments = useTracker(() => {
    Meteor.subscribe(`${Volunteers.eventName}.Volunteers.department`)
    return Volunteers.collections.department.find({}, { sort: { name: 1 } }).fetch()
  }, [])

  const buildWeeks = useMemo(() => getBuildWeeks(settings?.buildPeriod), [settings?.buildPeriod])

  // limits keyed by weekKey(weekStart) => { overall, departments: { [deptId]: limit } }
  const [limits, setLimits] = useState({})
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!settings?.buildDailyLimits) return
    const initial = {}
    settings.buildDailyLimits.forEach((wl) => {
      const key = weekKey(wl.weekStart)
      const depts = {}
      ;(wl.departments || []).forEach((d) => { depts[d.departmentId] = d.limit })
      initial[key] = { overall: wl.overall, departments: depts }
    })
    setLimits(initial)
  }, [settings?._id]) // only reset when settings doc changes identity

  const setOverall = useCallback((key, value) => {
    setLimits((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || { departments: {} }), overall: Number(value) || 0 },
    }))
    setSaved(false)
  }, [])

  const setDeptLimit = useCallback((key, deptId, value) => {
    setLimits((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || { overall: 0, departments: {} }),
        departments: {
          ...(prev[key]?.departments || {}),
          [deptId]: Number(value) || 0,
        },
      },
    }))
    setSaved(false)
  }, [])

  const getValidationError = (key) => {
    const wl = limits[key]
    if (!wl) return null
    const deptTotal = Object.values(wl.departments || {}).reduce((a, b) => a + b, 0)
    if (deptTotal > (wl.overall || 0)) {
      return `Department limits total (${deptTotal}) exceeds overall (${wl.overall || 0})`
    }
    return null
  }

  const handleSave = () => {
    for (const key of buildWeeks.map(weekKey)) {
      const err = getValidationError(key)
      if (err) { setError(err); return }
    }
    const buildDailyLimits = buildWeeks.map((weekStart) => {
      const key = weekKey(weekStart)
      const wl = limits[key] || { overall: 0, departments: {} }
      return {
        weekStart,
        overall: wl.overall || 0,
        departments: Object.entries(wl.departments || {})
          .filter(([, limit]) => limit > 0)
          .map(([departmentId, limit]) => ({ departmentId, limit })),
      }
    })
    Meteor.call('settings.updateBuildLimits', { _id: settings._id, buildDailyLimits }, (err) => {
      if (err) {
        setError(err.message)
      } else {
        setError(null)
        setSaved(true)
      }
    })
  }

  if (!buildWeeks.length) {
    return <p className="text-muted">Set a build period above to configure daily limits.</p>
  }

  return (
    <div>
      {buildWeeks.map((weekStart, i) => {
        const key = weekKey(weekStart)
        const wl = limits[key] || { overall: 0, departments: {} }
        const deptTotal = Object.values(wl.departments || {}).reduce((a, b) => a + b, 0)
        const remaining = (wl.overall || 0) - deptTotal
        const validationErr = getValidationError(key)
        const weekEnd = moment(weekStart).endOf('isoWeek')

        return (
          <div key={key} className="card mb-3">
            <div className="card-header">
              <strong>Build Week {i + 1}</strong>
              {' '}
              <span className="text-muted">
                {moment(weekStart).format('MMM D')} – {weekEnd.format('MMM D, YYYY')}
              </span>
            </div>
            <div className="card-body">
              <div className="form-group row align-items-center mb-3">
                <label className="col-sm-4 col-form-label font-weight-bold">
                  Overall daily limit
                </label>
                <div className="col-sm-3">
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={wl.overall || ''}
                    onChange={(e) => setOverall(key, e.target.value)}
                  />
                </div>
                <div className="col-sm-5 text-muted small">
                  Max people on site per day during this week
                </div>
              </div>

              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th style={{ width: 160 }}>Daily limit</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept._id}>
                      <td>{dept.name}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          className="form-control form-control-sm"
                          value={wl.departments?.[dept._id] || ''}
                          onChange={(e) => setDeptLimit(key, dept._id, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className={remaining < 0 ? 'table-danger' : 'table-light'}>
                    <td><strong>Departments total / Unallocated</strong></td>
                    <td>
                      <strong>{deptTotal}</strong>
                      {' / '}
                      <span className={remaining < 0 ? 'text-danger' : 'text-success'}>
                        {remaining}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              {validationErr && (
                <div className="alert alert-danger py-1">{validationErr}</div>
              )}
            </div>
          </div>
        )
      })}

      {error && <div className="alert alert-danger">{error}</div>}
      {saved && <div className="alert alert-success">Build limits saved.</div>}

      <button type="button" className="btn btn-primary" onClick={handleSave}>
        Save Build Daily Limits
      </button>
    </div>
  )
}

export const EventSettingsScreen = ({ settings, isLoaded }) => {
  const history = useHistory()
  useEffect(() => {
    AutoForm.addHooks(
      FORM_ID,
      {
        onSuccess: function onSuccess() {
          history.push('/manager')
        },
      },
      true,
    )
  }, [history])

  return (
    <div className="container">
      {isLoaded && settings && (
        <>
          <Blaze
            template="quickForm"
            collection={EventSettings}
            id={FORM_ID}
            doc={settings}
            type="method-update"
            meteormethod="settings.update"
            omitFields="eventName,buildDailyLimits"
          />

          <hr />
          <h4>Build Daily People Limits</h4>
          <p className="text-muted">
            Set a maximum number of people allowed on site per day for each build week.
            The overall cap is enforced per department — department limits must not exceed the overall.
          </p>
          <BuildLimitsSection settings={settings} />
        </>
      )}
    </div>
  )
}
