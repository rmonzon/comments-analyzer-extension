// Background script for YouTube Comment Sentiment Analyzer

class BackgroundService {
    constructor() {
        this.init();
    }

    init() {
        // Handle extension installation
        chrome.runtime.onInstalled.addListener((details) => {
            if (details.reason === 'install') {
                console.log('YouTube Comment Sentiment Analyzer installed');
            }
        });

        // Handle messages from content script and popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'urlChanged') {
                // Content script notified us of URL change
                this.handleUrlChange(request);
            }
        });

        // Update extension icon based on current tab
        chrome.tabs.onActivated.addListener((activeInfo) => {
            this.updateIcon(activeInfo.tabId);
        });

        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete') {
                this.updateIcon(tabId);
            }
        });
    }

    handleUrlChange(request) {
        // Could be used for future features like automatic analysis
        console.log('URL changed:', request);
    }

    async updateIcon(tabId) {
        try {
            const tab = await chrome.tabs.get(tabId);
            const isYouTube = this.isYouTubeUrl(tab.url);
            const isVideoPage = this.isVideoPageUrl(tab.url);

            // Update icon based on page type
            if (isYouTube && isVideoPage) {
                // Active state - on YouTube video page
                chrome.action.setIcon({
                    tabId: tabId,
                    path: {
                        "16": "icons/icon16.png",
                        "48": "icons/icon48.png",
                        "128": "icons/icon128.png"
                    }
                });
                chrome.action.setTitle({
                    tabId: tabId,
                    title: "Analyze YouTube Comments"
                });
            } else {
                // Inactive state - not on YouTube video page
                chrome.action.setIcon({
                    tabId: tabId,
                    path: {
                        "16": "icons/icon16.png",
                        "48": "icons/icon48.png",
                        "128": "icons/icon128.png"
                    }
                });
                chrome.action.setTitle({
                    tabId: tabId,
                    title: "Navigate to a YouTube video to analyze comments"
                });
            }
        } catch (error) {
            // Tab might not exist anymore, ignore error
            console.log('Error updating icon:', error);
        }
    }

    isYouTubeUrl(url) {
        if (!url) return false;
        return url.includes('youtube.com');
    }

    isVideoPageUrl(url) {
        if (!url) return false;
        return url.includes('/watch?v=') || url.includes('/shorts/');
    }
}

// Initialize the background service
new BackgroundService();
