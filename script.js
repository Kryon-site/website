// Aether AI - Advanced 3D Neural Mesh
const canvas = document.querySelector('#hero-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Neural Mesh Implementation
const geometry = new THREE.IcosahedronGeometry(4, 15);
const originalPositions = geometry.attributes.position.array.slice();

const material = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x278795) },
        uSecondaryColor: { value: new THREE.Color(0x184E5A) }
    },
    vertexShader: `
        uniform float uTime;
        varying vec3 vPosition;
        varying float vNoise;

        // Simple noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        float snoise(vec3 v) {
            const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 = v - i + dot(i, C.xxx) ;
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute( permute( permute(
                        i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
            float n_ = 0.142857142857;
            vec3  ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                            dot(p2,x2), dot(p3,x3) ) );
        }

        void main() {
            vPosition = position;
            float noise = snoise(position * 0.5 + uTime * 0.2);
            vNoise = noise;
            vec3 newPosition = position + normal * noise * 0.5;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            gl_PointSize = 2.0;
        }
    `,
    fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform vec3 uSecondaryColor;
        varying vec3 vPosition;
        varying float vNoise;

        void main() {
            float alpha = 0.1 + (vNoise + 1.0) * 0.2;
            vec3 finalColor = mix(uSecondaryColor, uColor, (vNoise + 1.0) * 0.5);
            gl_FragColor = vec4(finalColor, alpha);
        }
    `,
    transparent: true,
    wireframe: true
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Points for "stars" or particles
const pointsGeometry = new THREE.BufferGeometry();
const pointsCount = 1000;
const posArray = new Float32Array(pointsCount * 3);

for(let i = 0; i < pointsCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 20;
}

pointsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const pointsMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x278795,
    transparent: true,
    opacity: 0.5
});

const pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
scene.add(pointsMesh);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

camera.position.z = 8;

// Mouse tracking
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

window.addEventListener('mousemove', (event) => {
    targetX = (event.clientX / window.innerWidth) - 0.5;
    targetY = (event.clientY / window.innerHeight) - 0.5;
});

// Animation loop
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();
    requestAnimationFrame(animate);

    material.uniforms.uTime.value = elapsedTime;

    // Smooth follow mouse
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    mesh.rotation.y = elapsedTime * 0.1 + mouseX * 0.5;
    mesh.rotation.x = mouseY * 0.5;

    pointsMesh.rotation.y = -elapsedTime * 0.05;

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
