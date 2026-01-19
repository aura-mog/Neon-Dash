
// ==========================================
// NEON DASH - GAME ENGINE
// Reusable game mechanics for all levels
// ==========================================

class NeonDashGame {
    constructor(canvasId, levelData, levelLength, levelInfo) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.levelData = levelData;
        this.levelLength = levelLength;
        this.levelInfo = levelInfo; // { number: 1, name: "Neon Beginning" }
        
        // Game state
        this.player = {
            x: 180,
            y: 0,
            width: 40,
            height: 40,
            velocityY: 0,
            gravity: 0.8,
            jumpForce: -12, // Reduced from -15 for lower jumps
            jumpPadForce: -18, // Jump pad boost - 50% stronger!
            isJumping: false,
            rotation: 0
        };
        
        this.obstacles = [];
        this.platforms = [];
        this.particles = [];
        this.stars = [];
        this.floatingShapes = [];
        this.cameraX = 0;
        this.gameSpeed = 7;
        this.gameRunning = false;
        this.ground = 0;
        this.levelComplete = false;
        this.spacePressed = false;
        this.gamePaused = false;
        
        // Death effect
        this.deathEffectActive = false;
        this.deathEffectTimer = 0;
        this.screenShake = 0;
        
        // UI elements
        this.startScreen = document.getElementById('startScreen');
        this.gameOverScreen = document.getElementById('gameOver');
        this.scoreDisplay = document.getElementById('score');
        this.finalScoreDisplay = document.getElementById('finalScore');
        
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.ground = this.canvas.height - 100;
        this.player.y = this.ground - this.player.height;
        this.player.x = 180;
        this.obstacles = [];
        this.platforms = [];
        this.particles = [];
        this.cameraX = 0;
        this.gameSpeed = 7;
        this.levelComplete = false;
        
