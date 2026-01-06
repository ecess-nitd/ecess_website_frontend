import styles from '../styles/ConfirmDialog.module.css'

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', danger = false }) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{title}</h3>
        </div>
        <div className={styles.body}>
          <p>{message}</p>
        </div>
        <div className={styles.footer}>
          <button onClick={onCancel} className={styles.cancelBtn}>
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className={danger ? styles.dangerBtn : styles.confirmBtn}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
