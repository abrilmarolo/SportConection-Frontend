import React, { createContext, useContext, useState, useEffect } from 'react';
import { matchService } from '../services/matchService';
import { useAuth } from './AuthContext';

const PremiumContext = createContext();

export const usePremium = () => {
    const context = useContext(PremiumContext);
    if (!context) {
        throw new Error('usePremium must be used within PremiumProvider');
    }
    return context;
};

export const PremiumProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [isPremium, setIsPremium] = useState(false);
    const [swipesRemaining, setSwipesRemaining] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dailyLimit, setDailyLimit] = useState(10);

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        const fetchPremiumStatus = async () => {
            try {
                setLoading(true);
                const data = await matchService.getSwipeStats();
                setIsPremium(data.is_premium);
                setSwipesRemaining(data.swipes_remaining);
                setDailyLimit(data.daily_limit);
            } catch (error) {
                console.error('Error fetching premium status:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPremiumStatus();
    }, [isAuthenticated]);

    const refreshPremiumStatus = async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            const data = await matchService.getSwipeStats();
            setIsPremium(data.is_premium);
            setSwipesRemaining(data.swipes_remaining);
            setDailyLimit(data.daily_limit);
        } catch (error) {
            console.error('Error fetching premium status:', error);
        } finally {
            setLoading(false);
        }
    };

    const decrementSwipes = () => {
        if (swipesRemaining !== null && swipesRemaining > 0) {
            setSwipesRemaining(prev => prev - 1);
        }
    };

    const value = {
        isPremium,
        swipesRemaining,
        dailyLimit,
        loading,
        refreshPremiumStatus,
        decrementSwipes
    };

    return (
        <PremiumContext.Provider value={value}>
            {children}
        </PremiumContext.Provider>
    );
};
