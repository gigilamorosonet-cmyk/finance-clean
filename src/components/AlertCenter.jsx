import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getAlertService } from '@/services/alertService';
import { Bell, X, Trash2, AlertCircle, AlertTriangle, AlertOctagon, Info } from 'lucide-react';

export function AlertCenter() {
  const [alerts, setAlerts] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, critical

  const alertService = getAlertService();

  useEffect(() => {
    // Charger les alertes initiales
    setAlerts([...alertService.alerts]);

    // S'abonner aux nouvelles alertes
    const unsubscribe = alertService.subscribe('alert', (newAlert) => {
      setAlerts(prev => [newAlert, ...prev]);
    });

    return unsubscribe;
  }, []);

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertOctagon className="text-red-600" size={16} />;
      case 'danger':
        return <AlertTriangle className="text-red-500" size={16} />;
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={16} />;
      default:
        return <Info className="text-cyan-1" size={16} />;
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'border-red-600/50 bg-red-600/10';
      case 'danger':
        return 'border-red-500/50 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/10';
      default:
        return 'border-cyan-1/30 bg-cyan-1/5';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread') return !alert.read;
    if (filter === 'critical') return ['critical', 'danger'].includes(alert.severity);
    return true;
  });

  const unreadCount = alerts.filter(a => !a.read).length;
  const criticalCount = alerts.filter(a => ['critical', 'danger'].includes(a.severity)).length;

  const handleDismiss = (alertId) => {
    alertService.dismissAlert(alertId);
    setAlerts(alertService.alerts);
  };

  const handleMarkAsRead = (alertId) => {
    alertService.markAsRead(alertId);
    setAlerts([...alertService.alerts]);
  };

  const handleClearAll = () => {
    alertService.clearAll();
    setAlerts([]);
  };

  return (
    <>
      {/* Bell Icon - Floating */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-1 to-gold-1 flex items-center justify-center text-background shadow-lg hover:shadow-xl transition-all hover:scale-110"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Alert Panel */}
      {showPanel && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-h-[600px] overflow-y-auto rounded-lg shadow-2xl card-scifi">
          <Card className="card-scifi border-0 rounded-lg">
            <CardHeader className="sticky top-0 bg-background/95 backdrop-blur border-b border-border/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={20} className="text-cyan-1" />
                  <div>
                    <CardTitle className="text-base">Centre d'Alertes</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {unreadCount} non lues · {criticalCount} critiques
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPanel(false)}
                  className="p-1 hover:bg-border/30 rounded transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Filtres */}
              <div className="flex gap-2 p-3 border-b border-border/30 sticky top-16 bg-background/50 backdrop-blur">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    filter === 'all'
                      ? 'bg-cyan-1 text-background'
                      : 'bg-border/30 text-muted-foreground hover:bg-border/50'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    filter === 'unread'
                      ? 'bg-cyan-1 text-background'
                      : 'bg-border/30 text-muted-foreground hover:bg-border/50'
                  }`}
                >
                  Non lues ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter('critical')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    filter === 'critical'
                      ? 'bg-red-500 text-white'
                      : 'bg-border/30 text-muted-foreground hover:bg-border/50'
                  }`}
                >
                  ⚠️ ({criticalCount})
                </button>
              </div>

              {/* Liste alertes */}
              {filteredAlerts.length > 0 ? (
                <div className="space-y-2 p-3">
                  {filteredAlerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${getAlertColor(alert.severity)} transition-all hover:shadow-md ${
                        !alert.read ? 'font-semibold' : 'opacity-75'
                      }`}
                      onClick={() => handleMarkAsRead(alert.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1">
                          {getAlertIcon(alert.severity)}
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{alert.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {alert.timestamp.toLocaleTimeString('fr-FR')}
                            </p>
                            {alert.action && (
                              <button className="text-xs text-cyan-1 hover:underline mt-2">
                                → {alert.action.label}
                              </button>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDismiss(alert.id);
                          }}
                          className="p-1 hover:bg-border/50 rounded transition-colors flex-shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell size={32} className="text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Aucune alerte</p>
                </div>
              )}

              {/* Actions */}
              {alerts.length > 0 && (
                <div className="border-t border-border/30 p-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={handleClearAll}
                  >
                    <Trash2 size={14} className="mr-1" />
                    Tout effacer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notification Toast (top right) */}
      <div className="fixed top-6 right-6 z-50 space-y-2 max-w-sm pointer-events-none">
        {alerts.slice(0, 3).map(alert => {
          const isCritical = ['critical', 'danger'].includes(alert.severity);
          if (!isCritical && alert.severity === 'info') return null;

          return (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${getAlertColor(alert.severity)} shadow-lg animate-in slide-in-from-top-2 duration-300 pointer-events-auto flex items-start gap-2`}
            >
              {getAlertIcon(alert.severity)}
              <div className="flex-1">
                <p className="text-sm font-semibold">{alert.title}</p>
                <p className="text-xs text-muted-foreground">{alert.message}</p>
              </div>
              <button
                onClick={() => handleDismiss(alert.id)}
                className="p-1 hover:bg-border/30 rounded transition-colors flex-shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
