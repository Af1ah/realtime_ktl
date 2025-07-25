'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { vehicleAPI } from '@/lib/api';
import { Car, MoreVertical, AlertTriangle, Route, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Vehicle {
  id: number;
  name: string;
  driver: string;
  status: 'active' | 'inactive' | 'maintenance';
  lastLocation: string;
  lastUpdated: string;
  fuelLevel: number;
  currentRoute?: string;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: 1,
      name: 'KL-01-AB-1234',
      driver: 'John Doe',
      status: 'active',
      lastLocation: 'NH-47 Junction',
      lastUpdated: '2 minutes ago',
      fuelLevel: 75,
      currentRoute: 'City Center Route'
    },
    {
      id: 2,
      name: 'KL-01-CD-5678',
      driver: 'Jane Smith',
      status: 'active',
      lastLocation: 'Bypass Road',
      lastUpdated: '5 minutes ago',
      fuelLevel: 45,
      currentRoute: 'Airport Route'
    },
    {
      id: 3,
      name: 'KL-01-EF-9012',
      driver: 'Mike Johnson',
      status: 'maintenance',
      lastLocation: 'Service Center',
      lastUpdated: '1 hour ago',
      fuelLevel: 20
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'maintenance':
        return <Badge variant="destructive">Maintenance</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getFuelLevelIndicator = (level: number) => {
    let color = level > 70 ? 'bg-green-500' : 
                level > 30 ? 'bg-yellow-500' : 
                'bg-red-500';
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${color}`}
          style={{ width: `${level}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vehicles</h2>
          <p className="text-muted-foreground">
            Manage and monitor your vehicle fleet
          </p>
        </div>
        <Button>
          <Car className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Vehicles
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Vehicles
            </CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vehicles.filter(v => v.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              In Maintenance
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vehicles.filter(v => v.status === 'maintenance').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Fleet</CardTitle>
          <CardDescription>
            A list of all vehicles in your fleet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Fuel Level</TableHead>
                <TableHead>Route</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map(vehicle => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.name}</TableCell>
                  <TableCell>{vehicle.driver}</TableCell>
                  <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{vehicle.lastLocation}</div>
                      <div className="text-xs text-muted-foreground">
                        Updated {vehicle.lastUpdated}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-24">
                      {getFuelLevelIndicator(vehicle.fuelLevel)}
                      <div className="text-xs text-muted-foreground mt-1">
                        {vehicle.fuelLevel}% remaining
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {vehicle.currentRoute || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Assign Route</DropdownMenuItem>
                        <DropdownMenuItem>Track Location</DropdownMenuItem>
                        <DropdownMenuItem>Maintenance Log</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
