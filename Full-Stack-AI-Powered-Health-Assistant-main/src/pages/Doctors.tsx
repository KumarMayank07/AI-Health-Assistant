/// <reference types="google.maps" />
import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Search,
  Database,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/lib/api";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

interface Doctor {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string | null;
  };
  specialization: string;
  experience: number;
  location?: {
    coordinates?: [number, number];
    address?: { formatted?: string };
  };
  geometry?: { location?: { lat: number; lng: number } };
  rating?: { average: number; count: number };
  distance?: number | null;
  contact?: {
    phone?: string | null;
    email?: string | null;
    website?: string | null;
  };
  source?: "database" | "google"; // Track data source
}

// Make doctorLatLng defensive: accept undefined and use optional chaining safely
const doctorLatLng = (
  d?: Doctor | null
): { lat: number; lng: number } | null => {
  if (!d) return null;
  try {
    if (d.geometry?.location && typeof d.geometry.location.lat === "number") {
      return { lat: d.geometry.location.lat, lng: d.geometry.location.lng };
    }
    if (d.location?.coordinates && d.location.coordinates.length === 2) {
      // Mongo GeoJSON stored as [lng, lat]
      return { lat: d.location.coordinates[1], lng: d.location.coordinates[0] };
    }
  } catch (err) {
    // defensive: log and return null
    console.warn("doctorLatLng parse error for doctor:", d, err);
    return null;
  }
  return null;
};

// Google Places API libraries
const libraries: ("places" | "geometry")[] = ["places", "geometry"];

