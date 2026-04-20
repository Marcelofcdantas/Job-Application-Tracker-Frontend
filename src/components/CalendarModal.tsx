import React, { useState } from 'react';
import { Interview } from '../models/interview';
import { downloadCalendarEvent } from '../utils/calendar';
import { motion } from 'framer-motion';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview: Interview;
}

export const CalendarModal = ({ isOpen, onClose, interview }: CalendarModalProps) => {
  const [type, setType] = useState<'online' | 'in-person'>('online');
  const [formData, setFormData] = useState({
    platform: interview.platform || '',
    link: interview.link || '',
    address: interview.address || ''
  });

  if (!isOpen) return null;

  const handleConfirm = () => {
    downloadCalendarEvent({
      ...interview,
      ...formData
    });
    onClose();
  };

  return (
    <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <motion.div 
        className="modal"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.18 }}
        >
        <h2 className='modal-title-row'>Details of {interview.companyName}</h2>
        
        <label className="input-group">Interview Type</label>
        <select value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="online">Remote</option>
            <option value="presencial">In-person</option>
            </select>

            {type === 'online' ? (
            <>
                <input
                className='autocomplete-field' 
                placeholder="Platform (e.g. Zoom, Meet)" 
                value={formData.platform}
                onChange={(e) => setFormData({...formData, platform: e.target.value})}
                />
                <input 
                placeholder="Meeting Link" 
                value={formData.link}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
                />
            </>
            ) : (
            <input 
                placeholder="Address" 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
            )}
        <div className='modal-actions'>
            <button 
                className='primary-button'
                onClick={handleConfirm}
            >
                Add to Calendar
            </button>
            <button 
                className='secondary-button'
                onClick={onClose}
            >
                Close
            </button>
        </div>
      </motion.div>
    </motion.div>
  );
};