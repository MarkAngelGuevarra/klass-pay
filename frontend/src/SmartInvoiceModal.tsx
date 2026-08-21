import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  QrCode, 
  Calculator, 
  FileText, 
  Printer, 
  Share2, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  DollarSign, 
  Coins, 
  Users, 
  Percent, 
  ArrowRightLeft,
  Sparkles
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export interface SmartInvoiceProps {
  isOpen: boolean;
  onClose: () => void;
  billId: number;
  billName: string;
  billDescription?: string;
  organizerAddress: string;
  totalTarget: number;
  totalFunded: number;
  currency: 'XLM' | 'USDC';
  settled: boolean;
  payers: string[];
  contractId?: string;
}

// Live estimated rates for conversion display
const RATES = {
  XLM_USD: 0.112,
  XLM_PHP: 6.45,
  USDC_USD: 1.00,
  USDC_PHP: 58.50,
};

export const SmartInvoiceModal: React.FC<SmartInvoiceProps> = ({
  isOpen,
  onClose,
  billId,
  billName,
  billDescription,
  organizerAddress,
  totalTarget,
  totalFunded,
  currency,
  settled,
  payers,
  contractId = 'CCR4JWW44NJT5PORG27HO4MRK7QUZWNDBDXMIAKK6ZFUYLMUSJVUC3CQ'
}) => {
  const [activeTab, setActiveTab] = useState<'qr' | 'calculator' | 'receipt'>('qr');
  const [copied, setCopied] = useState(false);

  // Calculator State
  const [numPeople, setNumPeople] = useState<number>(Math.max(payers.length || 2, 2));
  const [tipPercent, setTipPercent] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<number>(totalTarget || 100);

  // Currency Conversions
  const conversions = useMemo(() => {
    const isXLM = currency === 'XLM';
    const amount = customAmount;
    const usdVal = isXLM ? amount * RATES.XLM_USD : amount * RATES.USDC_USD;
    const phpVal = isXLM ? amount * RATES.XLM_PHP : amount * RATES.USDC_PHP;
    return {
      usd: usdVal.toFixed(2),
      php: phpVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    };
  }, [customAmount, currency]);

  // Split calculations
  const splitCalculations = useMemo(() => {
    const tipAmount = (customAmount * tipPercent) / 100;
    const grandTotal = customAmount + tipAmount;
    const perPerson = numPeople > 0 ? grandTotal / numPeople : 0;
    return {
      tipAmount: Number(tipAmount.toFixed(4)),
      grandTotal: Number(grandTotal.toFixed(4)),
      perPerson: Number(perPerson.toFixed(4)),
    };
  }, [customAmount, tipPercent, numPeople]);

  // Stellar Payment Payload URL
  const paymentLink = `${window.location.origin}/app?bill=${billId}`;
  const stellarUri = `web+stellar:pay?destination=${organizerAddress}&amount=${splitCalculations.perPerson}&memo=${billId}&memo_type=id`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="modal-backdrop" 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
          overflowY: 'auto'
        }}
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            background: 'var(--card-bg, #111827)',
            color: 'var(--text, #F9FAFB)',
            borderRadius: '24px',
            border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.1))',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid var(--glass-border, rgba(255, 255, 255, 0.1))',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                padding: '0.6rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={20} color="#FFF" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                  Smart Invoicing & Split Terminal
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted, #9CA3AF)' }}>
                  Bill #{billId} • {billName || 'Classroom Fund'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                color: 'var(--text-muted, #9CA3AF)',
                cursor: 'pointer',
                borderRadius: '50%',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            padding: '0.75rem 2rem',
            gap: '0.5rem',
            background: 'rgba(0, 0, 0, 0.2)',
            borderBottom: '1px solid var(--glass-border, rgba(255, 255, 255, 0.05))'
          }}>
            <button
              onClick={() => setActiveTab('qr')}
              style={{
                flex: 1,
                padding: '0.6rem 1rem',
                borderRadius: '12px',
                border: activeTab === 'qr' ? '1px solid #3B82F6' : '1px solid transparent',
                background: activeTab === 'qr' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                color: activeTab === 'qr' ? '#60A5FA' : 'var(--text-muted, #9CA3AF)',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <QrCode size={16} /> QR Terminal
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              style={{
                flex: 1,
                padding: '0.6rem 1rem',
                borderRadius: '12px',
                border: activeTab === 'calculator' ? '1px solid #8B5CF6' : '1px solid transparent',
                background: activeTab === 'calculator' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                color: activeTab === 'calculator' ? '#A78BFA' : 'var(--text-muted, #9CA3AF)',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <Calculator size={16} /> Split Calculator
            </button>
            <button
              onClick={() => setActiveTab('receipt')}
              style={{
                flex: 1,
                padding: '0.6rem 1rem',
                borderRadius: '12px',
                border: activeTab === 'receipt' ? '1px solid #10B981' : '1px solid transparent',
                background: activeTab === 'receipt' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                color: activeTab === 'receipt' ? '#34D399' : 'var(--text-muted, #9CA3AF)',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <FileText size={16} /> Official Receipt
            </button>
          </div>

          {/* Modal Body */}
          <div style={{ padding: '2rem' }}>
            {/* TAB 1: QR CODE PAYMENT TERMINAL */}
            {activeTab === 'qr' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: '#FFFFFF',
                  padding: '1.5rem',
                  borderRadius: '20px',
                  display: 'inline-block',
                  margin: '0 auto 1.5rem auto',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
                }}>
                  <QRCodeSVG 
                    value={paymentLink}
                    size={220}
                    level="H"
                    includeMargin={false}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Scan with Freighter or Stellar Wallet</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted, #9CA3AF)' }}>
                    Instantly routes payment of <strong>{splitCalculations.perPerson} {currency}</strong> to Organizer
                  </p>
                </div>

                {/* Rates & Estimates Banner */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.08))',
                  borderRadius: '16px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #9CA3AF)', display: 'block' }}>Target Goal</span>
                    <strong style={{ fontSize: '1.1rem', color: '#60A5FA' }}>{totalTarget} {currency}</strong>
                  </div>
                  <div style={{ width: '1px', height: '30px', background: 'var(--glass-border, rgba(255, 255, 255, 0.1))' }} />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #9CA3AF)', display: 'block' }}>Est. Fiat Value</span>
                    <strong style={{ fontSize: '1.1rem', color: '#34D399' }}>₱{conversions.php}</strong>
                  </div>
                  <div style={{ width: '1px', height: '30px', background: 'var(--glass-border, rgba(255, 255, 255, 0.1))' }} />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #9CA3AF)', display: 'block' }}>USD Equiv.</span>
                    <strong style={{ fontSize: '1.1rem', color: '#A78BFA' }}>${conversions.usd}</strong>
                  </div>
                </div>

                {/* Share Link Actions */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => copyToClipboard(paymentLink)}
                    style={{
                      flex: 1,
                      padding: '0.8rem 1.2rem',
                      background: copied ? '#10B981' : 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '14px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                    {copied ? 'Copied Payment Link!' : 'Copy Payment Link'}
                  </button>
                  <button
                    onClick={() => copyToClipboard(stellarUri)}
                    style={{
                      padding: '0.8rem 1.2rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.1))',
                      color: 'var(--text, #FFF)',
                      borderRadius: '14px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Share2 size={18} /> Stellar URI
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: SMART SPLIT CALCULATOR */}
            {activeTab === 'calculator' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted, #9CA3AF)', marginBottom: '0.4rem' }}>
                      Total Bill Amount ({currency})
                    </label>
                    <input 
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.1))',
                        borderRadius: '12px',
                        color: 'var(--text, #FFF)',
                        fontSize: '1rem',
                        fontWeight: 600
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted, #9CA3AF)', marginBottom: '0.4rem' }}>
                      Number of Participants
                    </label>
                    <input 
                      type="number"
                      min="1"
                      max="100"
                      value={numPeople}
                      onChange={(e) => setNumPeople(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.1))',
                        borderRadius: '12px',
                        color: 'var(--text, #FFF)',
                        fontSize: '1rem',
                        fontWeight: 600
                      }}
                    />
                  </div>
                </div>

                {/* Tip / Service Fee Presets */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted, #9CA3AF)', marginBottom: '0.5rem' }}>
                    Organizer Service Fee / Buffer Tip: <strong>{tipPercent}%</strong>
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[0, 5, 10, 15, 20].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTipPercent(t)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          borderRadius: '10px',
                          border: tipPercent === t ? '1px solid #8B5CF6' : '1px solid var(--glass-border, rgba(255, 255, 255, 0.08))',
                          background: tipPercent === t ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                          color: tipPercent === t ? '#A78BFA' : 'var(--text-muted, #9CA3AF)',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {t === 0 ? 'None' : `${t}%`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculation Summary Card */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.08))',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '18px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted, #9CA3AF)' }}>Base Bill:</span>
                    <strong>{customAmount} {currency}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted, #9CA3AF)' }}>Buffer / Tip ({tipPercent}%):</span>
                    <strong>+{splitCalculations.tipAmount} {currency}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--glass-border, rgba(255, 255, 255, 0.1))' }}>
                    <span style={{ color: 'var(--text-muted, #9CA3AF)' }}>Grand Total:</span>
                    <strong style={{ color: '#60A5FA' }}>{splitCalculations.grandTotal} {currency}</strong>
                  </div>
                  
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '1rem',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted, #9CA3AF)', display: 'block' }}>Each Participant Pays</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34D399' }}>
                        {splitCalculations.perPerson} {currency}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #9CA3AF)', display: 'block' }}>Per-Person Fiat</span>
                      <strong style={{ color: '#FCD34D' }}>
                        ₱{((currency === 'XLM' ? splitCalculations.perPerson * RATES.XLM_PHP : splitCalculations.perPerson * RATES.USDC_PHP)).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: OFFICIAL ON-CHAIN RECEIPT */}
            {activeTab === 'receipt' && (
              <div id="klasspay-receipt" style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.1))',
                borderRadius: '16px',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border, rgba(255, 255, 255, 0.1))', paddingBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                      <ShieldCheck size={18} color="#10B981" />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: '#10B981' }}>VERIFIED STELLAR SETTLEMENT</span>
                    </div>
                    <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>KlassPay Tax & Audit Receipt</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted, #9CA3AF)' }}>
                      Bill Reference ID: #{billId}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      padding: '0.3rem 0.8rem', 
                      borderRadius: '20px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      background: settled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                      color: settled ? '#34D399' : '#60A5FA'
                    }}>
                      {settled ? 'STATUS: SETTLED' : 'STATUS: IN PROGRESS'}
                    </span>
                  </div>
                </div>

                {/* Receipt Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted, #9CA3AF)', display: 'block' }}>Bill Name:</span>
                    <strong>{billName || 'Classroom Bill'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted, #9CA3AF)', display: 'block' }}>Date / Timestamp:</span>
                    <strong>{new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted, #9CA3AF)', display: 'block' }}>Organizer Wallet:</span>
                    <strong style={{ wordBreak: 'break-all', fontSize: '0.75rem' }}>
                      {organizerAddress ? `${organizerAddress.substring(0, 10)}...${organizerAddress.slice(-8)}` : 'Pending Connection'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted, #9CA3AF)', display: 'block' }}>Soroban Mainnet Contract:</span>
                    <a 
                      href={`https://stellar.expert/explorer/public/contract/${contractId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#60A5FA', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', textDecoration: 'none' }}
                    >
                      {contractId.substring(0, 8)}...{contractId.slice(-6)} <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                {/* Financial Summary */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                    <span>Target Goal:</span>
                    <strong>{totalTarget} {currency}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                    <span>Current Funded:</span>
                    <strong style={{ color: '#34D399' }}>{totalFunded} {currency}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span>Total Payers Count:</span>
                    <strong>{payers.length} Verified Contributors</strong>
                  </div>
                </div>

                {/* Print Button */}
                <button
                  onClick={handlePrint}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    background: 'linear-gradient(90deg, #10B981, #059669)',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Printer size={18} /> Print / Export Official PDF Receipt
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
