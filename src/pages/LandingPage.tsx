import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getArtikelList, getStatistik } from '../api/webgisApi';
import '../styles/landing.css';

import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import MapPreviewSection from '../components/landing/MapPreviewSection';
import ArticlesSection from '../components/landing/ArticlesSection';
import LandingFooter from '../components/landing/LandingFooter';
import { formatImageUrl } from '../utils/imageUrl';

const LandingPage: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [artikels, setArtikels] = useState<any[]>([]);
  const [statistik, setStatistik] = useState<any>(null);

  // Carousel Drag & Scroll State
  const artikelTrackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Helper for smooth scrolling
  const handleSmoothScroll = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll to section when navigated from another page with location.state (e.g. { scrollTo: 'layanan' })
  // Otherwise default to top of page (Hero section) on initial load / refresh
  useEffect(() => {
    const stateObj = location.state as { scrollTo?: string } | null;
    if (stateObj && stateObj.scrollTo) {
      const targetId = stateObj.scrollTo;
      const timer = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      // Clear state so refreshing the page starts at top (Hero section)
      window.history.replaceState({}, document.title, window.location.pathname);
      return () => clearTimeout(timer);
    } else if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artikelRes, statRes] = await Promise.all([
          getArtikelList({ page: 1, limit: 6 }),
          getStatistik().catch(() => null),
        ]);
        setArtikels(artikelRes || []);
        if (statRes) {
          setStatistik(statRes);
        }
      } catch (error) {
        console.error('Failed to fetch landing data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="landing-body">
      <Helmet>
        <title>SIGAP UMKM - Sistem Geografis Potensi UMKM</title>
        <meta name="description" content="Visualisasikan Potensi UMKM Lokal dengan GIS di Kabupaten Bandung Barat." />
      </Helmet>

      <LandingNavbar 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        handleSmoothScroll={handleSmoothScroll} 
      />

      <main>
        <HeroSection statistik={statistik} />
        <FeaturesSection />
        <MapPreviewSection statistik={statistik} />
        
        <ArticlesSection 
          artikels={artikels}
          formatImageUrl={formatImageUrl}
          artikelTrackRef={artikelTrackRef}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          startX={startX}
          setStartX={setStartX}
          scrollLeftState={scrollLeftState}
          setScrollLeftState={setScrollLeftState}
        />
      </main>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;
