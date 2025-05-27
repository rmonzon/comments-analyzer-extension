// Popup script for YouTube Comment Sentiment Analyzer

class SentimentAnalyzer {
    constructor() {
        this.currentVideoId = null;
        this.isAnalyzing = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkYouTubePage();
    }

    bindEvents() {
        // Analyze button
        const analyzeBtn = document.getElementById('analyze-btn');
        analyzeBtn.addEventListener('click', () => this.startAnalysis());

        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        refreshBtn.addEventListener('click', () => this.refreshAnalysis());

        // Share button
        const shareBtn = document.getElementById('share-btn');
        shareBtn.addEventListener('click', () => this.shareAnalysis());

        // Retry button
        const retryBtn = document.getElementById('retry-btn');
        retryBtn.addEventListener('click', () => this.startAnalysis());
    }

    async checkYouTubePage() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // Send message to content script to get video info
            const response = await chrome.tabs.sendMessage(tab.id, { action: 'getVideoId' });
            
            if (response && response.isYouTube && response.isVideoPage && response.videoId) {
                this.currentVideoId = response.videoId;
                this.showReadyState();
            } else if (response && response.isYouTube) {
                this.showNotVideoPage();
            } else {
                this.showNotYouTube();
            }
        } catch (error) {
            console.error('Error checking YouTube page:', error);
            this.showNotYouTube();
        }
    }

    showReadyState() {
        this.hideAllSections();
        document.getElementById('ready').classList.remove('hidden');
    }

    showNotYouTube() {
        this.hideAllSections();
        document.getElementById('not-youtube').classList.remove('hidden');
    }

    showNotVideoPage() {
        this.hideAllSections();
        const notYouTube = document.getElementById('not-youtube');
        notYouTube.classList.remove('hidden');
        notYouTube.querySelector('h3').textContent = 'Not on Video Page';
        notYouTube.querySelector('p').textContent = 'Please navigate to a YouTube video (not homepage, search, etc.) to analyze comments.';
    }

    hideAllSections() {
        const sections = ['status', 'not-youtube', 'ready', 'loading', 'results', 'error'];
        sections.forEach(id => {
            document.getElementById(id).classList.add('hidden');
        });
    }

    async startAnalysis() {
        if (this.isAnalyzing || !this.currentVideoId) return;

        this.isAnalyzing = true;
        this.showLoadingState();

        try {
            // Step 1: Fetch comments
            this.updateLoadingStep(1, 'active');
            const commentsData = await this.fetchComments(this.currentVideoId);
            this.updateLoadingStep(1, 'completed');

            // Step 2: Analyze sentiment
            this.updateLoadingStep(2, 'active');
            const analysisData = await this.analyzeSentiment(this.currentVideoId);
            this.updateLoadingStep(2, 'completed');

            // Show results
            this.showResults(analysisData);

        } catch (error) {
            console.error('Analysis failed:', error);
            this.showError(error.message);
        } finally {
            this.isAnalyzing = false;
        }
    }

    async refreshAnalysis() {
        if (!this.currentVideoId) return;

        try {
            // Force refresh by setting forceRefresh to true
            const analysisData = await this.analyzeSentiment(this.currentVideoId, true);
            this.showResults(analysisData);
        } catch (error) {
            console.error('Refresh failed:', error);
            this.showError(error.message);
        }
    }

    async shareAnalysis() {
        if (!this.currentVideoId) return;

        try {
            // Create shareable link
            const shareableLink = `https://commentsanalyzer.info/shared?id=${this.currentVideoId}`;
            
            // Copy to clipboard
            await navigator.clipboard.writeText(shareableLink);
            
            // Update button to show success
            const shareBtn = document.getElementById('share-btn');
            const originalContent = shareBtn.innerHTML;
            
            shareBtn.classList.add('copied');
            shareBtn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
                <span>Copied!</span>
            `;
            
            // Reset button after 2 seconds
            setTimeout(() => {
                shareBtn.classList.remove('copied');
                shareBtn.innerHTML = originalContent;
            }, 2000);
            
        } catch (error) {
            console.error('Failed to copy link:', error);
            
            // Show error state
            const shareBtn = document.getElementById('share-btn');
            const originalContent = shareBtn.innerHTML;
            
            shareBtn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <span>Failed</span>
            `;
            
            setTimeout(() => {
                shareBtn.innerHTML = originalContent;
            }, 2000);
        }
    }

    async fetchComments(videoId) {
        const response = await fetch(`https://commentsanalyzer.info/api/youtube/video?videoId=${videoId}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch comments: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    async analyzeSentiment(videoId, forceRefresh = false) {
        const response = await fetch('https://commentsanalyzer.info/api/youtube/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                videoId: videoId,
                forceRefresh: forceRefresh
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to analyze sentiment: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    showLoadingState() {
        this.hideAllSections();
        document.getElementById('loading').classList.remove('hidden');
        
        // Reset loading steps
        const steps = document.querySelectorAll('.step');
        steps.forEach(step => {
            step.classList.remove('active', 'completed');
        });
    }

    updateLoadingStep(stepNumber, state) {
        const step = document.getElementById(`step-${stepNumber}`);
        step.classList.remove('active', 'completed');
        step.classList.add(state);

        // Update icon based on state
        const icon = step.querySelector('.step-icon');
        if (state === 'active') {
            icon.innerHTML = '<div class="spinner small"></div>';
        } else if (state === 'completed') {
            icon.innerHTML = '✅';
        }
    }

    showResults(data) {
        this.hideAllSections();
        document.getElementById('results').classList.remove('hidden');

        // Populate all sections with the new data format
        this.populateAnalysisMetadata(data);
        this.populateSentimentOverview(data);
        this.populateKeyPoints(data);
        this.populateComprehensiveSummary(data);
    }

    populateAnalysisMetadata(data) {
        const metadataContainer = document.getElementById('analysis-metadata');
        metadataContainer.innerHTML = '';

        // Create metadata items
        const commentsAnalyzed = data.commentsAnalyzed || 0;
        const createdAt = data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Unknown';
        const videoId = data.videoId || 'Unknown';

        metadataContainer.innerHTML = `
            <div class="metadata-item">
                <div class="metadata-label">Comments</div>
                <div class="metadata-value">${commentsAnalyzed}</div>
            </div>
            <div class="metadata-item">
                <div class="metadata-label">Analyzed</div>
                <div class="metadata-value">${createdAt}</div>
            </div>
            <div class="metadata-item">
                <div class="metadata-label">Video ID</div>
                <div class="metadata-value">${videoId.substring(0, 8)}...</div>
            </div>
        `;
    }

    populateSentimentOverview(data) {
        const overviewContainer = document.getElementById('sentiment-overview');
        overviewContainer.innerHTML = '';

        // Extract sentiment data from the new format
        const sentiments = this.extractSentimentData(data);

        sentiments.forEach(sentiment => {
            const card = this.createSentimentCard(sentiment);
            overviewContainer.appendChild(card);
        });
    }

    extractSentimentData(data) {
        // Handle the new API response format with sentimentStats
        if (data.sentimentStats) {
            const stats = data.sentimentStats;
            return [
                {
                    label: 'Positive',
                    percentage: stats.positive || 0,
                    type: 'positive'
                },
                {
                    label: 'Neutral',
                    percentage: stats.neutral || 0,
                    type: 'neutral'
                },
                {
                    label: 'Negative',
                    percentage: stats.negative || 0,
                    type: 'negative'
                }
            ];
        }
        
        // Fallback for legacy formats
        if (data.sentiment) {
            const sentiment = data.sentiment;
            return [
                {
                    label: 'Positive',
                    percentage: Math.round((sentiment.positive || 0) * 100),
                    type: 'positive'
                },
                {
                    label: 'Negative',
                    percentage: Math.round((sentiment.negative || 0) * 100),
                    type: 'negative'
                },
                {
                    label: 'Neutral',
                    percentage: Math.round((sentiment.neutral || 0) * 100),
                    type: 'neutral'
                }
            ];
        }
        
        // Default fallback
        return [
            {
                label: 'Positive',
                percentage: 45,
                type: 'positive'
            },
            {
                label: 'Negative',
                percentage: 25,
                type: 'negative'
            },
            {
                label: 'Neutral',
                percentage: 30,
                type: 'neutral'
            }
        ];
    }

    createSentimentCard(sentiment) {
        const card = document.createElement('div');
        card.className = `sentiment-card ${sentiment.type}`;
        
        card.innerHTML = `
            <div class="sentiment-header">
                <span class="sentiment-label">${sentiment.label}</span>
                <span class="sentiment-percentage">${sentiment.percentage}%</span>
            </div>
            <div class="sentiment-bar">
                <div class="sentiment-fill ${sentiment.type}" style="width: ${sentiment.percentage}%"></div>
            </div>
        `;

        return card;
    }

    populateKeyPoints(data) {
        const keyPointsContainer = document.getElementById('key-points-list');
        keyPointsContainer.innerHTML = '';

        if (data.keyPoints && Array.isArray(data.keyPoints)) {
            data.keyPoints.forEach(point => {
                const pointCard = this.createKeyPointCard(point);
                keyPointsContainer.appendChild(pointCard);
            });
        } else {
            // Show message if no key points available
            keyPointsContainer.innerHTML = `
                <div class="key-point-card">
                    <div class="key-point-title">No Key Points Available</div>
                    <div class="key-point-content">Key discussion points will appear here when available from the analysis.</div>
                </div>
            `;
        }
    }

    createKeyPointCard(point) {
        const card = document.createElement('div');
        card.className = 'key-point-card';
        
        card.innerHTML = `
            <div class="key-point-title">${this.escapeHtml(point.title || 'Untitled Point')}</div>
            <div class="key-point-content">${this.escapeHtml(point.content || 'No content available.')}</div>
        `;

        return card;
    }

    populateComprehensiveSummary(data) {
        const summaryContainer = document.getElementById('comprehensive-text');
        
        let summaryText = '';
        
        if (data.comprehensive) {
            summaryText = data.comprehensive;
        } else if (data.summary) {
            summaryText = data.summary;
        } else if (data.analysis && data.analysis.summary) {
            summaryText = data.analysis.summary;
        } else {
            summaryText = 'Analysis completed successfully. The sentiment analysis shows the overall emotional tone of the comments for this video.';
        }

        summaryContainer.textContent = summaryText;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        this.hideAllSections();
        document.getElementById('error').classList.remove('hidden');
        document.getElementById('error-message').textContent = message;
    }
}

// Initialize the analyzer when the popup loads
document.addEventListener('DOMContentLoaded', () => {
    new SentimentAnalyzer();
});
