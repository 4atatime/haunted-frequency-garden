// The Haunted Frequency Garden - Complete Organic Audio-Visual Experience
// Enhanced with stable audio loading and organic morphing systems

let song;
let fft;
let audioContextInitialized = false;
let audioLoaded = false;
let isPlaying = false;

// Organic systems
let organicMasses = [];
let particleClusters = [];
let creepingVines = [];
let smokeParticles = [];
let morphingLines = [];

// Camera system
let cameraZ = 0;
let cameraRotation = 0;
let lastEnergyLevels = [0, 0, 0];
let rotationTarget = 0;

// Audio analysis with heavy smoothing
let bassEnergy = 0;
let midEnergy = 0;
let trebleEnergy = 0;
let smoothedBass = 0;
let smoothedMid = 0;
let smoothedTreble = 0;

// Global animation parameters
let globalTime = 0;
let noiseOffset = 0;

// Entity counts for balanced performance
const MASS_COUNT = 8;
const CLUSTER_COUNT = 12;
const VINE_COUNT = 6;
const SMOKE_COUNT = 40;
const LINE_COUNT = 8;

function preload() {
    console.log('🌀 Loading haunted audio essence...');
    
    // Load audio with comprehensive error handling
    song = loadSound('soaked.mp3', 
        () => {
            console.log('✅ Audio loaded successfully');
            audioLoaded = true;
            updateStatus('audio loaded');
            document.getElementById('audioState').textContent = 'loaded';
        },
        (err) => {
            console.error('❌ Audio loading failed:', err);
            console.log('🔍 Check that soaked.mp3 is in the project folder');
            updateStatus('audio load failed');
            document.getElementById('audioState').textContent = 'failed';
        }
    );
}

function setup() {
    console.log('🌙 Initializing Haunted Frequency Garden...');
    
    const canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.parent(document.body);
    
    colorMode(RGB);
    
    // Initialize audio context safely for browser security
    getAudioContext().suspend();
    
    // Setup FFT analyzer
    fft = new p5.FFT(0.85, 256);
    
    // Initialize all organic systems
    initializeOrganicSystems();
    
    console.log('✅ System initialized - ready for audio');
    updateStatus('ready for audio initialization');
}

function draw() {
    // Deep space background
    background(1, 2, 3);
    
    // Update systems only when playing
    if (audioContextInitialized && audioLoaded && song && song.isPlaying()) {
        analyzeAudioSmooth();
        updateCameraSystem();
        updateGlobalAnimations();
        updateOrganicSystems();
        checkForNewInstruments();
    } else {
        // Static mode when paused
        staticCameraMode();
    }
    
    // Setup atmospheric lighting
    setupLighting();
    
    // Render all organic systems
    renderOrganicSystems();
    
    // Update UI displays
    updateDisplays();
}

function analyzeAudioSmooth() {
    let spectrum = fft.analyze();
    
    // Get raw frequency energies
    let rawBass = fft.getEnergy(20, 140);
    let rawMid = fft.getEnergy(400, 2600);
    let rawTreble = fft.getEnergy(5200, 14000);
    
    // Apply very heavy smoothing for organic movement
    smoothedBass = lerp(smoothedBass, rawBass, 0.04);
    smoothedMid = lerp(smoothedMid, rawMid, 0.04);
    smoothedTreble = lerp(smoothedTreble, rawTreble, 0.04);
    
    // Store for immediate effects
    bassEnergy = rawBass;
    midEnergy = rawMid;
    trebleEnergy = rawTreble;
}

function updateCameraSystem() {
    // Smooth forward progression through the garden
    let forwardSpeed = 2 + smoothedBass * 0.008;
    cameraZ += forwardSpeed;
    
    // Organic camera rotation
    rotationTarget = lerp(rotationTarget, 
        sin(globalTime * 0.2) * smoothedMid * 0.0003, 
        0.02
    );
    cameraRotation = lerp(cameraRotation, rotationTarget, 0.03);
    
    // Gentle organic sway
    let swayX = sin(globalTime * 0.3) * smoothedMid * 0.01;
    let swayY = cos(globalTime * 0.25) * smoothedBass * 0.008;
    
    // Apply smooth camera transformation
    camera(swayX, swayY, cameraZ, 
           swayX, swayY, cameraZ - 1000, 
           0, 1, 0);
    
    rotateY(cameraRotation);
    rotateX(sin(globalTime * 0.1) * smoothedTreble * 0.00008);
}

