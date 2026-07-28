/* The slice of three.js the umbrella scene actually uses.

   lib/umbrella.js reaches for `three` through a dynamic import so the library
   stays off the critical path. The catch is that `await import('three')` hands
   back a namespace object, and reading `THREE.Mesh` off it at runtime tells the
   bundler nothing about which exports are live — so the whole library ships.

   Re-exporting the used symbols statically here gives the bundler a graph it can
   actually shake, while `await import('./three-subset')` preserves the lazy
   boundary exactly as before. Call sites keep the `THREE.X` shape, so adopting
   this needed no changes inside the scene itself.

   Adding a new three.js feature to the scene means adding its export here first,
   otherwise it arrives as `undefined` at runtime rather than a build error.
   Regenerate the list with:
     grep -oE "THREE\.[A-Za-z0-9_]+" lib/umbrella.js | sed 's/THREE\.//' | sort -u
*/

export {
  // Core
  Scene,
  Group,
  Mesh,
  Color,
  Vector3,
  MathUtils,
  PerspectiveCamera,

  // Renderer and colour pipeline
  WebGLRenderer,
  PMREMGenerator,
  SRGBColorSpace,
  NeutralToneMapping,
  PCFSoftShadowMap,

  // Lights
  DirectionalLight,
  HemisphereLight,

  // Geometry
  BufferGeometry,
  Float32BufferAttribute,
  PlaneGeometry,
  SphereGeometry,
  CylinderGeometry,
  TubeGeometry,
  CatmullRomCurve3,

  // Materials
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshPhysicalMaterial,

  // Textures and enums
  CanvasTexture,
  RepeatWrapping,
  LinearMipmapLinearFilter,
  BackSide,
  DoubleSide
} from 'three';
