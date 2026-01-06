import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import apiFetch from '../../../lib/api'
import styles from '../../../styles/Form.module.css'

export default function EditEvent() {
  const router = useRouter()
  const { id } = router.query
  const [formData, setFormData] = useState({
    name: '',
    shortDesc: '',
    longDesc: '',
    date: '',
    time: '',
    venue: '',
    is_published: false
  })
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    apiFetch(`/events/${id}`)
      .then(event => {
        setFormData({
          name: event.name || '',
          shortDesc: event.shortDesc || '',
          longDesc: event.longDesc || '',
          date: event.date || '',
          time: event.time || '',
          venue: event.venue || '',
          is_published: event.is_published || false
        })
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      await apiFetch(`/admin/events/${id}/update`, {
        method: 'PUT',
        body: formData
      })

      if (image) {
        const formData = new FormData()
        formData.append('image', image)

        const token = typeof window !== 'undefined' ? localStorage.getItem('ecess_admin_token') : null
        const base = process.env.NEXT_PUBLIC_API_URL || ''
        const url = `${base}/admin/events/upload-image/${id}`

        await fetch(url, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        })
      }

      router.push('/events')
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (loading) return <Layout><p>Loading event...</p></Layout>

  return (
    <Layout>
      <div className={styles.header}>
        <h1>Edit Event</h1>
        <p className={styles.subtitle}>Update event details</p>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Event Name *</label>
            <input 
              className={styles.formInput}
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required
              placeholder="Enter event name"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Short Description</label>
            <input 
              className={styles.formInput}
              name="shortDesc" 
              value={formData.shortDesc} 
              onChange={handleChange}
              placeholder="Brief description (one line)"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Long Description</label>
            <textarea 
              className={styles.formTextarea}
              name="longDesc" 
              value={formData.longDesc} 
              onChange={handleChange}
              placeholder="Detailed event description"
            />
          </div>

          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Date</label>
              <input 
                className={styles.formInput}
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Time</label>
              <input 
                className={styles.formInput}
                type="time" 
                name="time" 
                value={formData.time} 
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Venue</label>
            <input 
              className={styles.formInput}
              name="venue" 
              value={formData.venue} 
              onChange={handleChange}
              placeholder="Event location/venue"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Update Event Image</label>
            <div className={styles.fileInput}>
              <input 
                className={styles.fileInputField}
                type="file" 
                accept="image/*" 
                onChange={(e) => setImage(e.target.files[0])}
              />
              {image && <p className={styles.fileName}>Selected: {image.name}</p>}
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input 
                className={styles.checkboxInput}
                type="checkbox" 
                name="is_published" 
                checked={formData.is_published} 
                onChange={handleChange}
              />
              <span className={styles.checkboxSpan}>Publish this event</span>
            </label>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button type="submit" disabled={saving} className={styles.submitBtn}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
