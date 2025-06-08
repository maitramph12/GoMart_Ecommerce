import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const showConfirmDialog = ({
  title,
  message,
  confirmLabel = 'Tiếp tục',
  cancelLabel = 'Huỷ bỏ',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  confirmAlert({
    title,
    message,
    buttons: [
      {
        label: cancelLabel,
        onClick: onCancel,
        className: 'px-4 py-2 bg-red text-gray rounded-md hover:text-gray-800',
      },
      {
        label: confirmLabel,
        onClick: onConfirm,
        className: 'px-4 py-2 !bg-green text-white rounded-md hover:bg-red',
      },
    ],
    closeOnClickOutside: true,
    closeOnEscape: true,
    overlayClassName: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
    customUI: ({ onClose, title, message, buttons }) => {
      return (
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end gap-4">
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={() => {
                  button.onClick?.();
                  onClose();
                }}
                className={button.className}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      );
    },
  });
}; 