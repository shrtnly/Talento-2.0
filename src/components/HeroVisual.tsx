import { useRef } from 'react';

/**
 * HeroVisual
 * ----------
 * Recreates the composition from /public/Hero/Placement.png using the individual
 * transparent layers so each one can be animated independently.
 *
 * All positions are percentages of a 1417 x 1220 artboard (Placement.png cropped
 * to its content), so the composition scales perfectly on every screen size.
 *
 * Layer order (back -> front):
 *   glow  ->  orbit 1 (outer)  ->  orbit 2 (middle)  ->  orbit 3 (inner)
 *         ->  man  ->  job app UI  ->  "TOP Rated" badge
 */

type Depth = { el: HTMLDivElement | null; depth: number };

const HeroVisual = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const layers = useRef<Depth[]>([]);
  const frame = useRef<number>(0);

  const register = (depth: number) => (el: HTMLDivElement | null) => {
    if (el && !layers.current.some((l) => l.el === el)) {
      layers.current.push({ el, depth });
    }
  };

  // Lightweight mouse parallax (desktop pointers only). Uses the CSS `translate`
  // property so it composes with the keyframe `transform` animations.
  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      layers.current.forEach(({ el, depth }) => {
        if (el) el.style.translate = `${x * depth}px ${y * depth}px`;
      });
    });
  };

  const handleLeave = () => {
    cancelAnimationFrame(frame.current);
    layers.current.forEach(({ el }) => {
      if (el) el.style.translate = '0px 0px';
    });
  };

  // Orbit rings are slate-blue line art; lift them in dark mode so they stay visible.
  const orbitTone =
    'opacity-70 dark:opacity-60 dark:brightness-[2.6] dark:saturate-[0.55]';

  return (
    <div
      ref={stageRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="hero-stage relative w-full max-w-[400px] sm:max-w-[520px] md:max-w-[600px] lg:max-w-none mx-auto aspect-[1417/1220] select-none"
      aria-label="Talento – vetted professional with job matching app"
      role="img"
    >
      {/* Soft brand glow behind the man – slow ambient breathing */}
      <div className="absolute left-[30%] top-[18%] w-[56%] aspect-square rounded-full bg-gradient-to-tr from-talento-300/40 via-talento-200/25 to-transparent dark:from-talento-600/25 dark:via-talento-800/15 blur-3xl animate-light-slow pointer-events-none" />

      {/* ---------- Orbit 1 (outer) ---------- */}
      <div
        ref={register(8)}
        className="parallax-layer absolute left-[28.23%] top-[2.3%] w-[69.51%] hero-enter-orbit"
        style={{ animationDelay: '0.05s' }}
      >
        <img
          src="/Hero/1.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          className={`w-full h-auto orbit-spin ${orbitTone}`}
          style={{ transformOrigin: '47.7% 50.2%', animationDuration: '70s' }}
        />
      </div>

      {/* ---------- Orbit 2 (middle) – counter rotation ---------- */}
      <div
        ref={register(12)}
        className="parallax-layer absolute left-[33.1%] top-[13.36%] w-[53.35%] hero-enter-orbit"
        style={{ animationDelay: '0.2s' }}
      >
        <img
          src="/Hero/2.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          className={`w-full h-auto orbit-spin-reverse ${orbitTone}`}
          style={{ transformOrigin: '52.5% 46.4%', animationDuration: '55s' }}
        />
      </div>

      {/* ---------- Orbit 3 (inner) ---------- */}
      <div
        ref={register(16)}
        className="parallax-layer absolute left-[41.64%] top-[18.2%] w-[40.16%] hero-enter-orbit"
        style={{ animationDelay: '0.35s' }}
      >
        <img
          src="/Hero/3.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          className={`w-full h-auto orbit-spin ${orbitTone}`}
          style={{ transformOrigin: '49.6% 53.1%', animationDuration: '40s' }}
        />
      </div>

      {/* ---------- Job app UI (floating - behind the man, no drop shadow) ---------- */}
      <div
        ref={register(22)}
        className="parallax-layer absolute left-[1.98%] top-[22.21%] w-[41.71%] z-10 hero-enter-left"
        style={{ animationDelay: '0.45s' }}
      >
        <img
          src="/Hero/UI.png"
          alt="Talento job search app showing featured jobs"
          draggable={false}
          className="w-full h-auto ui-float"
        />
      </div>

      {/* ---------- Man (brought to front of UI) ---------- */}
      <div
        ref={register(6)}
        className="parallax-layer absolute left-[26.11%] top-[14.1%] w-[45.87%] z-20 hero-enter-up"
        style={{ animationDelay: '0.15s' }}
      >
        <img
          src="/Hero/talento.hero.png"
          alt="Smiling vetted professional in a business suit"
          draggable={false}
          className="w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_0_40px_rgba(194,162,107,0.12)]"
        />
      </div>

      {/* ---------- Bottom baseline border (brought to front, sits on top of man base) ---------- */}
      <div
        className="absolute left-[3%] right-[2%] top-[96.75%] h-[3px] sm:h-[3.5px] md:h-[4px] z-30 bg-[#252430] dark:bg-gray-400 rounded-full hero-enter-fade"
        style={{ animationDelay: '0.6s' }}
      />

      {/* ---------- TOP Rated badge ---------- */}
      <div
        ref={register(28)}
        className="parallax-layer absolute left-[79.39%] top-[86.5%] w-[20.47%] z-40 hero-enter-pop"
        style={{ animationDelay: '0.75s' }}
      >
        <img
          src="/Hero/Badge.png"
          alt="Top rated – trusted by leading companies"
          draggable={false}
          className="w-full h-auto badge-float drop-shadow-[0_12px_20px_rgba(0,0,0,0.25)]"
        />
      </div>
    </div>
  );
};

export default HeroVisual;
