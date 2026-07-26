import React from 'react';
import { motion } from 'framer-motion';

// Public demo video (replace with your own hosted video if needed)
const DEMO_VIDEO_URL = 'https://www.w3schools.com/html/mov_bbb.mp4';

export default function VideoDemo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '4rem auto',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        background: 'var(--glass-bg)',
      }}
    >
      <video
        src={DEMO_VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-label="KlassPay demo video"
      />
    </motion.div>
  );
}
