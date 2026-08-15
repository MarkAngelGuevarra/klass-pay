import { Buffer } from 'buffer';
(window as unknown as Record<string, unknown>).Buffer = Buffer;

import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  PieChart as PieIcon,
  Activity,
  Layers,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Search,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Coins,
  DollarSign,
  PlusCircle,
} from 'lucide-react';
import App from './App';
import Landing from './Landing';
import ThemeToggle from './ThemeToggle';
import './index.css';
import './ui.css';

export interface ActivityItem {
  id: string;
  type: 'contribution' | 'creation' | 'settlement' | 'milestone';
  billId: number;
  billName: string;
  contributor: string;
  amount: number;
  currency: 'XLM' | 'USDC';
  timestamp: string;
  status: 'Settled' | 'Funded' | 'In Progress' | 'Created';
  txHash?: string;
}

export interface BillRosterItem {
  id: number;
  name: string;
  description: string;
  category: string;
  currency: 'XLM' | 'USDC';
  target: number;
  funded: number;
  contributorsCount: number;
  settled: boolean;
  createdAt: string;
  organizer: string;
}

const INITIAL_BILLS: BillRosterItem[] = [
  {
    id: 1042,
    name: 'Stellar APAC Hackathon House',
    description: 'Shared Airbnb & workspace rental for 6 developers in Singapore',
    category: 'Lodging & Workspace',
    currency: 'USDC',
    target: 4500,
    funded: 4500,
    contributorsCount: 6,
    settled: true,
    createdAt: '2026-08-08',
    organizer: 'GDHK...92LA',
  },
  {
    id: 1043,
    name: 'Soroban Smart Contract Audit',
    description: 'Community crowdfund for third-party security auditing',
    category: 'Security & Ops',
    currency: 'USDC',
    target: 3000,
    funded: 2450,
    contributorsCount: 14,
    settled: false,
    createdAt: '2026-08-11',
    organizer: 'GCBX...41PQ',
  },
  {
    id: 1044,
    name: 'Bali Founder Retreat Villa',
    description: 'Pool villa, catering and high-speed Starlink hub for team offsite',
    category: 'Travel & Retreat',
    currency: 'USDC',
    target: 6200,
    funded: 6200,
    contributorsCount: 8,
    settled: true,
    createdAt: '2026-08-05',
    organizer: 'GBXY...77KM',
  },
  {
    id: 1045,
    name: 'University Blockchain Club Demo Day',
    description: 'Food, merch, swag bags, and audio equipment rental',
    category: 'Community & Events',
    currency: 'XLM',
    target: 8500,
    funded: 7200,
    contributorsCount: 22,
    settled: false,
    createdAt: '2026-08-12',
    organizer: 'GA38...99ZZ',
  },
  {
    id: 1046,
    name: 'Web3 Builder Dinner & Drinks',
    description: 'Post-hackathon celebration banquet for 15 hackers',
    category: 'Dining & Social',
    currency: 'XLM',
    target: 3500,
    funded: 3500,
    contributorsCount: 15,
    settled: true,
    createdAt: '2026-08-14',
    organizer: 'GDT4...12VC',
  },
  {
    id: 1047,
    name: 'Student Flat Utilities & Fiber',
    description: 'Monthly high-speed gigabit fiber & electricity bill pool',
    category: 'Living Expenses',
    currency: 'XLM',
    target: 2250,
    funded: 1500,
    contributorsCount: 4,
    settled: false,
    createdAt: '2026-08-14',
    organizer: 'GAKL...88RR',
  },
];

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'settlement',
    billId: 1046,
    billName: 'Web3 Builder Dinner & Drinks',
    contributor: 'GDT4...12VC',
    amount: 3500,
    currency: 'XLM',
    timestamp: '12 mins ago',
    status: 'Settled',
    txHash: '9d4f...e2a1',
  },
  {
    id: 'act-2',
    type: 'contribution',
    billId: 1045,
    billName: 'University Blockchain Club Demo Day',
    contributor: 'GCP8...77KL',
    amount: 1000,
    currency: 'XLM',
    timestamp: '34 mins ago',
    status: 'Funded',
    txHash: '3a1c...f88b',
  },
  {
    id: 'act-3',
    type: 'milestone',
    billId: 1043,
    billName: 'Soroban Smart Contract Audit',
    contributor: 'GB99...43AA',
    amount: 500,
    currency: 'USDC',
    timestamp: '1 hour ago',
    status: 'Funded',
    txHash: '7e2b...4419',
  },
  {
    id: 'act-4',
    type: 'contribution',
    billId: 1047,
    billName: 'Student Flat Utilities & Fiber',
    contributor: 'GA38...99ZZ',
    amount: 500,
    currency: 'XLM',
    timestamp: '2 hours ago',
    status: 'In Progress',
    txHash: '11fe...c992',
  },
  {
    id: 'act-5',
    type: 'creation',
    billId: 1047,
    billName: 'Student Flat Utilities & Fiber',
    contributor: 'GAKL...88RR',
    amount: 2250,
    currency: 'XLM',
    timestamp: '5 hours ago',
    status: 'Created',
    txHash: '0xab...5561',
  },
  {
    id: 'act-6',
    type: 'settlement',
    billId: 1042,
    billName: 'Stellar APAC Hackathon House',
    contributor: 'GDHK...92LA',
    amount: 4500,
    currency: 'USDC',
    timestamp: '1 day ago',
    status: 'Settled',
    txHash: '8b9c...33df',
  },
  {
    id: 'act-7',
    type: 'contribution',
    billId: 1044,
    billName: 'Bali Founder Retreat Villa',
    contributor: 'GC77...22QQ',
    amount: 1200,
    currency: 'USDC',
    timestamp: '2 days ago',
    status: 'Settled',
    txHash: '5e6a...90bc',
  },
];