export default function Doctors() {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isRealData, setIsRealData] = useState(false);
  const [searchSource, setSearchSource] = useState<
    "database" | "google" | "both"
  >("google");
  const [searchFilters, setSearchFilters] = useState({
    specialization: "all",
    maxDistance: 50,
  });

  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  const { isLoaded: mapLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_API_KEY || "",
    libraries: libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    attemptGeolocation();
    loadSampleData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSampleData = () => {
    const sampleDoctors: Doctor[] = [
      {
        _id: "1",
        user: {
          firstName: "John",
          lastName: "Smith",
          email: "john.smith@example.com",
          profileImage: null,
        },
        specialization: "Retina Specialist",
        experience: 15,
        location: {
          coordinates: [-74.0007, 40.7336],
          address: { formatted: "123 Medical Center Dr, New York, NY" },
        },
        rating: { average: 4.8, count: 127 },
        distance: 2.5,
        contact: {
          phone: "+1-555-0123",
          email: "john.smith@example.com",
          website: "https://example.com",
        },
        source: "database",
      },
      {
        _id: "2",
        user: {
          firstName: "Sarah",
          lastName: "Johnson",
          email: "sarah.johnson@example.com",
          profileImage: null,
        },
        specialization: "Ophthalmologist",
        experience: 12,
        location: {
          coordinates: [-73.9851, 40.7484],
          address: { formatted: "456 Eye Care Ave, New York, NY" },
        },
        rating: { average: 4.6, count: 89 },
        distance: 3.2,
        contact: {
          phone: "+1-555-0456",
          email: "sarah.johnson@example.com",
          website: null,
        },
        source: "database",
      },
    ];
    setDoctors(sampleDoctors);
    setIsRealData(false);
  };

  const attemptGeolocation = (options?: PositionOptions) => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (lat === 0 && lng === 0) {
          toast({
            title: "Invalid location",
            description:
              "Automatic location returned 0,0. Please enter coordinates manually.",
            variant: "destructive",
          });
          return;
        }
        setUserLocation({ lat, lng });
      },
      (err) => {
        console.error("Geolocation error:", err);
        toast({
          title: "Location access blocked",
          description:
            "Please enable location for your browser or enter coordinates manually below.",
          variant: "destructive",
        });
      },
      { timeout: 10000, maximumAge: 60_000, ...(options || {}) }
    );
  };

  // Helper function to calculate distance between two points
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Google Places API search for nearby doctors
  const searchGooglePlaces = async (): Promise<Doctor[]> => {
    if (!userLocation || !mapLoaded || !window.google) {
      throw new Error("Google Maps not loaded or location not available");
    }

    return new Promise((resolve, reject) => {
      const service = new google.maps.places.PlacesService(mapRef.current!);

      // Determine search keywords based on specialization
      const getSearchKeyword = (spec: string) => {
        switch (spec) {
          case "Retina Specialist":
            return "retina specialist ophthalmologist";
          case "Ophthalmologist":
            return "ophthalmologist eye doctor";
          case "Optometrist":
            return "optometrist eye care";
          case "General Eye Care":
            return "eye doctor ophthalmologist optometrist";
          default:
            return "ophthalmologist eye doctor retina specialist";
        }
      };

      const request: google.maps.places.PlaceSearchRequest = {
        location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
        radius: searchFilters.maxDistance * 1000, // Convert km to meters
        type: "doctor",
        keyword: getSearchKeyword(searchFilters.specialization),
      };

      console.log("Google Places search request:", request);

      service.nearbySearch(request, (results, status) => {
        console.log("Google Places search status:", status);
        console.log("Google Places search results:", results);

        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const googleDoctors: Doctor[] = results
            .filter((place) => place.geometry?.location) // Only places with location
            .map((place, index) => {
              const lat = place.geometry!.location!.lat();
              const lng = place.geometry!.location!.lng();

              return {
                _id: place.place_id || `google-${index}`,
                user: {
                  firstName: place.name?.split(" ")[1] || "Dr.",
                  lastName:
                    place.name?.split(" ").slice(2).join(" ") ||
                    place.name?.split(" ")[0] ||
                    `Doctor ${index + 1}`,
                  email: "contact@example.com",
                  profileImage:
                    place.photos?.[0]?.getUrl({ maxWidth: 100 }) || null,
                },
                specialization:
                  searchFilters.specialization === "all"
                    ? "Eye Care Specialist"
                    : searchFilters.specialization,
                experience: Math.floor(Math.random() * 20) + 5, // Random experience for demo
                geometry: {
                  location: { lat, lng },
                },
                location: {
                  address: {
                    formatted:
                      place.vicinity ||
                      place.formatted_address ||
                      "Address not available",
                  },
                },
                rating: place.rating
                  ? {
                      average: place.rating,
                      count: place.user_ratings_total || 0,
                    }
                  : undefined,
                distance: calculateDistance(
                  userLocation.lat,
                  userLocation.lng,
                  lat,
                  lng
                ),
                contact: {
                  phone: null,
                  email: null,
                  website: null,
                },
                source: "google" as const,
              };
            })
            .sort((a, b) => {
            // Calculate composite score for each doctor
            const getScore = (doctor) => {
              let score = 0;
              
              // Rating weight (0-50 points)
              const rating = doctor.rating?.average || 0;
              score += rating * 10; // 5-star = 50 points
              
              // Review count weight (0-20 points) 
              const reviewCount = doctor.rating?.count || 0;
              score += Math.min(reviewCount / 10, 20); // Cap at 20 points
              
              // Experience weight (0-20 points)
              score += Math.min(doctor.experience, 20);
              
              // Distance penalty (subtract points for farther doctors)
              const distance = doctor.distance || 999;
              score -= distance * 2; // 2 points penalty per km
              
              // Specialization bonus (10 points for exact match)
              if (searchFilters.specialization !== "all" && 
                  doctor.specialization === searchFilters.specialization) {
                score += 10;
              }
              
              return score;
            };
            
            return getScore(b) - getScore(a); // Higher score first
          })

          resolve(googleDoctors);
        } else {
          console.error("Google Places search failed:", status);
          reject(new Error(`Google Places search failed: ${status}`));
        }
      });
    });
  };

  // safe user icon creation (only use google when loaded)
  const userMarkerIcon = (() => {
    if (mapLoaded && window.google?.maps) {
      return {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#2563eb",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#ffffff",
      } as google.maps.Symbol;
    }
    return undefined;
  })();

  // Database search for nearby doctors
  const searchNearbyDoctors = async (): Promise<Doctor[]> => {
    if (!userLocation) {
      throw new Error("Location required for nearby search");
    }

    const res = await apiService.getNearbyDoctors(
      userLocation.lat,
      userLocation.lng,
      searchFilters.maxDistance,
      searchFilters.specialization === "all"
        ? undefined
        : searchFilters.specialization
    );

    const found = Array.isArray(res) ? res : res?.doctors ?? [];
    return (found || [])
      .filter(Boolean)
      .map((doc) => ({ ...doc, source: "database" as const }));
  };

  const searchAllDoctors = async (): Promise<Doctor[]> => {
    const res = await apiService.getAllDoctors({
      specialization:
        searchFilters.specialization === "all"
          ? undefined
          : searchFilters.specialization,
      limit: 20,
    });

    const found = Array.isArray(res) ? res : res?.doctors ?? [];
    return (found || [])
      .filter(Boolean)
      .map((doc) => ({ ...doc, source: "database" as const }));
  };

  const handleSearch = async () => {
    if (!userLocation && searchSource !== "database") {
      toast({
        title: "Location required",
        description:
          "Please allow location access or enter coordinates to find nearby doctors.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    let allDoctors: Doctor[] = [];

    try {
      if (searchSource === "google" || searchSource === "both") {
        try {
          const googleDoctors = await searchGooglePlaces();
          allDoctors = [...allDoctors, ...googleDoctors];
          console.log(
            `Found ${googleDoctors.length} doctors from Google Places`
          );
        } catch (err) {
          console.error("Google Places search error:", err);
          toast({
            title: "Google Places search failed",
            description: "Trying database search as fallback.",
            variant: "destructive",
          });
        }
      }

      if (searchSource === "database" || searchSource === "both") {
        try {
          const dbDoctors = userLocation
            ? await searchNearbyDoctors()
            : await searchAllDoctors();
          allDoctors = [...allDoctors, ...dbDoctors];
          console.log(`Found ${dbDoctors.length} doctors from database`);
        } catch (err) {
          console.error("Database search error:", err);
        }
      }

      // Remove duplicates and sort by distance if available
      const uniqueDoctors = allDoctors.filter(
        (doctor, index, self) =>
          index === self.findIndex((d) => d._id === doctor._id)
      );

      if (uniqueDoctors.length > 0) {
        uniqueDoctors.sort((a, b) => {
          // Calculate composite score for each doctor
          const getScore = (doctor) => {
            let score = 0;

            // Rating weight (0-50 points)
            const rating = doctor.rating?.average || 0;
            score += rating * 10; // 5-star = 50 points

            // Review count weight (0-20 points)
            const reviewCount = doctor.rating?.count || 0;
            score += Math.min(reviewCount / 10, 20); // Cap at 20 points

            // Experience weight (0-20 points)
            score += Math.min(doctor.experience, 20);

            // Distance penalty (subtract points for farther doctors)
            const distance = doctor.distance || 999;
            score -= distance * 2; // 2 points penalty per km

            // Specialization bonus (10 points for exact match)
            if (
              searchFilters.specialization !== "all" &&
              doctor.specialization === searchFilters.specialization
            ) {
              score += 10;
            }

            return score;
          };

          return getScore(b) - getScore(a); // Higher score first
        });

        setDoctors(uniqueDoctors);
        setIsRealData(true);

        toast({
          title: "Search completed",
          description: `Found ${uniqueDoctors.length} doctors nearby.`,
        });

        // Pan to first doctor if map present
        const first = doctorLatLng(uniqueDoctors[0]);
        if (first && mapRef.current) {
          mapRef.current.panTo(first);
        }
      } else {
        toast({
          title: "No nearby doctors found",
          description: "Try increasing distance or changing specialization.",
          variant: "default",
        });
        loadSampleData(); // Fallback to sample data
      }
    } catch (err) {
      console.error("Search error:", err);
      toast({
        title: "Search error",
        description: "Could not fetch doctors. Showing sample data.",
        variant: "destructive",
      });
      loadSampleData();
    } finally {
      setLoading(false);
    }
  };

  const handleLoadRealData = async () => {
    setLoading(true);
    try {
      const dbDoctors = await searchAllDoctors();
      if (dbDoctors.length > 0) {
        setDoctors(dbDoctors);
        setIsRealData(true);
        toast({
          title: "Real data loaded",
          description: "Doctors loaded from server.",
        });
      } else {
        toast({
          title: "No doctors in database",
          description: "No doctors found in your database.",
          variant: "default",
        });
      }
    } catch (err) {
      console.error("Load real data error:", err);
      toast({
        title: "Error",
        description: "Could not fetch doctors from database.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const [manualCoords, setManualCoords] = useState({ lat: "", lng: "" });
  const useManualCoords = () => {
    const lat = parseFloat(manualCoords.lat);
    const lng = parseFloat(manualCoords.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      setUserLocation({ lat, lng });
      toast({
        title: "Location set",
        description: `Using coordinates: ${lat}, ${lng}`,
      });
    } else {
      toast({
        title: "Invalid coordinates",
        description: "Please enter valid numeric lat and lng.",
        variant: "destructive",
      });
    }
  };

  // choose a center: userLocation else first doctor else default
  const safeDoctors = doctors.filter(Boolean);
  const mapCenter = userLocation ??
    doctorLatLng(safeDoctors[0]) ?? { lat: 40.7128, lng: -74.006 };

  return (
    <div className="container py-10 space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Find Doctors</h1>
        <p className="text-muted-foreground">
          Discover retina care specialists and ophthalmologists near you
        </p>

        {!isRealData && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              📋 Showing sample data. Use search options below to find real
              doctors.
            </p>
          </div>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Search Source</Label>
              <Select
                value={searchSource}
                onValueChange={(v) =>
                  setSearchSource(v as "database" | "google" | "both")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Google Places
                    </div>
                  </SelectItem>
                  <SelectItem value="database">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      Database
                    </div>
                  </SelectItem>
                  <SelectItem value="both">Both Sources</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Specialization</Label>
              <Select
                value={searchFilters.specialization}
                onValueChange={(v) =>
                  setSearchFilters({ ...searchFilters, specialization: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All specializations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All specializations</SelectItem>
                  <SelectItem value="Retina Specialist">
                    Retina Specialist
                  </SelectItem>
                  <SelectItem value="Ophthalmologist">
                    Ophthalmologist
                  </SelectItem>
                  <SelectItem value="Optometrist">Optometrist</SelectItem>
                  <SelectItem value="General Eye Care">
                    General Eye Care
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Max Distance (km)</Label>
              <Select
                value={String(searchFilters.maxDistance)}
                onValueChange={(v) =>
                  setSearchFilters({
                    ...searchFilters,
                    maxDistance: parseInt(v),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 km</SelectItem>
                  <SelectItem value="10">10 km</SelectItem>
                  <SelectItem value="25">25 km</SelectItem>
                  <SelectItem value="50">50 km</SelectItem>
                  <SelectItem value="100">100 km</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                disabled={
                  loading || (!userLocation && searchSource !== "database")
                }
                className="w-full"
              >
                {loading ? "Searching..." : "Search Doctors"}
              </Button>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleLoadRealData}
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              {loading ? "Loading..." : "Load Database Only"}
            </Button>
            <Button
              onClick={loadSampleData}
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              Load Sample Data
            </Button>
            {isRealData && (
              <div className="flex items-center px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                <span className="text-sm text-green-800">
                  ✅ Real data loaded (
                  {doctors.filter((d) => d.source === "google").length} Google,{" "}
                  {doctors.filter((d) => d.source === "database").length}{" "}
                  Database)
                </span>
              </div>
            )}
          </div>

          {!userLocation && searchSource !== "database" && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <MapPin className="inline w-4 h-4 mr-1" />
                Enable location access to find doctors near you, or enter
                coordinates below.
              </p>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  className="border rounded px-2 py-1"
                  placeholder="Latitude (e.g. 40.7128)"
                  value={manualCoords.lat}
                  onChange={(e) =>
                    setManualCoords({ ...manualCoords, lat: e.target.value })
                  }
                />
                <input
                  className="border rounded px-2 py-1"
                  placeholder="Longitude (e.g. -74.0060)"
                  value={manualCoords.lng}
                  onChange={(e) =>
                    setManualCoords({ ...manualCoords, lng: e.target.value })
                  }
                />
                <div>
                  <Button onClick={useManualCoords} className="w-full">
                    Use Coordinates
                  </Button>
                </div>
              </div>

              <div className="mt-3">
                <Button onClick={() => attemptGeolocation()} variant="ghost">
                  Try Detecting Current Location
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {mapLoaded && GOOGLE_API_KEY ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Map View</CardTitle>
            <CardDescription>View doctors on the map</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: 400 }}>
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={mapCenter}
                zoom={userLocation ? 12 : 11}
                onLoad={(map) => {
                  mapRef.current = map;
                }}
              >
                {userLocation && (
                  <Marker
                    position={userLocation}
                    icon={userMarkerIcon as any}
                    title="Your Location"
                  />
                )}

                {safeDoctors.map((d) => {
                  const loc = doctorLatLng(d);
                  if (!loc) return null;
                  return (
                    <Marker
                      key={d._id}
                      position={loc}
                      onClick={() => setSelectedDoctor(d)}
                      icon={
                        d.source === "google"
                          ? undefined
                          : {
                              path: window.google?.maps?.SymbolPath.CIRCLE,
                              scale: 6,
                              fillColor: "#10b981",
                              fillOpacity: 1,
                              strokeWeight: 2,
                              strokeColor: "#ffffff",
                            }
                      }
                    />
                  );
                })}

                {selectedDoctor &&
                  (() => {
                    const loc = doctorLatLng(selectedDoctor);
                    if (!loc) return null;
                    return (
                      <InfoWindow
                        position={loc}
                        onCloseClick={() => setSelectedDoctor(null)}
                      >
                        <div style={{ maxWidth: 280 }}>
                          <div className="flex items-center gap-2 mb-2">
                            <strong>
                              Dr. {selectedDoctor.user.firstName}{" "}
                              {selectedDoctor.user.lastName}
                            </strong>
                            <Badge
                              variant={
                                selectedDoctor.source === "google"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {selectedDoctor.source === "google"
                                ? "Google"
                                : "DB"}
                            </Badge>
                          </div>
                          <div style={{ fontSize: 13, marginTop: 4 }}>
                            {selectedDoctor.specialization}
                          </div>
                          <div style={{ marginTop: 6, fontSize: 13 }}>
                            {selectedDoctor.location?.address?.formatted}
                          </div>
                          <div style={{ marginTop: 6, fontSize: 13 }}>
                            <em>Rating:</em>{" "}
                            {selectedDoctor.rating?.average?.toFixed(1) ??
                              "N/A"}{" "}
                            ({selectedDoctor.rating?.count ?? 0} reviews)
                          </div>
                          {selectedDoctor.distance && (
                            <div
                              style={{
                                marginTop: 4,
                                fontSize: 12,
                                color: "#666",
                              }}
                            >
                              {selectedDoctor.distance.toFixed(1)} km away
                            </div>
                          )}
                        </div>
                      </InfoWindow>
                    );
                  })()}
              </GoogleMap>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Map View</CardTitle>
            <CardDescription>Google Maps integration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-600">
                  {!mapLoaded
                    ? "Loading Google Maps..."
                    : "Google Maps integration"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  API Key: {GOOGLE_API_KEY ? "Configured" : "Not configured"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeDoctors.map((doctor) => (
          <Card key={doctor._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">
                      Dr. {doctor.user.firstName} {doctor.user.lastName}
                    </CardTitle>
                    <Badge
                      variant={
                        doctor.source === "google" ? "default" : "secondary"
                      }
                    >
                      {doctor.source === "google" ? "Google" : "DB"}
                    </Badge>
                  </div>
                  <CardDescription>{doctor.specialization}</CardDescription>
                </div>
                {doctor.user.profileImage && (
                  <img
                    src={doctor.user.profileImage}
                    alt={`${doctor.user.firstName}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm">
                    {doctor.rating?.average?.toFixed?.(1) ?? "N/A"} (
                    {doctor.rating?.count ?? 0} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {doctor.location?.address?.formatted ??
                      (doctor.geometry?.location
                        ? `${doctor.geometry.location.lat.toFixed(
                            4
                          )}, ${doctor.geometry.location.lng.toFixed(4)}`
                        : "Address not available")}
                  </span>
                </div>

                {doctor.distance != null && (
                  <Badge variant="secondary">
                    {Number(doctor.distance).toFixed(1)} km away
                  </Badge>
                )}

                <div className="text-sm">
                  <p>
                    <strong>Experience:</strong> {doctor.experience} years
                  </p>
                </div>

                <div className="flex gap-2">
                  {doctor.contact?.phone && (
                    <Button size="sm" variant="outline" className="flex-1">
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                  )}
                  {doctor.contact?.email && (
                    <Button size="sm" variant="outline" className="flex-1">
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </Button>
                  )}
                  {doctor.contact?.website && (
                    <Button size="sm" variant="outline" className="flex-1">
                      <Globe className="w-4 h-4 mr-1" />
                      Website
                    </Button>
                  )}
                </div>

                <Button className="w-full">Book Appointment</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {safeDoctors.length === 0 && !loading && (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search filters, enable location access, or click
            "Load Sample Data".
          </p>
          <Button onClick={loadSampleData} variant="outline">
            Load Sample Data
          </Button>
        </div>
      )}
    </div>
  );
}