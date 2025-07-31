// Romantic Surprise Web App - JavaScript
// Author: Arnel 💞

class RomanticSurprise {
    constructor() {
        this.currentPhase = 1;
        this.currentSlide = 0;
        this.currentPage = 0;
        this.totalSlides = 8;
        this.totalPages = 8;
        this.typewriterText = `Hi ga, mao diay ni akong special nga regalo para sa karong adlawa, for the meantime.
I hope ma-enjoy nimo ni nga gamay nga surprise.

Salamat kaayo nga ikaw ang gugma sa akong kinabuhi sa milabay nga lima ka buwan.
Gusto nako i-share ni nga surprise nimo, apay ta daytoy ket talaga nga para kenka.
Lima na ka bulan puno sa kalipay ug kasakit, ngem napintas dagiti naipundar a memories.

Karon nga orasa, medyo advance gamay, mga alas 5-6 sa buntag.
Kabalo ko nga mobangon ka sa kanah na oras para mo trabaho, ug ako na always ga hulat sa imong goodmorning.

Pero isip imong uyab sa lima ka bulan…

I’m still here.
Kay gusto ko nga magkatigulang ta together.
Thank you so much nga niabot ka sa akong kinabuhi. ❤️`;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startTypewriter();
        this.preloadImages();
        this.setupAudio();
    }

    setupEventListeners() {
        // Phase navigation
        document.getElementById('next-phase1').addEventListener('click', () => this.goToPhase(2));
        document.getElementById('next-phase2').addEventListener('click', () => this.goToPhase(3));
        
        // Book interactions
        document.getElementById('love-book').addEventListener('click', () => this.openBook());
        document.getElementById('close-book').addEventListener('click', () => this.closeBook());
        document.getElementById('prev-page').addEventListener('click', () => this.previousPage());
        document.getElementById('next-page').addEventListener('click', () => this.nextPage());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Click outside modal to close
        document.getElementById('book-modal').addEventListener('click', (e) => {
            if (e.target.id === 'book-modal') {
                this.closeBook();
            }
        });
    }

    setupAudio() {
        console.log('Setting up audio...');
        
        // Setup audio with user interaction requirement
        this.audioElements = {
            intro: document.getElementById('intro-music'),
            slideshow: document.getElementById('slideshow-music'),
            book: document.getElementById('book-music')
        };

        // Check if audio elements exist
        Object.keys(this.audioElements).forEach(key => {
            if (!this.audioElements[key]) {
                console.error(`Audio element ${key} not found!`);
            } else {
                console.log(`Audio element ${key} found:`, this.audioElements[key].src);
            }
        });

        // Set volume and preload
        Object.values(this.audioElements).forEach(audio => {
            if (audio) {
                audio.volume = 0.5;
                audio.preload = 'auto';
                
                // Add event listeners for debugging
                audio.addEventListener('loadstart', () => console.log(`${audio.id} loading started`));
                audio.addEventListener('canplay', () => console.log(`${audio.id} can play`));
                audio.addEventListener('error', (e) => console.error(`${audio.id} error:`, e));
            }
        });

        // Handle autoplay restrictions - try to enable audio on first user interaction
        const enableAudioOnInteraction = () => {
            console.log('User interaction detected, enabling audio...');
            this.enableAudio();
        };

        document.addEventListener('click', enableAudioOnInteraction, { once: true });
        document.addEventListener('touchstart', enableAudioOnInteraction, { once: true });
        document.addEventListener('keydown', enableAudioOnInteraction, { once: true });
    }

    enableAudio() {
        console.log('Enabling audio for phase:', this.currentPhase);
        if (this.currentPhase === 1) {
            this.playAudio('intro');
        }
    }

    playAudio(type) {
        console.log('Playing audio type:', type);
        
        // Stop all audio first
        Object.values(this.audioElements).forEach(audio => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });

