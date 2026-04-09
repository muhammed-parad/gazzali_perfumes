"use client";

import { ReactLenis, useLenis } from '@studio-freight/react-lenis';
import { ReactNode, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function LenisScrollTriggerBridge() {
  // On every Lenis scroll tick, update ScrollTrigger so it reads the correct position
  useLenis(() => {
    ScrollTrigger.update();
  });

  return null;
}

export default function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        wheelMultiplier: 1,
        smoothWheel: true,
      }}
    >
      <LenisScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}