function staticCameraMode() {
    // Minimal breathing effect when paused
    let breathe = sin(frameCount * 0.01) * 3;
    camera(0, breathe, cameraZ, 0, breathe, cameraZ - 500, 0, 1, 0);
}

function updateGlobalAnimations() {
    globalTime += 0.016; // 60fps time increment
    noiseOffset += 0.002;
}

function setupLighting() {
    // Base ambient darkness
    ambientLight(8, 10, 12);
    
    if (isPlaying) {
        // Audio-reactive directional light
        let intensity = map(smoothedBass + smoothedMid + smoothedTreble, 0, 765, 20, 100);
        directionalLight(intensity, intensity, intensity + 5, 0.3, 0.7, -1);
        
        // Dynamic point lights for atmosphere
        if (smoothedBass > 80) {
            pointLight(80, 75, 85, 0, -300, cameraZ + 200);
        }
        
        if (smoothedTreble > 120) {
            pointLight(120, 125, 130, 
                sin(globalTime * 2) * 200, 
                cos(globalTime * 1.7) * 150, 
                cameraZ + 100);
        }
    } else {
        directionalLight(40, 42, 45, 0.5, 0.8, -1);
    }
}

// Organic Mass Class - Bass Response
class OrganicMass {
    constructor() {
        this.position = createVector(
            random(-width * 1.8, width * 1.8),
            random(-height * 0.8, height * 0.8),
            cameraZ + random(-800, -2000)
        );
        this.baseSize = random(120, 300);
        this.size = this.baseSize;
        this.vertices = [];
        this.noiseOffsets = [];
        this.morphPhase = random(TWO_PI);
        
        this.generateOrganicShape();
    }
    
    generateOrganicShape() {
        this.vertices = [];
        this.noiseOffsets = [];
        
        let vertexCount = floor(random(12, 20));
        for (let i = 0; i < vertexCount; i++) {
            let angle = (TWO_PI / vertexCount) * i;
            let radius = random(0.6, 1.4);
            
            this.vertices.push({
                angle: angle,
                radius: radius,
                baseRadius: radius,
                height: random(-20, 20)
            });
            this.noiseOffsets.push(random(1000));
        }
    }
    
    update() {
        if (!isPlaying) return;
        
        // Slow organic morphing
        this.morphPhase += 0.008 + smoothedBass * 0.00005;
        
        // Size pulsation with bass
        this.size = this.baseSize + smoothedBass * 1.5;
        
        // Vertex morphing for organic shape
        this.vertices.forEach((vertex, index) => {
            let noiseVal = noise(this.noiseOffsets[index] + noiseOffset * 3);
            let bassInfluence = map(smoothedBass, 0, 255, 0.8, 2.2);
            
            vertex.radius = vertex.baseRadius * noiseVal * bassInfluence;
            vertex.height += sin(this.morphPhase + index * 0.5) * smoothedBass * 0.002;
            
            this.noiseOffsets[index] += 0.003;
        });
        
        // Regenerate if too far behind
        if (this.position.z < cameraZ - 2500) {
            this.position.z = cameraZ + random(-200, -1500);
            this.generateOrganicShape();
        }
    }
    
    display() {
        push();
        translate(this.position.x, this.position.y, this.position.z);
        
        let brightness = map(smoothedBass, 0, 255, 70, 160);
        fill(brightness, brightness, brightness + 5, 140);
        stroke(brightness + 20, brightness + 20, brightness + 25, 180);
        strokeWeight(1.5);
        
        // Draw organic mass using triangulated surface
        beginShape(TRIANGLES);
        for (let i = 0; i < this.vertices.length; i++) {
            let v1 = this.vertices[i];
            let v2 = this.vertices[(i + 1) % this.vertices.length];
            
            let x1 = cos(v1.angle) * v1.radius * this.size;
            let y1 = sin(v1.angle) * v1.radius * this.size;
            let z1 = v1.height;
            
            let x2 = cos(v2.angle) * v2.radius * this.size;
            let y2 = sin(v2.angle) * v2.radius * this.size;
            let z2 = v2.height;
            
            // Create triangular faces
            vertex(0, 0, 0);
            vertex(x1, y1, z1);
            vertex(x2, y2, z2);
        }
        endShape();
        
        pop();
    }
}

// Particle Cluster Class - Treble Response
class ParticleCluster {
    constructor() {
        this.position = createVector(
            random(-width * 2.5, width * 2.5),
            random(-height, height),
            cameraZ + random(-500, -1800)
        );
        this.particles = [];
        this.baseCount = floor(random(40, 80));
        
        this.generateParticleCloud();
    }
    
