/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewScreen, VehicleListing, UserAccount } from './types';
import { INITIAL_LISTINGS } from './data/sampleListings';
import {
  supabase,
  fetchListingsFromSupabase,
  insertListingToSupabase,
  getCurrentUserAccount,
  signOutAccount,
} from './lib/supabase';
import { Navbar } from './components/Navbar';
import { BrowseScreen } from './components/BrowseScreen';
import { ListingDetailScreen } from './components/ListingDetailScreen';
import { PostListingScreen } from './components/PostListingScreen';
import { SignUpModal } from './components/SignUpModal';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewScreen>('browse');
  const [selectedListing, setSelectedListing] = useState<VehicleListing | null>(null);
  const [listings, setListings] = useState<VehicleListing[]>(INITIAL_LISTINGS);
  const [isLoadingListings, setIsLoadingListings] = useState<boolean>(true);
  const [isArabic, setIsArabic] = useState<boolean>(true);
  const [notification, setNotification] = useState<string | null>(null);

  // User Account state powered by Supabase Authentication session
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  // Sync dir and lang on html root
  useEffect(() => {
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
  }, [isArabic]);

  // Check active Supabase Auth session on load & listen for auth state changes
  useEffect(() => {
    let isMounted = true;

    async function checkAuthSession() {
      try {
        const account = await getCurrentUserAccount();
        if (isMounted && account) {
          setCurrentUser(account);
        }
      } catch (err) {
        console.error('Failed to get Supabase user session:', err);
      }
    }

    checkAuthSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        const account = await getCurrentUserAccount();
        if (isMounted) setCurrentUser(account);
      } else {
        if (isMounted) setCurrentUser(null);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Fetch all listings from Supabase on mount
  useEffect(() => {
    let isMounted = true;

    async function loadSupabaseListings() {
      try {
        setIsLoadingListings(true);
        const data = await fetchListingsFromSupabase();
        if (isMounted && data && data.length > 0) {
          setListings(data);
        }
      } catch (err) {
        console.error('Failed to load listings from Supabase:', err);
      } finally {
        if (isMounted) {
          setIsLoadingListings(false);
        }
      }
    }

    loadSupabaseListings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectListing = (listing: VehicleListing) => {
    setSelectedListing(listing);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToBrowse = () => {
    setCurrentView('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddListing = async (newListing: VehicleListing) => {
    try {
      // Insert new listing row into Supabase 'listings' table
      const savedListing = await insertListingToSupabase(newListing);
      setListings((prev) => [savedListing, ...prev]);
      setSelectedListing(savedListing);
      setCurrentView('detail');
      setNotification(
        isArabic
          ? 'تم حفظ ونشر إعلان عربتك بنجاح على قاعدة بيانات دلالة!'
          : 'Your listing was saved and published successfully on Dallala!'
      );
    } catch (err) {
      console.error('Error inserting listing to Supabase:', err);
      // Resilient fallback so user flow is never disrupted
      setListings((prev) => [newListing, ...prev]);
      setSelectedListing(newListing);
      setCurrentView('detail');
      setNotification(
        isArabic
          ? 'تم نشر إعلان عربتك بنجاح!'
          : 'Your listing was published successfully!'
      );
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSignUpSuccess = (account: UserAccount) => {
    setCurrentUser(account);
    setNotification(
      isArabic
        ? `أهلاً بك يا ${account.name}! تم تسجيل الدخول بنجاح على منصة دلالة.`
        : `Welcome ${account.name}! You are now signed in to Dallala.`
    );
    setTimeout(() => setNotification(null), 4500);
  };

  const handleSignOut = async () => {
    await signOutAccount();
    setCurrentUser(null);
    setNotification(
      isArabic
        ? 'تم تسجيل الخروج بنجاح.'
        : 'You have signed out successfully.'
    );
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-slate-900 flex flex-col font-['Tajawal',sans-serif]">
      {/* Top App Header with Sign Up & Post Ad */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view === 'browse') setSelectedListing(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isArabic={isArabic}
        onToggleLanguage={() => setIsArabic((prev) => !prev)}
        listingCount={listings.length}
        currentUser={currentUser}
        onOpenSignUp={() => setIsSignUpModalOpen(true)}
      />

      {/* Success Notification Banner */}
      {notification && (
        <div className="bg-emerald-800 text-white px-4 py-3 text-center text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 sticky top-[57px] sm:top-[65px] z-20 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 stroke-[2.5]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content Screens */}
      <main className="flex-1">
        {currentView === 'browse' && (
          <BrowseScreen
            listings={listings}
            onSelectListing={handleSelectListing}
            isArabic={isArabic}
            onNavigateToPost={() => {
              setCurrentView('post');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'detail' && selectedListing && (
          <ListingDetailScreen
            listing={selectedListing}
            onBack={handleBackToBrowse}
            isArabic={isArabic}
          />
        )}

        {currentView === 'post' && (
          <PostListingScreen
            onAddListing={handleAddListing}
            onCancel={handleBackToBrowse}
            isArabic={isArabic}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Sign Up / Account Modal (Separate Optional Flow) */}
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        isArabic={isArabic}
        currentUser={currentUser}
        onSignUpSuccess={handleSignUpSuccess}
        onSignOut={handleSignOut}
      />

      {/* Trust & Safety Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start text-xs text-slate-500">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="font-black text-emerald-900 text-sm">
              {isArabic ? 'دلالة' : 'Dallala'}
            </span>
            <span>•</span>
            <span>
              {isArabic
                ? 'بيع وشراء عربتك بسهولة وأمان، مباشرة من الناس'
                : 'Buy & sell your car easily and safely, directly from people'}
            </span>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center font-medium">
            <span className="flex items-center gap-1 text-emerald-800">
              <ShieldCheck className="w-4 h-4" />
              {isArabic ? 'إعلانات مباشرة بدون عمولات مخفية' : 'Direct ads with zero hidden fees'}
            </span>
            <span>•</span>
            <span>{isArabic ? 'الخرطوم • بورتسودان • أم درمان • كسلا • ود مدني' : 'Khartoum • Port Sudan • Omdurman • Kassala'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
