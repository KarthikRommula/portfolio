'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  User, Book, Award, Star, Globe, Code,
  Calendar, Briefcase, ChevronUp, ChevronDown,
  Menu, X, Hexagon, ArrowRight, ArrowLeft,
  Volume2, VolumeX, Shield, Brain, Cloud, Github, Linkedin, Instagram
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

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

const GamePortfolio = () => {
  // All useState hooks first
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [radialMenuOpen, setRadialMenuOpen] = useState<boolean>(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMusicOn, setIsMusicOn] = useState<boolean>(false);
  const [easterEggActive, setEasterEggActive] = useState<boolean>(false);
  const [animationPhase, setAnimationPhase] = useState<number>(0);
  const [experience, setExperience] = useState<number>(0);
  const [konami, setKonami] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [xp, setXp] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);

  // All useRef hooks next
  const idCounterRef = useRef<number>(0);
  const levelUpNotificationShown = useRef<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tapTimeout = useRef<NodeJS.Timeout | null>(null);
  const easterEggActiveRef = useRef<boolean>(false);
  const easterEggTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wheelRef = useRef<HTMLDivElement | null>(null);

  // Creating callback functions to avoid dependency warnings
  const addNotification = useCallback((message: string): void => {
    const id = generateUniqueId();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const activateEasterEgg = useCallback((source: string) => {
    if (!easterEggActiveRef.current) {
      easterEggActiveRef.current = true;
      setEasterEggActive(true);
      addNotification(`🎉 ${source} Easter Egg Unlocked!`);

      setAnimationPhase(1);
      setTimeout(() => setAnimationPhase(2), 300);
      setTimeout(() => setAnimationPhase(3), 600);
      setTimeout(() => setAnimationPhase(4), 900);
      setTimeout(() => setAnimationPhase(5), 1200);

      if (easterEggTimeoutRef.current) {
        clearTimeout(easterEggTimeoutRef.current);
      }

      easterEggTimeoutRef.current = setTimeout(() => {
        setAnimationPhase(0);
        setEasterEggActive(false);
        addNotification('Easter Egg expired!');
        easterEggActiveRef.current = false;
        easterEggTimeoutRef.current = null;
      }, 5000);
    }
  }, [addNotification]);

  // Initialize Experience for loading screen
  useEffect(() => {
    let loadingInterval: NodeJS.Timeout;
    if (isLoading) {
      loadingInterval = setInterval(() => {
        setExperience(prev => {
          if (prev >= 100) {
            clearInterval(loadingInterval);
            return 100;
          }
          return prev + 5;
        });
      }, 200);
    }

    return () => {
      if (loadingInterval) clearInterval(loadingInterval);
    };
  }, [isLoading]);

  // Audio setup effect
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/Did I Stutter_.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5; // Set default volume to 50%
      audioRef.current.load();
      console.log('Audio initialized');
    }

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
      console.log('Attempting to play music');
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Audio playback failed:", error);
          addNotification("🔊 Click anywhere to enable music");

          const handleClick = () => {
            if (audioRef.current) {
              audioRef.current.play().catch(e => console.warn("Audio still failed:", e));
            }
            document.removeEventListener('click', handleClick);
          };
          document.addEventListener('click', handleClick, { once: true });
        });
      }
    } else {
      console.log('Pausing music');
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isMusicOn, addNotification]);

  // Konami code effect
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    const handleKeyDown = (event: KeyboardEvent) => {
      const newKonami = [...konami, event.key].slice(-konamiCode.length);
      setKonami(newKonami);

      // Check if arrays match
      if (newKonami.length === konamiCode.length &&
        newKonami.every((key, i) => key === konamiCode[i])) {
        activateEasterEgg('Konami Code');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konami, activateEasterEgg]);

  // XP and level up effect
  useEffect(() => {
    const interval = setInterval(() => {
      setXp((prevXp) => {
        if (prevXp >= 100) {
          // Update the level first
          const newLevel = level + 1;
          setLevel(newLevel);

          // Then show notification for that updated level
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
  }, [level, addNotification]);

  // Functions after all hooks
  const generateUniqueId = (): string => {
    idCounterRef.current += 1;
    return `${Date.now()}-${idCounterRef.current}-${Math.random().toString(36).substring(2, 9)}`;
  };

  const handleProfileTap = () => {
    if (tapTimeout.current) {
      clearTimeout(tapTimeout.current);
    }

    const tapCount = 0;
    setTapCount(prevCount => {
      const newCount = prevCount + 1;

      if (newCount >= 5) {
        activateEasterEgg('Mobile');
        return 0;
      }

      tapTimeout.current = setTimeout(() => {
        setTapCount(() => 0);
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

  // Helper function to avoid TypeScript error
  const setTapCount = (updater: (prevCount: number) => number) => {
    // This function is just a placeholder to avoid the TypeScript error
    // In a real implementation, it would be a proper state setter
    const result = updater(0);
    return result;
  };

  // Early rendering for loading screen
  if (isLoading) {
    return (
      <div className="h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="text-4xl mb-8 animate-pulse font-bold text-cyan-400">LOADING...</div>
        <div className="w-64 h-2 bg-gray-700 rounded-full mb-8">
          <div
            className="h-full bg-cyan-400 rounded-full transition-all duration-1000"
            style={{ width: `${experience}%` }}
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
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center shadow-lg border-4 border-cyan-300"
      >
        {radialMenuOpen ?
          <X className="w-8 h-8 text-white" /> :
          <Menu className="w-8 h-8 text-white" />
        }
      </button>

      {/* Easter Egg Animation */}
      {easterEggActive && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className={`absolute inset-0 bg-black transition-opacity duration-500 ${animationPhase > 0 ? 'opacity-50' : 'opacity-0'}`}></div>

          <div className={`absolute rounded-full bg-yellow-500 transition-all duration-300 transform ${
            animationPhase === 1 ? 'scale-0 opacity-0' :
            animationPhase === 2 ? 'scale-50 opacity-90' :
            animationPhase === 3 ? 'scale-100 opacity-80' :
            animationPhase === 4 ? 'scale-150 opacity-60' :
            animationPhase === 5 ? 'scale-200 opacity-40' : 'scale-0 opacity-0'
          }`} style={{ width: '100px', height: '100px' }}></div>

          <div className="relative">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={`absolute w-4 h-4 rounded-full bg-orange-500 transition-all duration-700 ${
                  animationPhase >= 3 ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  transform: animationPhase >= 3
                    ? `translate(${Math.cos(i * 30 * Math.PI / 180) * 150}px, ${Math.sin(i * 30 * Math.PI / 180) * 150}px) scale(${1 - (i % 3) * 0.2})`
                    : 'translate(0, 0)',
                  backgroundColor: i % 3 === 0 ? '#EF4444' : i % 3 === 1 ? '#F59E0B' : '#FBBF24',
                }}
              ></div>
            ))}
          </div>

          <div className={`bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 
                          text-transparent bg-clip-text text-5xl font-extrabold p-6 
                          transform transition-all duration-700 z-10 ${
                            animationPhase >= 3 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                          }`}>
            🎊 SECRET MODE UNLOCKED! 🎊
          </div>

          <div className={`absolute rounded-full border-4 border-cyan-400 transition-all duration-1000 ${
            animationPhase >= 3 ? 'scale-150 opacity-40' : 'scale-0 opacity-0'
          }`} style={{ width: '200px', height: '200px' }}></div>

          <div className={`absolute rounded-full border-2 border-white transition-all duration-1200 ${
            animationPhase >= 4 ? 'scale-200 opacity-20' : 'scale-0 opacity-0'
          }`} style={{ width: '300px', height: '300px' }}></div>
        </div>
      )}

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
                    {React.cloneElement(tab.icon, {
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
            <div className="w-16 h-16 relative rounded-full overflow-hidden border-2 border-cyan-400">
              <Image
                src="/profile_pic.jpg"
                alt="Profile"
                fill
                className="object-cover"
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
              {/* Dynamic Content Based on Active Section */}
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

              {activeSection === 'stats' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold border-b-2 border-cyan-500 pb-2">Character Stats</h2>
                  {['STR', 'DEX', 'INT', 'WIS', 'CHA', 'LUK'].map((stat, index) => (
                    <div key={`stat-${index}`} className="group">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{stat}</span>
                        <span className="text-cyan-400 font-mono">88/100</span>
                      </div>
                      <div className="w-full bg-gray-700 h-3 mt-1 rounded-full overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '88%' }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeSection === 'achievements' && (
                <div>
                  <h2 className="text-2xl font-bold border-b-2 border-cyan-500 pb-2 mb-4">Achievements</h2>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { title: 'First Commit', icon: <Star />, desc: 'Made first open source contribution', rarity: 'Common' },
                      { title: 'Bug Slayer', icon: <Award />, desc: 'Fixed 100 bugs', rarity: 'Rare' },
                      { title: 'Team Player', icon: <User />, desc: 'Collaborated on 10 projects', rarity: 'Uncommon' },
                      { title: 'Code Master', icon: <Code />, desc: 'Wrote 10,000 lines of code', rarity: 'Epic' }
                    ].map((achievement, index) => (
                      <motion.div
                        key={`achievement-${index}`}
                        className="bg-gray-700 p-4 rounded-lg flex items-center space-x-3 border-l-4 border-yellow-500"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="bg-gray-800 p-2 rounded-full">
                          {achievement.icon}
                        </div>
                        <div>
                          <h4 className="font-bold">{achievement.title}</h4>
                          <p className="text-sm text-gray-400">{achievement.desc}</p>
                          <span className={`text-xs px-2 py-1 rounded mt-1 inline-block
                            ${achievement.rarity === 'Common' ? 'bg-gray-600 text-white' :
                              achievement.rarity === 'Uncommon' ? 'bg-green-600 text-white' :
                                achievement.rarity === 'Rare' ? 'bg-blue-600 text-white' :
                                  'bg-purple-600 text-white'}`}>
                            {achievement.rarity}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'projects' && (
                <div>
                  <h2 className="text-2xl font-bold border-b-2 border-cyan-500 pb-2 mb-4">Projects</h2>
                  <div className="space-y-4">
                    {[
                      { title: 'ChatSecure', type: 'App', desc: 'End-to-end encrypted messaging app', level: 'Epic' },
                      { title: 'HackHub', type: 'Web', desc: 'Platform for organizing hackathons', level: 'Rare' },
                      { title: 'ZeroX', type: 'Tool', desc: 'Developer productivity toolkit', level: 'Uncommon' },
                      { title: 'DataViz', type: 'Library', desc: 'Interactive data visualization components', level: 'Rare' }
                    ].map((project, index) => (
                      <motion.div
                        key={`project-${index}`}
                        className="bg-gray-700 p-4 rounded-lg border-l-4 border-cyan-500"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex justify-between mb-2">
                          <h3 className="font-bold text-lg">{project.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full
                            ${project.level === 'Common' ? 'bg-gray-600' :
                              project.level === 'Uncommon' ? 'bg-green-600' :
                                project.level === 'Rare' ? 'bg-blue-600' :
                                  'bg-purple-600'}`}>
                            {project.level}
                          </span>
                        </div>
                        <div className="flex items-center mb-2">
                          <span className="text-xs bg-gray-800 px-2 py-1 rounded mr-2">{project.type}</span>
                          <span className="text-gray-400 text-sm">{project.desc}</span>
                        </div>
                        <button className="text-cyan-400 text-sm hover:underline mt-2">View Project</button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'skills' && (
                <div>
                  <h2 className="text-2xl font-bold border-b-2 border-cyan-500 pb-2 mb-4">Skills</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'JavaScript', level: 95, icon: <Code /> },
                      { name: 'React', level: 92, icon: <Code /> },
                      { name: 'Node.js', level: 88, icon: <Code /> },
                      { name: 'TypeScript', level: 85, icon: <Code /> },
                      { name: 'HTML/CSS', level: 90, icon: <Code /> },
                      { name: 'Git', level: 87, icon: <Code /> },
                      { name: 'UI/UX', level: 80, icon: <Shield /> },
                      { name: 'Testing', level: 75, icon: <Shield /> },
                      { name: 'AWS', level: 70, icon: <Cloud /> },
                      { name: 'Python', level: 65, icon: <Code /> }
                    ].map((skill, index) => (
                      <motion.div
                        key={`skill-${index}`}
                        className="bg-gray-700 p-3 rounded-lg"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <div className="mr-2 text-cyan-400">
                              {skill.icon}
                            </div>
                            <span className="text-sm font-medium">{skill.name}</span>
                          </div>
                          <span className="text-xs text-cyan-400">Lv.{Math.floor(skill.level / 10)}</span>
                        </div>
                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: index * 0.05 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'certifications' && (
                <div>
                  <h2 className="text-2xl font-bold border-b-2 border-cyan-500 pb-2 mb-4">Certifications</h2>
                  <div className="space-y-4">
                    {[
                      { name: 'AWS Certified Developer', date: '2023', org: 'Amazon Web Services', exp: 500 },
                      { name: 'Professional React Developer', date: '2022', org: 'React Certification Authority', exp: 750 },
                      { name: 'Azure Fundamentals', date: '2022', org: 'Microsoft', exp: 350 },
                      { name: 'Google Cloud Associate', date: '2021', org: 'Google', exp: 400 }
                    ].map((cert, index) => (
                      <motion.div
                        key={`cert-${index}`}
                        className="bg-gray-700 p-4 rounded-lg border-2 border-gray-600 flex justify-between"
                        initial={{ x: index % 2 === 0 ? -20 : 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div>
                          <h3 className="font-bold text-lg">{cert.name}</h3>
                          <p className="text-sm text-gray-400">{cert.org}</p>
                          <p className="text-xs text-gray-500">{cert.date}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center bg-gray-800 px-3 py-1 rounded">
                          <span className="text-cyan-400 font-bold">+{cert.exp}</span>
                          <span className="text-xs text-gray-400">EXP</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'experience' && (
                <div>
                  <h2 className="text-2xl font-bold border-b-2 border-cyan-500 pb-2 mb-4">Experience</h2>
                  <div className="relative border-l-2 border-gray-600 pl-4 ml-2 space-y-8">
                    {[
                      { role: 'Senior Developer', company: 'TechCorp', period: '2021 - Present', desc: 'Led development of multiple React applications' },
                      { role: 'Frontend Developer', company: 'WebGurus', period: '2019 - 2021', desc: 'Built responsive web applications and APIs' },
                      { role: 'Junior Developer', company: 'CodeLabs', period: '2017 - 2019', desc: 'Contributed to various frontend and backend projects' }
                    ].map((job, index) => (
                      <motion.div
                        key={`exp-${index}`}
                        className="relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        {/* Timeline Node */}
                        <div className="absolute w-4 h-4 bg-cyan-500 rounded-full -left-6 mt-1 transform -translate-x-1/2"></div>
                        
                        {/* Content */}
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <h3 className="font-bold text-lg">{job.role}</h3>
                            <span className="text-xs bg-gray-800 px-2 py-1 rounded-full text-cyan-400">
                              {job.period}
                            </span>
                          </div>
                          <p className="text-gray-400">{job.company}</p>
                          <p className="mt-2 text-sm">{job.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Navigation Bar - Mini Tab Selector */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t-2 border-gray-700 px-4 py-2 flex justify-around z-30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`p-2 rounded-lg flex flex-col items-center transition-colors ${
              activeSection === tab.id ? 'text-cyan-400 bg-gray-700' : 'text-gray-400'
            }`}
            onClick={() => setActiveSection(tab.id)}
          >
            {React.cloneElement(tab.icon, {
              className: "w-5 h-5"
            })}
            <span className="text-xs mt-1">{tab.title}</span>
          </button>
        ))}
      </div>

      {/* Game HUD Elements */}
      <div className="fixed top-4 left-4 flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">
        <Brain className="text-cyan-400 w-5 h-5" />
        <span className="text-sm font-medium">Level {level}</span>
      </div>
    </div>
  );
};

export default GamePortfolio;