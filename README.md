# YouTube Comment Sentiment Analyzer

A Chrome extension that analyzes the sentiment of YouTube video comments using AI. Get an instant summary and insights into the emotional tone of comments on any YouTube video.

For more info, visit https://commentsanalyzer.info/

## Features

- 🎯 **Smart Detection**: Automatically detects YouTube video pages (regular videos and Shorts)
- 📊 **Sentiment Analysis**: Analyzes comment sentiment with positive, negative, and neutral classifications
- 📈 **Visual Results**: Clean, modern interface with sentiment breakdowns and progress bars
- ⚡ **Real-time Analysis**: Fast API integration with loading states and progress indicators
- 🔄 **Refresh Option**: Force refresh analysis for updated results
- 🎨 **Modern Design**: Clean, YouTube-themed interface optimized for extension popup

## Screenshots
![screenshot-1](https://github.com/user-attachments/assets/2862262e-3427-465b-8baf-a8d99a18c041)

## Installation

### Method 1: Load as Unpacked Extension (Development)

1. **Download/Clone** this repository to your local machine
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** by toggling the switch in the top-right corner
4. **Click "Load unpacked"** and select the `youtube-sentiment-extension` folder
5. **Generate Icons** (optional): Open `icons/create-icons.html` in your browser and download the generated PNG files to the `icons/` folder

### Method 2: Create Icons (Required for full functionality)

The extension requires icon files. You can either:

**Option A: Use the Icon Generator**
1. Open `youtube-sentiment-extension/icons/create-icons.html` in your browser
2. Click the download buttons to save `icon16.png`, `icon48.png`, and `icon128.png`
3. Place these files in the `icons/` folder

**Option B: Use Your Own Icons**
- Create PNG files: `icon16.png` (16x16), `icon48.png` (48x48), `icon128.png` (128x128)
- Place them in the `icons/` folder

## Usage

1. **Navigate to YouTube**: Go to any YouTube video page (regular video or Short)
2. **Click the Extension Icon**: Look for the YouTube Sentiment Analyzer icon in your Chrome toolbar
3. **Analyze Comments**: Click the "Analyze Comments" button in the popup
4. **View Results**: See sentiment breakdown with percentages and summary

### Supported Pages

- ✅ YouTube video pages (`youtube.com/watch?v=VIDEO_ID`)
- ✅ YouTube Shorts (`youtube.com/shorts/VIDEO_ID`)
- ❌ YouTube homepage, search results, channel pages, etc.

## API Integration

This extension integrates with the CommentsAnalyzer API:

- **Comments Endpoint**: `GET https://commentsanalyzer.info/api/youtube/video?videoId={videoId}`
- **Analysis Endpoint**: `POST https://commentsanalyzer.info/api/youtube/summarize`

### API Request Format

```json
{
  "videoId": "VIDEO_ID_HERE",
  "forceRefresh": false
}
```

## File Structure

```
youtube-sentiment-extension/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup interface
├── popup.js               # Main popup logic and API integration
├── content.js             # YouTube page detection and video ID extraction
├── background.js          # Extension background service worker
├── styles.css             # Modern CSS styling
├── icons/                 # Extension icons
│   ├── create-icons.html  # Icon generator utility
│   ├── icon16.png         # 16x16 icon
│   ├── icon48.png         # 48x48 icon
│   └── icon128.png        # 128x128 icon
└── README.md              # This file
```

## Technical Details

### Architecture

- **Manifest V3**: Uses the latest Chrome extension manifest version
- **Content Script**: Detects YouTube pages and extracts video IDs
- **Popup Interface**: Modern, responsive UI for displaying results
- **Background Script**: Manages extension lifecycle and icon updates
- **API Integration**: RESTful API calls with proper error handling

### Key Components

1. **YouTube Detection**: Automatically detects video pages and extracts video IDs from URLs
2. **API Integration**: Fetches comments and performs sentiment analysis
3. **UI States**: Loading, error, results, and empty states with smooth transitions
4. **Error Handling**: Comprehensive error handling with user-friendly messages

### Browser Compatibility

- ✅ Chrome (Manifest V3)
- ✅ Edge (Chromium-based)
- ❌ Firefox (uses different extension format)
- ❌ Safari (uses different extension format)

## Development

### Local Development

1. Make changes to the extension files
2. Go to `chrome://extensions/`
3. Click the refresh icon on your extension card
4. Test the changes

### Debugging

- **Popup**: Right-click the extension icon → "Inspect popup"
- **Content Script**: Open DevTools on YouTube page → Console tab
- **Background Script**: Go to `chrome://extensions/` → Click "service worker" link

## Troubleshooting

### Common Issues

**Extension doesn't appear**
- Make sure Developer Mode is enabled
- Check that all required files are present
- Verify manifest.json syntax

**"Not on YouTube" message**
- Ensure you're on a YouTube video page (not homepage/search)
- Try refreshing the YouTube page
- Check that the URL contains `/watch?v=` or `/shorts/`

**API errors**
- Check your internet connection
- Verify the API endpoints are accessible
- Try the "Try Again" button

**Icons not showing**
- Generate icons using `icons/create-icons.html`
- Ensure PNG files are in the `icons/` folder
- Reload the extension

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source. Feel free to use, modify, and distribute according to your needs.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Ensure you're using a supported YouTube page format
