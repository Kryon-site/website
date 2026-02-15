// Three.js Background Animation
const canvas = document.querySelector('#hero-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Objects
const geometry = new THREE.IcosahedronGeometry(2, 1);
const material = new THREE.MeshPhongMaterial({
    color: 0x0066ff,
    wireframe: true,
    transparent: true,
    opacity: 0.1
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x0066ff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

camera.position.z = 5;

// Mouse tracking
let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) - 0.5;
    mouseY = (event.clientY / window.innerHeight) - 0.5;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    mesh.rotation.x += 0.001;
    mesh.rotation.y += 0.002;

    // Smooth follow mouse
    mesh.position.x += (mouseX * 2 - mesh.position.x) * 0.05;
    mesh.position.y += (-mouseY * 2 - mesh.position.y) * 0.05;

    renderer.render(scene, camera);
}

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

// Initialize Lucide Icons
if (window.lucide) {
    lucide.createIcons();
}
