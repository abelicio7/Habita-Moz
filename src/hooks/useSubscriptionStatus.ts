import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export type SubscriptionStatus = 'trial_active' | 'trial_expired' | 'active' | 'inactive';

export function useSubscriptionStatus() {
  const { profile, isAdvertiser } = useAuth();

  const status = useMemo((): SubscriptionStatus => {
    if (!profile || !isAdvertiser) {
      return 'inactive';
    }

    // Se subscription_status é 'active', usuário pagou
    if (profile.subscription_status === 'active') {
      // Verificar se ainda está dentro do período pago
      if (profile.trial_ends_at && new Date(profile.trial_ends_at) > new Date()) {
        return 'active';
      }
      // Período pago expirou
      return 'trial_expired';
    }

    // Verificar trial
    if (profile.trial_ends_at) {
      const trialEnd = new Date(profile.trial_ends_at);
      if (trialEnd > new Date()) {
        return 'trial_active';
      }
      return 'trial_expired';
    }

    return 'inactive';
  }, [profile, isAdvertiser]);

  const daysRemaining = useMemo(() => {
    if (!profile?.trial_ends_at) return 0;
    const endDate = new Date(profile.trial_ends_at);
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [profile?.trial_ends_at]);

  const canAccessPremium = status === 'trial_active' || status === 'active';

  return {
    status,
    daysRemaining,
    canAccessPremium,
    isTrialActive: status === 'trial_active',
    isActive: status === 'active',
    isExpired: status === 'trial_expired',
  };
}
