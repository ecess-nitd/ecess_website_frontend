import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import apiFetch from '../../lib/api'
import styles from '../../styles/Form.module.css'

export default function CreateEvent() {
  const router = useRouter()
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await apiFetch('/admin/events/post', {
        method: 'POST',
        body: formData
      })

      // Backend returns: { message: "...", event: { _id: "...", ... } }
      const eventId = response?.event?._id

      if (image && eventId) {
        const imageFormData = new FormData()
        imageFormData.append('image', image)

        const token = typeof window !== 'undefined' ? localStorage.getItem('ecess_admin_token') : null
        const base = process.env.NEXT_PUBLIC_API_URL || ''
        const url = `${base}/admin/events/upload-image/${eventId}`

        await fetch(url, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: imageFormData
        })
      }

      router.push('/events')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className={styles.header}>
        <h1>Create New Event</h1>
        <p className={styles.subtitle}>Add a new event to the system</p>
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
            <label className={styles.formLabel}>Event Image</label>
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
              <span className={styles.checkboxSpan}>Publish this event immediately</span>
            </label>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Creating...' : 'Create Event'}
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
