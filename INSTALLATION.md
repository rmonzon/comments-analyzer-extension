# Installation Guide - YouTube Comment Sentiment Analyzer

## Quick Start

1. **Download the Extension**
   - Download or clone this `youtube-sentiment-extension` folder to your computer

2. **Create Icon Files** (Required)
   - Open `icons/create-icons.html` in your web browser
   - Click the download buttons to save the three icon files:
     - `icon16.png` (16x16 pixels)
     - `icon48.png` (48x48 pixels) 
     - `icon128.png` (128x128 pixels)
   - Save these files in the `icons/` folder

3. **Load Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `youtube-sentiment-extension` folder
   - The extension should now appear in your extensions list

4. **Test the Extension**
   - Go to any YouTube video page (e.g., `youtube.com/watch?v=dQw4w9WgXcQ`)
   - Click the extension icon in your Chrome toolbar
   - Click "Analyze Comments" to test the functionality

## Troubleshooting

**Extension won't load:**
- Make sure all files are present, especially the icon PNG files
- Check that `manifest.json` is valid JSON
- Ensure Developer mode is enabled

**"Not on YouTube" message:**
- Make sure you're on a YouTube video page (URL contains `/watch?v=` or `/shorts/`)
- Try refreshing the YouTube page

**API errors:**
- Check your internet connection
- The API endpoints should be accessible at `commentsanalyzer.info`

## File Structure Check

Your extension folder should contain:
```
youtube-sentiment-extension/
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── background.js
├── styles.css
├── README.md
├── INSTALLATION.md
└── icons/
    ├── create-icons.html
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Next Steps

Once installed, the extension will:
1. Detect when you're on YouTube video pages
2. Show an "Analyze Comments" button when clicked
3. Fetch comments and perform sentiment analysis
4. Display results with visual sentiment breakdown

Enjoy analyzing YouTube comment sentiment! 🎉
