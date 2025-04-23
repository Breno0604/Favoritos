import React, { useEffect, useState } from 'react';
import { X, AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

const TOAST_DURATION = 3000; // 3 segundos

const Toast = ({ type = TOAST_TYPES.INFO, message, onClose }) => {
  const [visible, setVisible] = useState(true);
  
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300); // tempo para animação
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, TOAST_DURATION);
    
    return () => clearTimeout(timer);
  }, []);
  
  const getIcon = () => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case TOAST_TYPES.ERROR:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case TOAST_TYPES.WARNING:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case TOAST_TYPES.INFO:
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getToastClasses = () => {
    const baseClasses = "flex items-center gap-2 p-4 rounded-md shadow-md border transition-all duration-300";
    
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return cn(baseClasses, "bg-green-50 border-green-200 text-green-800", visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0");
      case TOAST_TYPES.ERROR:
        return cn(baseClasses, "bg-red-50 border-red-200 text-red-800", visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0");
      case TOAST_TYPES.WARNING:
        return cn(baseClasses, "bg-yellow-50 border-yellow-200 text-yellow-800", visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0");
      case TOAST_TYPES.INFO:
      default:
        return cn(baseClasses, "bg-blue-50 border-blue-200 text-blue-800", visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0");
    }
  };
  
  return (
    <div className={getToastClasses()}>
      {getIcon()}
      <span className="flex-1">{message}</span>
      <button onClick={handleClose} className="p-1 rounded-full hover:bg-black/10">
        <X className="h-4 w-4" />
        <span className="sr-only">Fechar</span>
      </button>
    </div>
  );
};

// Componente para gerenciar múltiplas toasts
const ToastContainer = ({ toasts = [], onClose }) => {
  // Limitar a quantidade de toasts (mostrar apenas as 3 mais recentes)
  const visibleToasts = toasts.slice(-3);
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {visibleToasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </div>
  );
};

export { Toast, ToastContainer, TOAST_TYPES }; 