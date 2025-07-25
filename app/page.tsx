import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Activity, AlertTriangle, Trophy, Navigation, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-20 animate-pulse" />
                <div className="relative bg-white rounded-full p-6 shadow-2xl">
                  <MapPin className="w-12 h-12 text-blue-600" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Realtime
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                -KTL
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Smart Traffic Monitoring Platform for Real-time Traffic Management, 
              Vehicle Tracking, and Intelligent Route Optimization
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
                  Access Dashboard
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Traffic Management
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced features designed for modern traffic monitoring and management needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Real-time Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base leading-relaxed">
                Live traffic density tracking, vehicle monitoring, and instant updates 
                across your entire transportation network
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Vehicle Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base leading-relaxed">
                GPS-based real-time vehicle location tracking with route history, 
                performance analytics, and fleet management tools
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl">Incident Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base leading-relaxed">
                Quick incident reporting, automated response team assignment, 
                and real-time status tracking for efficient resolution
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <Trophy className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Gamification</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base leading-relaxed">
                Driver performance scoring, leaderboards, achievements, 
                and reward systems to encourage safe driving practices
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                <Navigation className="w-8 h-8 text-indigo-600" />
              </div>
              <CardTitle className="text-xl">Smart Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base leading-relaxed">
                AI-powered route optimization with real-time traffic analysis, 
                alternative route suggestions, and accurate ETA predictions
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base leading-relaxed">
                Role-based access control, user authentication, 
                administrative tools, and comprehensive audit logging
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Traffic Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join the future of intelligent transportation with our comprehensive 
            real-time monitoring and management platform
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
