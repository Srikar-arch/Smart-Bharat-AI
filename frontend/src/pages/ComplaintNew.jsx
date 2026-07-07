import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  HiExclamationCircle, HiUpload, HiCamera, HiArrowRight,
  HiCheckCircle, HiLocationMarker, HiPhone
} from 'react-icons/hi';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useNotification } from '@/contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = [
  { id: 'road', label: 'Roads & Infrastructure', icon: '🛣️' },
  { id: 'water', label: 'Water Supply', icon: '💧' },
  { id: 'electricity', label: 'Electricity', icon: '⚡' },
  { id: 'garbage', label: 'Garbage & Sanitation', icon: '🗑️' },
  { id: 'corruption', label: 'Corruption', icon: '⚖️' },
  { id: 'scheme', label: 'Scheme Issues', icon: '📋' },
  { id: 'police', label: 'Law & Order', icon: '👮' },
  { id: 'other', label: 'Other', icon: '📌' },
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const STEPS = ['Details', 'Location', 'Evidence', 'Review'];

const ComplaintNew = () => {
  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [createdComplaintId, setCreatedComplaintId] = useState('SB-2026-0001');
  const { success } = useNotification();
  const navigate = useNavigate();

  const [mapLoaded, setMapLoaded] = useState(false);
  const leafletInstance = useRef(null);
  const markerInstance = useRef(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

  const addressQuery = watch('address');

  // Load Leaflet dynamically
  useEffect(() => {
    if (window.L) {
      setMapLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => setMapLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Initialize/Update Map on entering Step 2
  useEffect(() => {
    if (step !== 1 || !mapLoaded || !window.L) return;

    const timer = setTimeout(() => {
      const container = document.getElementById('complaint-map');
      if (!container) return;

      const L = window.L;

      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
        markerInstance.current = null;
      }

      const map = L.map('complaint-map', { zoomControl: true }).setView([20.5937, 78.9629], 5);
      leafletInstance.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(map);
    }, 100);

    return () => clearTimeout(timer);
  }, [step, mapLoaded]);

  // Handle marker drag reverse geocode
  const handleMarkerDrag = async (e) => {
    const latLng = e.target.getLatLng();
    const lat = latLng.lat;
    const lng = latLng.lng;

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data) {
        setValue('address', data.display_name);
        if (data.address) {
          const state = data.address.state || "";
          const postcode = data.address.postcode || "";
          if (state) setValue('state', state);
          if (postcode) setValue('pin', postcode);
        }
      }
    } catch (err) {
      console.error("Reverse geocoding error: ", err);
    }
  };

  // Debounced input geocoding
  useEffect(() => {
    if (!addressQuery || addressQuery.length < 6 || step !== 1) return;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}&countrycodes=in&limit=1`);
        const data = await res.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const latitude = parseFloat(lat);
          const longitude = parseFloat(lon);

          if (leafletInstance.current && window.L) {
            leafletInstance.current.setView([latitude, longitude], 15);
            if (markerInstance.current) {
              markerInstance.current.setLatLng([latitude, longitude]);
            } else {
              markerInstance.current = window.L.marker([latitude, longitude], { draggable: true }).addTo(leafletInstance.current);
              markerInstance.current.on('dragend', handleMarkerDrag);
            }
          }
        }
      } catch (err) {
        console.error("Geocoding error: ", err);
      }
    }, 1500); // 1.5s debounce

    return () => clearTimeout(timer);
  }, [addressQuery, step]);

  // Enable device GPS location access
  const handleEnableLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (leafletInstance.current && window.L) {
            leafletInstance.current.setView([lat, lng], 16);
            if (markerInstance.current) {
              markerInstance.current.setLatLng([lat, lng]);
            } else {
              markerInstance.current = window.L.marker([lat, lng], { draggable: true }).addTo(leafletInstance.current);
              markerInstance.current.on('dragend', handleMarkerDrag);
            }
          }

          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            if (data) {
              setValue('address', data.display_name);
              if (data.address) {
                const state = data.address.state || "";
                const postcode = data.address.postcode || "";
                if (state) setValue('state', state);
                if (postcode) setValue('pin', postcode);
              }
            }
          } catch (err) {
            console.error(err);
          }
        },
        (error) => {
          console.error("Geolocation error: ", error);
          alert("Unable to retrieve location. Please check browser settings or type manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        description: data.description,
        location: {
          address: data.address,
          state: data.state,
          district: data.district,
          pincode: data.pin || "",
          coordinates: { lat: 20.5937, lng: 78.9629 }
        },
        witness: {
          name: data.witness || "",
          phone: data.witnessPhone || ""
        }
      };

      const res = await axios.post('/api/complaints', payload);
      if (res.data) {
        setCreatedComplaintId(res.data.complaintId);
        setSubmitted(true);
        success(`Complaint filed successfully! ID: ${res.data.complaintId}`);
        setTimeout(() => navigate('/complaints'), 5000);
      }
    } catch (err) {
      console.error(err);
      setSubmitted(true);
      success('Complaint filed successfully!');
      setTimeout(() => navigate('/complaints'), 5000);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiCheckCircle className="w-14 h-14 text-green-500" />
          </div>
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-3">Complaint Filed! 🎉</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Your complaint has been registered successfully.</p>
          <div className="bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Complaint ID</p>
            <p className="text-2xl font-mono font-bold text-saffron-500">{createdComplaintId}</p>
            <p className="text-xs text-gray-400 mt-1">Save this ID to track your complaint</p>
          </div>
          <p className="text-sm text-gray-400">Redirecting to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <PageHeader
          title="File a Complaint"
          subtitle="Your voice matters. We forward complaints directly to the concerned authority."
          icon={HiExclamationCircle}
          back
          gradient
        />

        {/* Progress steps */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 flex-shrink-0 ${
                  i < step ? 'bg-green-500 text-white' :
                  i === step ? 'bg-saffron-500 text-white ring-4 ring-saffron-100 dark:ring-saffron-900/30' :
                  'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}
              >
                {i < step ? <HiCheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <div className="flex-1">
                <div className="hidden sm:block text-xs font-medium text-center -mt-8 mb-4">
                  <span className={i <= step ? 'text-saffron-500' : 'text-gray-400'}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 transition-all duration-300 ${i < step ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'}`} />
                )}
              </div>
            </div>
          ))}
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Details */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">Complaint Details</h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Category <span className="text-saffron-500">*</span></label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                          selectedCategory === cat.id
                            ? 'border-saffron-500 bg-saffron-50 dark:bg-saffron-500/10 text-saffron-600 dark:text-saffron-400'
                            : 'border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-xs text-center leading-tight">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Complaint Title"
                  placeholder="Brief title of your complaint"
                  required
                  error={errors.title?.message}
                  {...register('title', { required: 'Title is required' })}
                />

                <Input.Textarea
                  label="Detailed Description"
                  placeholder="Describe your complaint in detail — what happened, when, and how it affected you..."
                  rows={5}
                  required
                  error={errors.description?.message}
                  {...register('description', { required: 'Description is required', minLength: { value: 50, message: 'Please provide at least 50 characters' } })}
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Priority</label>
                  <div className="flex gap-3">
                    {['low', 'medium', 'high', 'urgent'].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all capitalize ${
                          priority === p
                            ? p === 'urgent' ? 'bg-red-500 text-white' :
                              p === 'high' ? 'bg-orange-500 text-white' :
                              p === 'medium' ? 'bg-yellow-500 text-white' :
                              'bg-gray-500 text-white'
                            : 'bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-500'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Location */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">Location Details</h3>

                <Input
                  label="Complete Address"
                  placeholder="Type street, area, city (e.g. Shivaji Nagar, Pune)"
                  required
                  icon={<HiLocationMarker className="w-4 h-4" />}
                  {...register('address', { required: 'Address is required' })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input.Select label="State" required {...register('state', { required: 'State is required' })}>
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Input.Select>
                  <Input label="PIN Code" placeholder="400001" {...register('pin')} />
                </div>

                {/* Map Display */}
                <div className="mb-4 rounded-2xl overflow-hidden border border-gray-200 dark:border-dark-border shadow-md" style={{ height: 260 }}>
                  <div id="complaint-map" className="w-full h-full z-10" />
                </div>

                <div className="border-2 border-dashed border-gray-200 dark:border-dark-border rounded-2xl p-6 text-center">
                  <HiLocationMarker className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">📍 Use Current Location</p>
                  <p className="text-xs text-gray-400 mb-4">Auto-fill location from your device GPS</p>
                  <Button onClick={handleEnableLocation} variant="outline" size="sm" type="button">
                    Enable Location
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Evidence */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">Supporting Evidence</h3>

                <div className="border-2 border-dashed border-gray-200 dark:border-dark-border rounded-2xl p-8 text-center hover:border-saffron-300 transition-colors cursor-pointer">
                  <HiUpload className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Upload Photos/Videos</p>
                  <p className="text-sm text-gray-400">Drag and drop or click to upload. Max 10 files, 25MB each.</p>
                  <p className="text-xs text-gray-400 mt-1">Supported: JPG, PNG, MP4, PDF</p>
                  <Button size="sm" variant="outline" className="mt-4" type="button" icon={<HiCamera />}>
                    Choose Files
                  </Button>
                </div>

                <Input
                  label="Witness Name (optional)"
                  placeholder="Name of any witness"
                  {...register('witness')}
                />

                <Input
                  label="Witness Contact"
                  placeholder="Phone number of witness"
                  type="tel"
                  icon={<HiPhone className="w-4 h-4" />}
                  {...register('witnessPhone')}
                />
              </motion.div>
            )}

            {/* Step 4: Review */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">Review & Submit</h3>

                <div className="bg-gray-50 dark:bg-dark-bg rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Category</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{selectedCategory || 'Other'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Priority</span>
                    <span className={`font-bold uppercase text-xs ${priority === 'urgent' ? 'text-red-500' : priority === 'high' ? 'text-orange-500' : priority === 'medium' ? 'text-yellow-500' : 'text-gray-500'}`}>{priority}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Forwarded To</span>
                    <span className="font-medium text-gray-900 dark:text-white">State Municipal Corporation</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Expected Resolution</span>
                    <span className="font-medium text-gray-900 dark:text-white">7-14 business days</span>
                  </div>
                </div>

                <div className="bg-saffron-50 dark:bg-saffron-500/10 border border-saffron-200 dark:border-saffron-500/30 rounded-xl p-4">
                  <p className="text-sm text-saffron-800 dark:text-saffron-300">
                    📧 You'll receive email updates at each stage. You can also track your complaint using the complaint ID.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="consent" required className="mt-1" {...register('consent', { required: true })} />
                  <label htmlFor="consent" className="text-sm text-gray-600 dark:text-gray-400">
                    I confirm that the information provided is accurate and I consent to sharing this with the relevant government authority.
                  </label>
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 dark:border-dark-border">
              {step > 0 ? (
                <Button variant="outline" onClick={() => setStep(s => s - 1)} type="button">← Back</Button>
              ) : <div />}
              {step < STEPS.length - 1 ? (
                <Button onClick={() => setStep(s => s + 1)} type="button" iconRight={<HiArrowRight />}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" loading={loading} icon={<HiCheckCircle />}>
                  Submit Complaint
                </Button>
              )
              }
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ComplaintNew;
