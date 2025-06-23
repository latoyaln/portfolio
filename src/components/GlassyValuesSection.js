import React, { useState, useEffect, useRef } from 'react';

const GlassyValuesSection = ({ pageData, currentLocale }) => {
  const [currentValueIndex, setCurrentValueIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const title = currentLocale === 'nl' ? 'Waar ik extra op let tijdens onze samenwerking' : 'What I pay extra attention to in our collaboration';


  const valuesComponent = pageData?.page?.fields?.components?.find(
    comp => comp.fields?.internalName === 'Values'
  );
  
  const values = valuesComponent?.fields?.components?.filter(
    comp => comp.sys?.contentType?.sys?.id === 'card'
  ) || [];

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-play functionality (desktop only)
  useEffect(() => {
    if (isMobile || !isAutoPlaying || values.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentValueIndex(prev => 
        prev >= values.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, values.length, isMobile]);

  // Add CSS for hiding scrollbars
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      
      /* Mobile scroll hint */
      .mobile-scroll-hint {
        animation: bounce 2s infinite;
      }
      
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(-5px);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Early returns after all hooks
  if (!valuesComponent) return null;
  if (values.length === 0) return null;

  const goToSlide = (index) => {
    setCurrentValueIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goToPrevious = () => {
    setCurrentValueIndex(prev => 
      prev === 0 ? values.length - 1 : prev - 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goToNext = () => {
    setCurrentValueIndex(prev => 
      prev >= values.length - 1 ? 0 : prev + 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  // Get visible cards (3 at a time for desktop, 1 for mobile)
  const getVisibleCards = () => {
    if (isMobile) {
      // For mobile, show only the current card
      return [{
        ...values[currentValueIndex],
        displayIndex: 0,
        actualIndex: currentValueIndex
      }];
    } else {
      // For desktop, show 3 cards
      const visibleCards = [];
      for (let i = 0; i < 3; i++) {
        const index = (currentValueIndex + i) % values.length;
        visibleCards.push({
          ...values[index],
          displayIndex: i,
          actualIndex: index
        });
      }
      return visibleCards;
    }
  };

  const visibleCards = getVisibleCards();

  return (
    <section className="bg-midnight py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
          <h2 className="text-h2 font-headings text-daylight mb-2">
          {title}     </h2>
          </div>

          {/* Cards Grid */}
          <div className="relative">
            {/* Cards Container - Desktop: Grid, Mobile: Single Card */}
            <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:mb-12">
              {/* Mobile: Single card with overflow hidden */}
              <div className="lg:hidden flex justify-center overflow-hidden px-2">
                <div className="w-full max-w-xs">
                  {values.map((value, index) => (
                    <div
                      key={value.sys?.id}
                      className={`transition-all duration-500 ${
                        index === currentValueIndex 
                          ? 'block scale-105 -translate-y-2' 
                          : 'hidden'
                      }`}
                    >
                      {/* Glass Card */}
                      <div className="relative h-80 rounded-2xl overflow-hidden group">
                        {/* Glass background with backdrop blur */}
                        <div className={`absolute inset-0 backdrop-blur-xl border border-daylight/20 rounded-2xl transition-all duration-300 ${
                          index === currentValueIndex
                            ? 'bg-daylight/20 border-daylight/30'
                            : 'bg-daylight/15'
                        }`}></div>
                        
                        {/* Gradient overlay */}
                        <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                          index === currentValueIndex
                            ? 'bg-gradient-to-br from-daylight/15 to-transparent'
                            : 'bg-gradient-to-br from-daylight/10 to-transparent'
                        }`}></div>
                        
                        <div className="relative z-10 h-full flex flex-col justify-center items-center p-6 text-center">
                          <h3 className={`font-headings text-daylight font-bold mb-4 transition-all duration-300 ${
                            index === currentValueIndex ? 'text-sm' : 'text-sm'
                          }`}>
                            {value.fields?.title}
                          </h3>
                          
                          {/* Description */}
                          <p className={`text-daylight/90 leading-relaxed text-sm transition-all duration-300 ${
                            index === currentValueIndex ? 'opacity-100' : 'opacity-80'
                          }`}>
                            {value.fields?.paragraph || value.fields?.textParagraph}
                          </p>
                        </div>

                        {/* Active indicator for mobile */}
                        {index === currentValueIndex && (
                          <div className="absolute top-4 right-4">
                            <div className="w-3 h-3 rounded-full bg-daylight shadow-lg shadow-daylight/50 animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden lg:contents">
                {visibleCards.map((value, displayIndex) => {
                  const isCenter = displayIndex === 1;
                  const isLeft = displayIndex === 0;
                  const isRight = displayIndex === 2;
                  
                  return (
                    <div
                      key={`${value.sys?.id}-${currentValueIndex}`}
                      className={`relative transition-all duration-700 ease-out ${
                        isCenter 
                          ? 'lg:scale-105 lg:-translate-y-4 z-20' 
                          : 'lg:scale-95 lg:translate-y-2 z-10'
                      }`}
                    >
                      {/* Glass Card */}
                      <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden group cursor-pointer"
                           onClick={() => goToSlide(value.actualIndex)}>
                        {/* Glass background with backdrop blur */}
                        <div className={`absolute inset-0 backdrop-blur-xl border border-daylight/20 rounded-2xl transition-all duration-300 ${
                          isCenter 
                            ? 'bg-daylight/20 border-daylight/30' 
                            : 'bg-daylight/10 group-hover:bg-daylight/15'
                        }`}></div>
                        
                        {/* Gradient overlay */}
                        <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                          isCenter 
                            ? 'bg-gradient-to-br from-daylight/10 to-transparent' 
                            : 'bg-gradient-to-br from-daylight/5 to-transparent group-hover:from-daylight/10'
                        }`}></div>
                        
                        <div className="relative z-10 h-full flex flex-col justify-center items-center p-6 lg:p-8 text-center">
                
                          <h3 className={`font-headings text-daylight font-bold mb-4 transition-all duration-300 ${
                            isCenter 
                              ? 'text-xl lg:text-xl' 
                              : 'text-xl lg:text-xl'
                          }`}>
                            {value.fields?.title}
                          </h3>
                          
                          {/* Description */}
                          <p className={`text-daylight/90 leading-relaxed transition-all duration-300 ${
                            isCenter 
                              ? 'text-base lg:text-lg opacity-100' 
                              : 'text-sm lg:text-base opacity-80 group-hover:opacity-100'
                          }`}>
                            {value.fields?.paragraph || value.fields?.textParagraph}
                          </p>
                        </div>

                        {/* Shine effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-daylight/10 to-transparent transform -skew-x-12 translate-x-full animate-pulse"></div>
                        </div>

                        {/* Active indicator for center card */}
                        {isCenter && (
                          <div className="absolute top-4 right-4">
                            <div className="w-3 h-3 rounded-full bg-daylight shadow-lg shadow-daylight/50 animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Mobile Progress Indicator */}
            {isMobile && values.length > 1 && (
              <div className="lg:hidden flex justify-center gap-2 mt-8">
                {values.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none ${
                      index === currentValueIndex 
                        ? 'bg-daylight scale-125 shadow-lg shadow-daylight/50' 
                        : 'bg-daylight/30'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  ></button>
                ))}
              </div>
            )}

            {!isMobile && values.length > 3 && (
              <div className="hidden lg:flex justify-center gap-2">
                {Array.from({ length: Math.max(1, values.length - 2) }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className="group relative overflow-hidden rounded-full transition-all duration-300 hover:scale-125"
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentValueIndex 
                        ? 'bg-daylight scale-125 shadow-lg shadow-daylight/50' 
                        : 'bg-daylight/30 hover:bg-daylight/60'
                    }`}></div>
                  </button>
                ))}
              </div>
            )}
          
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlassyValuesSection;