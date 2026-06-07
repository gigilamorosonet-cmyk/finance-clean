import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './PricingPlans.css';

export function PricingPlans() {
  const { t } = useTranslation();

  const plans = [
    {
      name: t('discovery'),
      price: 'Free',
      features: ['Basic analytics', 'Limited portfolio', 'Weekly updates']
    },
    {
      name: t('starter'),
      price: '4.99€',
      features: ['Advanced analytics', 'Unlimited portfolio', 'Daily updates', 'Email support']
    },
    {
      name: t('pro'),
      price: '14.99€',
      features: ['AI-powered insights', 'Real-time alerts', 'Priority support', 'API access', 'Custom reports']
    },
    {
      name: t('elite'),
      price: '29.99€',
      features: ['Everything in Pro', 'Dedicated advisor', '24/7 premium support', 'Advanced risk analysis', 'Portfolio optimization']
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
      {plans.map((plan, idx) => (
        <div
          key={idx}
          className="pricing-card glass-effect rounded-lg p-6 border border-border hover:border-cyan-1 transition-all"
        >
          <h3 className="text-xl font-bold text-gradient-cyan mb-2">{plan.name}</h3>
          <p className="text-3xl font-bold text-foreground mb-1">
            {plan.price}
            {plan.price !== 'Free' && <span className="text-sm text-muted-foreground">/{t('perMonth')}</span>}
          </p>
          <button className="w-full px-4 py-2 bg-cyan-1 text-background rounded-lg font-semibold hover:bg-cyan-600 transition-colors mb-6">
            {t('subscribe')}
          </button>
          <ul className="space-y-3">
            {plan.features.map((feature, fidx) => (
              <li key={fidx} className="flex items-start gap-3">
                <Check size={16} className="text-cyan-1 mt-1 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
