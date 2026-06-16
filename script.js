document.addEventListener('DOMContentLoaded', () => {

    // ── Confetti helper ──────────────────────────────────────────────────────
    const COLORS = ['#FF6B8A','#52C9A0','#FFB347','#B47FEB','#74b9ff','#FF4F6D','#2ed573'];

    function spawnConfetti(container, count, velocity) {
        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            el.classList.add('confetti-piece');
            el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
            if (Math.random() > .45) el.style.borderRadius = '2px';
            container.appendChild(el);

            const angle = Math.random() * Math.PI * 2;
            const v     = velocity * (.4 + Math.random() * .6);
            const tx    = Math.cos(angle) * v;
            const ty    = Math.sin(angle) * v;
            const rot   = (Math.random() - .5) * 720;

            el.animate([
                {
                    transform: `translate(-50%,-50%) scale(1) rotate(0deg)`,
                    opacity: 1
                },
                {
                    transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(.2) rotate(${rot}deg)`,
                    opacity: 0
                }
            ], {
                duration: 600 + Math.random() * 400,
                easing: 'cubic-bezier(.1,.8,.2,1)',
                fill: 'forwards',
                delay: Math.random() * 80
            });
        }
    }

    // ── Progressive timeline reveal ─────────────────────────────────────────
    function initProgressiveTimeline() {
        const items = document.querySelectorAll('.timeline-item');
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach((e, idx) => {
                if (e.isIntersecting) {
                    setTimeout(() => {
                        e.target.classList.add('item-active');
                    }, idx * 80);
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

        items.forEach(item => io.observe(item));
    }

    // ── Section scroll reveal ───────────────────────────────────────────────
    function initScrollObserver() {
        const sections = document.querySelectorAll('.scroll-reveal');
        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('active');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });
        sections.forEach(s => obs.observe(s));
    }

    // ── Main Reveal Card ────────────────────────────────────────────────────
    const revealCard    = document.getElementById('revealCard');
    const cardFront     = document.getElementById('cardFront');
    const cardBack      = document.getElementById('cardBack');
    const secretContent = document.getElementById('secretContent');
    const mainConfetti  = document.getElementById('confettiContainer');
    let   cardRevealed  = false;

    if (revealCard) {
        revealCard.addEventListener('click', () => {
            if (cardRevealed) return;
            cardRevealed = true;

            revealCard.classList.remove('pulse-button');
            revealCard.classList.add('is-opening');

            spawnConfetti(mainConfetti, 55, 150);

            setTimeout(() => {
                revealCard.classList.remove('is-opening');
                revealCard.classList.add('card-revealed');

                cardFront.classList.add('hidden');
                cardBack.classList.remove('hidden');

                secretContent.classList.add('reveal-active');
                initScrollObserver();
                initProgressiveTimeline();
            }, 520);
        });
    }

    // ── Remastered Camera Image Snapshot Generator Logic ────────────────────
    const MEMORY_POOL = [
        {
            imgSrc: "./pics/gall1.jpg",
            title: "ความทรงจำที่ 1: สุขภาพ & ความสุข",
            desc: "ขอให้ปีนี้เต็มไปด้วยเสียงหัวเราะบริสุทธิ์ และเหตุผลนับไม่ถ้วนที่จะยิ้มทุกวัน!"
        },
        {
            imgSrc: "./pics/gall2.jpg",
            title: "ความทรงจำที่ 2: ความฝันยิ่งใหญ่ 🚀",
            desc: "ขอให้เป้าหมายทุกอย่างที่กำลังมุ่งมั่นอยู่ในปีนี้สำเร็จอย่างสมบูรณ์แบบ คุณทำได้!"
        },
        {
            imgSrc: "./pics/gall3.jpg",
            title: "ความทรงจำที่ 3: สันติภาพ & ความรัก",
            desc: "ขอบคุณที่เป็นแสงสว่างที่ยอดเยี่ยมในชีวิตของฉัน ส่งความอบอุ่นมาให้ในวันเกิดนะ"
        },
        {
            imgSrc: "./pics/gall2.jpg",
            title: "ความทรงจำที่ 4: การผจญภัยหวาน",
            desc: "ยินดีกับการโคจรรอบดวงอาทิตย์อีกครั้ง! ขอให้ปีนี้เต็มไปด้วยของอร่อยๆ และการเดินทางครั้งใหม่"
        }
    ];

    const generateBtn          = document.getElementById('generateBtn');
    const cameraFlashOverlay   = document.getElementById('cameraFlashOverlay');
    const generatorViewer      = document.getElementById('generatorViewer');
    const viewerPlaceholder    = document.getElementById('viewerPlaceholder');
    const viewerContent        = document.getElementById('viewerContent');
    const generatedImage       = document.getElementById('generatedImage');
    const generatedTitle       = document.getElementById('generatedTitle');
    const generatedDesc        = document.getElementById('generatedDesc');
    let   lastRandomIndex      = -1;

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            // Disable button briefly to let snapshot animations play safely
            generateBtn.disabled = true;

            // 1. Core Shutter Flash Overlay State Mechanics
            cameraFlashOverlay.classList.remove('trigger-flash');
            void cameraFlashOverlay.offsetWidth; // Force element reflow repaint to restart keyframe
            cameraFlashOverlay.classList.add('trigger-flash');

            // Reset polaroid card element class list for a clean drop out rerun
            generatorViewer.classList.remove('eject-photo-animation');
            void generatorViewer.offsetWidth;

            // 2. Select a fresh random option from data structure pool
            let randomIndex = Math.floor(Math.random() * MEMORY_POOL.length);
            while (randomIndex === lastRandomIndex && MEMORY_POOL.length > 1) {
                randomIndex = Math.floor(Math.random() * MEMORY_POOL.length);
            }
            lastRandomIndex = randomIndex;
            const selectedMemory = MEMORY_POOL[randomIndex];

            // 3. Inject content mapping immediately while hidden
            generatedImage.src       = selectedMemory.imgSrc;
            generatedTitle.innerText = selectedMemory.title;
            generatedDesc.innerText  = selectedMemory.desc;

            // Swap visibility targets slightly ahead of the drop reveal sweep
            viewerPlaceholder.style.display = 'none';
            viewerContent.style.display     = 'block';

            // 4. Trigger Polaroid Slot Eject Physical Sliding Animation
            setTimeout(() => {
                generatorViewer.classList.add('eject-photo-animation');
            }, 50);

            // Unlock camera shutter button when completion frames terminate
            setTimeout(() => {
                generateBtn.disabled = false;
            }, 1450);
        });
    }
});


// ── Remastered Gallery Folder System Tab Filter Mechanics ────────────────
    const folderTabBtns = document.querySelectorAll('.folder-tab-btn');
    const folderFileNodes = document.querySelectorAll('.folder-file-node');

    folderTabBtns.forEach(tabBtn => {
        tabBtn.addEventListener('click', () => {
            // 1. Swap active indicator tracking status states on tabs
            folderTabBtns.forEach(btn => btn.classList.remove('active'));
            tabBtn.classList.add('active');

            const activeTargetFilter = tabBtn.getAttribute('data-target-folder');

            // 2. Filter file nodes via target tag attributes checking
            folderFileNodes.forEach(fileNode => {
                const nodeFileType = fileNode.getAttribute('data-file-type');

                if (activeTargetFilter === 'all-memories' || nodeFileType === activeTargetFilter) {
                    fileNode.classList.remove('hide-file');
                    
                    // Trigger a smooth pop animation sequence setup
                    fileNode.animate([
                        { opacity: 0, transform: 'scale(0.96) translateY(6px)' },
                        { opacity: 1, transform: 'scale(1) translateY(0)' }
                    ], {
                        duration: 350,
                        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        fill: 'forwards'
                    });
                } else {
                    fileNode.classList.add('hide-file');
                }
            });
        });
    });
    


    