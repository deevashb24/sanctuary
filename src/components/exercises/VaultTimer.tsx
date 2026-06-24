'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { SystemProgram, Transaction, PublicKey } from '@solana/web3.js';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Timer, AlertOctagon, RefreshCcw, ShieldCheck, Zap } from 'lucide-react';

type VaultState = 'IDLE' | 'STAKING' | 'ACTIVE' | 'FAILED' | 'COMPLETED';

export function VaultTimer() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [vaultState, setVaultState] = useState<VaultState>('IDLE');
  const [stakeAmount, setStakeAmount] = useState<string>('0.05');
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const endTimeRef = useRef<number | null>(null);

  // Hardcode a mock "treasury" address for demonstration
  const TREASURY_ADDRESS = new PublicKey('11111111111111111111111111111111');

  function failSession(reason: string) {
    // In a real on-chain scenario, this client-side trigger might ping a backend oracle
    // which then sends the `slash_session` transaction. For now, we simulate the slash.
    setVaultState('FAILED');
    console.error(`Session failed: ${reason}`);
  }

  // Handle Visibility and Blur for Anti-Cheat
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (vaultState === 'ACTIVE' && document.visibilityState === 'hidden') {
        failSession('You left the tab.');
      }
    };

    const handleBlur = () => {
      if (vaultState === 'ACTIVE') {
        failSession('Window lost focus.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [vaultState]);

  // Timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (vaultState === 'ACTIVE' && endTimeRef.current) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((endTimeRef.current! - now) / 1000));
        setTimeLeft(remaining);

        if (remaining <= 0) {
          clearInterval(interval);
          setVaultState('COMPLETED');
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [vaultState]);

  const handleStartStake = async () => {
    if (!publicKey) return;

    try {
      setVaultState('STAKING');
      
      const amountLamports = parseFloat(stakeAmount) * 1e9;
      
      // MOCK: In production, this would call the Anchor program's `initialize_session`
      // Here we just send SOL to a dummy treasury to simulate "locking"
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: TREASURY_ADDRESS,
          lamports: amountLamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');

      // Start the timer
      const durationSeconds = durationMinutes * 60;
      endTimeRef.current = Date.now() + durationSeconds * 1000;
      setTimeLeft(durationSeconds);
      setVaultState('ACTIVE');
      
    } catch (err) {
      console.error('Staking failed:', err);
      setVaultState('IDLE');
    }
  };

  const handleReclaim = async () => {
    // MOCK: In production, user calls the Anchor program's `reclaim_session`
    // which transfers the escrowed SOL back to the user.
    alert("Reclaim transaction simulated! Stake returned.");
    setVaultState('IDLE');
  };

  // Format time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      
      {/* Aesthetic glowing background orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-light text-white tracking-tight flex items-center justify-center gap-3">
            <Lock className="w-7 h-7 text-teal-400" />
            Accountability Vault
          </h2>
          <p className="text-white/40 mt-2 font-mono text-sm uppercase tracking-widest">Stake-to-Disconnect</p>
        </div>

        <AnimatePresence mode="wait">
          
          {/* IDLE STATE: Connect & Setup */}
          {vaultState === 'IDLE' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col items-center gap-6"
            >
              {!publicKey ? (
                <div className="flex flex-col items-center gap-4 py-8">
                  <div className="p-4 rounded-full bg-white/5 border border-white/10 mb-2">
                    <ShieldCheck className="w-10 h-10 text-white/50" />
                  </div>
                  <p className="text-white/60 text-center max-w-sm mb-4">
                    Connect your Solana wallet to stake tokens and enforce your focus session.
                  </p>
                  <WalletMultiButton className="!bg-teal-500/20 !text-teal-300 hover:!bg-teal-500/30 !rounded-xl !transition-colors !border !border-teal-500/50 font-mono" />
                </div>
              ) : (
                <div className="w-full max-w-sm space-y-6">
                  {/* Stake Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-white/50 ml-1">Stake Amount (SOL)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        step="0.01"
                        min="0.01"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-teal-500/50 transition-colors font-mono"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <Image src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=025" alt="SOL" width={20} height={20} className="w-5 h-5 opacity-80" />
                      </div>
                    </div>
                  </div>

                  {/* Duration Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-white/50 ml-1">Duration</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[15, 30, 60].map(mins => (
                        <button
                          key={mins}
                          onClick={() => setDurationMinutes(mins)}
                          className={`py-3 rounded-xl border font-mono text-sm transition-all ${
                            durationMinutes === mins 
                              ? 'bg-teal-500/20 border-teal-500/50 text-teal-300' 
                              : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                          }`}
                        >
                          {mins}m
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Start Button */}
                  <button 
                    onClick={handleStartStake}
                    className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/50 text-teal-300 font-bold uppercase tracking-widest hover:bg-teal-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Lock & Start
                  </button>
                  
                  <p className="text-[10px] text-white/30 text-center font-mono uppercase mt-4">
                    Warning: Leaving this tab or minimizing the window will result in a slashed stake.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* STAKING STATE: Loading */}
          {vaultState === 'STAKING' && (
            <motion.div
              key="staking"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-12 flex flex-col items-center gap-6"
            >
              <RefreshCcw className="w-12 h-12 text-teal-400 animate-spin" />
              <p className="text-white/60 font-mono animate-pulse">Awaiting Signature...</p>
            </motion.div>
          )}

          {/* ACTIVE STATE: Countdown */}
          {vaultState === 'ACTIVE' && (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="py-12 flex flex-col items-center gap-8 w-full"
            >
              <div className="relative">
                {/* Glowing ring */}
                <div className="absolute inset-0 bg-teal-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                
                {/* Timer text */}
                <h1 className="text-8xl md:text-9xl font-light text-white tracking-tighter tabular-nums relative z-10" style={{ textShadow: '0 0 40px rgba(45, 212, 191, 0.4)' }}>
                  {formatTime(timeLeft)}
                </h1>
              </div>

              <div className="flex items-center gap-2 text-teal-400/80 bg-teal-400/10 px-4 py-2 rounded-full border border-teal-400/20">
                <Timer className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-mono uppercase tracking-widest">Focus Locked</span>
              </div>
            </motion.div>
          )}

          {/* FAILED STATE: Slashed */}
          {vaultState === 'FAILED' && (
            <motion.div
              key="failed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12 flex flex-col items-center gap-6"
            >
              <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-2">
                <AlertOctagon className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-3xl text-red-500 font-light tracking-tight">Focus Broken</h3>
              <p className="text-white/60 text-center max-w-sm">
                You lost focus on this window. Your stake has been slashed and sent to the treasury.
              </p>
              <button 
                onClick={() => setVaultState('IDLE')}
                className="mt-4 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-mono text-sm text-white/80 uppercase tracking-wider"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* COMPLETED STATE: Success */}
          {vaultState === 'COMPLETED' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center gap-6"
            >
              <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-2">
                <Zap className="w-12 h-12 text-emerald-400" />
              </div>
              <h3 className="text-3xl text-emerald-400 font-light tracking-tight">Session Complete</h3>
              <p className="text-white/60 text-center max-w-sm">
                Incredible focus. You may now reclaim your stake and collect your reward.
              </p>
              <button 
                onClick={handleReclaim}
                className="mt-4 w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/50 text-emerald-300 font-bold uppercase tracking-widest hover:bg-emerald-500/30 transition-all shadow-[0_0_20px_rgba(52,211,153,0.2)]"
              >
                Sign to Reclaim
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
