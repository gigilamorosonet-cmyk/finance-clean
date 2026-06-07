// Service pour les alertes et notifications
// Monitore les changements de taux, zones conflit, etc.

export class AlertService {
  constructor() {
    this.alerts = [];
    this.subscriptions = new Map();
    this.thresholds = {
      exchangeRate: 0.5,      // Alerte si taux change > 0.5%
      interestRate: 0.25,     // Alerte si taux directeur change > 0.25%
      inflation: 0.5,         // Alerte si inflation change > 0.5%
      conflictEscalation: 1   // Alerte sur escalade conflit
    };
  }

  // Créer une alerte
  createAlert(type, title, message, severity = 'info', data = {}) {
    const alert = {
      id: `alert-${Date.now()}-${Math.random()}`,
      type,      // 'exchange-rate', 'interest-rate', 'inflation', 'conflict', 'trade'
      title,
      message,
      severity,  // 'info', 'warning', 'danger', 'critical'
      data,
      timestamp: new Date(),
      read: false,
      action: data.action || null
    };

    this.alerts.unshift(alert);

    // Notifier les subscribers
    this.notifySubscribers('alert', alert);

    // Web Notification si permission
    if (severity !== 'info' && Notification?.permission === 'granted') {
      this.sendWebNotification(alert);
    }

    return alert;
  }

  // Monitorer taux de change
  monitorExchangeRate(pair, currentRate, previousRate) {
    const change = Math.abs((currentRate - previousRate) / previousRate * 100);

    if (change > this.thresholds.exchangeRate) {
      const severity = change > 2 ? 'danger' : 'warning';
      const direction = currentRate > previousRate ? '📈 Hausse' : '📉 Baisse';

      this.createAlert(
        'exchange-rate',
        `${pair} Change Significatif`,
        `${direction} de ${change.toFixed(2)}% - ${previousRate.toFixed(4)} → ${currentRate.toFixed(4)}`,
        severity,
        {
          pair,
          currentRate,
          previousRate,
          change,
          action: {
            label: 'Voir graphique',
            href: '#exchange-chart'
          }
        }
      );
    }
  }

  // Monitorer taux directeurs
  monitorInterestRate(bank, currentRate, previousRate) {
    const change = Math.abs(currentRate - previousRate);

    if (change > this.thresholds.interestRate) {
      const direction = currentRate > previousRate ? '⬆️ Hausse' : '⬇️ Baisse';
      const severity = change > 0.5 ? 'danger' : 'warning';

      this.createAlert(
        'interest-rate',
        `Taux Directeur ${bank}`,
        `${direction} de ${change.toFixed(2)}% - ${previousRate.toFixed(2)}% → ${currentRate.toFixed(2)}%`,
        severity,
        {
          bank,
          currentRate,
          previousRate,
          change
        }
      );
    }
  }

  // Monitorer inflation
  monitorInflation(country, currentRate, previousRate) {
    const change = Math.abs(currentRate - previousRate);

    if (change > this.thresholds.inflation) {
      const severity = currentRate > 5 ? 'danger' : currentRate > 3 ? 'warning' : 'info';
      const direction = currentRate > previousRate ? '📈' : '📉';

      this.createAlert(
        'inflation',
        `Inflation ${country}`,
        `${direction} ${change.toFixed(2)}% - Taux actuel: ${currentRate.toFixed(2)}%`,
        severity,
        {
          country,
          currentRate,
          previousRate,
          change
        }
      );
    }
  }

  // Monitorer escalade conflit
  monitorConflict(region, severity, changeDescription) {
    const severityMap = {
      'critical': 'critical',
      'high': 'danger',
      'moderate': 'warning',
      'low': 'info'
    };

    this.createAlert(
      'conflict',
      `⚠️ Zone de Conflit: ${region}`,
      changeDescription,
      severityMap[severity] || 'warning',
      {
        region,
        severity,
        action: {
          label: 'Voir impact matières',
          href: '#conflict-analysis'
        }
      }
    );
  }

  // Monitorer flux commerciaux
  monitorTrade(country, type, change) {
    const title = type === 'deficit' ? '⚠️ Déficit Commercial' : '📦 Excédent Commercial';
    const severity = type === 'deficit' && change > 50 ? 'danger' : 'info';

    this.createAlert(
      'trade',
      `${title} - ${country}`,
      `Changement de $${change}B dans le solde commercial`,
      severity,
      {
        country,
        type,
        change
      }
    );
  }

  // S'abonner à des alertes
  subscribe(type, callback) {
    if (!this.subscriptions.has(type)) {
      this.subscriptions.set(type, []);
    }
    this.subscriptions.get(type).push(callback);

    // Retourner fonction de désabonnement
    return () => {
      const callbacks = this.subscriptions.get(type);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  // Notifier les subscribers
  notifySubscribers(type, data) {
    const callbacks = this.subscriptions.get(type) || [];
    callbacks.forEach(callback => callback(data));
  }

  // Envoyer web notification
  sendWebNotification(alert) {
    try {
      new Notification(alert.title, {
        body: alert.message,
        icon: '/finvue-icon.png',
        tag: alert.id,
        requireInteraction: alert.severity !== 'info'
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  // Demander permission notifications
  static requestPermission() {
    if (!('Notification' in window)) {
      console.log('Notifications non supportées');
      return;
    }

    if (Notification.permission === 'granted') {
      return Promise.resolve();
    }

    if (Notification.permission !== 'denied') {
      return Notification.requestPermission();
    }
  }

  // Marquer alerte comme lue
  markAsRead(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.read = true;
      this.notifySubscribers('alert-read', alert);
    }
  }

  // Supprimer alerte
  dismissAlert(alertId) {
    const index = this.alerts.findIndex(a => a.id === alertId);
    if (index > -1) {
      const alert = this.alerts.splice(index, 1)[0];
      this.notifySubscribers('alert-dismissed', alert);
    }
  }

  // Obtenir alertes non lues
  getUnreadAlerts() {
    return this.alerts.filter(a => !a.read);
  }

  // Obtenir alertes par type
  getAlertsByType(type) {
    return this.alerts.filter(a => a.type === type);
  }

  // Obtenir alertes récentes (dernières 24h)
  getRecentAlerts(hours = 24) {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    return this.alerts.filter(a => a.timestamp.getTime() > cutoff);
  }

  // Effacer toutes les alertes
  clearAll() {
    this.alerts = [];
  }

  // Exporter alertes
  exportAlerts(format = 'json') {
    if (format === 'json') {
      return JSON.stringify(this.alerts, null, 2);
    } else if (format === 'csv') {
      let csv = 'Time,Type,Severity,Title,Message\n';
      this.alerts.forEach(alert => {
        csv += `"${alert.timestamp}","${alert.type}","${alert.severity}","${alert.title}","${alert.message}"\n`;
      });
      return csv;
    }
  }
}

// Instance singleton
let alertServiceInstance = null;

export function getAlertService() {
  if (!alertServiceInstance) {
    alertServiceInstance = new AlertService();
  }
  return alertServiceInstance;
}
