'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mapAPI } from '@/lib/api';
import { Layer, Map, MapLayerMouseEvent, Marker, NavigationControl, Popup, Source } from 'react-map-gl';
import { Car, AlertTriangle } from 'lucide-react';

interface Vehicle {
  id: number;
  name: string;
  lat: number;
  lng: number;
  status: 'active' | 'inactive' | 'maintenance';
}

interface Incident {
  id: number;
  type: string;
  severity: 'high' | 'medium' | 'low';
  location: {
    lat: number;
    lng: number;
  };
  description: string;
}

export default function MapPage() {
  const [viewState, setViewState] = useState({
    latitude: 10.1632,  // Centered on Kerala
    longitude: 76.6413,
    zoom: 11
  });
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedItem, setSelectedItem] = useState<Vehicle | Incident | null>(null);
  const [trafficData, setTrafficData] = useState<any>(null);

  // Simulate real-time updates
  useEffect(() => {
    // Initial load
    loadMapData();

    // Set up periodic updates
    const interval = setInterval(loadMapData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadMapData = async () => {
    try {
      // In a real application, these would be actual API calls
      // For now, we'll simulate with dummy data
      const vehiclesData: Vehicle[] = [
        { id: 1, name: 'KL-01-AB-1234', lat: 10.1634, lng: 76.6413, status: 'active' },
        { id: 2, name: 'KL-01-CD-5678', lat: 10.1532, lng: 76.6513, status: 'active' },
        { id: 3, name: 'KL-01-EF-9012', lat: 10.1732, lng: 76.6313, status: 'inactive' },
      ];

      const incidentsData: Incident[] = [
        {
          id: 1,
          type: 'accident',
          severity: 'high',
          location: { lat: 10.1634, lng: 76.6513 },
          description: 'Major accident on NH-47'
        },
        {
          id: 2,
          type: 'congestion',
          severity: 'medium',
          location: { lat: 10.1532, lng: 76.6413 },
          description: 'Heavy traffic near City Center'
        }
      ];

      setVehicles(vehiclesData);
      setIncidents(incidentsData);

      // Simulate traffic layer data
      setTrafficData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [76.6413, 10.1632],
                [76.6513, 10.1732]
              ]
            },
            properties: {
              congestion: 'high'
            }
          }
        ]
      });
    } catch (error) {
      console.error('Error loading map data:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)]">
      <Card className="h-full">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Traffic Map</CardTitle>
              <CardDescription>Real-time vehicle tracking and traffic monitoring</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">
                {vehicles.filter(v => v.status === 'active').length} Active Vehicles
              </Badge>
              <Badge variant="outline" className="text-red-500">
                {incidents.length} Active Incidents
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-5rem)]">
          <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          >
            <NavigationControl position="top-right" />

            {/* Traffic Layer */}
            {trafficData && (
              <Source type="geojson" data={trafficData}>
                <Layer
                  id="traffic"
                  type="line"
                  paint={{
                    'line-color': [
                      'match',
                      ['get', 'congestion'],
                      'high', '#ff0000',
                      'medium', '#ffff00',
                      '#00ff00'
                    ],
                    'line-width': 4
                  }}
                />
              </Source>
            )}

            {/* Vehicle Markers */}
            {vehicles.map(vehicle => (
              <Marker
                key={vehicle.id}
                latitude={vehicle.lat}
                longitude={vehicle.lng}
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  setSelectedItem(vehicle);
                }}
              >
                <div className={`p-2 rounded-full ${
                  vehicle.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                }`}>
                  <Car className="h-4 w-4 text-white" />
                </div>
              </Marker>
            ))}

            {/* Incident Markers */}
            {incidents.map(incident => (
              <Marker
                key={incident.id}
                latitude={incident.location.lat}
                longitude={incident.location.lng}
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  setSelectedItem(incident);
                }}
              >
                <div className={`p-2 rounded-full ${
                  incident.severity === 'high' ? 'bg-red-500' :
                  incident.severity === 'medium' ? 'bg-yellow-500' :
                  'bg-orange-500'
                }`}>
                  <AlertTriangle className="h-4 w-4 text-white" />
                </div>
              </Marker>
            ))}

            {/* Popup for selected item */}
            {selectedItem && (
              <Popup
                latitude={'lat' in selectedItem ? selectedItem.lat : selectedItem.location.lat}
                longitude={'lng' in selectedItem ? selectedItem.lng : selectedItem.location.lng}
                onClose={() => setSelectedItem(null)}
                closeOnClick={false}
              >
                <div className="p-2">
                  {'name' in selectedItem ? (
                    // Vehicle popup
                    <>
                      <h3 className="font-bold">{selectedItem.name}</h3>
                      <p className="text-sm">Status: {selectedItem.status}</p>
                    </>
                  ) : (
                    // Incident popup
                    <>
                      <h3 className="font-bold">{selectedItem.type}</h3>
                      <p className="text-sm">Severity: {selectedItem.severity}</p>
                      <p className="text-sm">{selectedItem.description}</p>
                    </>
                  )}
                </div>
              </Popup>
            )}
          </Map>
        </CardContent>
      </Card>
    </div>
  );
}
