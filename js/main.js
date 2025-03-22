// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Smooth scrolling for navigation links
$(document).ready(function() {
    // Add smooth scrolling to nav links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = $(this.hash);
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800);
        }
    });

    // Navbar background change on scroll
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $('.navbar').addClass('navbar-scrolled');
        } else {
            $('.navbar').removeClass('navbar-scrolled');
        }
    });

    // Form submission handling
    $('form').on('submit', function(e) {
        e.preventDefault();
        // Add your form submission logic here
        alert('Thank you for your message! I will get back to you soon.');
        this.reset();
    });
});

// Portfolio and Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Selectors
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const portfolioModal = document.querySelector('.portfolio-modal');
    const modalClose = document.querySelector('.portfolio-modal-close');
    
    // Configuration
    const itemsPerLoad = 9;
    let currentlyShown = 0;
    let currentFilter = 'all';
    
    // Initialize portfolio items - hide all first
    portfolioItems.forEach(item => {
        item.classList.add('hidden');
    });
    
    // Function to show items based on current filter and count
    function showItems(filter, start, count) {
        let shown = 0;
        let itemsShown = 0;
        
        portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            // If item matches current filter (or is 'all')
            if (filter === 'all' || category === filter) {
                // If it's within the range we want to show (either previously shown or new batch)
                if (shown < start + count) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
                shown++;
            } else {
                item.classList.add('hidden');
            }
        });
        
        return shown; // Return total possible items for this filter
    }
    
    // Update load more button visibility
    function updateLoadMoreButton(totalItems) {
        if (currentlyShown >= totalItems) {
            loadMoreBtn.classList.add('hidden');
        } else {
            loadMoreBtn.classList.remove('hidden');
        }
    }
    
    // Initial load
    let totalItemsForCurrentFilter = showItems(currentFilter, 0, itemsPerLoad);
    currentlyShown = Math.min(itemsPerLoad, totalItemsForCurrentFilter);
    updateLoadMoreButton(totalItemsForCurrentFilter);
    
    // Filter button click handler
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update current filter
            currentFilter = button.getAttribute('data-filter');
            
            // Reset shown count
            currentlyShown = 0;
            
            // Show first batch of filtered items
            totalItemsForCurrentFilter = showItems(currentFilter, 0, itemsPerLoad);
            currentlyShown = Math.min(itemsPerLoad, totalItemsForCurrentFilter);
            
            // Update load more button
            updateLoadMoreButton(totalItemsForCurrentFilter);
        });
    });
    
    // Load more button click handler
    loadMoreBtn.addEventListener('click', () => {
        // Show more items
        totalItemsForCurrentFilter = showItems(currentFilter, currentlyShown, itemsPerLoad);
        currentlyShown = Math.min(currentlyShown + itemsPerLoad, totalItemsForCurrentFilter);
        
        // Update load more button
        updateLoadMoreButton(totalItemsForCurrentFilter);
    });
    
    // Modal functionality
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const modalImg = portfolioModal.querySelector('img');
            
            // If the image is a thumbnail, load the full resolution version
            if (img.classList.contains('thumbnail')) {
                const fullSrc = img.getAttribute('data-full-src');
                const fullImage = new Image();
                fullImage.src = fullSrc;
                fullImage.className = 'img-fluid full-image';
                fullImage.alt = img.alt;
                
                fullImage.onload = () => {
                    fullImage.classList.add('loaded');
                    img.parentNode.replaceChild(fullImage, img);
                    modalImg.src = fullSrc;
                    portfolioModal.classList.add('active');
                    document.body.classList.add('modal-open');
                };
            } else {
                modalImg.src = img.src;
                portfolioModal.classList.add('active');
                document.body.classList.add('modal-open');
            }
        });
    });
    
    // Close modal functionality
    modalClose.addEventListener('click', () => {
        portfolioModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    });
    
    portfolioModal.addEventListener('click', (e) => {
        if (e.target === portfolioModal) {
            portfolioModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && portfolioModal.classList.contains('active')) {
            portfolioModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    });
    
    // Lazy loading functionality for thumbnails
    portfolioItems.forEach(item => {
        const thumbnail = item.querySelector('.thumbnail');
        if (!thumbnail) return; // Skip items without thumbnails
        
        const fullSrc = thumbnail.getAttribute('data-full-src');
        if (!fullSrc) return; // Skip if no full src attribute
        
        // Create a new image element for the full resolution image
        const fullImage = new Image();
        fullImage.src = fullSrc;
        fullImage.className = 'img-fluid full-image';
        fullImage.alt = thumbnail.alt;
        
        // When the full image is loaded, replace the thumbnail
        fullImage.onload = () => {
            fullImage.classList.add('loaded');
            thumbnail.parentNode.replaceChild(fullImage, thumbnail);
        };
    });
}); 