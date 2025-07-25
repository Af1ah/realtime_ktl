'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Car, 
  AlertTriangle, 
  TrendingUp, 
  MapPin, 
  Clock,
  Users,
  Route
} from 'lucide-react';
import { useWebSocketStore } from '@/lib/websocket';
import { useAuthStore } from '@/lib/auth';
import { toast } from 'sonner';

interface DashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  totalIncidents: number;
  activeIncidents: number;
  avgResponseTime: string;
  totalRoutes: number;
  activeUsers: number;
  systemUptime: string;
}

interface RecentActivity {
  id: number;
  type: 'vehicle' | 'incident' | 'route' | 'user';
  message: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { subscribe, unsubscribe, isConnected } = useWebSocketStore();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 156,
    activeVehicles: 89,
    totalIncidents: 23,
    activeIncidents: 7,
    avgResponseTime: '4.2 min',
    totalRoutes: 342,
    activeUsers: 45,
    systemUptime: '99.8%'
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: 1,
      type: 'incident',
      message: 'New traffic incident reported on Highway 101',
      timestamp: '2 minutes ago',
      status: 'warning'
    },
    {
      id: 2,
      type: 'vehicle',
      message: 'Vehicle KTL-001 completed route successfully',
      timestamp: '5 minutes ago',
      status: 'success'
    },
    {
      id: 3,
      type: 'route',
      message: 'Route optimization completed for downtown area',
      timestamp: '8 minutes ago',
      status: 'info'
    },
    {
      id: 4,
      type: 'user',
      message: 'New driver registered: John Smith',
      timestamp: '12 minutes ago',
      status: 'info'
    },
    {
      id: 5,
      type: 'incident',
      message: 'Incident #INC-2024-001 resolved',
      timestamp: '15 minutes ago',
      status: 'success'
    }
  ]);

  useEffect(() => {
    if (isConnected) {
      // Subscribe to real-time updates
      subscribe('dashboard_stats', (data) => {
        setStats(prev => ({ ...prev, ...data }));
      });

      subscribe('system_notifications', (data) => {
        if (data.type === 'activity') {
          setRecentActivity(prev => [data.activity, ...prev.slice(0, 4)]);
        }
        
        // Show toast notifications for important events
        if (data.priority === 'high') {
          toast.warning(data.message);
        }
      });

      return () => {
        unsubscribe('dashboard_stats');
        unsubscribe('system_notifications');
      };
    }
  }, [isConnected, subscribe, unsubscribe]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vehicle':
        return <Car className="h-4 w-4" />;
      case 'incident':
        return <AlertTriangle className="h-4 w-4" />;
      case 'route':
        return <Route className="h-4 w-4" />;
      case 'user':
        return <Users className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-blue-100 text-lg">
          Here's what's happening with your traffic management system today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVehicles}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{stats.activeVehicles} active</span>
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeIncidents}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalIncidents} total incidents
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↓ 12% from last week</span>
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.systemUptime}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates from your traffic management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`p-1 rounded-full ${getStatusColor(activity.status)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <MapPin className="mr-2 h-4 w-4" />
              View Live Map
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Report Incident
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Car className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Route className="mr-2 h-4 w-4" />
              Optimize Routes
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Active Routes</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.totalRoutes}
            </div>
            <Badge variant="secondary">Optimized daily</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Active Users</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.activeUsers}
            </div>
            <Badge variant="secondary">Currently online</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Connection Status</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold mb-2">
              {isConnected ? (
                <span className="text-green-600">●</span>
              ) : (
                <span className="text-red-600">●</span>
              )}
            </div>
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}