interface VolumeDataPoint {
  date: string;
  xlmVolume: number;
  usdcVolume: number;
  totalUsdEquivalent: number;
}

const TIMELINE_DATA: VolumeDataPoint[] = [
  { date: 'Aug 08', xlmVolume: 2200, usdcVolume: 4500, totalUsdEquivalent: 4764 },
  { date: 'Aug 09', xlmVolume: 3100, usdcVolume: 5200, totalUsdEquivalent: 5572 },
  { date: 'Aug 10', xlmVolume: 4500, usdcVolume: 7400, totalUsdEquivalent: 7940 },
  { date: 'Aug 11', xlmVolume: 6200, usdcVolume: 9800, totalUsdEquivalent: 10544 },
  { date: 'Aug 12', xlmVolume: 8900, usdcVolume: 12500, totalUsdEquivalent: 13568 },
  { date: 'Aug 13', xlmVolume: 11400, usdcVolume: 14800, totalUsdEquivalent: 16168 },
  { date: 'Aug 14', xlmVolume: 14200, usdcVolume: 18150, totalUsdEquivalent: 19854 },
  { date: 'Aug 15', xlmVolume: 17950, usdcVolume: 23150, totalUsdEquivalent: 25304 },
];

export function Dashboard() {
  const navigate = useNavigate();

  // State
  const [bills, setBills] = useState<BillRosterItem[]>(INITIAL_BILLS);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D' | 'ALL'>('30D');
  const [assetFilter, setAssetFilter] = useState<'ALL' | 'XLM' | 'USDC'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SETTLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeChartMode, setActiveChartMode] = useState<'total' | 'usdc' | 'xlm'>('total');
  const [hoveredPoint, setHoveredPoint] = useState<VolumeDataPoint | null>(null);

  // Manual Refresh animation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Quick Simulation: Add demo contribution to test reactive UI
  const handleSimulateContribution = () => {
    const randomBill = bills.find((b) => !b.settled) || bills[0];
    const addAmt = randomBill.currency === 'USDC' ? 100 : 250;
    const newFunded = Math.min(randomBill.target, randomBill.funded + addAmt);
    const isNowSettled = newFunded >= randomBill.target;

    setBills((prev) =>
      prev.map((b) =>
        b.id === randomBill.id
          ? {
              ...b,
              funded: newFunded,
              contributorsCount: b.contributorsCount + 1,
              settled: isNowSettled,
            }
          : b
      )
    );

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: isNowSettled ? 'settlement' : 'contribution',
      billId: randomBill.id,
      billName: randomBill.name,
      contributor: `G${Math.random().toString(36).substring(2, 6).toUpperCase()}...${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`,
      amount: addAmt,
      currency: randomBill.currency,
      timestamp: 'Just now',
      status: isNowSettled ? 'Settled' : 'Funded',
      txHash: `${Math.random().toString(36).substring(2, 6)}...${Math.random()
        .toString(36)
        .substring(2, 6)}`,
    };

    setActivities((prev) => [newActivity, ...prev]);
  };

  // Computed Metrics
  const metrics = useMemo(() => {
    const totalBills = bills.length;
    const settledBills = bills.filter((b) => b.settled).length;
    const activeBills = totalBills - settledBills;

    const totalXlmFunded = bills
      .filter((b) => b.currency === 'XLM')
      .reduce((sum, b) => sum + b.funded, 0);

    const totalUsdcFunded = bills
      .filter((b) => b.currency === 'USDC')
      .reduce((sum, b) => sum + b.funded, 0);

    // Approximate XLM price = $0.12 for composite aggregate
    const totalUsdEstimated = totalUsdcFunded + totalXlmFunded * 0.12;

    const totalContributors = bills.reduce((sum, b) => sum + b.contributorsCount, 0);
    const avgFundingPercent =
      bills.reduce((sum, b) => sum + (b.funded / b.target) * 100, 0) / (totalBills || 1);

    return {
      totalBills,
      settledBills,
      activeBills,
      totalXlmFunded,
      totalUsdcFunded,
      totalUsdEstimated,
      totalContributors,
      avgFundingPercent: Math.round(avgFundingPercent),
    };
  }, [bills]);

  // Filtered Bills
  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      const matchesAsset =
        assetFilter === 'ALL' || b.currency === assetFilter;
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'SETTLED' && b.settled) ||
        (statusFilter === 'ACTIVE' && !b.settled);
      const matchesSearch =
        searchQuery === '' ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toString().includes(searchQuery);

      return matchesAsset && matchesStatus && matchesSearch;
    });
  }, [bills, assetFilter, statusFilter, searchQuery]);

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return activities.filter((a) => {
      const matchesAsset = assetFilter === 'ALL' || a.currency === assetFilter;
      const matchesSearch =
        searchQuery === '' ||
        a.billName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.contributor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.billId.toString().includes(searchQuery);
      return matchesAsset && matchesSearch;
    });
  }, [activities, assetFilter, searchQuery]);

  // Chart SVG Coordinates Generator
  const chartWidth = 650;
  const chartHeight = 240;
  const paddingX = 40;
  const paddingY = 30;

  const chartSeries = useMemo(() => {
    const values = TIMELINE_DATA.map((d) => {
      if (activeChartMode === 'usdc') return d.usdcVolume;
      if (activeChartMode === 'xlm') return d.xlmVolume;
      return d.totalUsdEquivalent;
    });

    const maxVal = Math.max(...values) * 1.15;
    const minVal = 0;

    const points = TIMELINE_DATA.map((d, index) => {
      const val =
        activeChartMode === 'usdc'
          ? d.usdcVolume
          : activeChartMode === 'xlm'
          ? d.xlmVolume
          : d.totalUsdEquivalent;

      const x =
        paddingX +
        (index / (TIMELINE_DATA.length - 1)) * (chartWidth - paddingX * 2);
      const y =
        chartHeight -
        paddingY -
        ((val - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);

      return { x, y, data: d, val };
    });

    // Generate smooth bezier SVG path
    let pathD = '';
    let areaD = '';

    if (points.length > 0) {
      pathD = `M ${points[0].x} ${points[0].y}`;
      areaD = `M ${points[0].x} ${chartHeight - paddingY} L ${points[0].x} ${points[0].y}`;

      for (let i = 0; i < points.length - 1; i++) {
        const curr = points[i];
        const next = points[i + 1];
        const cpX1 = curr.x + (next.x - curr.x) / 2;
        const cpY1 = curr.y;
        const cpX2 = curr.x + (next.x - curr.x) / 2;
        const cpY2 = next.y;

        pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
        areaD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
      }

      areaD += ` L ${points[points.length - 1].x} ${chartHeight - paddingY} Z`;
    }

    return { points, pathD, areaD, maxVal };
  }, [activeChartMode]);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1.5rem 1.25rem 4rem 1.25rem',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header & Navigation Bar */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--glass-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/')}
            className="btn"
            style={{
              width: 'auto',
              padding: '0.5rem 0.9rem',
              borderRadius: '12px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.9rem',
            }}
          >
            <ArrowLeft size={16} /> Home
          </button>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '1.75rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              📊 Treasurer Analytics
            </h1>
            <p
              style={{
                margin: '0.2rem 0 0 0',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
              }}
            >
              Soroban Multi-Asset Treasury & Settlement Dashboard
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleSimulateContribution}
            className="btn"
            title="Simulate a live contribution to observe real-time updates"
            style={{
              width: 'auto',
              padding: '0.55rem 1.1rem',
              borderRadius: '12px',
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
            }}
          >
            <Sparkles size={16} /> Live Simulation
          </button>

          <button
            onClick={handleRefresh}
            className="btn"
            style={{
              width: 'auto',
              padding: '0.55rem 0.9rem',
              borderRadius: '12px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
            }}
          >
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <RefreshCw size={15} />
            </motion.div>
            Sync
          </button>

          <ThemeToggle />

          <button
            onClick={() => navigate('/app')}
            className="btn"
            style={{
              width: 'auto',
              padding: '0.55rem 1.25rem',
              borderRadius: '12px',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <PlusCircle size={16} /> Launch Bill App
          </button>
        </div>
      </header>

      {/* Filter / Controls Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
          padding: '0.75rem 1.25rem',
          background: 'var(--glass-bg)',
          borderRadius: '16px',
          border: '1px solid var(--glass-border)',
        }}
      >
        {/* Search */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 240px',
            minWidth: '220px',
            maxWidth: '380px',
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bills, tags, addresses..."
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem 0.55rem 2.25rem',
              borderRadius: '10px',
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Toggles: Currency & Status & Timeframe */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Currency Filter */}
          <div
            style={{
              display: 'flex',
              background: 'var(--input-bg)',
              padding: '3px',
              borderRadius: '10px',
              border: '1px solid var(--input-border)',
            }}
          >
            {(['ALL', 'USDC', 'XLM'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setAssetFilter(curr)}
                style={{
                  border: 'none',
                  background:
                    assetFilter === curr ? 'var(--primary)' : 'transparent',
                  color: assetFilter === curr ? '#ffffff' : 'var(--text-muted)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '7px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {curr === 'ALL' ? 'All Assets' : curr === 'USDC' ? '💵 USDC' : '⚡ XLM'}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div
            style={{
              display: 'flex',
              background: 'var(--input-bg)',
              padding: '3px',
              borderRadius: '10px',
              border: '1px solid var(--input-border)',
            }}
          >
            {(['ALL', 'ACTIVE', 'SETTLED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  border: 'none',
                  background:
                    statusFilter === st ? 'var(--secondary)' : 'transparent',
                  color: statusFilter === st ? '#ffffff' : 'var(--text-muted)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '7px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {st === 'ALL' ? 'All' : st === 'ACTIVE' ? 'Active' : 'Settled'}
              </button>
            ))}
          </div>

          {/* Timeframe */}
          <div
            style={{
              display: 'flex',
              background: 'var(--input-bg)',
              padding: '3px',
              borderRadius: '10px',
              border: '1px solid var(--input-border)',
            }}
          >
            {(['7D', '30D', '90D', 'ALL'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                style={{
                  border: 'none',
                  background:
                    timeframe === tf ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: timeframe === tf ? 'var(--text-main)' : 'var(--text-muted)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '7px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {/* Metric 1: Total Volume */}
        <motion.div
          whileHover={{ y: -3 }}
          className="card"
          style={{
            margin: 0,
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25), transparent 70%)',
              borderRadius: '50%',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Total Volume Processed
            </span>
            <div
              style={{
                padding: '0.35rem',
                borderRadius: '8px',
                background: 'rgba(139, 92, 246, 0.15)',
                color: 'var(--primary)',
              }}
            >
              <TrendingUp size={18} />
            </div>
          </div>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              margin: '0.6rem 0 0.4rem 0',
              color: 'var(--text-main)',
            }}
          >
            ${metrics.totalUsdEstimated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', fontSize: '0.78rem' }}>
            <span
              style={{
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                fontWeight: 600,
              }}
            >
              💵 {metrics.totalUsdcFunded.toLocaleString()} USDC
            </span>
            <span
              style={{
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                background: 'rgba(139, 92, 246, 0.15)',
                color: 'var(--primary)',
                fontWeight: 600,
              }}
            >
              ⚡ {metrics.totalXlmFunded.toLocaleString()} XLM
            </span>
          </div>
        </motion.div>

        {/* Metric 2: Active Bills */}
        <motion.div
          whileHover={{ y: -3 }}
          className="card"
          style={{
            margin: 0,
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle, rgba(236, 72, 153, 0.25), transparent 70%)',
              borderRadius: '50%',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Active Pools
            </span>
            <div
              style={{
                padding: '0.35rem',
                borderRadius: '8px',
                background: 'rgba(236, 72, 153, 0.15)',
                color: 'var(--secondary)',
              }}
            >
              <Clock size={18} />
            </div>
          </div>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              margin: '0.6rem 0 0.4rem 0',
              color: 'var(--text-main)',
            }}
          >
            {metrics.activeBills}
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '0.4rem', fontWeight: 500 }}>
              / {metrics.totalBills} total
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Average Funding Rate: <strong style={{ color: '#10b981' }}>{metrics.avgFundingPercent}%</strong>
          </div>
        </motion.div>

        {/* Metric 3: Settled & Disbursed */}
        <motion.div
          whileHover={{ y: -3 }}
          className="card"
          style={{
            margin: 0,
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25), transparent 70%)',
              borderRadius: '50%',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Settled Bills
            </span>
            <div
              style={{
                padding: '0.35rem',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
              }}
            >
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              margin: '0.6rem 0 0.4rem 0',
              color: '#10b981',
            }}
          >
            {metrics.settledBills}
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '0.4rem', fontWeight: 500 }}>
              Settled
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={14} color="#10b981" /> 100% Soroban Trustless Escrow
          </div>
        </motion.div>

        {/* Metric 4: Total Contributors */}
        <motion.div
          whileHover={{ y: -3 }}
          className="card"
          style={{
            margin: 0,
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25), transparent 70%)',
              borderRadius: '50%',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Total Contributors
            </span>
            <div
              style={{
                padding: '0.35rem',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
              }}
            >
              <Users size={18} />
            </div>
          </div>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              margin: '0.6rem 0 0.4rem 0',
              color: 'var(--text-main)',
            }}
          >
            {metrics.totalContributors}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Sparkles size={14} color="var(--primary)" /> Zero Gas Fees (Sponsored)
          </div>
        </motion.div>
      </div>

      {/* Visualizations Section (2-Column Responsive Grid) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Chart 1: Interactive Volume Timeline */}
        <div className="card" style={{ margin: 0, padding: '1.5rem', position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <TrendingUp size={18} color="var(--primary)" /> Volume Processed Timeline
              </h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Cumulative funding over the last 8 observation intervals
              </p>
            </div>

            {/* Mode switch */}
            <div
              style={{
                display: 'flex',
                background: 'var(--input-bg)',
                padding: '3px',
                borderRadius: '8px',
                border: '1px solid var(--input-border)',
              }}
            >
              <button
                onClick={() => setActiveChartMode('total')}
                style={{
                  border: 'none',
                  background: activeChartMode === 'total' ? 'var(--primary)' : 'transparent',
                  color: activeChartMode === 'total' ? '#fff' : 'var(--text-muted)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Total ($)
              </button>
              <button
                onClick={() => setActiveChartMode('usdc')}
                style={{
                  border: 'none',
                  background: activeChartMode === 'usdc' ? '#3b82f6' : 'transparent',
                  color: activeChartMode === 'usdc' ? '#fff' : 'var(--text-muted)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                USDC
              </button>
              <button
                onClick={() => setActiveChartMode('xlm')}
                style={{
                  border: 'none',
                  background: activeChartMode === 'xlm' ? 'var(--secondary)' : 'transparent',
                  color: activeChartMode === 'xlm' ? '#fff' : 'var(--text-muted)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                XLM
              </button>
            </div>
          </div>

          {/* SVG Area Chart */}
          <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden' }}>
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={
                      activeChartMode === 'usdc'
                        ? '#3b82f6'
                        : activeChartMode === 'xlm'
                        ? 'var(--secondary)'
                        : 'var(--primary)'
                    }
                    stopOpacity="0.45"
                  />
                  <stop
                    offset="100%"
                    stopColor={
                      activeChartMode === 'usdc'
                        ? '#3b82f6'
                        : activeChartMode === 'xlm'
                        ? 'var(--secondary)'
                        : 'var(--primary)'
                    }
                    stopOpacity="0.0"
                  />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
                return (
                  <line
                    key={ratio}
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="var(--glass-border)"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Area Fill */}
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                d={chartSeries.areaD}
                fill="url(#chartGradient)"
              />

              {/* Line Stroke */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                d={chartSeries.pathD}
                fill="none"
                stroke={
                  activeChartMode === 'usdc'
                    ? '#3b82f6'
                    : activeChartMode === 'xlm'
                    ? 'var(--secondary)'
                    : 'var(--primary)'
                }
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {chartSeries.points.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint?.date === pt.data.date ? 6 : 4}
                    fill={
                      activeChartMode === 'usdc'
                        ? '#3b82f6'
                        : activeChartMode === 'xlm'
                        ? 'var(--secondary)'
                        : 'var(--primary)'
                    }
                    stroke="#ffffff"
                    strokeWidth="2"
                    style={{ cursor: 'pointer', transition: 'r 0.2s ease' }}
                    onMouseEnter={() => setHoveredPoint(pt.data)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Date labels */}
                  <text
                    x={pt.x}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="11"
                    fontFamily="inherit"
                  >
                    {pt.data.date}
                  </text>
                </g>
              ))}
            </svg>

            {/* Hover Tooltip */}
            {hoveredPoint && (
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '15px',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '8px',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.78rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  pointerEvents: 'none',
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{hoveredPoint.date}</div>
                <div style={{ color: '#3b82f6' }}>USDC: ${hoveredPoint.usdcVolume.toLocaleString()}</div>
                <div style={{ color: 'var(--secondary)' }}>XLM: {hoveredPoint.xlmVolume.toLocaleString()} XLM</div>
                <div style={{ color: '#10b981', fontWeight: 600 }}>
                  Est. Total: ${hoveredPoint.totalUsdEquivalent.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Asset Allocation & Settlement Health */}
        <div className="card" style={{ margin: 0, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '1.15rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <PieIcon size={18} color="var(--secondary)" /> Asset Allocation & Health
            </h3>
            <p style={{ margin: '0.2rem 0 1.25rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Stellar USDC vs Native XLM volume distribution & protocol efficiency
            </p>

            {/* Multi-asset distribution bar */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#3b82f6', fontWeight: 600 }}>
                  💵 USDC Share ({Math.round((metrics.totalUsdcFunded / (metrics.totalUsdEstimated || 1)) * 100)}%)
                </span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  ⚡ XLM Share ({Math.round(((metrics.totalXlmFunded * 0.12) / (metrics.totalUsdEstimated || 1)) * 100)}%)
                </span>
              </div>
              <div
                style={{
                  height: '14px',
                  borderRadius: '7px',
                  background: 'rgba(0,0,0,0.3)',
                  overflow: 'hidden',
                  display: 'flex',
                  border: '1px solid var(--glass-border)',
                }}
              >
                <div
                  style={{
                    width: `${Math.round((metrics.totalUsdcFunded / (metrics.totalUsdEstimated || 1)) * 100)}%`,
                    background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                    transition: 'width 0.8s ease',
                  }}
                />
                <div
                  style={{
                    width: `${Math.round(((metrics.totalXlmFunded * 0.12) / (metrics.totalUsdEstimated || 1)) * 100)}%`,
                    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                    transition: 'width 0.8s ease',
                  }}
                />
              </div>
            </div>

            {/* Performance breakdown pills */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
              <div
                style={{
                  padding: '0.8rem',
                  borderRadius: '12px',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avg. Settlement Time</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  2.4 Days
                </div>
                <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '0.2rem' }}>
                  ⚡ 48h faster than off-chain
                </div>
              </div>

              <div
                style={{
                  padding: '0.8rem',
                  borderRadius: '12px',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gas Sponsored (FeeBump)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981', marginTop: '0.2rem' }}>
                  $0.00
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  100% Sponsor Covered
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.8rem',
              color: 'var(--text-main)',
            }}
          >
            <ShieldCheck size={18} color="#10b981" />
            <span>Soroban split_pay contract: 0 state collisions, automated disbursement.</span>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Live Activity Feed & Bills Roster */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Left Column: Real-time Activity Feed */}
        <div className="card" style={{ margin: 0, padding: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Activity size={18} color="var(--primary)" /> Real-Time Activity Feed
              </h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Chronological ledger of contributions, settlements, and milestones
              </p>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '20px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                fontWeight: 600,
              }}
            >
              ● LIVE
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              maxHeight: '480px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}
          >
            <AnimatePresence>
              {filteredActivities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                  No activities matching current filter.
                </div>
              ) : (
                filteredActivities.map((act) => (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background:
                            act.type === 'settlement'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : act.type === 'milestone'
                              ? 'rgba(236, 72, 153, 0.15)'
                              : act.currency === 'USDC'
                              ? 'rgba(59, 130, 246, 0.15)'
                              : 'rgba(139, 92, 246, 0.15)',
                          color:
                            act.type === 'settlement'
                              ? '#10b981'
                              : act.type === 'milestone'
                              ? 'var(--secondary)'
                              : act.currency === 'USDC'
                              ? '#3b82f6'
                              : 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {act.type === 'settlement' ? (
                          <CheckCircle2 size={18} />
                        ) : act.type === 'milestone' ? (
                          <Sparkles size={18} />
                        ) : act.currency === 'USDC' ? (
                          <DollarSign size={18} />
                        ) : (
                          <Coins size={18} />
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          {act.billName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span style={{ fontFamily: 'monospace' }}>{act.contributor}</span> • {act.timestamp}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          color: act.currency === 'USDC' ? '#60a5fa' : 'var(--primary)',
                        }}
                      >
                        +{act.amount.toLocaleString()} {act.currency}
                      </div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '6px',
                          fontWeight: 600,
                          background:
                            act.status === 'Settled'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : act.status === 'Funded'
                              ? 'rgba(139, 92, 246, 0.15)'
                              : 'rgba(255, 255, 255, 0.08)',
                          color:
                            act.status === 'Settled'
                              ? '#10b981'
                              : act.status === 'Funded'
                              ? 'var(--primary)'
                              : 'var(--text-muted)',
                        }}
                      >
                        {act.status}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Bills Roster Table */}
        <div className="card" style={{ margin: 0, padding: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Layers size={18} color="var(--secondary)" /> Treasury Bills Roster
              </h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Active and completed group split pools with on-chain links
              </p>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {filteredBills.length} Bill{filteredBills.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              maxHeight: '480px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}
          >
            {filteredBills.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                No bills found matching your criteria.
              </div>
            ) : (
              filteredBills.map((b) => {
                const percent = Math.min(100, Math.round((b.funded / b.target) * 100));
                return (
                  <motion.div
                    key={b.id}
                    whileHover={{ scale: 1.01 }}
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                            #{b.id}
                          </span>
                          <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {b.name}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {b.category} • {b.contributorsCount} contributors
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            fontWeight: 600,
                            background:
                              b.currency === 'USDC'
                                ? 'rgba(59, 130, 246, 0.15)'
                                : 'rgba(139, 92, 246, 0.15)',
                            color: b.currency === 'USDC' ? '#60a5fa' : 'var(--primary)',
                          }}
                        >
                          {b.currency}
                        </span>

                        <button
                          onClick={() => navigate(`/app?bill=${b.id}`)}
                          className="btn"
                          title="Open in Bill Manager"
                          style={{
                            width: 'auto',
                            padding: '0.35rem 0.6rem',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            background: 'var(--glass-bg)',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--text-main)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          Open <ExternalLink size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar & Amounts */}
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.78rem',
                          marginBottom: '0.25rem',
                        }}
                      >
                        <span style={{ color: 'var(--text-muted)' }}>
                          Funded: <strong style={{ color: 'var(--text-main)' }}>{b.funded.toLocaleString()}</strong> / {b.target.toLocaleString()} {b.currency}
                        </span>
                        <span
                          style={{
                            fontWeight: 700,
                            color: b.settled ? '#10b981' : percent >= 50 ? 'var(--primary)' : 'var(--text-muted)',
                          }}
                        >
                          {percent}% {b.settled ? '✓ Settled' : ''}
                        </span>
                      </div>
                      <div
                        style={{
                          height: '6px',
                          background: 'rgba(0,0,0,0.3)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${percent}%`,
                            background: b.settled
                              ? 'linear-gradient(90deg, #10b981, #34d399)'
                              : percent >= 50
                              ? 'linear-gradient(90deg, var(--primary), var(--secondary))'
                              : 'linear-gradient(90deg, #60a5fa, #3b82f6)',
                            transition: 'width 0.6s ease',
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
    <Analytics />
  </React.StrictMode>,
);