        // Create background stars
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.levelLength,
                y: Math.random() * (this.ground - 50),
                size: Math.random() * 2 + 1,
                brightness: Math.random(),
                twinkleSpeed: Math.random() * 0.05 + 0.02
            });
        }
        
        // Create floating shapes
        this.floatingShapes = [];
        for (let i = 0; i < 15; i++) {
            this.floatingShapes.push({
                x: Math.random() * this.levelLength,
                y: Math.random() * (this.ground - 100) + 50,
                size: Math.random() * 30 + 20,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 2,
                type: Math.random() > 0.5 ? 'triangle' : 'square',
                opacity: Math.random() * 0.3 + 0.1
            });
        }
        
        // Create obstacles from level data
        this.levelData.forEach(data => {
            if (data.type === 'spike') {
                this.obstacles.push({
                    x: data.x,
                    y: this.ground - 45, // Reduced from 60 - shorter spikes!
                    width: 40,
                    height: 45, // Reduced from 60
                    type: 'spike'
                });
            } else if (data.type === 'block') {
                const sizes = {
                    small: 40,
                    medium: 60,
                    large: 80
                };
                const height = sizes[data.size] || 50;
                const width = data.width || 40;
                this.obstacles.push({
                    x: data.x,
                    y: this.ground - height,
                    width: width,
                    height: height,
                    type: 'block'
                });
            } else if (data.type === 'platform') {
                this.platforms.push({
                    x: data.x,
                    y: this.ground - data.height,
                    width: data.width || 200,
                    height: 25
                });
            } else if (data.type === 'jumppad') {
                this.obstacles.push({
                    x: data.x,
                    y: this.ground - 15,
                    width: 60,
                    height: 15,
                    type: 'jumppad'
                });
            } else if (data.type === 'finish') {
                // Finish line is a big wall at the end
                this.obstacles.push({
                    x: data.x,
                    y: 0, // Starts at top of screen
                    width: 100,
                    height: this.ground, // Full screen height
                    type: 'finish'
                });
            }
        });
        
        this.updateProgress();
    }
    
    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (!this.gameRunning && !this.startScreen.classList.contains('hidden') && this.gameOverScreen.classList.contains('hidden')) {
                    // Do nothing, start screen is showing
                } else if (!this.gameRunning && !this.gameOverScreen.classList.contains('hidden')) {
                    // Restart game
                    this.restart();
                } else {
                    // Jump
                    if (!this.spacePressed) {
                        this.jump();
                        this.spacePressed = true;
                    }
                }
            } else if (e.code === 'Escape' || e.code === 'KeyP') {
                // Toggle pause
                if (this.gameRunning && !this.levelComplete) {
                    this.togglePause();
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                this.spacePressed = false;
            }
        });
        
        this.canvas.addEventListener('click', () => this.jump());
        
        document.getElementById('startBtn').addEventListener('click', () => {
            this.start();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restart();
        });
        
        document.getElementById('menuBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    start() {
        this.startScreen.classList.add('hidden');
        this.init();
        this.gameRunning = true;
        this.gameLoop();
    }
    
    restart() {
        this.gameOverScreen.classList.add('hidden');
        this.init();
        this.gameRunning = true;
        this.gameLoop();
    }
    
    togglePause() {
        this.gamePaused = !this.gamePaused;
        if (!this.gamePaused) {
            // Resume game loop
            this.gameLoop();
        }
    }
    
    jump() {
        if (!this.player.isJumping && this.gameRunning && !this.levelComplete) {
            this.player.velocityY = this.player.jumpForce;
            this.player.isJumping = true;
        }
    }
    
    createParticles(x, y, color, count = 15) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                velocityX: (Math.random() - 0.5) * 10,
                velocityY: (Math.random() - 0.5) * 10,
                size: Math.random() * 5 + 2,
                color: color,
                life: 40
            });
        }
    }
    
    update() {
        if (!this.gameRunning || this.gamePaused) return;
        
        // Update camera
        // Stop camera when finish line is at right edge (like real Geometry Dash)
        const maxCameraX = this.levelLength - this.canvas.width;
        if (this.cameraX < maxCameraX) {
            this.cameraX += this.gameSpeed;
        } else {
            // Camera is locked - move player forward instead!
            this.player.x += this.gameSpeed;
        }
        
        // Update player
        this.player.velocityY += this.player.gravity;
        this.player.y += this.player.velocityY;
        
        // Ground collision
        let onPlatform = false;
        let justLanded = false;
        let wasOnPlatform = !this.player.isJumping; // Track if player was on ground/platform last frame
        
        // Check platform collisions
        this.platforms.forEach(platform => {
            const screenX = platform.x - this.cameraX;
            
            // Landing on top
            if (
                this.player.x + this.player.width > screenX &&
                this.player.x < screenX + platform.width &&
                this.player.y + this.player.height >= platform.y - 10 &&
                this.player.y + this.player.height <= platform.y + 25 &&
                this.player.velocityY >= 0
            ) {
                this.player.y = platform.y - this.player.height;
                this.player.velocityY = 0;
                this.player.isJumping = false;
                this.player.rotation = 0;
                onPlatform = true;
                justLanded = true;
            }
            
            // Hitting from below
            if (
                this.player.x + this.player.width > screenX &&
                this.player.x < screenX + platform.width &&
                this.player.y < platform.y + platform.height &&
                this.player.y + this.player.height > platform.y + platform.height &&
                this.player.velocityY < 0
            ) {
                this.player.y = platform.y + platform.height;
                this.player.velocityY = 0;
            }
        });
        
        // Check block collisions
        this.obstacles.forEach(obstacle => {
            const screenX = obstacle.x - this.cameraX;
            if (obstacle.type === 'block') {
                // Landing on top
                if (
                    this.player.x + this.player.width > screenX &&
                    this.player.x < screenX + obstacle.width &&
                    this.player.y + this.player.height >= obstacle.y - 10 &&
                    this.player.y + this.player.height <= obstacle.y + 15 &&
                    this.player.velocityY >= 0
                ) {
                    this.player.y = obstacle.y - this.player.height;
                    this.player.velocityY = 0;
                    this.player.isJumping = false;
                    this.player.rotation = 0;
                    onPlatform = true;
                    justLanded = true;
                }
                
                // Hitting from below
                if (
                    this.player.x + this.player.width > screenX &&
                    this.player.x < screenX + obstacle.width &&
                    this.player.y < obstacle.y + obstacle.height &&
                    this.player.y + this.player.height > obstacle.y + obstacle.height &&
                    this.player.velocityY < 0
                ) {
                    this.player.y = obstacle.y + obstacle.height;
                    this.player.velocityY = 0;
                }
            }
        });
        
        // Ground collision
        if (!onPlatform && this.player.y >= this.ground - this.player.height) {
            this.player.y = this.ground - this.player.height;
            this.player.velocityY = 0;
            this.player.isJumping = false;
            this.player.rotation = 0;
            justLanded = true;
        } else if (!onPlatform && this.player.y < this.ground - this.player.height) {
            this.player.rotation += 5;
            // If player was on platform/ground last frame but isn't now, they're falling
            if (wasOnPlatform) {
                this.player.isJumping = true;
            }
        }
        
        // Instant bounce when holding space and landing
        if (justLanded && this.spacePressed) {
            this.player.velocityY = this.player.jumpForce;
            this.player.isJumping = true;
        }
        
        // Check obstacle collisions
        this.obstacles.forEach(obstacle => {
            const screenX = obstacle.x - this.cameraX;
            
            if (obstacle.type === 'finish') {
                // Magnetic pull effect when close to finish
                const distanceToFinish = screenX - this.player.x;
                if (distanceToFinish < 300 && distanceToFinish > 0) {
                    // Pull player toward finish (stronger as you get closer)
                    const pullStrength = (300 - distanceToFinish) / 300;
                    this.player.x += pullStrength * 2;
                    
                    // Create portal particles
                    if (Math.random() < 0.3) {
                        this.createParticles(screenX + 50, Math.random() * this.ground, '#00ff00', 2);
                    }
                }
                
                // Check if player reached finish
                if (
                    this.player.x + this.player.width > screenX &&
                    this.player.x < screenX + obstacle.width
                ) {
                    this.levelComplete = true;
                    this.gameRunning = false;
                    this.createParticles(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, '#00ffff', 30);
                    this.createParticles(screenX + 50, this.ground / 2, '#00ff00', 50);
                    
                    // Save completion and increment attempts
                    const savedProgress = JSON.parse(localStorage.getItem('neonDashProgress')) || {
                        level1: { bestProgress: 0, attempts: 0, completed: false }
                    };
                    const levelKey = 'level' + this.levelInfo.number;
                    if (!savedProgress[levelKey]) savedProgress[levelKey] = { bestProgress: 0, attempts: 0, completed: false };
                    savedProgress[levelKey].bestProgress = 100;
                    savedProgress[levelKey].completed = true;
                    savedProgress[levelKey].attempts++; // Count completion as an attempt
                    localStorage.setItem('neonDashProgress', JSON.stringify(savedProgress));
                    
                    this.finalScoreDisplay.textContent = 'LEVEL COMPLETE!';
                    setTimeout(() => {
                        this.gameOverScreen.classList.remove('hidden');
                    }, 500);
                }
            } else {
                let collided = false;
                
                if (obstacle.type === 'jumppad') {
                    // Jump pad - boost player when landing on it
                    if (
                        this.player.x + this.player.width > screenX &&
                        this.player.x < screenX + obstacle.width &&
                        this.player.y + this.player.height >= obstacle.y - 5 &&
                        this.player.y + this.player.height <= obstacle.y + obstacle.height + 5 &&
                        this.player.velocityY >= 0
                    ) {
                        // BOOST!
                        this.player.velocityY = this.player.jumpPadForce;
                        this.player.isJumping = true;
                        // Create boost effect
                        this.createParticles(this.player.x + this.player.width / 2, obstacle.y, '#ffff00', 15);
                        onPlatform = true; // Prevent falling through
                    }
                } else if (obstacle.type === 'spike') {
                    // Tighter hitbox excluding glow
                    const spikeLeft = screenX + 5;
                    const spikeRight = screenX + obstacle.width - 5;
                    const spikeTop = obstacle.y + 5;
                    const spikeBottom = obstacle.y + obstacle.height;
                    
                    if (
                        this.player.x + 5 < spikeRight &&
                        this.player.x + this.player.width - 5 > spikeLeft &&
                        this.player.y + 5 < spikeBottom &&
                        this.player.y + this.player.height - 5 > spikeTop
                    ) {
                        collided = true;
                    }
                } else if (obstacle.type === 'block') {
                    const isLandingOnTop = 
                        this.player.y + this.player.height >= obstacle.y - 10 &&
                        this.player.y + this.player.height <= obstacle.y + 15 &&
                        this.player.velocityY >= 0;
                    
                    if (
                        this.player.x < screenX + obstacle.width &&
                        this.player.x + this.player.width > screenX &&
                        this.player.y < obstacle.y + obstacle.height &&
                        this.player.y + this.player.height > obstacle.y &&
                        !isLandingOnTop
                    ) {
                        collided = true;
                    }
                }
                
                if (collided) {
                    this.gameRunning = false;
                    this.deathEffectActive = true;
                    this.deathEffectTimer = 30; // 30 frames of effect
                    this.screenShake = 15;
                    
                    // Explosion effect - way more particles!
                    this.createParticles(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, '#ff00ff', 40);
                    this.createParticles(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, '#00ffff', 30);
                    
                    // Increment attempts on death
                    const savedProgress = JSON.parse(localStorage.getItem('neonDashProgress')) || {};
                    const levelKey = 'level' + this.levelInfo.number;
                    if (!savedProgress[levelKey]) {
                        savedProgress[levelKey] = { bestProgress: 0, attempts: 0, completed: false };
                    }
                    savedProgress[levelKey].attempts++;
                    localStorage.setItem('neonDashProgress', JSON.stringify(savedProgress));
                    
                    this.finalScoreDisplay.textContent = 'GAME OVER';
                    setTimeout(() => {
                        this.gameOverScreen.classList.remove('hidden');
                    }, 500); // Longer delay to see death effect
                }
            }
        });
        
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].x += this.particles[i].velocityX;
            this.particles[i].y += this.particles[i].velocityY;
            this.particles[i].velocityY += 0.3;
            this.particles[i].life--;
            
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // Update death effect
        if (this.deathEffectActive) {
            this.deathEffectTimer--;
            this.screenShake *= 0.85; // Reduce shake over time
            if (this.deathEffectTimer <= 0) {
                this.deathEffectActive = false;
                this.screenShake = 0;
            }
        }
        
        // Update stars
        this.stars.forEach(star => {
            star.brightness += star.twinkleSpeed;
            if (star.brightness > 1 || star.brightness < 0) {
                star.twinkleSpeed *= -1;
            }
        });
        
        // Update shapes
        this.floatingShapes.forEach(shape => {
            shape.rotation += shape.rotationSpeed;
        });
        
        this.updateProgress();
    }
    
    draw() {
        // Apply screen shake if active
        if (this.deathEffectActive && this.screenShake > 0) {
            this.ctx.save();
            const shakeX = (Math.random() - 0.5) * this.screenShake;
            const shakeY = (Math.random() - 0.5) * this.screenShake;
            this.ctx.translate(shakeX, shakeY);
        }
        
        // Clear
        this.ctx.fillStyle = 'rgba(0, 8, 20, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars
        this.stars.forEach(star => {
            const screenX = star.x - this.cameraX;
            if (screenX > -10 && screenX < this.canvas.width + 10) {
                this.ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
                this.ctx.fillRect(screenX, star.y, star.size, star.size);
            }
        });
        
        // Draw floating shapes
        this.floatingShapes.forEach(shape => {
            const screenX = shape.x - this.cameraX * 0.5;
            if (screenX > -shape.size && screenX < this.canvas.width + shape.size) {
                this.ctx.save();
                this.ctx.translate(screenX, shape.y);
                this.ctx.rotate((shape.rotation * Math.PI) / 180);
                this.ctx.globalAlpha = shape.opacity;
                
                if (shape.type === 'triangle') {
                    this.ctx.strokeStyle = '#ff00ff';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, -shape.size / 2);
                    this.ctx.lineTo(shape.size / 2, shape.size / 2);
                    this.ctx.lineTo(-shape.size / 2, shape.size / 2);
                    this.ctx.closePath();
                    this.ctx.stroke();
                } else {
                    this.ctx.strokeStyle = '#00ffff';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
                }
                
                this.ctx.restore();
                this.ctx.globalAlpha = 1;
            }
        });
        
        // Draw grid
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.canvas.width; i += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(i - (this.cameraX % 40), 0);
            this.ctx.lineTo(i - (this.cameraX % 40), this.canvas.height);
            this.ctx.stroke();
        }
        
        // Draw ground
        this.ctx.fillStyle = '#ff00ff';
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = '#ff00ff';
        this.ctx.fillRect(0, this.ground, this.canvas.width, 5);
        this.ctx.shadowBlur = 0;
        
        const lineOffset = this.cameraX % 40;
        this.ctx.strokeStyle = '#00ffff';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < this.canvas.width; i += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(i - lineOffset, this.ground + 10);
            this.ctx.lineTo(i + 20 - lineOffset, this.ground + 10);
            this.ctx.stroke();
        }
        
        // Draw platforms
        this.platforms.forEach(platform => {
            const screenX = platform.x - this.cameraX;
            if (screenX > -platform.width && screenX < this.canvas.width) {
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = '#00ffff';
                this.ctx.fillStyle = '#00ffff';
                this.ctx.fillRect(screenX, platform.y, platform.width, platform.height);
                
                this.ctx.shadowBlur = 0;
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(screenX + 5, platform.y + 5, platform.width - 10, platform.height - 10);
            }
        });
        
        // Draw obstacles
        this.obstacles.forEach(obstacle => {
            const screenX = obstacle.x - this.cameraX;
            if (screenX > -obstacle.width && screenX < this.canvas.width) {
                if (obstacle.type === 'spike') {
                    this.ctx.shadowBlur = 20;
                    this.ctx.shadowColor = '#ff00ff';
                    this.ctx.fillStyle = '#ff00ff';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX + obstacle.width / 2, obstacle.y);
                    this.ctx.lineTo(screenX, obstacle.y + obstacle.height);
                    this.ctx.lineTo(screenX + obstacle.width, obstacle.y + obstacle.height);
                    this.ctx.closePath();
                    this.ctx.fill();
                } else if (obstacle.type === 'block') {
                    this.ctx.shadowBlur = 20;
                    this.ctx.shadowColor = '#ff00ff';
                    this.ctx.fillStyle = '#ff00ff';
                    this.ctx.fillRect(screenX, obstacle.y, obstacle.width, obstacle.height);
                    
                    this.ctx.shadowBlur = 0;
                    this.ctx.fillStyle = '#000';
                    this.ctx.fillRect(screenX + 5, obstacle.y + 5, obstacle.width - 10, obstacle.height - 10);
                } else if (obstacle.type === 'jumppad') {
                    // Draw jump pad - yellow with arrows
                    this.ctx.shadowBlur = 25;
                    this.ctx.shadowColor = '#ffff00';
                    this.ctx.fillStyle = '#ffff00';
                    this.ctx.fillRect(screenX, obstacle.y, obstacle.width, obstacle.height);
                    
                    // Draw arrow pattern
                    this.ctx.shadowBlur = 0;
                    this.ctx.fillStyle = '#000';
                    const arrowSize = 8;
                    for (let i = 0; i < 3; i++) {
                        const arrowX = screenX + 10 + i * 20;
                        this.ctx.beginPath();
                        this.ctx.moveTo(arrowX, obstacle.y + 10);
                        this.ctx.lineTo(arrowX - arrowSize, obstacle.y + 3);
                        this.ctx.lineTo(arrowX + arrowSize, obstacle.y + 3);
                        this.ctx.closePath();
                        this.ctx.fill();
                    }
                } else if (obstacle.type === 'finish') {
                    // Draw finish portal - big glowing wall
                    const time = Date.now() / 1000;
                    
                    // Outer glow
                    this.ctx.shadowBlur = 50;
                    this.ctx.shadowColor = '#00ff00';
                    
                    // Main portal wall - gradient
                    const gradient = this.ctx.createLinearGradient(screenX, 0, screenX + obstacle.width, 0);
                    gradient.addColorStop(0, 'rgba(0, 255, 0, 0.3)');
                    gradient.addColorStop(0.5, 'rgba(0, 255, 100, 0.8)');
                    gradient.addColorStop(1, 'rgba(0, 255, 0, 0.3)');
                    this.ctx.fillStyle = gradient;
                    this.ctx.fillRect(screenX, obstacle.y, obstacle.width, obstacle.height);
                    
                    // Animated vertical lines (portal effect)
                    this.ctx.shadowBlur = 0;
                    this.ctx.strokeStyle = '#00ff00';
                    this.ctx.lineWidth = 3;
                    for (let i = 0; i < 5; i++) {
                        const lineY = (time * 200 + i * 100) % obstacle.height;
                        this.ctx.beginPath();
                        this.ctx.moveTo(screenX, lineY);
                        this.ctx.lineTo(screenX + obstacle.width, lineY);
                        this.ctx.stroke();
                    }
                    
                    // Center bright line
                    this.ctx.strokeStyle = '#ffffff';
                    this.ctx.lineWidth = 5;
                    this.ctx.globalAlpha = 0.5 + Math.sin(time * 5) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX + obstacle.width / 2, 0);
                    this.ctx.lineTo(screenX + obstacle.width / 2, obstacle.height);
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1;
                }
                this.ctx.shadowBlur = 0;
            }
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life / 40;
            this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        });
        this.ctx.globalAlpha = 1;
        
        // Draw player
        this.ctx.save();
        this.ctx.translate(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
        this.ctx.rotate((this.player.rotation * Math.PI) / 180);
        
        this.ctx.shadowBlur = 30;
        this.ctx.shadowColor = '#00ffff';
        this.ctx.fillStyle = '#00ffff';
        this.ctx.fillRect(-this.player.width / 2, -this.player.height / 2, this.player.width, this.player.height);
        
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(-this.player.width / 2 + 5, -this.player.height / 2 + 5, this.player.width - 10, this.player.height - 10);
        
        this.ctx.restore();
        
        // Death flash effect
        if (this.deathEffectActive && this.deathEffectTimer > 15) {
            const flashAlpha = (this.deathEffectTimer - 15) / 15; // Fade from 1 to 0
            this.ctx.fillStyle = `rgba(255, 0, 100, ${flashAlpha * 0.4})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // Restore screen shake transform if active
        if (this.deathEffectActive && this.screenShake > 0) {
            this.ctx.restore();
        }
        
        // Draw pause overlay
        if (this.gamePaused && this.gameRunning) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.font = '72px Orbitron';
            this.ctx.fillStyle = '#ff00ff';
            this.ctx.shadowBlur = 30;
            this.ctx.shadowColor = '#ff00ff';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2 - 40);
            
            this.ctx.font = '24px Rajdhani';
            this.ctx.fillStyle = '#00ffff';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#00ffff';
            this.ctx.fillText('Press ESC or P to Resume', this.canvas.width / 2, this.canvas.height / 2 + 40);
            
            this.ctx.shadowBlur = 0;
            this.ctx.textAlign = 'left';
        }
    }
    
    updateProgress() {
        const progress = Math.min(100, Math.floor((this.cameraX / this.levelLength) * 100));
        this.scoreDisplay.textContent = progress + '%';
        
        // Save best progress
        const savedProgress = JSON.parse(localStorage.getItem('neonDashProgress')) || {};
        const levelKey = 'level' + this.levelInfo.number;
        if (!savedProgress[levelKey]) {
            savedProgress[levelKey] = { bestProgress: 0, attempts: 0, completed: false };
        }
        
        if (progress > savedProgress[levelKey].bestProgress) {
            savedProgress[levelKey].bestProgress = progress;
            localStorage.setItem('neonDashProgress', JSON.stringify(savedProgress));
        }
    }
    
    gameLoop() {
        this.update();
        this.draw();
        // Only continue loop if game is running AND not paused
        if (this.gameRunning && !this.gamePaused) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }
}
