import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import ConfirmDialog from '../components/ConfirmDialog'
import apiFetch from '../lib/api'
import styles from '../styles/Events.module.css'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, eventId: null, eventName: '' })

  // Filters
  const [search, setSearch] = useState('')
  const [publishedFilter, setPublishedFilter] = useState('all') // all | published | draft

  const router = useRouter()

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await apiFetch('/events')
      setEvents(data || [])
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const openDeleteDialog = (eventId, eventName) => {
    setDeleteDialog({ isOpen: true, eventId, eventName })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, eventId: null, eventName: '' })
  }

  const confirmDelete = async () => {
    try {
      await apiFetch(`/admin/events/${deleteDialog.eventId}`, { method: 'DELETE' })

      setEvents(prev =>
        prev.filter(e => (e._id || e.id) !== deleteDialog.eventId)
      )

      closeDeleteDialog()
    } catch (err) {
      alert('Failed to delete: ' + err.message)
      closeDeleteDialog()
    }
  }

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase()

    return (events || []).filter(e => {
      const name = (e.name || '').toLowerCase()
      const matchesSearch = q ? name.includes(q) : true

      const isPublished = !!e.is_published
      const matchesPublished =
        publishedFilter === 'all'
          ? true
          : publishedFilter === 'published'
            ? isPublished
            : !isPublished

      return matchesSearch && matchesPublished
    })
  }, [events, search, publishedFilter])

  const clearFilters = () => {
    setSearch('')
    setPublishedFilter('all')
  }

  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Events List</h1>
          </div>

          <button onClick={() => router.push('/events/create')} className={styles.primaryBtn}>
            + Create Event
          </button>
        </div>

        {/* Filters */}
        {!loading && !error && (
          <div className={styles.filtersCard}>
            <div className={styles.filtersLeft}>
              <div className={styles.searchWrap}>
                <span className={styles.searchIcon}>⌕</span>
                <input
                  className={styles.searchInput}
                  placeholder="Search by event name…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className={styles.segment}>
                <button
                  className={`${styles.segmentBtn} ${publishedFilter === 'all' ? styles.segmentActive : ''}`}
                  onClick={() => setPublishedFilter('all')}
                  type="button"
                >
                  All
                </button>
                <button
                  className={`${styles.segmentBtn} ${publishedFilter === 'published' ? styles.segmentActive : ''}`}
                  onClick={() => setPublishedFilter('published')}
                  type="button"
                >
                  Published
                </button>
                <button
                  className={`${styles.segmentBtn} ${publishedFilter === 'draft' ? styles.segmentActive : ''}`}
                  onClick={() => setPublishedFilter('draft')}
                  type="button"
                >
                  Draft
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className={styles.stateCard}>
            <div className={styles.skeletonRow} />
            <div className={styles.skeletonRow} />
            <div className={styles.skeletonRow} />
            <p className={styles.stateText}>Loading events…</p>
          </div>
        )}

        {error && (
          <div className={styles.errorCard}>
            <p className={styles.errorTitle}>Something went wrong</p>
            <p className={styles.errorText}>{error}</p>
            <button onClick={fetchEvents} className={styles.ghostBtn}>Retry</button>
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredEvents.length === 0 ? (
              <div className={styles.emptyCard}>
                <div className={styles.emptyIcon}>📅</div>
                <h2 className={styles.emptyTitle}>
                  {events.length === 0 ? 'No events yet' : 'No matching events'}
                </h2>
                <p className={styles.emptyText}>
                  {events.length === 0
                    ? 'Create your first event to get started.'
                    : 'Try changing your search or filter.'}
                </p>

                <div className={styles.emptyActions}>
                  {events.length === 0 ? (
                    <button onClick={() => router.push('/events/create')} className={styles.primaryBtn}>
                      Create Event
                    </button>
                  ) : (
                    <button onClick={clearFilters} className={styles.primaryBtn}>
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <div className={styles.tableHeader}>
                  <p className={styles.tableHint}>
                    Showing <b>{filteredEvents.length}</b> of {events.length} event{events.length > 1 ? 's' : ''}
                  </p>
                </div>

                <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Venue</th>
                        <th>Published</th>
                        <th className={styles.thActions}>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredEvents.map(event => {
                        const eventId = event._id || event.id

                        return (
                          <tr key={eventId}>
                            <td className={styles.nameCell}>{event.name || 'Untitled'}</td>
                            <td>{event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</td>
                            <td>{event.time || '-'}</td>
                            <td className={styles.venueCell}>{event.venue || '-'}</td>
                            <td>
                              <span className={event.is_published ? styles.badgePublished : styles.badgeDraft}>
                                {event.is_published ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td className={styles.actionsCell}>
                              <button
                                onClick={() => router.push(`/events/edit/${eventId}`)}
                                className={styles.secondaryBtn}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => openDeleteDialog(eventId, event.name)}
                                className={styles.dangerBtn}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
              </div>
            )}
          </>
        )}

        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          title="Delete Event"
          message={`Are you sure you want to delete "${deleteDialog.eventName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          danger={true}
          onConfirm={confirmDelete}
          onCancel={closeDeleteDialog}
        />
      </div>
    </Layout>
  )
}