    generateParticleCloud() {
        this.particles = [];
        for (let i = 0; i < this.baseCount; i++) {
            this.particles.push({
                offset: p5.Vector.random3D().mult(random(30, 150)),
                noiseOffset: random(1000),
                size: random(2, 8),
                opacity: random(0.3, 0.8)
            });
        }
    }
    
    update() {
        if (!isPlaying) return;
        
        // Organic particle movement
        this.particles.forEach(particle => {
            particle.noiseOffset += 0.004;
            
            let noiseVal = noise(particle.noiseOffset);
            let trebleInfluence = smoothedTreble * 0.01;
            
            particle.offset.add(p5.Vector.random3D().mult(noiseVal * trebleInfluence));
            particle.offset.mult(0.98); // Damping
            
            particle.size = random(2, 8) + smoothedTreble * 0.02;
        });
        
        // Regenerate if too far
        if (this.position.z < cameraZ - 2200) {
            this.position.z = cameraZ + random(-300, -1200);
            this.generateParticleCloud();
        }
    }
    
    display() {
        push();
        translate(this.position.x, this.position.y, this.position.z);
        
        let brightness = map(smoothedTreble, 0, 255, 120, 200);
        
        this.particles.forEach(particle => {
            push();
            translate(particle.offset.x, particle.offset.y, particle.offset.z);
            
            fill(brightness, brightness, brightness + 10, particle.opacity * 255);
            noStroke();
            sphere(particle.size);
            
            pop();
        });
        
        pop();
    }
}

// Creeping Vine Class - Mid Response
class CreepingVine {
    constructor() {
        this.position = createVector(
            random(-width * 2, width * 2),
            random(-height, height),
            cameraZ + random(-600, -1800)
        );
        this.segments = [];
        this.maxSegments = floor(random(15, 30));
        this.baseThickness = random(4, 12);
        this.growthPhase = random(TWO_PI);
        
        this.initializeVine();
    }
    
    initializeVine() {
        this.segments = [];
        let currentPos = createVector(0, 0, 0);
        
        for (let i = 0; i < this.maxSegments; i++) {
            let segmentLength = random(15, 35);
            let angle = random(-0.3, 0.3);
            
            currentPos = currentPos.copy().add(createVector(
                cos(angle) * segmentLength,
                sin(angle) * segmentLength,
                random(-5, 5)
            ));
            
            this.segments.push({
                position: currentPos.copy(),
                thickness: this.baseThickness * (1 - i / this.maxSegments),
                noiseOffset: random(1000)
            });
        }
    }
    
    update() {
        if (!isPlaying) return;
        
        this.growthPhase += 0.015 + smoothedMid * 0.00008;
        
        // Organic vine movement
        this.segments.forEach((segment, index) => {
            segment.noiseOffset += 0.005;
            
            let noiseVal = noise(segment.noiseOffset + noiseOffset * 2);
            let midInfluence = smoothedMid * 0.008;
            
            // Organic swaying motion
            segment.position.add(createVector(
                sin(this.growthPhase + index * 0.3) * midInfluence,
                cos(this.growthPhase + index * 0.4) * midInfluence * 0.7,
                noiseVal * midInfluence
            ));
            
            segment.thickness = this.baseThickness * (1 - index / this.maxSegments) + smoothedMid * 0.01;
        });
        
        // Regenerate if too far
        if (this.position.z < cameraZ - 2300) {
            this.position.z = cameraZ + random(-400, -1200);
            this.initializeVine();
        }
    }
    
    display() {
        push();
        translate(this.position.x, this.position.y, this.position.z);
        
        let brightness = map(smoothedMid, 0, 255, 90, 170);
        stroke(brightness, brightness, brightness + 8, 160);
        noFill();
        
        // Draw vine as connected segments
        for (let i = 0; i < this.segments.length - 1; i++) {
            let seg1 = this.segments[i];
            let seg2 = this.segments[i + 1];
            
            strokeWeight(seg1.thickness);
            line(seg1.position.x, seg1.position.y, seg1.position.z,
                 seg2.position.x, seg2.position.y, seg2.position.z);
        }
        
        pop();
    }
}

// Smoke Particle Class - Bass Atmospheric
class SmokeParticle {
    constructor() {
        this.position = createVector(
            random(-width * 3, width * 3),
            random(-height * 1.5, height * 1.5),
            cameraZ + random(-1000, -2500)
        );
        this.size = random(50, 150);
        this.opacity = random(0.2, 0.6);
        this.driftSpeed = random(0.3, 0.8);
        this.noiseOffset = random(1000);
    }
    
