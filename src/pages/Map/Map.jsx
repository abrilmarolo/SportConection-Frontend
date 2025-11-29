import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { venueService } from '../../services/venueService';
import { FaSearch } from 'react-icons/fa';

export function Map() {
    const { isAuthenticated } = useAuth();
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [venues, setVenues] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mapCenter, setMapCenter] = useState(null);

    const mapStyles = useMemo(() => ({
        height: "70vh",
        width: "100%"
    }), []);

    const defaultCenter = useMemo(() => ({
        lat: -34.603722,
        lng: -58.381592
    }), []);

    // Filtrar venues según búsqueda
    const filteredVenues = useMemo(() => {
        if (!searchQuery.trim()) return venues;
        
        const query = searchQuery.toLowerCase();
        return venues.filter(venue => 
            venue.name?.toLowerCase().includes(query) ||
            venue.address?.toLowerCase().includes(query)
        );
    }, [venues, searchQuery]);

    // Manejar selección desde búsqueda
    const handleSearchSelect = (venue) => {
        setSelectedVenue(venue);
        setMapCenter({
            lat: parseFloat(venue.lat),
            lng: parseFloat(venue.lng)
        });
    };

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    });

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await venueService.getAllVenues();
                setVenues(response.data || []);
            } catch (error) {
                setError(error.message);
                console.error('Error al cargar venues:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVenues();
    }, []);

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
                <div className="venues-map-container p-4">
                    {/* Barra de búsqueda */}
                    <div className="mb-4">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar club por nombre o dirección..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Resultados de búsqueda */}
                        {searchQuery && filteredVenues.length > 0 && (
                            <div className="mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {filteredVenues.map(venue => (
                                    <div
                                        key={venue.id}
                                        onClick={() => handleSearchSelect(venue)}
                                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                                    >
                                        <p className="font-semibold text-gray-900 dark:text-white">{venue.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{venue.address}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {searchQuery && filteredVenues.length === 0 && (
                            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-gray-600 dark:text-gray-400">
                                No se encontraron clubes
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}

                        {loading && (
                            <div className="text-center text-gray-600 dark:text-gray-400">
                                Cargando clubes deportivos...
                            </div>
                        )}

                        {!loading && venues.length > 0 && (
                            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                                Mostrando {venues.length} clubes deportivos
                            </div>
                        )}
                    </div>

                    {loadError ? (
                        <div className="p-4 text-center">
                            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                Error al cargar Google Maps
                            </div>
                        </div>
                    ) : !isLoaded ? (
                        <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                            Cargando mapa...
                        </div>
                    ) : (
                        <GoogleMap
                            mapContainerStyle={mapStyles}
                            zoom={mapCenter ? 15 : 13}
                            center={mapCenter || defaultCenter}
                        >
                            {venues.map(venue => (
                                <Marker
                                    key={venue.id}
                                    position={{
                                        lat: parseFloat(venue.lat),
                                        lng: parseFloat(venue.lng)
                                    }}
                                    onClick={() => setSelectedVenue(venue)}
                                />
                            ))}

                            {selectedVenue && (
                                <InfoWindow
                                    position={{
                                        lat: parseFloat(selectedVenue.lat),
                                        lng: parseFloat(selectedVenue.lng)
                                    }}
                                    onCloseClick={() => setSelectedVenue(null)}
                                >
                                    <div className="max-w-sm">
                                        <h3 className="font-bold text-lg mb-2">{selectedVenue.name}</h3>
                                        <p className="text-gray-600 mb-2">{selectedVenue.address}</p>
                                        {selectedVenue.phone && (
                                            <p className="text-gray-700 mb-2">
                                                <strong>Teléfono:</strong> {selectedVenue.phone}
                                            </p>
                                        )}
                                        {selectedVenue.website && (
                                            <a 
                                                href={selectedVenue.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 underline"
                                            >
                                                Visitar sitio web
                                            </a>
                                        )}
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    )}
                </div>
            )}
        </>
    );
}


