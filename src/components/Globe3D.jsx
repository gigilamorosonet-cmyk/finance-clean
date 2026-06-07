import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Globe, Zap } from 'lucide-react';

export function Globe3D({ onCountrySelect }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadThree = async () => {
      try {
        // Charger Three.js depuis CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = () => {
          initGlobe();
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading Three.js:', error);
      }
    };

    const initGlobe = () => {
      if (!canvasRef.current || !window.THREE) return;

      const THREE = window.THREE;
      const canvas = canvasRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setClearColor(0x050510, 1);
      camera.position.z = 3;

      // Créer la sphère (Globe)
      const geometry = new THREE.SphereGeometry(1, 64, 64);

      // Canvas pour texture
      const canvas2D = document.createElement('canvas');
      canvas2D.width = 2048;
      canvas2D.height = 1024;
      const ctx = canvas2D.getContext('2d');

      // Gradient globe
      const gradient = ctx.createLinearGradient(0, 0, canvas2D.width, canvas2D.height);
      gradient.addColorStop(0, '#0a3d62'); // Bleu foncé
      gradient.addColorStop(0.5, '#1a5490'); // Bleu ciel
      gradient.addColorStop(1, '#0a3d62'); // Bleu foncé
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas2D.width, canvas2D.height);

      // Ajouter des continents (simplifiés)
      ctx.fillStyle = '#2d5016'; // Vert
      drawContinent(ctx, canvas2D, 'USA');
      drawContinent(ctx, canvas2D, 'Europe');
      drawContinent(ctx, canvas2D, 'Asia');
      drawContinent(ctx, canvas2D, 'Africa');

      // Ajouter des zones de conflit
      ctx.fillStyle = '#ff6b6b'; // Rouge
      drawConflictZone(ctx, canvas2D, 'Ukraine', [820, 300]);
      drawConflictZone(ctx, canvas2D, 'MiddleEast', [950, 400]);

      const texture = new THREE.CanvasTexture(canvas2D);
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 5
      });

      const globe = new THREE.Mesh(geometry, material);
      scene.add(globe);

      // Lumière
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(5, 3, 5);
      scene.add(light);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      // Ajouter des points pour les pays majeurs
      const countries = [
        { name: 'France', x: 0.3, y: 0.35, code: 'FR' },
        { name: 'USA', x: 0.15, y: 0.4, code: 'US' },
        { name: 'Japan', x: 0.7, y: 0.35, code: 'JP' },
        { name: 'China', x: 0.65, y: 0.38, code: 'CN' },
        { name: 'Brazil', x: 0.25, y: 0.25, code: 'BR' },
        { name: 'Australia', x: 0.75, y: 0.2, code: 'AU' },
      ];

      countries.forEach(country => {
        // Point sur le globe
        const pointGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const pointMaterial = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
        const point = new THREE.Mesh(pointGeometry, pointMaterial);

        const lat = (country.y - 0.5) * Math.PI;
        const lon = (country.x - 0.5) * Math.PI * 2;

        point.position.x = Math.cos(lat) * Math.cos(lon) * 1.02;
        point.position.y = Math.sin(lat) * 1.02;
        point.position.z = Math.cos(lat) * Math.sin(lon) * 1.02;

        scene.add(point);

        // Rendre le point cliquable
        point.userData.countryCode = country.code;
        point.userData.countryName = country.name;
      });

      // Animation
      let animationId = null;
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        globe.rotation.y += 0.0005;
        renderer.render(scene, camera);
      };
      animate();

      // Gestion du redimensionnement
      const handleResize = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);

      // Raycaster pour détection de clics
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      canvas.addEventListener('click', (event) => {
        mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children);
        for (let i = 0; i < intersects.length; i++) {
          if (intersects[i].object.userData.countryCode) {
            onCountrySelect?.(intersects[i].object.userData.countryCode);
            break;
          }
        }
      });

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
      };
    };

    loadThree();
  }, [onCountrySelect]);

  // Fonction pour dessiner continents
  function drawContinent(ctx, canvas, name) {
    const continents = {
      'USA': { x: 350, y: 350, w: 150, h: 120 },
      'Europe': { x: 750, y: 300, w: 100, h: 100 },
      'Asia': { x: 1200, y: 350, w: 300, h: 200 },
      'Africa': { x: 900, y: 450, w: 150, h: 200 },
    };

    const cont = continents[name];
    if (!cont) return;

    ctx.beginPath();
    ctx.ellipse(cont.x, cont.y, cont.w, cont.h, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Fonction pour dessiner zones conflit
  function drawConflictZone(ctx, canvas, name, pos) {
    ctx.beginPath();
    ctx.arc(pos[0], pos[1], 25, 0, Math.PI * 2);
    ctx.fill();
  }

  return (
    <div className="space-y-6">
      <Card className="card-scifi">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="text-cyan-1" />
            Globe 3D Interactif
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full bg-gradient-to-b from-blue-950/30 to-blue-900/20 rounded-lg overflow-hidden" style={{ height: '500px' }}>
            <canvas
              ref={canvasRef}
              className="w-full h-full"
            />

            {/* Loading indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-2 text-cyan-1">
              <Zap size={16} className="animate-pulse" />
              <span className="text-sm">Chargement du globe 3D...</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 p-3 bg-cyan-1/5 border border-cyan-1/20 rounded-lg text-sm text-muted-foreground">
            <p className="text-xs">
              💡 <strong>Instructions:</strong> Le globe tourne automatiquement. Cliquez sur un point bleu pour voir les données du pays.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Fallback pour navigateurs sans WebGL */}
      <Card className="card-scifi border-gold-1/20 bg-gold-1/5">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            📌 <strong>Note:</strong> Le globe 3D nécessite WebGL. Si vous ne voyez pas le globe, votre navigateur ne supporte pas WebGL.
            Utilisez plutôt la <strong>Carte Mondiale 2D</strong> pour les mêmes fonctionnalités.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
