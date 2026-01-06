import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import ConfirmDialog from '../components/ConfirmDialog'
import apiFetch from '../lib/api'
import styles from '../styles/Team.module.css'

export default function TeamPage() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, memberId: null, memberName: '' })
  
  // Filters
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('all') // all | Second Year | Pre Final Year | Final Year
  
  const router = useRouter()

  const fetchMembers = async () => {
    try {
      const data = await apiFetch('/team')
      setMembers(data || [])
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const openDeleteDialog = (memberId, memberName) => {
    setDeleteDialog({ isOpen: true, memberId, memberName })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, memberId: null, memberName: '' })
  }

  const confirmDelete = async () => {
    try {
      await apiFetch(`/admin/team/${deleteDialog.memberId}`, { method: 'DELETE' })
      setMembers(members.filter(m => (m._id || m.id) !== deleteDialog.memberId))
      closeDeleteDialog()
    } catch (err) {
      alert('Failed to delete: ' + err.message)
      closeDeleteDialog()
    }
  }

  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase()

    return (members || []).filter(m => {
      const name = (m.name || '').toLowerCase()
      const post = (m.post || '').toLowerCase()
      const matchesSearch = q ? (name.includes(q) || post.includes(q)) : true

      const matchesYear =
        yearFilter === 'all'
          ? true
          : m.year === yearFilter

      return matchesSearch && matchesYear
    })
  }, [members, search, yearFilter])

  const clearFilters = () => {
    setSearch('')
    setYearFilter('all')
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Team Members</h1>
          <button className={styles.addButton} onClick={() => router.push('/team/create')}>
            + Add Member
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
                  placeholder="Search by name or post…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className={styles.segment}>
                <button
                  className={`${styles.segmentBtn} ${yearFilter === 'all' ? styles.segmentActive : ''}`}
                  onClick={() => setYearFilter('all')}
                  type="button"
                >
                  All
                </button>
                <button
                  className={`${styles.segmentBtn} ${yearFilter === 'Second Year' ? styles.segmentActive : ''}`}
                  onClick={() => setYearFilter('Second Year')}
                  type="button"
                >
                  Second Year
                </button>
                <button
                  className={`${styles.segmentBtn} ${yearFilter === 'Pre Final Year' ? styles.segmentActive : ''}`}
                  onClick={() => setYearFilter('Pre Final Year')}
                  type="button"
                >
                  Pre Final
                </button>
                <button
                  className={`${styles.segmentBtn} ${yearFilter === 'Final Year' ? styles.segmentActive : ''}`}
                  onClick={() => setYearFilter('Final Year')}
                  type="button"
                >
                  Final Year
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && <div className={styles.loading}>Loading team members...</div>}
        {error && <div className={styles.error}>Error: {error}</div>}

        {!loading && !error && (
          <div className={styles.tableWrapper}>
            {filteredMembers.length === 0 ? (
              <div className={styles.emptyState}>
                {members.length === 0 
                  ? 'No team members found. Add your first member!' 
                  : 'No matching members found. Try changing your search or filter.'}
              </div>
            ) : (
              <>
                <div className={styles.tableHeader}>
                  <p className={styles.tableHint}>
                    Showing <b>{filteredMembers.length}</b> of {members.length} member{members.length > 1 ? 's' : ''}
                  </p>
                </div>
                <table className={styles.table}>
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Post</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map(member => {
                  const memberId = member._id || member.id
                  return (
                    <tr key={memberId}>
                      <td>
                        {member.image_url ? (
                          <img src={member.image_url} alt={member.name} className={styles.memberPhoto} />
                        ) : (
                          <div className={styles.memberPhoto} style={{ background: '#e5e7eb' }} />
                        )}
                      </td>
                      <td>{member.name || 'N/A'}</td>
                      <td>{member.post || 'N/A'}</td>
                      <td>{member.year || 'N/A'}</td>
                      <td>
                        <div className={styles.actions}>
                          <button className={styles.editButton} onClick={() => router.push(`/team/edit/${memberId}`)}>
                            Edit
                          </button>
                          <button className={styles.deleteButton} onClick={() => openDeleteDialog(memberId, member.name)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
              </>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Team Member"
        message={`Are you sure you want to delete ${deleteDialog.memberName}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={closeDeleteDialog}
        confirmText="Delete"
        cancelText="Cancel"
        danger
      />
    </Layout>
  );
}
