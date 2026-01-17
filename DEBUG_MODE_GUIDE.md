# 🐛 DEBUG MODE - Complete Usage Guide

## What is DEBUG MODE?

DEBUG MODE is a special testing version of your game that lets you **instantly skip to any part of the level** without playing through it. This is ESSENTIAL for testing long levels!

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get the Files

Download these 3 files to the SAME folder on your computer:
- `game-engine.js`
- `DEBUG_MODE.html`
- Your level data (from level1.html)

### Step 2: Configure DEBUG_MODE.html

Open `DEBUG_MODE.html` in a text editor (Notepad, VS Code, etc.)

**Find this section:**
```javascript
// PASTE YOUR LEVEL DATA HERE
const debugLevelData = [
    // Example - replace with your actual level data
    { x: 800, type: 'spike' },
    // ...
];
```

**Open your level1.html** and copy the ENTIRE `level1Data` array

**Paste it** into DEBUG_MODE.html, replacing the example data

**Example:**
```javascript
const debugLevelData = [
    // Section 1: Tutorial
    { x: 800, type: 'spike' },
    { x: 1200, type: 'spike' },
    { x: 1600, type: 'block', width: 100 },
    
    // ... paste ALL your obstacles here ...
    
    { x: 17000, type: 'finish' }
];
```

### Step 3: Set Level Length

Find this line:
```javascript
const debugLevelLength = 10200;
```

Change it to match YOUR level length:
```javascript
const debugLevelLength = 17200;  // Must match your actual level!
```

### Step 4: Save and Test

1. Save `DEBUG_MODE.html`
2. Double-click it to open in browser
3. You should see the game with debug controls at the bottom!

---

## 🎮 How to Use DEBUG MODE

### Method 1: Quick Jump Buttons

Click any button to instantly skip to that position:

- **Start (0%)** - Beginning of level
- **25%** - Quarter way through
- **50%** - Halfway
- **75%** - Three quarters
- **90%** - Near the end
- **95%** - Very close to finish
- **98%** - Right before finish line

**Example Usage:**
```
Problem: You added obstacles at 85% and want to test them

Solution:
1. Click "75%" button
2. Play for 10 seconds
3. You reach 85% and can test your new obstacles!
```

### Method 2: Custom Percent (BEST!)

Want to skip to **exactly** 62%? Or 88%? Use the custom input!

**How:**
1. Type a number in the "Custom %" field
2. Click "GO" (or press Enter)
3. Instantly jump to that position!

**Examples:**
- Type `43` → Click GO → Start at 43%
- Type `97` → Press Enter → Start at 97%
- Type `5` → Start at 5% (test early obstacles)

**Pro Tips:**
- Use this to test SPECIFIC sections
- If you know obstacle is at x:15000 and level is 17200 long:
  - (15000 / 17200) * 100 = 87%
  - Type `87` and GO!

---

## 🎯 Real-World Examples

### Example 1: Testing the Finish Line

**Problem:** Your level is 17,000 pixels long. You want to test the finish line.

**Solution:**
```
1. Open DEBUG_MODE.html
2. Type "98" in Custom %
3. Click GO
4. You're now at x:16,864 (98% of 17,200)
5. Play for 5 seconds
6. Reach finish line and test!
```

**Without DEBUG MODE:** Would take 3-5 minutes to play through entire level each time!

---

### Example 2: Testing a Specific Jump

**Problem:** You added a tricky jump at 60% and want to test if it's possible.

**Solution:**
```
1. Type "55" in Custom %
2. Click GO
3. Start at 55%
4. Play to 60%
5. Test your jump!
6. Too hard? Adjust obstacle, save, refresh (F5)
7. Click "55%" again, test again!
```

**Iteration time:** 10 seconds per test instead of 2 minutes!

---

### Example 3: Testing Multiple Sections Quickly

**Problem:** You made changes at 30%, 65%, and 90%. Need to test all three.

**Solution:**
```
1. Type "25", GO → Test 30% section
2. Type "60", GO → Test 65% section  
3. Type "85", GO → Test 90% section
4. Total time: 1 minute instead of 15 minutes!
```

---

## 🔧 Advanced Usage

### Finding Exact Positions

**Want to know what percent a specific obstacle is at?**

Formula: `(obstacle_x / level_length) * 100`

**Example:**
```
Obstacle at x: 12,500
Level length: 17,200
Percent: (12500 / 17200) * 100 = 72.67%

Type "72" or "73" in custom input!
```

### Testing Obstacle Spacing

**Want to test if two obstacles are too close?**

```
1. Find obstacle positions: x:5000 and x:5200
2. Calculate percent: 5000/17200 = 29%
3. Type "28", GO
4. Play and see if jumps feel right
5. Adjust spacing if needed
6. Save, F5, type "28" again!
```

### Testing Platform Sections

**Have a platform gauntlet from 40% to 50%?**

```
1. Type "38", GO (start before section)
2. Build up speed
3. Test platform jumps with proper momentum
4. Die? Type "38" again instantly!
```

---

