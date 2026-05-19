import React from 'react';
import { useStore } from '../store/useStore';
import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export function ToastNotification() {
  const notifications = useStore((state) => state.notifications);
  const removeNotification = useStore((state) => state.removeNotification);

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map((toast) => {
        let Icon = Info;
        if (toast.type === 'success') Icon = CheckCircle;
        if (toast.type === 'error') Icon = AlertTriangle;

        return (
          <div key={toast.id} className={`toast ${toast.type || 'success'}`}>
            <Icon size={20} className="toast-icon" />
            <span>{toast.message}</span>
            <button
              className="toast-close"
              onClick={() => removeNotification(toast.id)}
              aria-label="關閉"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
