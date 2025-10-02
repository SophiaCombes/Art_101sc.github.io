document.addEventListener('DOMContentLoaded', function() {
    // Get timeline container for scrolling
    const timelineContainer = document.querySelector('.timeline-container');
    let isScrolling = false;
    
    // Handle dropdown clicks
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        
        dropbtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Close all other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                    const otherContent = otherDropdown.querySelector('.dropdown-content');
                    otherContent.style.display = 'none';
                }
            });
            
            // Toggle current dropdown
            if (dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
                dropdownContent.style.display = 'none';
            } else {
                dropdown.classList.add('active');
                dropdownContent.style.display = 'block';
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
                const dropdownContent = dropdown.querySelector('.dropdown-content');
                dropdownContent.style.display = 'none';
            });
        }
    });
    
    // Add mouse wheel support for horizontal scrolling from anywhere on the page
    document.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        if (!isScrolling) {
            isScrolling = true;
            
            const scrollAmount = e.deltaY > 0 ? 100 : -100;
            timelineContainer.scrollLeft += scrollAmount;
            
            setTimeout(() => {
                isScrolling = false;
            }, 50);
        }
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            timelineContainer.scrollLeft -= 200;
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            timelineContainer.scrollLeft += 200;
        }
    });
    
    // Add touch/swipe support for mobile
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    
    timelineContainer.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = false;
    });
    
    timelineContainer.addEventListener('touchmove', function(e) {
        if (!isDragging) {
            const deltaX = Math.abs(e.touches[0].clientX - startX);
            const deltaY = Math.abs(e.touches[0].clientY - startY);
            
            if (deltaX > deltaY) {
                isDragging = true;
                e.preventDefault();
            }
        }
    });
    
    timelineContainer.addEventListener('touchend', function(e) {
        if (isDragging) {
            const endX = e.changedTouches[0].clientX;
            const deltaX = startX - endX;
            
            if (Math.abs(deltaX) > 50) {
                timelineContainer.scrollLeft += deltaX;
            }
        }
        isDragging = false;
    });
    
    // Add loading animation
    const timeline = document.querySelector('.timeline');
    timeline.style.opacity = '0';
    timeline.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        timeline.style.transition = 'all 0.6s ease';
        timeline.style.opacity = '1';
        timeline.style.transform = 'translateY(0)';
    }, 100);
    
    // Add scroll indicator
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.innerHTML = '← Scroll to explore timeline →';
    scrollIndicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 10px 20px;
        border-radius: 25px;
        font-size: 14px;
        z-index: 1000;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(scrollIndicator);
    
    // Hide scroll indicator after user starts scrolling
    let hasScrolled = false;
    timelineContainer.addEventListener('scroll', function() {
        if (!hasScrolled) {
            hasScrolled = true;
            scrollIndicator.style.opacity = '0';
            setTimeout(() => {
                scrollIndicator.remove();
            }, 300);
        }
    });
    
    // Auto-hide scroll indicator after 5 seconds
    setTimeout(() => {
        if (!hasScrolled) {
            scrollIndicator.style.opacity = '0';
            setTimeout(() => {
                scrollIndicator.remove();
            }, 300);
        }
    }, 5000);
});

// --- Info box population on hover ---
(function attachInfoBoxHandlers() {
    const infoBox = document.getElementById('info-box');
    if (!infoBox) return;

    // Prefer HTML-provided data-info; fallback to unique placeholder
    const subsectionLinks = document.querySelectorAll('.dropdown-content a');
    subsectionLinks.forEach((link, index) => {
        const getText = () => link.dataset.info && link.dataset.info.trim().length > 0 ? link.dataset.info : `hi ${index + 1}`;

        const setInfo = () => {
            infoBox.textContent = getText();
        };

        link.addEventListener('mouseenter', setInfo);
        link.addEventListener('focus', setInfo);
    });

    // Wheel handling: inside info box -> vertical scroll; outside -> horizontal timeline scroll remains
    infoBox.addEventListener('wheel', (e) => {
        // Allow native vertical scroll in the info box; prevent our global horizontal scroll logic from running
        e.stopPropagation();
        // Do not preventDefault so the box can scroll vertically using native behavior
    }, { passive: false });
})();