        // Play requested audio
        if (this.audioElements[type]) {
            const audio = this.audioElements[type];
            console.log('Attempting to play:', audio.src);
            
            audio.play().then(() => {
                console.log(`Successfully playing ${type} audio`);
            }).catch(e => {
                console.error(`Failed to play ${type} audio:`, e);
                
                // Try alternative approach for mobile
                setTimeout(() => {
                    audio.play().catch(err => {
                        console.error(`Retry failed for ${type}:`, err);
                    });
                }, 100);
            });
        } else {
            console.error(`Audio element ${type} not found!`);
        }
    }

    startTypewriter() {
        const element = document.getElementById('typewriter-text');
        let index = 0;
        const speed = 50; // milliseconds per character

        const typeChar = () => {
            if (index < this.typewriterText.length) {
                element.textContent = this.typewriterText.substring(0, index + 1);
                index++;
                setTimeout(typeChar, speed);
            } else {
                // Remove cursor effect and show next button
                element.style.borderRight = 'none';
                setTimeout(() => {
                    document.getElementById('next-phase1').classList.remove('hidden');
                }, 1000);
            }
        };

        typeChar();
    }

    goToPhase(phaseNumber) {
        console.log(`Going to phase ${phaseNumber}`);
        
        // Hide current phase
        document.getElementById(`phase${this.currentPhase}`).classList.remove('active');
        
        // Show new phase with delay for smooth transition
        setTimeout(() => {
            document.getElementById(`phase${phaseNumber}`).classList.add('active');
            this.currentPhase = phaseNumber;
            
            // Start phase-specific functionality
            if (phaseNumber === 2) {
                this.startSlideshow();
                this.playAudio('slideshow');
            } else if (phaseNumber === 3) {
                this.playAudio('book');
            }
        }, 300);
    }

    startSlideshow() {
        this.currentSlide = 0;
        this.updateSlideCounter();
        this.updateProgressBar();
        
        // Auto-advance slides
        this.slideshowInterval = setInterval(() => {
            this.nextSlide();
        }, 6000); // 6 seconds per slide
    }

    nextSlide() {
        const slides = document.querySelectorAll('.slide');
        slides[this.currentSlide].classList.remove('active');
        
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        slides[this.currentSlide].classList.add('active');
        
        this.updateSlideCounter();
        this.updateProgressBar();
        
        // Show next button after last slide
        if (this.currentSlide === this.totalSlides - 1) {
            setTimeout(() => {
                document.getElementById('next-phase2').classList.remove('hidden');
                clearInterval(this.slideshowInterval);
            }, 3000);
        }
    }

    updateSlideCounter() {
        document.querySelector('.slide-counter').textContent = `${this.currentSlide + 1} / ${this.totalSlides}`;
    }

    updateProgressBar() {
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        document.querySelector('.progress-fill').style.width = `${progress}%`;
    }

    openBook() {
        document.getElementById('book-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
        this.currentPage = 0;
        this.updateBookPage();
    }

    closeBook() {
        document.getElementById('book-modal').classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    nextPage() {
        if (this.currentPage < this.totalPages - 1) {
            this.currentPage++;
            this.updateBookPage();
        }
    }

    previousPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.updateBookPage();
        }
    }

    updateBookPage() {
        const pages = document.querySelectorAll('.page');
        pages.forEach((page, index) => {
            page.classList.toggle('active', index === this.currentPage);
        });
        
        document.getElementById('page-counter').textContent = `${this.currentPage + 1} / ${this.totalPages}`;
        
        // Update navigation buttons
        document.getElementById('prev-page').disabled = this.currentPage === 0;
        document.getElementById('next-page').disabled = this.currentPage === this.totalPages - 1;
    }

    handleKeyboard(e) {
        if (document.getElementById('book-modal').classList.contains('active')) {
            switch(e.key) {
                case 'ArrowLeft':
                    this.previousPage();
                    break;
                case 'ArrowRight':
                    this.nextPage();
                    break;
                case 'Escape':
                    this.closeBook();
                    break;
            }
        }
    }

    preloadImages() {
        // Preload memory images for smooth slideshow
        const imageNames = [
            'First-in-your-place.jpg',
            'First-Snack-With-You.jpg',
            'Funny-Moments.jpg',
            'Job-Interview-With-You.jpg',
            'Pa-Dagat-With-Friends.jpg',
            'Spice-Pic.jpg',
            'Sweetness-Overload.jpg',
            'Work.jpg'
        ];

        imageNames.forEach((imageName, index) => {
            const img = new Image();
            img.src = `assets/images/${imageName}`;
            
            // Handle missing images gracefully
            img.onerror = () => {
                console.log(`Image ${imageName} not found, using placeholder`);
            };
        });
    }

    // Utility methods
    createHeartAnimation() {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '100vh';
        heart.style.fontSize = '2rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.animation = 'floatUp 3s ease-out forwards';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 3000);
    }

    // Add floating hearts effect
    startHeartAnimation() {
        setInterval(() => {
            this.createHeartAnimation();
        }, 2000);
    }
}

// CSS for floating hearts animation
const heartStyles = `
@keyframes floatUp {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
    }
}
`;

// Add heart animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = heartStyles;
document.head.appendChild(styleSheet);

// Initialize the app when DOM is loaded - SINGLE INSTANCE
let romanticApp = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    
    if (!romanticApp) {
        romanticApp = new RomanticSurprise();
        window.romanticApp = romanticApp;
        
        // Start heart animation after a delay
        setTimeout(() => {
            romanticApp.startHeartAnimation();
        }, 5000);
        
        console.log('App initialized successfully');
    }
});

// Handle visibility change to pause/resume audio
document.addEventListener('visibilitychange', () => {
    if (romanticApp && romanticApp.audioElements) {
        if (document.hidden) {
            Object.values(romanticApp.audioElements).forEach(audio => {
                if (audio) audio.pause();
            });
        } else {
            // Resume audio based on current phase
            const audioMap = { 1: 'intro', 2: 'slideshow', 3: 'book' };
            const currentAudio = audioMap[romanticApp.currentPhase];
            if (currentAudio && romanticApp.audioElements[currentAudio]) {
                romanticApp.audioElements[currentAudio].play().catch(e => 
                    console.log('Resume audio failed:', e)
                );
            }
        }
    }
});

// Add click handler to enable audio on any click
document.addEventListener('click', () => {
    if (romanticApp && romanticApp.audioElements) {
        // Try to play current phase audio if not already playing
        const audioMap = { 1: 'intro', 2: 'slideshow', 3: 'book' };
        const currentAudio = audioMap[romanticApp.currentPhase];
        const audio = romanticApp.audioElements[currentAudio];
        
        if (audio && audio.paused) {
            audio.play().catch(e => console.log('Click audio enable failed:', e));
        }
    }
}, { once: false });
