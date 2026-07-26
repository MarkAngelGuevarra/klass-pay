import React from 'react';
import { motion } from 'framer-motion';

// Mock payment history data – replace with real contract calls later
const payments = [
  { id: '1', name: 'Trip to Bali', amount: '250 XLM', status: 'Completed' },
  { id: '2', name: 'Roommate Rent', amount: '500 XLM', status: 'Pending' },
  { id: '3', name: 'Group Project', amount: '150 XLM', status: 'Completed' },
];

export default function PaymentHistory() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.4 }}
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '3rem auto',
        padding: '1.5rem',
        borderRadius: '16px',
        background: 'var(--glass-bg)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
      }}
    >
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary)' }}>
        Recent Payments
      </h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {payments.map(p => (
          <li
            key={p.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.75rem 0',
              borderBottom: '1px solid var(--glass-border)',
            }}
          >
            <span style={{ fontWeight: 500 }}>{p.name}</span>
            <span>{p.amount}</span>
            <span style={{ color: p.status === 'Completed' ? '#10B981' : '#EF4444' }}>
              {p.status}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
