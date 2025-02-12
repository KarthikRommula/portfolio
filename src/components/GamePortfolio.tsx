"use client";
import React, { useState, useEffect } from 'react';
import { Music, Volume2, VolumeX, User, Briefcase, Code, Mail, Menu } from 'lucide-react';

const GamePortfolio = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [konami, setKonami] = useState<string[]>([]);

  // Sections data
  const sections = [
    { id: 'about', icon: <User />, title: 'About Me', level: 1 },
    { id: 'projects', icon: <Briefcase />, title: 'Projects', level: 2 },
    { id: 'skills', icon: <Code />, title: 'Skills', level: 3 },
    { id: 'contact', icon: <Mail />, title: 'Contact', level: 4 }
  ];

  // Konami code easter egg
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      setKonami(prev => {
        const newKonami = [...prev, e.key];
        if (newKonami.length > konamiCode.length) {
          newKonami.shift();
        }
        if (JSON.stringify(newKonami) === JSON.stringify(konamiCode)) {
          setShowEasterEgg(true);
        }
        return newKonami;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Loading screen
  if (isLoading) {
    return (
      <div className="h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="text-4xl mb-8 animate-pulse font-bold text-cyan-400">LOADING...</div>
        <button
          onClick={() => setIsLoading(false)}
          className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-xl font-bold 
                   transform hover:scale-105 transition-all animate-bounce"
        >
          PRESS START
        </button>
        <div className="mt-4 text-sm text-gray-400">Use ↑↑↓↓←→←→BA for a surprise</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-800 bg-opacity-90 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 font-bold text-xl text-cyan-400">
              PLAYER ONE
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all
                    ${activeSection === section.id 
                      ? 'bg-cyan-500 text-white' 
                      : 'hover:bg-gray-700 text-gray-300'}`}
                >
                  {section.icon}
                  <span>LVL {section.level} - {section.title}</span>
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="p-2 rounded-lg hover:bg-gray-700">
                <Menu size={24} />
              </button>
            </div>

            {/* Sound toggle */}
            <button
              onClick={() => setIsMusicOn(!isMusicOn)}
              className="p-2 rounded-lg hover:bg-gray-700"
            >
              {isMusicOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero section with parallax effect */}
          <div className="relative h-96 overflow-hidden rounded-2xl mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-cyan-900 opacity-75" />
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-pulse">
                  Welcome Player
                </h1>
                <p className="text-xl md:text-2xl text-gray-300">
                  Level Up Your Web Experience
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="mb-16 p-6 bg-gray-800 rounded-2xl transform hover:scale-[1.02] transition-all"
            >
              <h2 className="text-3xl font-bold mb-4 flex items-center space-x-3">
                {section.icon}
                <span>{section.title}</span>
                <span className="text-sm text-cyan-400">LVL {section.level}</span>
              </h2>
              <div className="h-64 flex items-center justify-center text-gray-400">
                [Content for {section.title} goes here]
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Easter egg modal */}
      {showEasterEgg && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-2xl max-w-md">
            <h3 className="text-2xl font-bold mb-4">🎮 Secret Level Unlocked!</h3>
            <p className="mb-4">You've discovered the hidden easter egg! Here's a special achievement.</p>
            <button
              onClick={() => setShowEasterEgg(false)}
              className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Particle effects */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-500 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GamePortfolio;