import React, { useEffect, useState } from 'react';
import { MILESTONES } from '../data/content';

interface NavigationTrackProps {
  activeSection: string;
  onSectionClick: (id: string) => void;
}

export const NavigationTrack: React.FC<NavigationTrackProps> = ({
  activeSection,
  onSectionClick,
}) => {
  return (
    <aside
      className="hidden xl:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 flex-col items-center select-none"
      aria-label="Navigation par jalons"
    >
      <div className="relative flex flex-col items-center gap-12 py-4">
        {/* Continuous vertical guide line */}
        <div className="absolute top-2 bottom-2 left-[50%] w-[1px] -translate-x-1/2 bg-white/15 pointer-events-none" />

        {MILESTONES.map((item) => {
          const isActive = activeSection === item.targetId;
          return (
            <button
              key={item.targetId}
              onClick={() => onSectionClick(item.targetId)}
              className="group relative flex flex-col items-center text-center cursor-pointer transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f06a1d] rounded-sm p-1"
              aria-label={`Aller à la section ${item.label}`}
              aria-current={isActive ? 'true' : undefined}
            >
              {/* Milestone Number */}
              <span
                className={`font-heading text-[13px] font-extrabold tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'text-[#f06a1d] scale-110 drop-shadow-[0_0_8px_rgba(240,106,29,0.5)]'
                    : 'text-white/40 group-hover:text-white/80'
                }`}
              >
                {item.num}
              </span>

              {/* Indicator Dot */}
              <div className="relative my-2 flex items-center justify-center">
                <span
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-[#f06a1d] shadow-[0_0_12px_#f06a1d] ring-4 ring-[#f06a1d]/20 scale-125'
                      : 'bg-white/25 group-hover:bg-white/60 group-hover:scale-110'
                  }`}
                />
              </div>

              {/* Label */}
              <span
                className={`text-[9px] font-bold tracking-[0.14em] uppercase transition-all duration-300 ${
                  isActive
                    ? 'text-white opacity-100 font-semibold'
                    : 'text-white/35 opacity-70 group-hover:text-white/80 group-hover:opacity-100'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