    update() {
        if (!isPlaying) return;
        
        this.noiseOffset += 0.003;
        
        // Organic drift movement
        this.position.x += map(noise(this.noiseOffset), 0, 1, -this.driftSpeed, this.driftSpeed);
        this.position.y += map(noise(this.noiseOffset + 100), 0, 1, -this.driftSpeed * 0.5, this.driftSpeed * 0.5);
        
        // Size variation with bass
        this.size = random(50, 150) + smoothedBass * 0.5;
        
        // Regenerate if too far
        if (this.position.z < cameraZ - 3000) {
            this.position.z = cameraZ + random(-500, -2000);
        }
    }
    
    display() {
        push();
        translate(this.position.x, this.position.y, this.position.z);
        
        let brightness = map(smoothedBass, 0, 255, 60, 120);
        fill(brightness, brightness, brightness + 5, this.opacity * 255);
        noStroke();
        
        sphere(this.size);
        
        pop();
    }
}

// Morphing Line Class - Treble Response
class MorphingLine {
    constructor() {
        this.startPos = createVector(
            random(-width * 2, width * 2),
            random(-height, height),
            cameraZ + random(-800, -1800)
        );
        this.endPos = createVector(
            random(-width * 2, width * 2),
            random(-height, height),
            cameraZ + random(-800, -1800)
        );
        this.controlPoints = [];
        this.morphPhase = random(TWO_PI);
        
        this.generateControlPoints();
    }
    
    generateControlPoints() {
        this.controlPoints = [];
        let segments = floor(random(8, 16));
        
        for (let i = 0; i <= segments; i++) {
            let t = i / segments;
            let basePos = p5.Vector.lerp(this.startPos, this.endPos, t);
            
            this.controlPoints.push({
                position: basePos.copy(),
                basePosition: basePos.copy(),
                offset: createVector(0, 0, 0),
                noiseOffset: random(1000)
            });
        }
    }
    
    update() {
        if (!isPlaying) return;
        
        this.morphPhase += 0.02 + smoothedTreble * 0.0001;
        
        // Update control points with treble-driven morphing
        this.controlPoints.forEach((point, index) => {
            point.noiseOffset += 0.008;
            
            let noiseVal = noise(point.noiseOffset + noiseOffset * 4);
            let trebleInfluence = smoothedTreble * 0.3;
            
            // Organic stretching and morphing
            let morphAmount = sin(this.morphPhase + index * 0.5) * trebleInfluence;
            point.offset = p5.Vector.random3D().mult(noiseVal * trebleInfluence + morphAmount);
            
            point.position = p5.Vector.add(point.basePosition, point.offset);
        });
        
        // Regenerate if too far
        if (this.startPos.z < cameraZ - 2400) {
            this.startPos.z = cameraZ + random(-400, -1200);
            this.endPos.z = cameraZ + random(-400, -1200);
            this.generateControlPoints();
        }
    }
    
    display() {
        let brightness = map(smoothedTreble, 0, 255, 110, 220);
        
        stroke(brightness, brightness, brightness + 15, 180);
        strokeWeight(2 + smoothedTreble * 0.015);
        noFill();
        
        // Draw morphing line
        beginShape();
        this.controlPoints.forEach(point => {
            vertex(point.position.x, point.position.y, point.position.z);
        });
        endShape();
    }
}

function initializeOrganicSystems() {
    console.log('🌿 Generating organic entities...');
    
    // Initialize all organic systems
    organicMasses = [];
    particleClusters = [];
    creepingVines = [];
    smokeParticles = [];
    morphingLines = [];
    
    for (let i = 0; i < MASS_COUNT; i++) {
        organicMasses.push(new OrganicMass());
    }
    
    for (let i = 0; i < CLUSTER_COUNT; i++) {
        particleClusters.push(new ParticleCluster());
    }
    
    for (let i = 0; i < VINE_COUNT; i++) {
        creepingVines.push(new CreepingVine());
    }
    
    for (let i = 0; i < SMOKE_COUNT; i++) {
        smokeParticles.push(new SmokeParticle());
    }
    
    for (let i = 0; i < LINE_COUNT; i++) {
        morphingLines.push(new MorphingLine());
    }
    
    console.log('✅ Organic ecosystem initialized');
}

