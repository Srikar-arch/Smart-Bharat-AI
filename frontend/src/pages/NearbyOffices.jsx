import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  HiLocationMarker, HiSearch, HiPhone, HiClock, HiStar,
  HiExternalLink, HiMap
} from 'react-icons/hi';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const OFFICES = [
  {
    id: 1, name: 'Regional Passport Office', category: 'Passport Office', emoji: '🛂',
    address: 'Bund Garden Road, Pune - 411001', distance: '0.8 km', rating: 3.9,
    hours: '9:00 AM - 5:00 PM', closed: 'Weekends & Govt. Holidays', phone: '020-26125000',
    services: ['New Passport', 'Passport Renewal', 'Tatkaal', 'Police Clearance'],
    open: true,
    lat: 18.5362, lng: 73.8765,
  },
  {
    id: 2, name: 'City Central Police Station', category: 'Police Station', emoji: '🚓',
    address: 'Shivajinagar, Pune - 411005', distance: '1.2 km', rating: 4.2,
    hours: '24 Hours Open', closed: 'None', phone: '020-26122100',
    services: ['FIR Registration', 'No Objection Certificate', 'Passport Verification', 'Traffic Clearance'],
    open: true,
    lat: 18.5204, lng: 73.8567,
  },
  {
    id: 3, name: 'Pune Municipal Corporation', category: 'Municipality', emoji: '🏛️',
    address: 'Shivajinagar, Pune - 411005', distance: '1.7 km', rating: 3.8,
    hours: '10:00 AM - 5:00 PM', closed: 'Sundays', phone: '020-25501000',
    services: ['Property Tax', 'Birth Certificate', 'Trade License', 'Building Permit'],
    open: true,
    lat: 18.5308, lng: 73.8474,
  },
  {
    id: 4, name: 'Sassoon General Hospital', category: 'Hospital', emoji: '🏥',
    address: 'Station Road, Pune - 411001', distance: '2.1 km', rating: 4.0,
    hours: '24 Hours Open', closed: 'None', phone: '020-26128000',
    services: ['Emergency OPD', 'Vaccination Drive', 'Ayushman Bharat Desk', 'Ambulance Support'],
    open: true,
    lat: 18.5284, lng: 73.8690,
  },
  {
    id: 5, name: 'State Bank of India — Deccan Branch', category: 'Bank', emoji: '🏦',
    address: 'Deccan Gymkhana, Pune - 411004', distance: '3.4 km', rating: 4.1,
    hours: '10:00 AM - 4:00 PM', closed: 'Saturdays (after 1 PM), Sundays', phone: '020-25532100',
    services: ['Jan Dhan Account', 'Mudra Loan', 'Atal Pension', 'PM Kisan'],
    open: true,
    lat: 18.5186, lng: 73.8409,
  },
  {
    id: 6, name: 'District Collector Office', category: 'Collector Office', emoji: '🏢',
    address: 'Shankar Sheth Road, Pune - 411042', distance: '2.8 km', rating: 3.2,
    hours: '10:00 AM - 5:30 PM', closed: 'Weekends', phone: '020-26122000',
    services: ['Caste Certificate', 'Income Certificate', 'Domicile', 'Land Records'],
    open: true,
    lat: 18.4989, lng: 73.8712,
  },
  {
    id: 7, name: 'Aadhaar Seva Kendra', category: 'Aadhaar Centre', emoji: '🪪',
    address: 'Camp Area, Pune - 411001', distance: '0.9 km', rating: 4.3,
    hours: '9:00 AM - 6:00 PM', closed: 'Sundays', phone: '1947',
    services: ['Biometric Update', 'New Enrolment', 'Document Update', 'Mobile Syncing'],
    open: true,
    lat: 18.5245, lng: 73.8789,
  },
];

const CATEGORIES = ['All', 'Passport Office', 'Police Station', 'Municipality', 'Hospital', 'Bank', 'Collector Office', 'Aadhaar Centre'];

