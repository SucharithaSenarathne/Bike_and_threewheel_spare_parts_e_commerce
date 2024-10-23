import React, { useEffect, useRef } from 'react';

const NUM_PARTICLES = 600;
const PARTICLE_SIZE = 0.5; // View heights
const SPEED = 20000; // Milliseconds

const randomNormal = (o) => {
  o = Object.assign({ mean: 0, dev: 1, pool: [] }, o);
  if (Array.isArray(o.pool) && o.pool.length > 0) return normalPool(o);

  let r, a, n, e, l = o.mean, t = o.dev;
  do {
    r = (a = 2 * Math.random() - 1) * a + (n = 2 * Math.random() - 1) * n;
  } while (r >= 1);
  e = a * Math.sqrt(-2 * Math.log(r) / r);
  return t * e + l;
};

const normalPool = (o) => {
  let r = 0;
  do {
    let a = Math.round(randomNormal({ mean: o.mean, dev: o.dev }));
    if (a < o.pool.length && a >= 0) return o.pool[a];
    r++;
  } while (r < 100);
};

const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);

  const rand = (low, high) => Math.random() * (high - low) + low;

  const createParticle = (canvas) => {
    const colour = {
      r: 255,
      g: randomNormal({ mean: 125, dev: 20 }),
      b: 50,
      a: rand(0, 1),
    };
    return {
      x: -2,
      y: -2,
      diameter: Math.max(0, randomNormal({ mean: PARTICLE_SIZE, dev: PARTICLE_SIZE / 2 })),
      duration: randomNormal({ mean: SPEED, dev: SPEED * 0.1 }),
      amplitude: randomNormal({ mean: 16, dev: 2 }),
      offsetY: randomNormal({ mean: 0, dev: 10 }),
      arc: Math.PI * 2,
      startTime: performance.now() - rand(0, SPEED),
      colour: `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`,
    };
  };

  const moveParticle = (particle, canvas, time) => {
    const progress = ((time - particle.startTime) % particle.duration) / particle.duration;
    return {
      ...particle,
      x: progress,
      y: ((Math.sin(progress * particle.arc) * particle.amplitude) + particle.offsetY),
    };
  };

  const drawParticle = (particle, canvas, ctx) => {
    const vh = canvas.height / 100;
    ctx.fillStyle = particle.colour;
    ctx.beginPath();
    ctx.ellipse(
      particle.x * canvas.width,
      particle.y * vh + (canvas.height / 2),
      particle.diameter * vh,
      particle.diameter * vh,
      0,
      0,
      2 * Math.PI
    );
    ctx.fill();
  };

  const draw = (time, canvas, ctx) => {
    particles.current.forEach((particle, index) => {
      particles.current[index] = moveParticle(particle, canvas, time);
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.current.forEach((particle) => {
      drawParticle(particle, canvas, ctx);
    });

    requestAnimationFrame((time) => draw(time, canvas, ctx));
  };

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    const ctx = canvas.getContext('2d');

    window.addEventListener('resize', () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    });

    return [canvas, ctx];
  };

  const startAnimation = () => {
    const [canvas, ctx] = initializeCanvas();

    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.current.push(createParticle(canvas));
    }

    requestAnimationFrame((time) => draw(time, canvas, ctx));
  };

  useEffect(() => {
    startAnimation();
  }, []);

  return <canvas ref={canvasRef} id="particle-canvas" style={{ width: '100%', height: '300px' }} />;
};

export default ParticleCanvas;