function updateOrganicSystems() {
    // Update all organic entities
    organicMasses.forEach(mass => mass.update());
    particleClusters.forEach(cluster => cluster.update());
    creepingVines.forEach(vine => vine.update());
    smokeParticles.forEach(smoke => smoke.update());
    morphingLines.forEach(line => line.update());
    
    // Maintain entity counts through regeneration
    while (organicMasses.length < MASS_COUNT) {
        organicMasses.push(new OrganicMass());
    }
    while (particleClusters.length < CLUSTER_COUNT) {
        particleClusters.push(new ParticleCluster());
    }
    while (creepingVines.length < VINE_COUNT) {
        creepingVines.push(new CreepingVine());
    }
    while (smokeParticles.length < SMOKE_COUNT) {
        smokeParticles.push(new SmokeParticle());
    }
    while (morphingLines.length < LINE_COUNT) {
        morphingLines.push(new MorphingLine());
    }
}

function checkForNewInstruments() {
    // Detect significant energy changes to spawn new elements
    let currentEnergy = [bassEnergy, midEnergy, trebleEnergy];
    let energyChanges = currentEnergy.map((e, i) => e - lastEnergyLevels[i]);
    
    energyChanges.forEach((change, i) => {
        if (change > 80) { // Threshold for new instrument detection
            spawnNewElements(i);
        }
    });
    
    lastEnergyLevels = currentEnergy.slice();
}

function spawnNewElements(type) {
    switch (type) {
        case 0: // Bass - spawn masses and smoke
            organicMasses.push(new OrganicMass());
            smokeParticles.push(new SmokeParticle());
            break;
            
        case 1: // Mid - spawn vines
            creepingVines.push(new CreepingVine());
            creepingVines.push(new CreepingVine());
            break;
            
        case 2: // Treble - spawn clusters and lines
            particleClusters.push(new ParticleCluster());
            morphingLines.push(new MorphingLine());
            break;
    }
}

function renderOrganicSystems() {
    // Render all organic systems in appropriate order
    smokeParticles.forEach(smoke => smoke.display());
    organicMasses.forEach(mass => mass.display());
    creepingVines.forEach(vine => vine.display());
    particleClusters.forEach(cluster => cluster.display());
    morphingLines.forEach(line => line.display());
}

// Audio control functions
function initializeAudio() {
    console.log('🔊 Initializing audio context...');
    updateStatus('initializing audio...');
    
    userStartAudio().then(() => {
        audioContextInitialized = true;
        
        document.getElementById('playBtn').disabled = false;
        document.getElementById('initBtn').textContent = 'audio ready';
        document.getElementById('initBtn').style.background = '#1a3a1a';
        
        updateStatus('audio ready');
        console.log('✅ Audio context initialized successfully');
    }).catch(err => {
        console.error('❌ Audio initialization failed:', err);
        updateStatus('audio initialization failed');
        document.getElementById('initBtn').style.background = '#3a1a1a';
    });
}

function togglePlay() {
    if (!audioContextInitialized) {
        console.log('⚠️ Audio context not initialized');
        updateStatus('initialize audio first');
        return;
    }
    
    if (!audioLoaded) {
        console.log('⚠️ Audio file not loaded');
        updateStatus('audio file not found');
        return;
    }
    
    if (song.isPlaying()) {
        song.pause();
        isPlaying = false;
        document.getElementById('playBtn').textContent = 'enter garden';
        updateStatus('garden paused');
        console.log('🌙 Garden experience paused');
    } else {
        song.play();
        isPlaying = true;
        document.getElementById('playBtn').textContent = 'exit garden';
        updateStatus('exploring garden');
        console.log('🌿 Garden experience begun');
    }
}

function updateStatus(message) {
    if (document.getElementById('statusText')) {
        document.getElementById('statusText').textContent = message;
    }
}

function updateDisplays() {
    // Update depth display
    if (document.getElementById('depthText')) {
        document.getElementById('depthText').textContent = Math.round(cameraZ / 10) + 'm';
    }
    
    // Update frequency levels
    if (document.getElementById('bassLevel')) {
        document.getElementById('bassLevel').textContent = Math.round(smoothedBass);
    }
    if (document.getElementById('midLevel')) {
        document.getElementById('midLevel').textContent = Math.round(smoothedMid);
    }
    if (document.getElementById('trebleLevel')) {
        document.getElementById('trebleLevel').textContent = Math.round(smoothedTreble);
    }
}

// Keyboard controls
function keyPressed() {
    if (key === ' ') {
        togglePlay();
        return false; // Prevent default browser behavior
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
