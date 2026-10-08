import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { QrCode, Smartphone, CheckCircle2, Clock, AlertTriangle, ShieldCheck, Heart, Sparkles, Copy, Check, Receipt, RefreshCw, CreditCard, Lock } from 'lucide-react'
import { recordContribution, isSupabaseConfigured } from '../lib/supabase'

export default function PaymentScannerSection() {
  const [amount, setAmount] = useState('250')
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copiedUpi, setCopiedUpi] = useState(false)

  // Payment Mode: 'gateway' (Auto-verified) vs 'direct_upi' (Manual UTR)
  const [paymentMode, setPaymentMode] = useState('direct_upi')

  // Form states
  const [payerName, setPayerName] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [upiRefId, setUpiRefId] = useState('')
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [receipt, setReceipt] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const upiId = import.meta.env.VITE_UPI_ID || '8555069928@ybl'
  const upiName = import.meta.env.VITE_UPI_NAME || 'Mana Sathuluru'
  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || ''

  const activeAmount = isCustom ? (customAmount || '100') : amount

  // UPI Deep-link URI
  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${activeAmount}&cu=INR&tn=${encodeURIComponent('Support Mana Sathuluru')}`

  // Dynamically load Razorpay SDK
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  // Generate UPI QR Code
  useEffect(() => {
    let isMounted = true
    QRCode.toDataURL(upiUri, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#0a0d14',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
      .then(url => {
        if (isMounted) setQrDataUrl(url)
      })
      .catch(err => {
        console.error('Error generating UPI QR code:', err)
      })

    return () => {
      isMounted = false
    }
  }, [upiUri])

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId)
    setCopiedUpi(true)
    setTimeout(() => setCopiedUpi(false), 2000)
  }

  const handleDirectPay = () => {
    window.location.href = upiUri
  }

  // 1. REAL-TIME GATEWAY PAYMENT (RAZORPAY)
  const handleRazorpayPay = () => {
    if (!razorpayKeyId) {
      setErrorMessage(
        'Real-time automated bank gateway requires a Razorpay Key in .env (VITE_RAZORPAY_KEY_ID). Add your free test or live key to enable automatic bank settlement!'
      )
      return
    }

    if (!window.Razorpay) {
      setErrorMessage('Razorpay payment gateway is loading. Please check your internet connection.')
      return
    }

    if (!payerName.trim()) {
      setErrorMessage('Please enter your name in Step 2 before initiating payment.')
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    const options = {
      key: razorpayKeyId,
      amount: Number(activeAmount) * 100, // Amount in paise
      currency: 'INR',
      name: 'Mana Sathuluru',
      description: `Community Contribution - ₹${activeAmount}`,
      image: '/favicon.svg',
      prefill: {
        name: payerName,
        contact: contactInfo.includes('@') ? '' : contactInfo,
        email: contactInfo.includes('@') ? contactInfo : ''
      },
      theme: {
        color: '#e5a93c'
      },
      handler: async function (response) {
        // Genuine Bank-Confirmed Payment Callback
        try {
          const res = await recordContribution({
            payerName,
            contactInfo,
            amount: activeAmount,
            upiRefId: response.razorpay_payment_id,
            paymentMethod: 'RAZORPAY_AUTOMATED',
            note: `Auto-Verified by Bank via Razorpay. Payment ID: ${response.razorpay_payment_id}`
          })

          setReceipt({
            id: response.razorpay_payment_id,
            payerName,
            amount: activeAmount,
            status: 'BANK_VERIFIED',
            statusLabel: 'Bank Verified (Real-Time)',
            method: 'Razorpay Auto-Settlement',
            date: new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          })
        } catch (err) {
          setErrorMessage('Payment received by bank, but failed to record in database. Please contact us.')
        } finally {
          setIsSubmitting(false)
        }
      },
      modal: {
        ondismiss: function () {
          setIsSubmitting(false)
          setErrorMessage('Payment was cancelled or closed. No receipt was issued.')
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', function (response) {
      setIsSubmitting(false)
      setErrorMessage(`Payment failed: ${response.error.description}. No receipt issued.`)
    })
    rzp.open()
  }

  // 2. DIRECT UPI UTR SUBMISSION (WITH STRICT 12-DIGIT VALIDATION & PENDING STATUS)
  const handleConfirmUpiManual = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!payerName.trim()) {
      setErrorMessage('Please enter your name.')
      return
    }

    const cleanUtr = upiRefId.trim().replace(/[^0-9]/g, '')

    // STRICT CHECK: A genuine UPI UTR is ALWAYS exactly 12 numeric digits in India
    if (cleanUtr.length !== 12) {
      setErrorMessage(
        '❌ Invalid UTR Number: Genuine UPI transactions always have an exact 12-digit UTR/Reference number (e.g. 423456789012). Check your PhonePe/Google Pay transaction history to find it.'
      )
      return
    }

    setIsSubmitting(true)

    try {
      const res = await recordContribution({
        payerName,
        contactInfo,
        amount: activeAmount,
        upiRefId: cleanUtr,
        paymentMethod: 'UPI_MANUAL_P2P',
        note: note ? `Pending statement verification. Note: ${note}` : 'Pending bank statement verification'
      })

      if (!res.success) {
        throw new Error(res.error || 'Failed to record verification submission.')
      }

      // DO NOT GIVE A FAKE "VERIFIED" RECEIPT!
      // Mark clearly as "PENDING ADMIN VERIFICATION" so nobody can fake it without paying!
      setReceipt({
        id: `UTR-${cleanUtr.slice(0, 4)}-${cleanUtr.slice(-4)}`,
        payerName,
        amount: activeAmount,
        status: 'PENDING_VERIFICATION',
        statusLabel: 'Pending Bank Statement Verification',
        method: 'Direct UPI Transfer',
        upiRefId: cleanUtr,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      })
    } catch (err) {
      setErrorMessage(err.message || 'Error submitting UTR. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetPayment = () => {
    setReceipt(null)
    setPayerName('')
    setContactInfo('')
    setUpiRefId('')
    setNote('')
    setErrorMessage('')
  }

  return (
    <section id="support" className="relative py-28 md:py-36 bg-[#06080d] overflow-hidden border-t border-white/[0.04]">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-emerald-600/10 via-gold-500/10 to-amber-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold-500/20 bg-gold-500/5 mb-4">
            <Heart className="w-3.5 h-3.5 text-gold-400 fill-gold-400/20" />
            <span className="text-xs uppercase tracking-[0.2em] text-gold-300 font-medium">
              Community Support & Contribution
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">
            Support <span className="text-gold-gradient">Mana Sathuluru</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Every contribution directly empowers village documentary projects, festival coverage, community archives, and youth initiatives.
          </p>
        </div>

        {receipt ? (
          /* RECEIPT CARD */
          <div className="max-w-xl mx-auto p-8 sm:p-10 rounded-3xl glass-panel border border-gold-500/30 shadow-[0_25px_70px_rgba(0,0,0,0.9)] text-center animate-aesthetic-fade-up">
            {receipt.status === 'BANK_VERIFIED' ? (
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8" />
              </div>
            )}

            <span
              className={`text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full inline-block mb-3 ${
                receipt.status === 'BANK_VERIFIED'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
              }`}
            >
              {receipt.statusLabel}
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
              Dhanyavadalu, {receipt.payerName}!
            </h3>

            {receipt.status === 'BANK_VERIFIED' ? (
              <p className="text-sm text-slate-300 mb-6">
                Your payment of <strong className="text-gold-300 font-serif text-lg">₹{receipt.amount}</strong> was verified in real time by the bank.
              </p>
            ) : (
              <p className="text-sm text-slate-300 mb-6">
                Your 12-digit UTR reference has been logged. Our administration will cross-verify this with our bank account statement. <span className="text-amber-300">Fake or unmatched UTRs are rejected.</span>
              </p>
            )}

            {/* Receipt Summary Box */}
            <div className="bg-black/50 rounded-2xl p-5 border border-white/10 text-left space-y-2.5 mb-8 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Receipt Reference:</span>
                <span className="text-white font-mono">{receipt.id}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Amount:</span>
                <span className="text-gold-300 font-bold font-serif">₹{receipt.amount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Method:</span>
                <span className="text-white">{receipt.method}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Timestamp:</span>
                <span className="text-white">{receipt.date}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-white/10">
                <span>Verification State:</span>
                <span
                  className={`font-semibold flex items-center gap-1 ${
                    receipt.status === 'BANK_VERIFIED' ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {receipt.status === 'BANK_VERIFIED' ? (
                    <>
                      <ShieldCheck className="w-4 h-4" /> Bank Confirmed
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4" /> Awaiting Bank Match
                    </>
                  )}
                </span>
              </div>
            </div>

            <button
              onClick={resetPayment}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.08] hover:bg-gold-500/20 border border-white/10 hover:border-gold-500/40 text-slate-200 hover:text-gold-200 font-semibold text-xs tracking-wider uppercase transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Back to Payment</span>
            </button>
          </div>
        ) : (
          /* SCANNER & REAL-TIME FLOW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* LEFT: SCANNER & OPTIONS */}
            <div className="lg:col-span-6 p-6 sm:p-10 rounded-3xl glass-panel border border-gold-500/25 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-gold-300 text-xs uppercase font-bold tracking-wider">
                    <QrCode className="w-4 h-4" />
                    <span>Real-Time UPI Scanner</span>
                  </div>
                  <span className="text-xs text-slate-400">Direct to Satuluru Bank</span>
                </div>

                {/* Amount Selector Pills */}
                <div className="mb-6">
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">
                    Select Contribution Amount (₹)
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {['100', '250', '500', '1000'].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setAmount(amt)
                          setIsCustom(false)
                        }}
                        className={`py-2.5 rounded-xl font-serif text-sm font-bold transition-all ${
                          !isCustom && amount === amt
                            ? 'bg-gold-500 text-slate-950 shadow-[0_0_20px_rgba(229,169,60,0.4)]'
                            : 'bg-white/[0.05] text-slate-300 hover:bg-white/[0.1] border border-white/10'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="Custom Amount (₹)"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value)
                        setIsCustom(true)
                      }}
                      className="w-full px-4 py-2 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-black/60 border border-white/10 mb-6">
                  <div className="relative p-3 rounded-2xl bg-white shadow-[0_0_35px_rgba(229,169,60,0.25)]">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="UPI Payment QR Code"
                        className="w-56 h-56 sm:w-60 sm:h-60 object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-56 h-56 flex items-center justify-center text-slate-800">
                        Loading QR...
                      </div>
                    )}
                  </div>

                  <div className="mt-3 text-center">
                    <span className="font-serif text-2xl font-bold text-gold-300">
                      ₹{activeAmount}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Scan using Google Pay, PhonePe, Paytm, or BHIM
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Mobile Direct Pay */}
                <button
                  type="button"
                  onClick={handleDirectPay}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg transition-all"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Tap to Pay on Phone (GPay / PhonePe)</span>
                </button>

                {/* Copy UPI */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-white/5 text-xs">
                  <span className="text-slate-400">
                    UPI ID: <strong className="text-white font-mono">{upiId}</strong>
                  </span>
                  <button
                    onClick={copyUpiId}
                    className="inline-flex items-center gap-1 text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: VERIFICATION HUB */}
            <div className="lg:col-span-6 p-6 sm:p-10 rounded-3xl glass-panel border border-white/10 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-gold-400 text-xs uppercase font-bold tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Real-Time Verification</span>
                  </div>
                  
                  {/* Mode switcher tabs */}
                  <div className="flex bg-black/60 rounded-xl p-1 border border-white/10 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMode('direct_upi')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        paymentMode === 'direct_upi' ? 'bg-gold-500 text-slate-950 font-bold' : 'text-slate-400'
                      }`}
                    >
                      UPI UTR
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMode('gateway')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        paymentMode === 'gateway' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
                      }`}
                    >
                      Live Gateway
                    </button>
                  </div>
                </div>

                {paymentMode === 'gateway' ? (
                  /* AUTOMATED GATEWAY FLOW */
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white mb-2">
                      Automated Bank Gateway
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                      Opens the official banking gateway modal. Bank automatically verifies receipt of funds in real time before generating a certificate.
                    </p>

                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter your name"
                          value={payerName}
                          onChange={(e) => setPayerName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                          Email or Mobile Number
                        </label>
                        <input
                          type="text"
                          placeholder="To receive verified digital receipt"
                          value={contactInfo}
                          onChange={(e) => setContactInfo(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-400"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRazorpayPay}
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all disabled:opacity-60"
                    >
                      <CreditCard className="w-4 h-4 text-slate-950" />
                      <span>{isSubmitting ? 'Opening Bank Gateway...' : `Pay ₹${activeAmount} (Auto Bank-Verified)`}</span>
                    </button>

                    <p className="text-[11px] text-slate-400 mt-3 text-center">
                      Protected by 256-bit bank encryption. Receipts are issued ONLY after bank settlement.
                    </p>
                  </div>
                ) : (
                  /* DIRECT UPI UTR FORM (WITH 12-DIGIT VALIDATION & NO FAKE CONFIRMATION) */
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white mb-2">
                      Submit 12-Digit UPI UTR
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                      Paid via QR scanner or UPI app? Enter your official 12-digit bank reference number below. It will be verified against our statement.
                    </p>

                    <form onSubmit={handleConfirmUpiManual} className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Varma"
                          value={payerName}
                          onChange={(e) => setPayerName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                          Phone or Email
                        </label>
                        <input
                          type="text"
                          placeholder="Where can we send confirmation?"
                          value={contactInfo}
                          onChange={(e) => setContactInfo(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium flex items-center justify-between">
                          <span>12-Digit Bank UTR / Ref Number *</span>
                          <span className="text-[10px] text-gold-400 lowercase">must be 12 digits</span>
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={12}
                          placeholder="e.g. 429812345678"
                          value={upiRefId}
                          onChange={(e) => setUpiRefId(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-400 font-mono tracking-wider"
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/20 text-amber-300 text-[11px] leading-relaxed flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                        <span>
                          <strong>Anti-Fraud Policy:</strong> All UTRs are matched with our official bank statement. Entering random or fake numbers will NOT result in verified status.
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-sm tracking-wide hover:shadow-[0_0_25px_rgba(229,169,60,0.4)] active:scale-95 transition-all duration-300 disabled:opacity-60"
                      >
                        <Receipt className="w-4 h-4 text-slate-950" />
                        <span>{isSubmitting ? 'Validating...' : `Submit UTR for Verification (₹${activeAmount})`}</span>
                      </button>
                    </form>
                  </div>
                )}

                {errorMessage && (
                  <div className="mt-4 p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs leading-relaxed flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-gold-400">
                  <Lock className="w-3.5 h-3.5" />
                  No Fake Receipts Permitted
                </span>
                <span>Real Bank Verification</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  )
}
