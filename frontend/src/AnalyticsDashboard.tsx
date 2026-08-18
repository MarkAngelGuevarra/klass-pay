import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Trophy, TrendingUp, Users, Activity, ExternalLink } from 'lucide-react';
import { getAllBillsMetadata, BillMetadata } from './firebase';

const AnalyticsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState<Array<{ id: number; metadata: BillMetadata }>>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAllBillsMetadata();
        // Sort by newest first
        const sorted = data.sort((a, b) => {
          const dateA = a.metadata.createdAt ? new Date(a.metadata.createdAt).getTime() : 0;
          const dateB = b.metadata.createdAt ? new Date(b.metadata.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        setBills(sorted);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Generate chart data based on bill creation dates
  const generateChartData = () => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: 0,
        volume: 0
      };
    });

    bills.forEach(bill => {
      if (bill.metadata.createdAt) {
        const billDate = new Date(bill.metadata.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dayMatch = last7Days.find(d => d.date === billDate);
        if (dayMatch) {
          dayMatch.count += 1;
          // Assume average bill target is 50 XLM for volume estimation since we don't index on-chain amounts yet
          dayMatch.volume += 50; 
        }
      }
    });
    return last7Days;
  };

  const chartData = generateChartData();
  const totalBills = bills.length;
  const activeCurrencies = new Set(bills.map(b => b.metadata.currency || 'XLM')).size;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="analytics-container"
      style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            className="btn" 
            style={{ padding: '0.5rem', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}
            onClick={() => navigate('/')}
          >
            ← Back
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Protocol Analytics
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Real-time Mainnet Settlement Data</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading network data...</div>
      ) : (
        <>
          {/* Top Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            <motion.div whileHover={{ y: -5 }} style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <Activity size={24} color="#3B82F6" />
                <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Bills Created</h3>
              </div>
              <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>{totalBills}</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <TrendingUp size={24} color="#10B981" />
                <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Est. Network Volume</h3>
              </div>
              <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>{totalBills * 50} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>XLM</span></p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <Users size={24} color="#8B5CF6" />
                <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Supported Assets</h3>
              </div>
              <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>{activeCurrencies}</p>
            </motion.div>
          </div>

          {/* Charts Section */}
          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--glass-border)', marginBottom: '3rem' }}>
            <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} color="var(--primary)" /> Protocol Growth (7 Days)
            </h3>
            <div style={{ height: '350px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text)' }}
                    itemStyle={{ color: 'var(--primary)' }}
                  />
                  <Area type="monotone" dataKey="volume" name="Volume (XLM)" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Bills Feed */}
          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={20} color="#10B981" /> Live Network Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {bills.slice(0, 8).map((bill, index) => (
                <motion.div 
                  key={`${bill.id}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}
                >
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{bill.metadata.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{bill.metadata.description}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>ID: {bill.id}</span>
                      <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                        {bill.metadata.currency || 'XLM'}
                      </span>
                    </div>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {bill.metadata.createdAt ? new Date(bill.metadata.createdAt).toLocaleString() : 'Recent'}
                    </p>
                  </div>
                </motion.div>
              ))}
              {bills.length === 0 && (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No bills found on the network yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AnalyticsDashboard;