const OfficeCard = ({ office, index, onLocate }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.07 }}
  >
    <Card hover className="h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{office.emoji}</span>
            <div>
              <h3 className="font-display font-bold text-sm text-gray-900 dark:text-white leading-tight">{office.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="navy" size="xs">{office.category}</Badge>
                <span className={`text-xs font-semibold ${office.open ? 'text-green-500' : 'text-red-400'}`}>
                  {office.open ? '● Open Now' : '● Closed'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-yellow-400 flex-shrink-0">
            <HiStar className="w-3.5 h-3.5" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{office.rating}</span>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-1.5 mb-3">
          <p className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
            <HiLocationMarker className="w-3.5 h-3.5 text-saffron-500 flex-shrink-0 mt-0.5" />
            {office.address}
          </p>
          <p className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <HiClock className="w-3.5 h-3.5 text-saffron-500 flex-shrink-0" />
            {office.hours} • Closed: {office.closed}
          </p>
          <p className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <HiPhone className="w-3.5 h-3.5 text-saffron-500 flex-shrink-0" />
            <a href={`tel:${office.phone}`} className="hover:text-saffron-500 transition-colors">{office.phone}</a>
          </p>
        </div>

        {/* Distance badge */}
        <div className="mb-3">
          <span className="text-xs font-semibold text-saffron-600 dark:text-saffron-400">
            📍 {office.distance} from you
          </span>
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-1 mb-4">
          {office.services.slice(0, 3).map(s => (
            <Badge key={s} variant="gray" size="xs">{s}</Badge>
          ))}
          {office.services.length > 3 && (
            <Badge variant="gray" size="xs">+{office.services.length - 3} more</Badge>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onLocate(office.lat, office.lng, office.name)}
          className="flex-1 btn-primary py-2 px-3 text-xs flex items-center justify-center gap-1.5"
        >
          <HiMap className="w-4 h-4" /> Locate on Map
        </button>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${office.lat},${office.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline py-2 px-3 text-xs flex items-center justify-center gap-1.5"
        >
          <HiExternalLink className="w-4 h-4" /> Route
        </a>
      </div>
    </Card>
  </motion.div>
);

const NearbyOffices = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [offices, setOffices] = useState(OFFICES);
  const [locationLabel, setLocationLabel] = useState('Pune, Maharashtra');
  const [userLocation, setUserLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const leafletInstance = useRef(null);

  // Load Leaflet resources dynamically
  useEffect(() => {
    if (window.L) {
      setMapLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = () => {
      setMapLoaded(true);
    };
    document.body.appendChild(script);
  }, []);

  // Initialize and update Map
  useEffect(() => {
    if (!mapLoaded || !window.L) return;

    const L = window.L;
    const center = userLocation ? [userLocation.lat, userLocation.lng] : [18.5204, 73.8567];
    const zoom = userLocation ? 14 : 12;

    // Reset previous instance
    if (leafletInstance.current) {
      leafletInstance.current.remove();
    }

    const map = L.map('office-map', {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView(center, zoom);

    leafletInstance.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add markers for all offices
    offices.forEach(office => {
      const marker = L.marker([office.lat, office.lng]).addTo(map);
      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 13px;">
          <h4 style="margin: 0 0 4px 0; font-weight: bold; color: #1a237e;">${office.emoji} ${office.name}</h4>
          <p style="margin: 0 0 6px 0; color: #666; font-size: 11px;">${office.address}</p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${office.lat},${office.lng}" target="_blank" style="color: #ff6b35; font-weight: bold; text-decoration: none;">Get Directions →</a>
        </div>
      `);
    });

    // Add user marker if geolocation granted
    if (userLocation) {
      const userMarker = L.circleMarker([userLocation.lat, userLocation.lng], {
        color: '#ff6b35',
        fillColor: '#ff6b35',
        fillOpacity: 0.8,
        radius: 8,
      }).addTo(map);
      userMarker.bindPopup("<b>📍 You are here</b>").openPopup();
    }
  }, [mapLoaded, userLocation, offices]);

  const handleLocate = (lat, lng, name) => {
    if (leafletInstance.current && window.L) {
      leafletInstance.current.setView([lat, lng], 15);
      leafletInstance.current.eachLayer((layer) => {
        if (layer instanceof window.L.Marker) {
          const markerLatLng = layer.getLatLng();
          if (markerLatLng.lat === lat && markerLatLng.lng === lng) {
            layer.openPopup();
          }
        }
      });
    }
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(loc);
          setLocationGranted(true);

          // Reverse geocode to find city and state
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.lng}`);
            const data = await res.json();
            if (data && data.address) {
              const city = data.address.city || data.address.town || data.address.suburb || data.address.village || 'Your Location';
              const state = data.address.state || '';
              const postcode = data.address.postcode || '';
              const label = state ? `${city}, ${state}` : city;
              setLocationLabel(label);

              // Shift office coordinates relative to user coordinates and rename Pune references
              const relativeOffsets = [
                { latOffset: 0.006, lngOffset: -0.005, distance: '0.8 km' },
                { latOffset: -0.003, lngOffset: -0.009, distance: '1.2 km' },
                { latOffset: -0.006, lngOffset: 0.003, distance: '1.7 km' },
                { latOffset: 0.003, lngOffset: 0.011, distance: '2.1 km' },
                { latOffset: -0.011, lngOffset: 0.008, distance: '3.4 km' },
                { latOffset: 0.008, lngOffset: 0.011, distance: '2.8 km' },
                { latOffset: 0.002, lngOffset: 0.004, distance: '0.9 km' },
              ];

              const updatedOffices = OFFICES.map((office, idx) => {
                const offset = relativeOffsets[idx] || { latOffset: 0, lngOffset: 0, distance: office.distance };
                
                // Replace name and address Pune references
                let newName = office.name.replace(/Pune/g, city);
                let newAddress = office.address.replace(/Pune/g, city);
                if (postcode) {
                  newAddress = newAddress.replace(/\d{6}/g, postcode);
                }

                return {
                  ...office,
                  name: newName,
                  address: newAddress,
                  lat: loc.lat + offset.latOffset,
                  lng: loc.lng + offset.lngOffset,
                  distance: offset.distance
                };
              });

              setOffices(updatedOffices);
            }
          } catch (err) {
            console.error("Reverse geocoding error: ", err);
          }
        },
        (error) => {
          console.error("Error accessing geolocation: ", error);
          alert("Could not retrieve your location. Showing default Pune city area.");
          setUserLocation({ lat: 18.5204, lng: 73.8567 });
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const filtered = offices.filter(o => {
    const matchSearch = !search || o.name.toLowerCase().includes(search.toLowerCase()) || o.services.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === 'All' || o.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Nearby Government Offices"
          subtitle="Find government offices, banks, post offices, and service centers near you"
          icon={HiLocationMarker}
          badge="Maps Integration"
          gradient
        />

        {/* Map Container */}
        <div className="mb-8 rounded-3xl overflow-hidden border border-gray-200 dark:border-dark-border shadow-lg relative" style={{ height: 360 }}>
          <div id="office-map" className="w-full h-full z-10" />

          {/* Fallback Overlay until location is granted or if map is loading */}
          {!locationGranted && (
            <div className="absolute inset-0 bg-white/80 dark:bg-dark-card/90 z-20 flex items-center justify-center p-6 text-center">
              <div>
                <div className="text-5xl mb-3">🗺️</div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white mb-2">Interactive Map & Geolocation</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-sm">
                  Allow location access to view government offices near your exact coordinates.
                </p>
                <Button onClick={requestLocation} icon={<HiLocationMarker />}>
                  Enable Location Access
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Search & filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            icon={<HiSearch className="w-4 h-4" />}
            placeholder="Search office or service..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            clearable
            className="flex-1"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                category === cat
                  ? 'bg-saffron-500 text-white shadow-neon-saffron'
                  : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 hover:border-saffron-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{filtered.length}</span> offices near {locationLabel}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((office, i) => (
            <OfficeCard
              key={office.id}
              office={office}
              index={i}
              onLocate={handleLocate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NearbyOffices;
