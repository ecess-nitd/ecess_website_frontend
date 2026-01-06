import { useEffect, useState } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import ConfirmDialog from '../components/ConfirmDialog'
import apiFetch from '../lib/api'
import styles from '../styles/AccessList.module.css'

export default function Home() {
  const [authorizedEmails, setAuthorizedEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [addingEmail, setAddingEmail] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, email: '' })

  useEffect(() => {
    fetchAuthorizedEmails()
  }, [])

  const fetchAuthorizedEmails = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiFetch('/admin/authorized-emails')
      setAuthorizedEmails(data || [])
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleAddEmail = async (e) => {
    e.preventDefault()
    
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      alert('Please fill in all fields')
      return
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      alert('Please enter a valid email address')
      return
    }

    // Password validation
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }

    try {
      setAddingEmail(true)
      await apiFetch('/admin/authorized-emails', {
        method: 'POST',
        body: JSON.stringify({ 
          name: newName.trim(),
          email: newEmail.trim(),
          password: newPassword 
        })
      })
      
      setAuthorizedEmails([...authorizedEmails, { 
        name: newName.trim(),
        email: newEmail.trim(), 
        added_at: new Date().toISOString() 
      }])
      setNewName('')
      setNewEmail('')
      setNewPassword('')
      setShowForm(false)
      setAddingEmail(false)
    } catch (err) {
      alert('Failed to add email: ' + err.message)
      setAddingEmail(false)
    }
  }

  const openDeleteDialog = (email) => {
    setDeleteDialog({ isOpen: true, email })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, email: '' })
  }

  const confirmDelete = async () => {
    try {
      await apiFetch(`/admin/authorized-emails/${encodeURIComponent(deleteDialog.email)}`, {
        method: 'DELETE'
      })
      
      setAuthorizedEmails(authorizedEmails.filter(item => item.email !== deleteDialog.email))
      closeDeleteDialog()
    } catch (err) {
      alert('Failed to remove email: ' + err.message)
      closeDeleteDialog()
    }
  }

  // Filter emails based on search query
  const filteredEmails = authorizedEmails.filter(item => {
    const query = searchQuery.toLowerCase()
    return (
      item.email?.toLowerCase().includes(query) ||
      item.name?.toLowerCase().includes(query)
    )
  })

  return (
    <Layout>
      <>
        <Head>
          <title>Dashboard - ECESS Admin</title>
        </Head>

        <div className={styles.container}>
          <div className={styles.headerCard}>
            <div className={styles.headerTop}>
              <h2 className={styles.heading}>Authorized Access</h2>
              <button 
                onClick={() => setShowForm(true)}
                className={styles.grantButton}
              >
                + Grant Access
              </button>
            </div>
            <div className={styles.searchWrap}>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          {/* Grant Access Form Modal */}
          {showForm && (
            <div className={styles.modalOverlay} onClick={() => setShowForm(false)}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <h3 className={styles.modalTitle}>Grant Admin Access</h3>
                  <button 
                    onClick={() => setShowForm(false)} 
                    className={styles.closeBtn}
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleAddEmail} className={styles.modalForm}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Name</label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className={styles.formInput}
                      disabled={addingEmail}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email Address</label>
                    <input
                      type="email"
                      placeholder="admin@example.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className={styles.formInput}
                      disabled={addingEmail}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Password</label>
                    <input
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={styles.formInput}
                      disabled={addingEmail}
                      required
                    />
                  </div>
                  <div className={styles.modalActions}>
                    <button 
                      type="button"
                      onClick={() => setShowForm(false)}
                      className={styles.cancelBtn}
                      disabled={addingEmail}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className={styles.submitBtn}
                      disabled={addingEmail}
                    >
                      {addingEmail ? 'Granting...' : 'Grant Access'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Email List */}
          {loading ? (
              <div className={styles.stateCard}>
                <p className={styles.stateText}>Loading authorized emails...</p>
              </div>
            ) : error ? (
              <div className={styles.errorCard}>
                <p className={styles.errorTitle}>Error loading emails</p>
                <p className={styles.errorText}>{error}</p>
                <button onClick={fetchAuthorizedEmails} className={styles.retryBtn}>
                  Retry
                </button>
              </div>
            ) : authorizedEmails.length === 0 ? (
              <div className={styles.emptyCard}>
                <div className={styles.emptyIcon}>📧</div>
                <h3 className={styles.emptyTitle}>No authorized emails yet</h3>
                <p className={styles.emptyText}>
                  Click "Grant Access" to add admin users
                </p>
              </div>
            ) : filteredEmails.length === 0 ? (
              <div className={styles.emptyCard}>
                <div className={styles.emptyIcon}>🔍</div>
                <h3 className={styles.emptyTitle}>No results found</h3>
                <p className={styles.emptyText}>
                  No emails match your search query
                </p>
              </div>
            ) : (
              <div className={styles.emailListCard}>
                <div className={styles.emailListHeader}>
                  <p className={styles.emailCount}>
                    Showing <b>{filteredEmails.length}</b> of <b>{authorizedEmails.length}</b> email{authorizedEmails.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className={styles.emailList}>
                  {filteredEmails.map((item, index) => (
                    <div key={item.email || index} className={styles.emailItem}>
                      <div className={styles.emailInfo}>
                        <span className={styles.emailIcon}>✉️</span>
                        <div className={styles.emailDetails}>
                          {item.name && (
                            <p className={styles.emailName}>{item.name}</p>
                          )}
                          <p className={styles.emailAddress}>{item.email}</p>
                          {item.added_at && (
                            <p className={styles.emailMeta}>
                              Added {new Date(item.added_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => openDeleteDialog(item.email)}
                        className={styles.removeBtn}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          title="Remove Email Access"
          message={`Are you sure you want to remove admin access for ${deleteDialog.email}?`}
          confirmText="Remove"
          cancelText="Cancel"
          danger
          onConfirm={confirmDelete}
          onCancel={closeDeleteDialog}
        />
      </>
    </Layout>
  )
}
