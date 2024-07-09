import React from 'react';
import '../styles/modal.css';

const Modal = ({ className = '', isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className={`modal-overlay`}>
            <div className={`modal ${className}`}>
                <button className="modal-close-button" onClick={onClose}>
                    {
                        className === '' ? <i className="bi bi-x-circle"></i> : ''
                    }
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;