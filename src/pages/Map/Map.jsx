import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { venueService } from '../../services/venueService';

export function Map() {
    const { isAuthenticated } = useAuth();
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [venues, setVenues] = useState([]);
    const [selectedSport, setSelectedSport] = useState(null);
    const [sports, setSports] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const mapStyles = {
        height: "70vh",
        width: "100%"
    };

    const defaultCenter = {
        lat: -34.603722, // Buenos Aires
        lng: -58.381592
    };

    useEffect(() => {
        const fetchSports = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await venueService.getSports();
                setSports(data);
            } catch (error) {
                setError(error.message);
                console.error('Error al cargar deportes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSports();
    }, []);

    useEffect(() => {
        const fetchVenues = async () => {
            if (!selectedSport) {
                setVenues([]);
                return;
            }
            
            try {
                setLoading(true);
                setError(null);
                const data = await venueService.getAllVenues(
                    selectedSport,
                    defaultCenter.lat,
                    defaultCenter.lng
                );
                setVenues(data.venues || []);
            } catch (error) {
                setError(error.message);
                console.error('Error al cargar venues:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVenues();
    }, [selectedSport]);

    const MapContent = () => (
        <div className="venues-map-container p-4">
            <div className="mb-6">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="filters mb-4">
                    <select 
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                        value={selectedSport} 
                        onChange={(e) => setSelectedSport(e.target.value)}
                        disabled={loading}
                    >
                        <option value="">Todos los deportes</option>
                        {sports.map(sport => (
                            <option key={sport.id} value={sport.id}>
                                {sport.name}
                            </option>
                        ))}
                    </select>
                </div>

                {loading && (
                    <div className="text-center text-gray-600 dark:text-gray-400">
                        Cargando...
                    </div>
                )}
            </div>

            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={13}
                    center={defaultCenter}
                    options={{
                        styles: [
                            {
                                elementType: "geometry",
                                stylers: [{ color: "#242f3e" }]
                            },
                            {
                                elementType: "labels.text.stroke",
                                stylers: [{ color: "#242f3e" }]
                            },
                            {
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#746855" }]
                            }
                        ]
                    }}
                >
                    {venues.map(venue => (
                        <Marker
                            key={venue.place_id}
                            position={{
                                lat: venue.lat,
                                lng: venue.lng
                            }}
                            onClick={() => setSelectedVenue(venue)}
                        />
                    ))}

                    {selectedVenue && (
                        <InfoWindow
                            position={{
                                lat: selectedVenue.lat,
                                lng: selectedVenue.lng
                            }}
                            onCloseClick={() => setSelectedVenue(null)}
                        >
                            <div className="max-w-sm">
                                <h3 className="font-bold text-lg mb-2">{selectedVenue.name}</h3>
                                <p className="text-gray-600 mb-2">{selectedVenue.address}</p>
                                {selectedVenue.opening_hours && (
                                    <p className={`mb-2 ${
                                        selectedVenue.opening_hours.open_now 
                                            ? "text-green-600" 
                                            : "text-red-600"
                                    }`}>
                                        {selectedVenue.opening_hours.open_now 
                                            ? "Abierto" 
                                            : "Cerrado"}
                                    </p>
                                )}
                                {selectedVenue.photo_reference && (
                                    <img
                                        src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${selectedVenue.photo_reference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
                                        alt={selectedVenue.name}
                                        className="w-full h-auto rounded-lg shadow-md"
                                    />
                                )}
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );

    return (
        <>
            {!isAuthenticated ? (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center p-8 bg-red-700 dark:bg-red-900 rounded-lg">
                        <h2 className="text-2xl text-white font-normal">Acceso Denegado</h2>
                        <p className="mt-2 text-white">Debes iniciar sesión para ver el mapa</p>
                    </div>
                </div>
            ) : (
                <MapContent />
            )}
        </>
    );
}

