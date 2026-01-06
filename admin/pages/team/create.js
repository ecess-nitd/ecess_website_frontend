import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import apiFetch from '../../lib/api'
import styles from '../../styles/Form.module.css'

export default function CreateTeamMember() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    post: '',
    year: '',
    LinkedInHandle: '',
    InstaHandle: ''
  })
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Create team member
      const response = await apiFetch('/admin/team/add', {
        method: 'POST',
        body: formData
      })

      // Extract member ID (handle both response formats)
      const memberId = response.member?._id || response.member?.id || response._id || response.id

      // Upload image if selected
      if (image && memberId) {
        const imageFormData = new FormData()
        imageFormData.append('image', image)

        const token = typeof window !== 'undefined' ? localStorage.getItem('ecess_admin_token') : null
        const base = process.env.NEXT_PUBLIC_API_URL || ''
        const url = `${base}/admin/team/upload-member-image/${memberId}`

        await fetch(url, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: imageFormData
        })
      }

      router.push('/team')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Add Team Member</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.formInput}
              placeholder="Enter member name"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Post</label>
            <input
              name="post"
              value={formData.post}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="e.g., President, Vice President, Member"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Year</label>
            <input
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="e.g., 2024, Final Year, Second Year"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>LinkedIn Handle</label>
            <input
              name="LinkedInHandle"
              value={formData.LinkedInHandle}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Instagram Handle</label>
            <input
              name="InstaHandle"
              value={formData.InstaHandle}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="https://instagram.com/username"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Member Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className={styles.formInput}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formActions}>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? 'Adding...' : 'Add Member'}
            </button>
            <button type="button" onClick={() => router.back()} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