## 🎮 Workflow: Making a New Level

**Old way (no debug mode):**
```
1. Add 10 obstacles
2. Commit to GitHub
3. Wait 1 minute for deployment
4. Play from start
5. Reach new obstacles at 90% after 3 minutes
6. Find bug
7. Go back to step 1
Time: 4+ minutes per iteration
```

**New way (with debug mode):**
```
1. Add 10 obstacles
2. Save file
3. Refresh DEBUG_MODE.html (press F5)
4. Type "88", GO
5. Test new obstacles in 5 seconds
6. Find bug, fix it
7. Save, F5, type "88" again
Time: 10 seconds per iteration!
```

**You can test 24x faster!** 🚀

---

## 💡 Pro Tips

### Tip 1: Keep DEBUG_MODE Open

Always have DEBUG_MODE.html open in one browser tab while editing:
```
Tab 1: Text editor with level1.html
Tab 2: DEBUG_MODE.html for testing
Tab 3: Your actual level1.html for final testing
```

### Tip 2: Test Backwards

Don't test from 0% → 100%
Test from 100% → 0%!

```
1. Test finish line first (98%)
2. Work backwards to 75%
3. Then 50%
4. Then 25%
5. Finally test from start

Why? Catch end-game bugs first!
```

### Tip 3: Muscle Memory Testing

Testing a hard jump? Do it 10 times:

```
1. Type "55", GO
2. Try jump
3. Die? Type "55", GO
4. Try again
5. Repeat until you can do it consistently
6. If you can't, it's too hard!
```

### Tip 4: Compare Before/After

Testing a change?

```
Before change:
1. Type "60", GO → Test → Note how it feels
2. Make change
3. Save, F5
4. Type "60", GO → Test again
5. Compare! Better? Worse?
```

### Tip 5: Use Browser Bookmarks

Bookmark DEBUG_MODE.html with a simple name like "Test Game"
One click and you're testing!

---

## 🐛 Troubleshooting

### "Nothing happens when I click buttons"

**Cause:** Level data or levelLength not set correctly

**Fix:**
1. Check console (F12 → Console tab)
2. Make sure `debugLevelData` has obstacles
3. Make sure `debugLevelLength` is a number

---

### "Game starts but obstacles are wrong"

**Cause:** Level data is outdated

**Fix:**
1. Copy level data from level1.html AGAIN
2. Paste into DEBUG_MODE.html
3. Save and refresh

---

### "Can't type in Custom % field"

**Cause:** Browser focus issue

**Fix:**
1. Click inside the input field
2. Make sure you clicked "START TESTING" first
3. If still broken, refresh page

---

### "Game is offset/weird"

**Cause:** levelLength doesn't match actual level

**Fix:**
1. Check your finish line: `{ x: 17000, type: 'finish' }`
2. Set debugLevelLength to: 17000 + 200 = 17200
3. Save and refresh

---

## 📋 Checklist: Am I Ready?

Before using DEBUG MODE, check:

- [ ] All 3 files in same folder (game-engine.js, DEBUG_MODE.html, level data)
- [ ] Level data copied from level1.html
- [ ] debugLevelLength matches my level length
- [ ] File saved
- [ ] Opened in browser

If all checked ✅ → You're ready!

---

## 🎯 Quick Reference

**Skip to start:** Click "Start (0%)"
**Skip to middle:** Click "50%"
**Skip to end:** Click "98%" or type "98" and GO
**Skip to custom:** Type percent, press Enter or click GO
**Pause game:** Press ESC or P key
**Restart from same spot:** Just click the button again!

---

## ❓ FAQ

**Q: Does DEBUG MODE save my progress?**
A: No! It's only for testing. Use your real level1.html for playing.

**Q: Can I share DEBUG_MODE with friends?**
A: Yes! But they'll need the game-engine.js file too.

**Q: Should I commit DEBUG_MODE to GitHub?**
A: NO! It's only for local testing. Your friends use the regular game.

**Q: Can I use DEBUG MODE for level 2, 3, etc?**
A: Yes! Just paste level2Data instead of level1Data.

**Q: What if I make a typo in the custom percent?**
A: It will show an alert. Just fix it and try again!

**Q: Can I skip past 100%?**
A: No, it caps at 100% (the end of the level)

**Q: Does pause work in DEBUG MODE?**
A: Yes! Press ESC or P anytime.

---

## 🎮 Practice Exercise

Try this right now:

1. Open DEBUG_MODE.html
2. Click "50%"
3. Play until you die
4. Type "50" in custom input
5. Press Enter
6. Notice how FAST you can retry!

**Time saved: 1-2 minutes per test!**

Over 100 tests → **Save 2-3 HOURS of testing time!**

---

## 🚀 Next Steps

Now that you know how to use DEBUG MODE:

1. Use it every time you edit your level
2. Test sections as you build them
3. Find bugs 10x faster
4. Make better levels in less time!

**Remember:** Local testing + DEBUG MODE = Game development superpowers! 💪

---

Need help? Stuck on something? Let me know!
