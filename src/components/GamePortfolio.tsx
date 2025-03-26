'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  User, Book, Award, Star, Globe, Code,
  Calendar, Briefcase, ChevronUp, ChevronDown,
  Menu, X, Hexagon, ArrowRight, ArrowLeft,
  Volume2, VolumeX, Shield, Brain, Cloud, Github, Linkedin, Instagram
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Define types for tab items
type TabItem = {
  id: string;
  title: string;
  icon: React.ReactElement<{ className?: string }>;
};

// Define type for swipe direction
type SwipeDirection = 'up' | 'down' | 'left' | 'right' | null;

// Define type for notification
type Notification = {
  id: string;
  message: string;
};

const MobileGameUI = () => {
  // State hooks
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [radialMenuOpen, setRadialMenuOpen] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMusicOn, setIsMusicOn] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [xp, setXp] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [tapCount, setTapCount] = useState<number>(0);

  // Refs
  const easterEggActiveRef = useRef<boolean>(false);
  const tapTimeout = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const levelUpNotificationShown = useRef<boolean>(false);
  const easterEggTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wheelRef = useRef<HTMLDivElement | null>(null);

  // Experience loading effect
  useEffect(() => {
    if (isLoading) {
      const loadingInterval = setInterval(() => {
        setXp(prev => {
          if (prev >= 100) {
            clearInterval(loadingInterval);
            return 100;
          }
          return prev + 5;
        });
      }, 200);

      return () => clearInterval(loadingInterval);
    }
  }, [isLoading]);

  // Audio setup effect
  useEffect(() => {
    audioRef.current = new Audio('/Did I Stutter_.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    audioRef.current.load();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Audio toggle effect
  useEffect(() => {
    if (!audioRef.current) return;

    if (isMusicOn) {
      const playPromise = audioRef.current.play();
      playPromise?.catch(error => {
        console.warn("Audio playback failed:", error);
        addNotification("🔊 Click anywhere to enable music");

        const handleClick = () => {
          audioRef.current?.play().catch(e => console.warn("Audio still failed:", e));
          document.removeEventListener('click', handleClick);
        };
        document.addEventListener('click', handleClick, { once: true });
      });
    } else {
      audioRef.current.pause();
    }
  }, [isMusicOn]);

  // XP and level up effect
  useEffect(() => {
    const interval = setInterval(() => {
      setXp((prevXp) => {
        if (prevXp >= 100) {
          const newLevel = level + 1;
          setLevel(newLevel);

          if (!levelUpNotificationShown.current) {
            levelUpNotificationShown.current = true;
            addNotification(`🎖️ Leveled Up! You are now Level ${newLevel}!`);
            setTimeout(() => {
              levelUpNotificationShown.current = false;
            }, 1000);
          }
          return 0;
        }
        return prevXp + 10;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [level]);

  // Notifications and unique ID generation
  const generateUniqueId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  const addNotification = (message: string): void => {
    const id = generateUniqueId();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  // Easter egg activation
  const activateEasterEgg = (source: string) => {
    if (!easterEggActiveRef.current) {
      easterEggActiveRef.current = true;
      addNotification(`🎉 ${source} Easter Egg Unlocked!`);

      if (easterEggTimeoutRef.current) {
        clearTimeout(easterEggTimeoutRef.current);
      }

      easterEggTimeoutRef.current = setTimeout(() => {
        easterEggActiveRef.current = false;
        addNotification('Easter Egg expired!');
        easterEggTimeoutRef.current = null;
      }, 5000);
    }
  };

  // Profile tap handler
  const handleProfileTap = () => {
    if (tapTimeout.current) {
      clearTimeout(tapTimeout.current);
    }

    setTapCount(prevCount => {
      const newCount = prevCount + 1;

      if (newCount >= 5) {
        activateEasterEgg('Mobile');
        return 0;
      }

      tapTimeout.current = setTimeout(() => {
        setTapCount(0);
      }, 3000);

      return newCount;
    });
  };

  // Tab data structure
  const tabs: TabItem[] = [
    { id: 'overview', title: 'Overview', icon: <Book /> },
    { id: 'stats', title: 'Stats', icon: <Award /> },
    { id: 'achievements', title: 'Achievements', icon: <Star /> },
    { id: 'projects', title: 'Projects', icon: <Globe /> },
    { id: 'skills', title: 'Skills', icon: <Code /> },
    { id: 'certifications', title: 'Certifications', icon: <Calendar /> },
    { id: 'experience', title: 'Experience', icon: <Briefcase /> }
  ];

  // Handle touch events for card deck navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null || touchStartX === null) return;

    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;

    const diffY = touchStartY - touchEndY;
    const diffX = touchStartX - touchEndX;

    // Determine if swipe was primarily horizontal or vertical
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (diffX > 50) {
        // Swipe left - go to next tab
        navigateTab(1);
        setSwipeDirection('left');
      } else if (diffX < -50) {
        // Swipe right - go to previous tab
        navigateTab(-1);
        setSwipeDirection('right');
      }
    } else {
      // Vertical swipe
      if (diffY > 50) {
        setSwipeDirection('up');
        // Swipe up functionality - could open details
        setRadialMenuOpen(false);
      } else if (diffY < -50) {
        setSwipeDirection('down');
        // Swipe down functionality - could close details
        setRadialMenuOpen(false);
      }
    }

    // Reset after animation timing
    setTimeout(() => setSwipeDirection(null), 300);

    setTouchStartY(null);
    setTouchStartX(null);
  };

  // Navigate between tabs
  const navigateTab = (direction: number) => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeSection);
    let newIndex = currentIndex + direction;

    // Loop around if we go past the end or beginning
    if (newIndex >= tabs.length) newIndex = 0;
    if (newIndex < 0) newIndex = tabs.length - 1;

    setActiveSection(tabs[newIndex].id);

    // Update wheel rotation for visual feedback
    setWheelRotation(newIndex * (360 / tabs.length) * -1);
  };

  // Toggle radial menu
  const toggleRadialMenu = () => {
    setRadialMenuOpen(!radialMenuOpen);
  };

  // Select a tab from the radial menu
  const selectRadialTab = (id: string) => {
    setActiveSection(id);
    const newIndex = tabs.findIndex(tab => tab.id === id);
    setWheelRotation(newIndex * (360 / tabs.length) * -1);
    setRadialMenuOpen(false);
  };

  // Calculate positions for radial menu items
  const getRadialPosition = (index: number, total: number) => {
    const radius = 120; // Distance from center
    const angle = (index * (360 / total) - 90) * (Math.PI / 180);
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return { x, y };
  };

  // Early rendering for loading screen
  if (isLoading) {
    return (
      <div className="h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="text-4xl mb-8 animate-pulse font-bold text-cyan-400">LOADING...</div>
        <div className="w-64 h-2 bg-gray-700 rounded-full mb-8">
          <div
            className="h-full bg-cyan-400 rounded-full transition-all duration-1000"
            style={{ width: `${xp}%` }}
          />
        </div>
        <button
          onClick={() => setIsLoading(false)}
          className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-xl font-bold 
                     transform hover:scale-105 transition-all animate-bounce"
        >
          PRESS START
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Floating Action Button - Game-style menu toggle */}
      <button
        onClick={toggleRadialMenu}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-cyan-500 
                  flex items-center justify-center shadow-lg border-4 border-cyan-300"
      >
        {radialMenuOpen ?
          <X className="w-8 h-8 text-white" /> :
          <Menu className="w-8 h-8 text-white" />
        }
      </button>

      {/* Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg"
            style={{ animation: 'fadeIn 0.3s ease-in-out' }}
          >
            {notification.message}
          </div>
        ))}
      </div>

      {/* Music Toggle Button */}
      <button
        onClick={() => {
          setIsMusicOn(!isMusicOn);
          addNotification(isMusicOn ? '🔇 Music Off' : '🎵 Music On');
        }}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg hover:bg-gray-700"
      >
        {isMusicOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      {/* Radial Menu */}
      <AnimatePresence>
        {radialMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-64 h-64"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              ref={wheelRef}
            >
              {/* Center Button */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                          w-16 h-16 rounded-full bg-gray-800 border-4 border-cyan-400 
                          flex items-center justify-center z-10"
                onClick={handleProfileTap}
              >
                <User className="w-8 h-8 text-cyan-400" />
              </div>

              {/* Radial Menu Items */}
              {tabs.map((tab, index) => {
                const { x, y } = getRadialPosition(index, tabs.length);
                return (
                  <motion.button
                    key={tab.id}
                    className={`absolute w-14 h-14 rounded-full flex items-center justify-center
                                ${activeSection === tab.id ? 'bg-cyan-500' : 'bg-gray-700'}`}
                    style={{
                      left: `calc(50% + ${x}px - 28px)`,
                      top: `calc(50% + ${y}px - 28px)`
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      transition: { delay: index * 0.05 }
                    }}
                    exit={{
                      scale: 0,
                      opacity: 0,
                      transition: { delay: (tabs.length - index) * 0.05 }
                    }}
                    onClick={() => selectRadialTab(tab.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {React.cloneElement(tab.icon as React.ReactElement<any>, {
                      className: "w-6 h-6 text-white"
                    })}
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area - Card Deck Style */}
      <div
        className="pt-4 px-4 pb-24 min-h-screen"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Profile Card - Always visible at top */}
        <motion.div
          className="bg-gray-800 rounded-lg p-4 mb-4 border-2 border-cyan-500"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          onClick={handleProfileTap}
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400 relative">
              <Image
                src="/profile_pic.jpg"
                alt="Profile"
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">Player One</h2>
              <p className="text-cyan-400">Level {level} Developer</p>

              {/* XP Bar */}
              <div className="w-full bg-gray-700 h-2 mt-2 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${xp}%` }} />
              </div>
            </div>
          </div>
          <div className="mt-2 flex space-x-2">
            <Github className="hover:text-cyan-400 cursor-pointer" />
            <Linkedin className="hover:text-cyan-400 cursor-pointer" />
            <Instagram className="hover:text-cyan-400 cursor-pointer" />
          </div>
        </motion.div>

        {/* Navigation Indicators */}
        <div className="flex justify-between items-center mb-4 px-2">
          <button
            onClick={() => navigateTab(-1)}
            className="p-2 bg-gray-800 rounded-full border border-gray-700"
          >
            <ArrowLeft className="w-5 h-5 text-cyan-400" />
          </button>

          <div className="text-center font-bold text-lg">
            {tabs.find(tab => tab.id === activeSection)?.title}
          </div>

          <button
            onClick={() => navigateTab(1)}
            className="p-2 bg-gray-800 rounded-full border border-gray-700"
          >
            <ArrowRight className="w-5 h-5 text-cyan-400" />
          </button>
        </div>

        {/* Content Cards with 3D Swipe Effect */}
        <div className="relative h-[500px]" style={{ perspective: '1000px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              className="bg-gray-800 rounded-lg p-6 shadow-xl border-2 border-gray-700 h-full overflow-y-auto"
              initial={{
                x: swipeDirection === 'left' ? 300 : swipeDirection === 'right' ? -300 : 0,
                rotateY: swipeDirection === 'left' ? 30 : swipeDirection === 'right' ? -30 : 0,
                opacity: 0,
                scale: 0.9
              }}
              animate={{
                x: 0,
                rotateY: 0,
                opacity: 1,
                scale: 1
              }}
              exit={{
                x: swipeDirection === 'left' ? -300 : swipeDirection === 'right' ? 300 : 0,
                rotateY: swipeDirection === 'left' ? -30 : swipeDirection === 'right' ? 30 : 0,
                opacity: 0,
                scale: 0.9
              }}
              transition={{ type: 'spring', damping: 15 }}
            >
              {/* Content for each section (Overview, Stats, etc.) */}
              {activeSection === 'overview' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold border-b-2 border-cyan-500 pb-2">Character Bio</h2>
                  <p className="text-gray-300">A legendary developer who specializes in creating immersive web experiences and conquering complex coding challenges.</p>

                  <h3 className="text-xl font-semibold mt-4 text-cyan-400">Main Quests</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Hexagon className="mr-2 text-green-400" size={16} />
                      <span>Master the React Framework</span>
                    </li>
                    <li className="flex items-center">
                      <Hexagon className="mr-2 text-yellow-400" size={16} />
                      <span>Defeat the Legacy Code Boss</span>
                    </li>
                    <li className="flex items-center">
                      <Hexagon className="mr-2 text-red-400" size={16} />
                      <span>Build the Ultimate Portfolio</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* Other sections (Stats, Achievements, Projects, Skills, Certifications, Experience) 
                  would be similar to the previous code */}
              {/* For brevity, I've only shown the Overview section. 
                  You would add the other sections similarly */}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MobileGameUI;