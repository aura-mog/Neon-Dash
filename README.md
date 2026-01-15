# NEON DASH - Modular Game System

## 🎮 Files Overview

### Core Files (DO NOT DELETE):
- **game-engine.js** - All game physics, mechanics, collision detection, rendering
- **index.html** - Homepage with level selection and progress tracking

### Level Files:
- **level1.html** - Level 1: Neon Beginning
- **LEVEL_TEMPLATE.html** - Copy this to create new levels!

---

## 🚀 How to Create a New Level

### Method 1: Quick (Copy Template)
1. Copy `LEVEL_TEMPLATE.html`
2. Rename it to `level2.html` (or level3, level4, etc.)
3. Edit the level data inside (see below)
4. Upload to GitHub
5. Update homepage to link to new level

### Method 2: Details

**Step 1: Copy the template**
```
LEVEL_TEMPLATE.html → level2.html
```

**Step 2: Update the title and level info**
Change these lines:
```html
<title>Level 2 - YOUR NAME</title>
<h1>LEVEL 2</h1>
<div class="subtitle">YOUR LEVEL NAME</div>
<div>Difficulty: ★★★☆☆</div>
```

**Step 3: Design your level**
Edit the `levelXData` array:
```javascript
const level2Data = [
    { x: 800, type: 'spike' },
    { x: 1200, type: 'block', width: 120 },
    { x: 2000, type: 'platform', height: 150, width: 240 },
    // ... add more obstacles
    { x: 10000, type: 'finish' }
];
```

**Step 4: Set level length**
```javascript
const levelLength = 10200; // About 200px past your finish line
```

**Step 5: Update game initialization**
```javascript
const game = new NeonDashGame(
    'gameCanvas',
    level2Data,        // Your level data
    levelLength,       // Your level length
    { number: 2, name: 'Cyber Rush' } // Level number and name
);
```

**Done!** Your level is ready to play!

---

## 📐 Obstacle Reference

### Spike
```javascript
{ x: 800, type: 'spike' }
```
- Width: 40px
- Height: 45px (shorter than before!)
- Deadly from all sides
- Place 40px apart to make them touch (e.g., x: 800, x: 840)

### Block
```javascript
{ x: 1200, type: 'block', width: 120 }
```
- Width: Custom (default 40px)
- Height: 50px (or use size: 'small', 'medium', 'large')
- Can land on top
- Deadly from sides/bottom

### Platform
```javascript
{ x: 3500, type: 'platform', height: 150, width: 240 }
```
- Width: Custom (default 200px)
- Height: Distance from ground
- Can land on top
- Can't glitch through from below

### Small Platform
```javascript
{ x: 4000, type: 'small_platform', height: 120, width: 140 }
```
- Width: Custom (default 140px - narrower than regular platform)
- Height: Distance from ground
- Perfect for tighter jumps
- Same mechanics as regular platform

### Finish Line
```javascript
{ x: 10000, type: 'finish' }
```
- Always at the end
- Green checkered pattern
- Completes the level

---

## 🔧 Game Physics (In game-engine.js)

### Player Stats:
- **Jump Force**: -12 (reduced from -15 for shorter jumps)
- **Gravity**: 0.8
- **Speed**: 7 pixels/frame
- **Size**: 40x40 pixels
- **Position**: x: 180 (more centered)

### Spike Stats:
- **Height**: 45px (reduced from 60px - more like real Geometry Dash!)
- **Width**: 40px
- **Hitbox**: 5px inset (excludes glow)

### To Change Physics:
1. Open `game-engine.js`
2. Find the values in the constructor (lines ~15-25)
3. Edit and save
4. Upload to GitHub
5. **All levels automatically use new physics!**

---

## 💾 Progress Tracking

Progress is saved automatically to localStorage:
- Best progress percentage
- Number of attempts
- Completion status

Accessed by both level files and homepage.

---

## 📁 Upload to GitHub

**Upload these files to your repository:**
1. `game-engine.js` (REQUIRED for all levels)
2. `index.html` (homepage)
3. `level1.html`
4. `level2.html` (when you create it)
5. Any other level files

**All files must be in the same folder!**

---

## 🎯 Tips for Level Design

1. **Start Easy**: First 3-5 obstacles should be simple (300-400px apart)
2. **Build Difficulty**: Gradually reduce spacing
3. **Test Jumps**: Make sure everything is possible!
4. **Use Variety**: Mix spikes, blocks, and platforms
5. **Platform Sections**: Put 2-3 ground spikes before platforms (forces player to use them)
6. **Spacing Guide**:
   - Easy: 400-500px between obstacles
   - Medium: 250-350px
   - Hard: 150-250px
   - Very Hard: 80-150px

---

## 🐛 Common Issues

**404 Error**: Make sure `game-engine.js` is in the same folder as level files

**Physics feel wrong**: Edit values in `game-engine.js` constructor

**Progress not saving**: Check localStorage isn't disabled in browser

**Level too hard/easy**: Adjust obstacle spacing in level data array

---

## 🎨 Future Ideas

Want to add new mechanics? Edit `game-engine.js`:
- Moving platforms
- Speed boosters
- Gravity flips
- Power-ups
- Enemies
- Different player skins

Add the mechanic once → works in ALL levels!

---

Made with ❤️ for easy level creation!
