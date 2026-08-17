import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* The umbrella is heavy — Three.js, generated canvas textures, an environment
   map and a WebGL render loop. It sits below the fold, so it is built LAZILY:
   `three` is a dynamic import, which Next splits into its own chunk that is
   only fetched once the visitor is approaching the section. That keeps the
   whole 3D scene off the critical path.

   initUmbrella(host) returns a dispose() — the React wrapper calls it on
   unmount so a route change can't leak a WebGL context or a render loop. */
export function initUmbrella(host) {
  if (!host) return () => {};

  /* Quality tier. Phones and low-core/low-memory machines pay a real cost for
     soft shadows, MSAA and a 2x pixel ratio on a scene this size, so they get a
     cheaper render. `lite` still looks like the same umbrella — it just stops
     trying to be a studio render on hardware that can't afford one.
     Computed here rather than at module scope so this file stays SSR-safe. */
  const LITE = window.matchMedia('(pointer: coarse)').matches
    || (navigator.hardwareConcurrency || 8) <= 4
    || (navigator.deviceMemory || 8) <= 4;

  /* Every knob that costs real time on a phone, in one place. The lite column
     is tuned against the two things that actually hurt: how long the build
     blocks the main thread, and how much fragment work each frame costs while
     the visitor is scrolling past.

     `physical` is the big one. MeshPhysicalMaterial with sheen is among the
     most expensive shaders three ships — sheen alone adds a second specular
     lobe per light, and the bump map costs derivative instructions on every
     fragment. Eight of them, on a canvas that is wider than the screen, is
     what made scrolling past this section feel like the page had stalled.
     MeshStandardMaterial keeps the fabric reading as fabric at phone size. */
  /* The lite column is tuned harder than the last pass. Two levers dominate and
     they are independent:

     `pixelRatio` 1.25 -> 1. Fragment work scales with its SQUARE, so this alone
     removes ~36% of the per-frame shading on a canvas that is wider than the
     phone. Nothing about the canopy is resolvable at 1.25x on a screen this
     size that isn't at 1x — the antialiasing that would have shown the
     difference is already off on this tier.

     The segment counts roughly halve the geometry (the canopy drops from ~3.1k
     triangles to ~1.5k, and the forty-odd tubes shrink with it). That is a
     one-off build cost AND a per-frame vertex cost, so it pays twice.

     texSize stays at 256: the gores carry printed service names, and 128 is
     where that lettering stops being legible rather than merely soft. */
  const Q = LITE
    ? { physical: false, bump: false, texSize: 256, radialSeg: 12, angularSeg: 8,
        tubeRadial: 4, hemSeg: 14, seamSeg: 8, ribSeg: 10, strutSeg: 5,
        pixelRatio: 1, envSamples: 0.06, frameMs: 1000 / 30 }
    /* pixelRatio 1.5 rather than 2: fragment work scales with its square, so
       on a Retina laptop capping at 2 meant four times the shading of a 1x
       screen for a canvas this size — the heaviest single thing the page does
       on a machine with integrated graphics, and it ran at 60fps while
       ScrollSmoother was transforming the page in the same frame. At 1.5 the
       canopy edges are still cleanly antialiased. */
    : { physical: true, bump: true, texSize: 512, radialSeg: 32, angularSeg: 22,
        tubeRadial: 8, hemSeg: 38, seamSeg: 24, ribSeg: 30, strutSeg: 16,
        pixelRatio: 1.5, envSamples: 0.04, frameMs: 0 };

  let disposed = false;
  const teardown = [];

  /* Hand the main thread back between build steps. Everything below — eight
     512px canvas textures, eight lathed gores with computed normals, forty-odd
     tube meshes — used to run as one uninterrupted block, so the first thing a
     phone did on reaching this section was freeze for a second or more. The
     work is the same; it just no longer lands in a single frame.
     `scheduler.yield` where it exists, a macrotask everywhere else. */
  const yieldToMain = typeof scheduler !== 'undefined' && scheduler.yield
    ? () => scheduler.yield()
    : () => new Promise((resolve) => setTimeout(resolve, 0));

  let umbrellaStarted = false;
  const startUmbrella = async () => {
    if (umbrellaStarted || disposed) return;
    umbrellaStarted = true;
    /* Not `import('three')`: the namespace object that returns is opaque to the
       bundler, so the whole library ends up in the chunk. lib/three-subset.js
       re-exports just what this scene uses, statically, which lets the rest be
       shaken out — same lazy boundary, smaller download. */
    const THREE = await import('@/lib/three-subset');
    if (disposed) return; // navigated away while the chunk was in flight

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  // Slightly above hem level, below the apex: high cameras foreshorten the
  // dome into a squashed pancake, dead-level ones lose the rim ellipse that
  // makes the canopy read three-dimensional.
  camera.position.set(0, 0.98, 7.8);
  camera.lookAt(0, -0.18, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: !LITE, alpha: true, powerPreference: 'high-performance' });
  // Pixel ratio is the single biggest lever here — it scales fragment work
  // quadratically, and phones ship 3x screens where the extra pixels aren't
  // visible on a canvas this size.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, Q.pixelRatio));
  renderer.setClearColor(0xffffff, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = !LITE;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);

  /* Registered the moment the context exists, not at the end of the build. The
     build below yields to the main thread between gores, and a route change in
     any one of those gaps returns early — with this teardown registered only at
     the end, that exit would strand a live WebGL context and its canvas, and
     browsers cap how many contexts may exist at once. */
  teardown.push(() => {
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      const mats = Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : [];
      mats.forEach((m) => {
        Object.values(m).forEach((v) => { if (v && v.isTexture) v.dispose(); });
        m.dispose();
      });
    });
    if (scene.environment) scene.environment.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    delete window.__umbrellaDebug;
  });

  /* Studio-style environment map — without one, fabric and chrome read as
     flat plastic no matter how the direct lights are tuned. */
  const envScene = new THREE.Scene();
  envScene.add(new THREE.Mesh(
    new THREE.SphereGeometry(18, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xdde8f2, side: THREE.BackSide }),
  ));
  function addSoftbox(width, height, intensity, x, y, z, tint = null) {
    const material = new THREE.MeshBasicMaterial();
    if (tint) material.color.copy(tint).multiplyScalar(intensity);
    else material.color.setScalar(intensity);
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
    panel.position.set(x, y, z);
    panel.lookAt(0, 0, 0);
    envScene.add(panel);
  }
  addSoftbox(9, 9, 5, 0, 11, 3);
  addSoftbox(7, 4, 2.6, -9, 4, 5);
  addSoftbox(6, 3, 1.5, 9, 3, -3, new THREE.Color(1, 0.93, 0.85));
  addSoftbox(8, 3, 1.1, 0, 2, -10, new THREE.Color(0.8, 0.9, 1));
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(envScene, Q.envSamples).texture;
  pmrem.dispose();
  // The softbox panels and their materials exist only to be baked into the
  // env map above; holding them past that is pure GPU memory.
  envScene.traverse((obj) => {
    if (!obj.isMesh) return;
    obj.geometry.dispose();
    obj.material.dispose();
  });

  scene.add(new THREE.HemisphereLight(0xffffff, 0x3a5a78, 0.9));

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(4.8, 6.5, 6);
  // No shadow map on lite — nothing renders it, so don't allocate one either.
  keyLight.castShadow = !LITE;
  /* 512 rather than 1024. The shadow map is re-rendered every frame because the
     canopy never stops turning, so its size is a per-frame fill cost, not a
     one-off. Only the canopy casts into it now (see below) and PCF soft
     filtering blurs the result anyway, so the extra resolution was not
     surviving to the screen. */
  keyLight.shadow.mapSize.set(512, 512);
  keyLight.shadow.camera.left = -4;
  keyLight.shadow.camera.right = 4;
  keyLight.shadow.camera.top = 4;
  keyLight.shadow.camera.bottom = -4;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x9fc9ee, 0.7);
  fillLight.position.set(-5, 1.5, 3);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0x4d86b8, 1.3);
  rimLight.position.set(0, 2.5, -5);
  scene.add(rimLight);

  // Sit the whole umbrella low in the frame so its canopy clears the heading
  // above it (the heading grows with viewport width and would otherwise
  // overlap the canopy on wide screens).
  const floatBaseY = -0.2;
  const floatingRig = new THREE.Group();
  floatingRig.position.y = floatBaseY;
  scene.add(floatingRig);

  const umbrella = new THREE.Group();
  umbrella.rotation.set(-0.07, 0, 0.01);
  const compactCanopy = window.matchMedia('(max-width: 767px)').matches;
  const overallScale = compactCanopy ? 1.0 : 1.18;
  umbrella.scale.setScalar(overallScale);
  floatingRig.add(umbrella);

  const canopyRadius = 2.3;
  const domeHeight = 1.0;
  const facetCount = 8;
  const assemblyPieceCount = 4;
  const panelAngle = (Math.PI * 2) / facetCount;
  // Classic two-tone canopy: solid blue gores alternating with white gores.
  const panelBlue = '#0e5293';
  const panelWhite = '#eef3f8';
  const labelInk = '#0c3f76';   // navy print on the white gores
  // The four service lines printed onto the canopy. Each maps to two opposite
  // gores (index % 4) so a readable panel always faces the viewer as it spins.
  const serviceLabels = [
    'BUSINESS\nCONSULTING',
    'ACCOUNTING &\nBOOKKEEPING',
    'VAT\nFILING',
    'TAXATION',
  ];

  /* Rib profile: parabola blended with a touch of cone so the crown keeps a
     slight peak at the ferrule instead of a flat squashed top, easing into a
     ~37 degree drooping rim like a taut opened canopy. */
  function ribProfile(radialProgress) {
    const parabola = 1 - radialProgress * radialProgress;
    const cone = 1 - radialProgress;
    return domeHeight * (0.85 * parabola + 0.15 * cone)
      - 0.055 * Math.pow(radialProgress, 6);
  }

  /* Fabric surface: ridge along every rib, a soft valley between ribs, and a
     scalloped hem that rises between the rib tips like sewn gores do. */
  function canopyHeight(radialProgress, localProgress) {
    const between = Math.sin(Math.PI * localProgress);
    const valleyWindow = Math.pow(Math.sin(Math.PI * Math.min(radialProgress * 1.08, 1)), 1.2);
    return ribProfile(radialProgress)
      - 0.05 * between * valleyWindow
      + 0.075 * between * Math.pow(radialProgress, 4);
  }

  function canopyRadiusAt(radialProgress, localProgress) {
    const pinch = 1 - 0.05 * Math.sin(Math.PI * localProgress) * Math.pow(radialProgress, 3);
    return canopyRadius * radialProgress * pinch;
  }

  function createWeaveTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    context.fillStyle = '#808080';
    context.fillRect(0, 0, 128, 128);
    for (let line = 0; line < 128; line += 2) {
      context.strokeStyle = line % 4 === 0 ? 'rgba(240,240,240,.1)' : 'rgba(25,25,25,.08)';
      context.beginPath();
      context.moveTo(0, line + 0.5);
      context.lineTo(128, line + 0.5);
      context.stroke();
      context.beginPath();
      context.moveTo(line + 0.5, 0);
      context.lineTo(line + 0.5, 128);
      context.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(18, 22);
    return texture;
  }

  /* Panel texture: gored nylon with baked seam allowances and stitching.
     Remember the vertical flip — canvas top row lands at the hem (v = 1). */
  function createPanelTexture(baseColor, label, isLight = false, ink = 'rgba(255,255,255,0.95)') {
    const size = Q.texSize;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');

    // Shading shifts with the gore colour: deep navy folds, threads and
    // stitching on the blue panels; soft cool-grey equivalents on the white
    // ones (a white gore should never darken to navy).
    const apexShade = isLight ? 'rgba(120,140,170,1)' : 'rgba(4,26,52,1)';
    const shadeAlpha = isLight ? 0.4 : 0.55;
    const threadHi = isLight ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.022)';
    const threadLo = isLight ? 'rgba(40,60,95,.035)' : 'rgba(3,20,42,.02)';
    const seamShadow = isLight ? 'rgba(55,80,115,.3)' : 'rgba(2,18,38,.42)';
    const seamFade = isLight ? 'rgba(55,80,115,0)' : 'rgba(2,18,38,0)';
    const hemShadow = isLight ? 'rgba(55,80,115,.34)' : 'rgba(2,18,38,.5)';
    const hemFade = isLight ? 'rgba(55,80,115,0)' : 'rgba(2,18,38,0)';
    const stitch = isLight ? 'rgba(30,55,95,.4)' : 'rgba(255,255,255,.3)';

    const gradient = context.createLinearGradient(0, 0, 0, size);
    gradient.addColorStop(0, baseColor);
    gradient.addColorStop(0.72, baseColor);
    gradient.addColorStop(1, apexShade);
    context.fillStyle = baseColor;
    context.fillRect(0, 0, size, size);
    context.globalAlpha = shadeAlpha;
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
    context.globalAlpha = 1;

    /* Every measurement below was picked against a 512px gore. The lite tier
       halves that, so they scale with it — otherwise a 256px texture gets seam
       allowances and stitching at double their intended width, which reads as
       a much coarser fabric rather than the same one at lower resolution. */
    const k = size / 512;

    // Faint thread directionality so close-ups read as coated fabric.
    context.lineWidth = 1;
    const threadStep = Math.max(3, Math.round(7 * k));
    for (let line = 0; line <= size; line += threadStep) {
      context.strokeStyle = (line / threadStep) % 3 === 0 ? threadHi : threadLo;
      context.beginPath();
      context.moveTo(0, line + 0.5);
      context.lineTo(size, line + 0.5);
      context.stroke();
    }

    const seamWidth = 40 * k;
    const stitchInset = 26 * k;
    const stitchWidth = 2.4 * k;
    const dash = [11 * k, 9 * k];

    // Seam allowances folded under each gore edge, plus visible stitching.
    [0, size].forEach(edge => {
      const inward = edge === 0 ? 1 : -1;
      const shade = context.createLinearGradient(edge, 0, edge + inward * seamWidth, 0);
      shade.addColorStop(0, seamShadow);
      shade.addColorStop(1, seamFade);
      context.fillStyle = shade;
      context.fillRect(edge === 0 ? 0 : size - seamWidth, 0, seamWidth, size);

      context.strokeStyle = stitch;
      context.lineWidth = stitchWidth;
      context.setLineDash(dash);
      context.beginPath();
      context.moveTo(edge + inward * stitchInset, 0);
      context.lineTo(edge + inward * stitchInset, size);
      context.stroke();
      context.setLineDash([]);
    });

    // Hem: doubled-over band with a stitch row (hem sits at the canvas top).
    const hemBand = 30 * k;
    const hemShade = context.createLinearGradient(0, 0, 0, hemBand);
    hemShade.addColorStop(0, hemShadow);
    hemShade.addColorStop(1, hemFade);
    context.fillStyle = hemShade;
    context.fillRect(0, 0, size, hemBand);
    context.strokeStyle = stitch;
    context.lineWidth = stitchWidth;
    context.setLineDash(dash);
    context.beginPath();
    context.moveTo(0, 20 * k);
    context.lineTo(size, 20 * k);
    context.stroke();
    context.setLineDash([]);

    if (label) {
      // Screen-printed service name. Counter-rotate so it reads upright on the
      // assembled canopy (WebGL flips the canvas vertically once more).
      const lines = label.split('\n');
      const rendered = lines.length > 1 ? [...lines].reverse() : lines;
      // Seat the text low on the gore (~3/4 of the way to the hem). Near the
      // apex the dome curls away and foreshortens the print; the wide, flatter
      // band closer to the hem is where it stays readable.
      const centerY = size * 0.23;   // distance from hem (canvas top) to text centre
      const lineStep = size * 0.165; // extra gap so stacked lines never crowd
      const maxWidth = size * 0.78;

      context.save();
      context.translate(size, size);
      context.rotate(Math.PI);
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      if ('letterSpacing' in context) context.letterSpacing = '0.05em';

      rendered.forEach((line, i) => {
        let fontSize = size * 0.108;
        const applyFont = () => { context.font = `800 ${fontSize}px Montserrat, Arial, sans-serif`; };
        applyFont();
        const width = context.measureText(line).width;
        if (width > maxWidth) { fontSize *= maxWidth / width; applyFont(); }

        const physicalY = lines.length > 1
          ? centerY - (rendered.length - 1) * lineStep / 2 + i * lineStep
          : centerY;
        const y = size - physicalY;

        // A soft cast shadow seats the lettering into the weave so it reads as
        // printed-on fabric rather than a decal floating above it.
        context.shadowColor = isLight ? 'rgba(10,35,70,0.28)' : 'rgba(2,18,40,0.6)';
        context.shadowBlur = (isLight ? 6 : 9) * k;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = (isLight ? 2 : 3) * k;
        context.fillStyle = ink;
        context.fillText(line, size / 2, y);
      });
      context.restore();
      context.shadowColor = 'transparent';
      context.shadowBlur = 0;
      context.shadowOffsetY = 0;
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    return texture;
  }

  // Only the bump path uses it, and only the full tier has a bump path.
  const weaveTexture = Q.bump ? createWeaveTexture() : null;
  const makeFabricMaterial = (index) => {
    const isWhite = index % 2 === 1;   // even gores solid blue, odd gores white
    // Every gore is branded: names cycle through the four services around the
    // canopy (index % 4), so no two neighbours repeat. White ink on the blue
    // gores, navy ink on the white ones.
    const label = serviceLabels[index % serviceLabels.length];
    const ink = isWhite ? labelInk : 'rgba(255,255,255,0.96)';
    const common = {
      color: 0xffffff,
      map: createPanelTexture(isWhite ? panelWhite : panelBlue, label, isWhite, ink),
      roughness: 0.62,
      metalness: 0,
      envMapIntensity: 0.85,
      side: THREE.DoubleSide,
    };
    /* Lite drops to Standard: no sheen lobe, no bump derivatives. The gore
       keeps its printed texture, its env reflection and its shading — it just
       loses the soft fabric rim, which is not resolvable at phone size anyway. */
    if (!Q.physical) return new THREE.MeshStandardMaterial(common);
    return new THREE.MeshPhysicalMaterial({
      ...common,
      sheen: 0.55,
      sheenRoughness: 0.55,
      sheenColor: 0xbcd6ee,
      bumpMap: weaveTexture,
      bumpScale: 0.005,
    });
  };

  /* One gore's texture per turn of the event loop. Eight 512px canvases back to
     back is the single longest block in this build; interleaved like this the
     browser stays free to paint and respond to touch while it happens. */
  const fabricMaterials = [];
  for (let index = 0; index < facetCount; index += 1) {
    fabricMaterials.push(makeFabricMaterial(index));
    await yieldToMain();
    if (disposed) return;
  }

  // (Font-ready texture re-render removed — the umbrella now builds lazily, well
  // after web fonts have loaded, so the first render already uses the real font;
  // regenerating all eight textures a second time was pure wasted main-thread work.)

  const hemMaterial = new THREE.MeshStandardMaterial({
    color: 0x093a63,
    roughness: 0.72,
    metalness: 0,
  });

  function addTube(parent, points, radius, material, tubularSegments = 28) {
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, tubularSegments, radius, Q.tubeRadial, false),
      material,
    );
    /* Every tube here is either a hem/seam ridge lying flat on the fabric or a
       rib/stretcher sitting underneath it — all of them already in the canopy's
       own shadow, all of them under 3cm across. They were being re-rendered
       into the shadow map every frame to contribute nothing visible. */
    tube.castShadow = false;
    parent.add(tube);
    return tube;
  }

  const pieces = Array.from({ length: assemblyPieceCount }, () => new THREE.Group());
  pieces.forEach(piece => umbrella.add(piece));

  function createCanopyPiece(index) {
    const piece = pieces[Math.floor(index / 2)];
    const radialSegments = Q.radialSeg;
    const angularSegments = Q.angularSeg;
    const startAngle = index * panelAngle;
    const vertices = [];
    const uvs = [];
    const indices = [];

    for (let radial = 0; radial <= radialSegments; radial += 1) {
      const radialProgress = radial / radialSegments;
      for (let angular = 0; angular <= angularSegments; angular += 1) {
        const localProgress = angular / angularSegments;
        const angle = startAngle + panelAngle * localProgress;
        const radius = canopyRadiusAt(radialProgress, localProgress);
        vertices.push(
          radius * Math.cos(angle),
          canopyHeight(radialProgress, localProgress),
          radius * Math.sin(angle),
        );
        uvs.push(localProgress, radialProgress);
      }
    }

    for (let radial = 0; radial < radialSegments; radial += 1) {
      for (let angular = 0; angular < angularSegments; angular += 1) {
        const first = radial * (angularSegments + 1) + angular;
        const second = first + angularSegments + 1;
        indices.push(first, second, first + 1, second, second + 1, first + 1);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const panel = new THREE.Mesh(geometry, fabricMaterials[index]);
    panel.castShadow = !LITE;
    panel.receiveShadow = !LITE;
    piece.add(panel);

    // Sewn hem running along the scalloped edge of the gore.
    const hemPoints = [];
    for (let step = 0; step <= 28; step += 1) {
      const localProgress = step / 28;
      const angle = startAngle + panelAngle * localProgress;
      const radius = canopyRadiusAt(1, localProgress);
      hemPoints.push(new THREE.Vector3(
        radius * Math.cos(angle),
        canopyHeight(1, localProgress) + 0.004,
        radius * Math.sin(angle),
      ));
    }
    addTube(piece, hemPoints, 0.013, hemMaterial, Q.hemSeg);

    // Raised seam ridge where this gore is stitched to its neighbour.
    const seamPoints = [];
    for (let step = 0; step <= 10; step += 1) {
      const radialProgress = 0.12 + (step / 10) * 0.88;
      seamPoints.push(new THREE.Vector3(
        canopyRadius * radialProgress * Math.cos(startAngle),
        canopyHeight(radialProgress, 0) + 0.006,
        canopyRadius * radialProgress * Math.sin(startAngle),
      ));
    }
    addTube(piece, seamPoints, 0.007, hemMaterial, Q.seamSeg);
  }

  /* Same again for the gore meshes — each one lathes ~750 vertices, computes
     its normals and builds two tube meshes, so they get a turn of the loop each. */
  for (let index = 0; index < facetCount; index += 1) {
    createCanopyPiece(index);
    await yieldToMain();
    if (disposed) return;
  }

  const framework = new THREE.Group();
  umbrella.add(framework);

  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: 0xdfe4e8,
    roughness: 0.2,
    metalness: 1,
    envMapIntensity: 1.2,
    transparent: true,
    opacity: 0,
  });
  const darkSteelMaterial = new THREE.MeshStandardMaterial({
    color: 0x8f9aa4,
    roughness: 0.34,
    metalness: 0.9,
    envMapIntensity: 1,
    transparent: true,
    opacity: 0,
  });
  /* The logo orange (#dd7627) rather than a wood tone, so the handle picks up
     the brand's second colour against the blue canopy. The clearcoat is what
     keeps it reading as a lacquered grip instead of flat plastic. */
  // Clearcoat is a second specular layer per fragment; lite settles for a low
  // roughness Standard, which reads as the same lacquered grip at this size.
  const handleMaterial = Q.physical
    ? new THREE.MeshPhysicalMaterial({
        color: 0xdd7627,
        roughness: 0.34,
        metalness: 0,
        clearcoat: 0.6,
        clearcoatRoughness: 0.22,
        envMapIntensity: 0.9,
        transparent: true,
        opacity: 0,
      })
    : new THREE.MeshStandardMaterial({
        color: 0xdd7627,
        roughness: 0.28,
        metalness: 0,
        envMapIntensity: 0.9,
        transparent: true,
        opacity: 0,
      });
  const frameworkMaterials = [chromeMaterial, darkSteelMaterial, handleMaterial];

  /* Same reasoning as addTube: ferrules, the runner, rib tips and joint balls
     are all small parts sitting under or behind the canopy. The shadow pass now
     draws the eight gores and the handle and nothing else. */
  function addFrameMesh(geometry, material, x, y, z) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = false;
    framework.add(mesh);
    return mesh;
  }

  // Shaft, top ferrule and runner.
  addFrameMesh(new THREE.CylinderGeometry(0.03, 0.03, 2.11, 20), chromeMaterial, 0, -0.195, 0);
  addFrameMesh(new THREE.CylinderGeometry(0.05, 0.05, 0.09, 16), chromeMaterial, 0, 0.95, 0);
  addFrameMesh(new THREE.CylinderGeometry(0.013, 0.03, 0.18, 14), chromeMaterial, 0, 1.1, 0);
  addFrameMesh(new THREE.SphereGeometry(0.017, 12, 12), chromeMaterial, 0, 1.2, 0);
  addFrameMesh(new THREE.CylinderGeometry(0.048, 0.052, 0.13, 16), darkSteelMaterial, 0, 0.12, 0);

  for (let index = 0; index < facetCount; index += 1) {
    const angle = index * panelAngle;
    const direction = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));

    // Ribs run UNDER the fabric — the old build laid them on top, which was
    // one of the strongest "CG toy" tells.
    const ribPoints = [];
    for (let step = 0; step <= 9; step += 1) {
      const progress = step / 9;
      const point = direction.clone().multiplyScalar(canopyRadius * progress);
      point.y = ribProfile(progress) - 0.02;
      ribPoints.push(point);
    }
    addTube(framework, ribPoints, 0.0115, darkSteelMaterial, Q.ribSeg);

    // Chrome tip continuing the rib line past the hem.
    const nearEnd = direction.clone().multiplyScalar(canopyRadius * 0.96);
    nearEnd.y = ribProfile(0.96) - 0.02;
    const end = direction.clone().multiplyScalar(canopyRadius);
    end.y = ribProfile(1) - 0.02;
    const outward = end.clone().sub(nearEnd).normalize();
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.013, 0.11, 10), chromeMaterial);
    tip.position.copy(end).addScaledVector(outward, 0.05);
    tip.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), outward);
    tip.castShadow = false;
    framework.add(tip);

    // Stretcher from the runner up to the middle of the rib, with a joint.
    const inner = new THREE.Vector3(0, 0.18, 0);
    const outer = direction.clone().multiplyScalar(canopyRadius * 0.45);
    outer.y = ribProfile(0.45) - 0.03;
    addTube(framework, [inner, outer], 0.008, darkSteelMaterial, Q.strutSeg);
    addFrameMesh(new THREE.SphereGeometry(0.016, 10, 10), darkSteelMaterial, outer.x, outer.y, outer.z);
  }

  // Curved lacquered J-handle with a chrome collar.
  addFrameMesh(new THREE.CylinderGeometry(0.036, 0.036, 0.05, 16), chromeMaterial, 0, -1.23, 0);
  const handleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -1.24, 0),
    new THREE.Vector3(0, -1.38, 0),
    new THREE.Vector3(0.02, -1.48, 0),
    new THREE.Vector3(0.1, -1.545, 0),
    new THREE.Vector3(0.22, -1.55, 0),
    new THREE.Vector3(0.33, -1.51, 0),
    new THREE.Vector3(0.4, -1.42, 0),
    new THREE.Vector3(0.415, -1.32, 0),
    new THREE.Vector3(0.41, -1.24, 0),
  ], false, 'centripetal');
  const handle = new THREE.Mesh(
    new THREE.TubeGeometry(handleCurve, LITE ? 28 : 56, 0.052, LITE ? 8 : 12, false),
    handleMaterial,
  );
  handle.castShadow = !LITE;
  framework.add(handle);
  addFrameMesh(new THREE.SphereGeometry(0.052, 14, 14), handleMaterial, 0.41, -1.24, 0);

  const separatedStates = [
    { position: [-2.25, 1.05, 0.55], rotation: [-0.22, -0.34, -0.46] },
    { position: [2.2, 1.15, -0.5], rotation: [0.18, 0.42, 0.42] },
    { position: [-2.1, -1.08, -0.48], rotation: [0.28, 0.25, 0.34] },
    { position: [2.25, -1.02, 0.58], rotation: [-0.2, -0.38, -0.38] },
  ];

  let assemblyProgress = 1;
  const globalGsap = gsap;
  const globalScrollTrigger = ScrollTrigger;
  const progressFill = document.querySelector('.umbrella-progress-fill');
  const progressLabel = document.querySelector('.umbrella-assembly-progress > span');
  const pinContent = document.querySelector('.umbrella-pin-content');

  if (globalGsap && globalScrollTrigger && pinContent) {
    assemblyProgress = 0;
    pieces.forEach((piece, index) => {
      const state = separatedStates[index];
      piece.position.set(...state.position);
      piece.rotation.set(...state.rotation);
    });

    /* Pinning is the one thing here that actively fights a phone's own
       scrolling: it swaps the section to fixed positioning partway through a
       scroll and inserts a spacer, forcing a re-layout at exactly the moment
       the compositor is trying to carry a fling. Desktop keeps the pinned
       scroll-to-assemble; touch gets the same assembly driven by the section
       travelling up through the viewport, with no pin and no re-layout. */
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    /* Touch no longer scrubs either. Scrubbing meant every scroll frame drove
       four groups' positions AND rotations, and each of those writes dirties
       the whole scene so the very next frame has to re-render 28k triangles —
       a WebGL redraw chained to the phone's scroll. Played once on entry, the
       same assembly runs on its own clock while the section is on screen, and
       the render loop goes back to the idle spin it was always going to do. */
    const scrollConfig = isTouch
      ? {
          trigger: '.section-umbrella',
          start: 'top 78%',
          once: true,
          invalidateOnRefresh: true,
        }
      : {
          trigger: '.section-umbrella',
          start: 'top top',
          end: () => `+=${Math.max(500, window.innerHeight * 0.75)}`,
          pin: pinContent,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        };

    /* Reads the TIMELINE's progress, not the ScrollTrigger's. Those are the same
       number only while scrubbing, which is now the desktop path alone: on touch
       the trigger just fires once and the timeline plays on its own clock, so a
       trigger-based reading would track scroll position instead of assembly —
       and `once` kills the trigger after the first pass, freezing it outright.
       Everything downstream depends on this being the real assembly state: the
       idle spin and float ramp in through `spinStrength`, and drag is gated on
       it. */
    let lastLabel = '';
    const assemblyTimeline = globalGsap.timeline({
      scrollTrigger: scrollConfig,
      onUpdate() {
        const progress = assemblyTimeline.progress();
        assemblyProgress = progress;
        if (progressFill) progressFill.style.transform = `scaleX(${progress})`;
        if (progressLabel) {
          // Only touch the DOM when the wording actually changes — this fires
          // every frame the timeline advances.
          const label = progress > 0.82 ? 'Umbrella complete' : 'Scroll to assemble';
          if (label !== lastLabel) {
            lastLabel = label;
            progressLabel.textContent = label;
          }
        }
      },
    });

    pieces.forEach((piece, index) => {
      const at = index * 0.02;
      assemblyTimeline
        .to(piece.position, { x: 0, y: 0, z: 0, duration: 0.55, ease: 'power2.inOut' }, at)
        .to(piece.rotation, { x: 0, y: 0, z: 0, duration: 0.55, ease: 'power2.inOut' }, at);
    });

    assemblyTimeline
      .to(frameworkMaterials, { opacity: 1, duration: 0.15, stagger: 0.02 }, 0.45)
      .to(floatingRig.scale, { x: 1.035, y: 1.035, z: 1.035, duration: 0.2, ease: 'power2.out' }, 0.6)
      .to({}, { duration: 0.2 });

    /* This timeline is built outside SiteMotion's gsap.context, so it isn't
       covered by that context's revert — kill it here or a route change leaves
       a pinned section (and its pin spacer) behind. */
    teardown.push(() => {
      assemblyTimeline.scrollTrigger?.kill();
      assemblyTimeline.kill();
    });
  } else {
    pieces.forEach(piece => {
      piece.position.set(0, 0, 0);
      piece.rotation.set(0, 0, 0);
    });
    frameworkMaterials.forEach(material => { material.opacity = 1; });
    if (progressFill) progressFill.style.transform = 'scaleX(1)';
  }

  let dragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let resumeAt = 0;
  let previousTime = 0;

  host.addEventListener('pointerdown', event => {
    if (assemblyProgress < 0.82) return;
    dragging = true;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    host.setPointerCapture(event.pointerId);
  });

  host.addEventListener('pointermove', event => {
    if (!dragging) return;
    // Horizontal drag spins the canopy; the tilt stays locked at its fixed angle.
    umbrella.rotation.y += (event.clientX - lastPointerX) * 0.01;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
  });

  function finishDrag() {
    dragging = false;
    resumeAt = performance.now() + 700;
  }

  host.addEventListener('pointerup', finishDrag);
  host.addEventListener('pointercancel', finishDrag);

  function resizeRenderer() {
    const { clientWidth, clientHeight } = host;
    if (!clientWidth || !clientHeight) return;
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight, false);
  }

  const observer = new ResizeObserver(resizeRenderer);
  observer.observe(host);
  resizeRenderer();

  /* Compile and link the shader programs ahead of the first frame rather than
     during it. Eight fabric programs plus chrome, steel and the handle is
     substantial driver work, and left unprepared all of it lands on the single
     frame the canopy first becomes visible — the hitch that made the umbrella
     look like it turned up late even once it had downloaded. Where compileAsync
     is unavailable the first frame just pays for it as it used to. */
  if (renderer.compileAsync) {
    /* Raced against a timeout rather than simply awaited. compileAsync resolves
       off the back of KHR_parallel_shader_compile, and a driver that never
       reports back would otherwise leave the canopy stuck behind its loading
       text for the rest of the visit. Losing the race costs only the stall this
       was meant to avoid — the first frame compiles as it always did. */
    await Promise.race([
      renderer.compileAsync(scene, camera),
      new Promise((resolve) => setTimeout(resolve, 2000)),
    ]);
    if (disposed) return;
  }

  host.classList.add('is-ready');
  if (globalScrollTrigger) requestAnimationFrame(() => globalScrollTrigger.refresh());

  window.__umbrellaDebug = { renderer, scene, camera, umbrella, floatingRig };

  // GPU-side disposal is registered up with the renderer; this only needs to
  // stop the observer that was created here.
  teardown.push(() => observer.disconnect());

  /* The render loop only runs while the canvas is actually on screen and the
     tab is in the foreground. Left unconditional it kept drawing ~28k triangles
     with shadows at 60fps for the whole visit — the single biggest cause of
     scroll jank elsewhere on the page, and a battery drain on phones. */
  let onScreen = false;
  let looping = false;

  /* Lite renders at ~30fps rather than 60. The spin and drift are slow enough
     that half the frames are indistinguishable, and on a phone this is the
     difference between the GPU being busy every frame the compositor also needs
     for scrolling and it being busy every other one. */
  let lastDraw = 0;

  function render(time) {
    if (!onScreen || document.hidden) { looping = false; return; }

    if (Q.frameMs && time - lastDraw < Q.frameMs) {
      requestAnimationFrame(render);
      return;
    }
    lastDraw = time;

    const delta = previousTime ? Math.min(time - previousTime, 32) : 16;
    previousTime = time;

    const spinStrength = THREE.MathUtils.smoothstep(assemblyProgress, 0.64, 0.8);
    if (!dragging && time > resumeAt) {
      umbrella.rotation.y += delta * 0.00014 * spinStrength;
    }

    // Gentle floating drift only — no roll/pitch wobble, so the canopy holds
    // one fixed tilt while it slowly spins in place.
    floatingRig.position.y = floatBaseY + Math.sin(time * 0.001) * 0.07 * spinStrength;
    floatingRig.position.x = Math.sin(time * 0.0007 + 1.2) * 0.022 * spinStrength;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  function startLoop() {
    if (looping || !onScreen || document.hidden) return;
    looping = true;
    previousTime = 0; // don't integrate the gap we spent paused into one huge delta
    requestAnimationFrame(render);
  }

  /* A little runway so it's already spinning by the time the section is in
     view — but only a little. At a full screen either side the scene was
     rendering through most of the scroll past the sections above and below it,
     which is exactly when the compositor least wants the competition. */
  const visibilityObserver = new IntersectionObserver((entries) => {
    onScreen = entries[entries.length - 1].isIntersecting; // callbacks can batch
    startLoop();
  }, { rootMargin: '20% 0px' });
  visibilityObserver.observe(host);

  document.addEventListener('visibilitychange', startLoop);

  teardown.push(() => {
    onScreen = false; // stops the loop at its next frame check
    visibilityObserver.disconnect();
    document.removeEventListener('visibilitychange', startLoop);
  });
  };

  /* Build when the visitor is actually approaching the section — two screens of
     runway is plenty to download and assemble before it's in view. The previous
     trigger fired on the first mousemove/touch anywhere on the page, which meant
     every visitor paid for the whole 3D scene within a second of arriving even
     if they never scrolled near it. */
  const buildObserver = new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    startUmbrella();
  }, { rootMargin: '200% 0px' });
  buildObserver.observe(host);

  return function dispose() {
    disposed = true;
    buildObserver.disconnect();
    teardown.forEach((fn) => fn());
    teardown.length = 0;
  };
}
