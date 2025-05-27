// Content script for YouTube video detection and ID extraction

class YouTubeDetector {
    constructor() {
        this.currentVideoId = null;
        this.init();
    }

    init() {
        // Listen for messages from popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'getVideoId') {
                const videoId = this.extractVideoId();
                sendResponse({ 
                    videoId: videoId,
                    isYouTube: this.isYouTubePage(),
                    isVideoPage: this.isVideoPage()
                });
            }
        });

        // Monitor URL changes (YouTube is a SPA)
        this.observeUrlChanges();
    }

    isYouTubePage() {
        return window.location.hostname === 'www.youtube.com' || 
               window.location.hostname === 'youtube.com';
    }

    isVideoPage() {
        const path = window.location.pathname;
        const search = window.location.search;
        
        // Regular video page: /watch?v=VIDEO_ID
        if (path === '/watch' && search.includes('v=')) {
            return true;
        }
        
        // YouTube Shorts: /shorts/VIDEO_ID
        if (path.startsWith('/shorts/')) {
            return true;
        }
        
        return false;
    }

    extractVideoId() {
        if (!this.isYouTubePage() || !this.isVideoPage()) {
            return null;
        }

        const url = window.location.href;
        let videoId = null;

        // Extract from regular video URL: youtube.com/watch?v=VIDEO_ID
        const watchMatch = url.match(/[?&]v=([^&]+)/);
        if (watchMatch) {
            videoId = watchMatch[1];
        }

        // Extract from Shorts URL: youtube.com/shorts/VIDEO_ID
        const shortsMatch = url.match(/\/shorts\/([^?&]+)/);
        if (shortsMatch) {
            videoId = shortsMatch[1];
        }

        // Clean up video ID (remove any additional parameters)
        if (videoId) {
            videoId = videoId.split('&')[0].split('?')[0];
        }

        return videoId;
    }

    observeUrlChanges() {
        let lastUrl = window.location.href;
        
        // Use MutationObserver to detect URL changes in SPA
        const observer = new MutationObserver(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                this.currentVideoId = this.extractVideoId();
                
                // Notify popup if it's open
                chrome.runtime.sendMessage({
                    action: 'urlChanged',
                    videoId: this.currentVideoId,
                    isVideoPage: this.isVideoPage()
                }).catch(() => {
                    // Popup might not be open, ignore error
                });
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Also listen for popstate events (back/forward navigation)
        window.addEventListener('popstate', () => {
            setTimeout(() => {
                const newVideoId = this.extractVideoId();
                if (newVideoId !== this.currentVideoId) {
                    this.currentVideoId = newVideoId;
                    chrome.runtime.sendMessage({
                        action: 'urlChanged',
                        videoId: this.currentVideoId,
                        isVideoPage: this.isVideoPage()
                    }).catch(() => {
                        // Popup might not be open, ignore error
                    });
                }
            }, 100);
        });
    }
}

// Initialize the detector when the script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new YouTubeDetector();
    });
} else {
    new YouTubeDetector();
}
