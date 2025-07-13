// Main JavaScript file for Filtreli Duş Başlığı website
document.addEventListener('DOMContentLoaded', function() {
    initGallery();
    initVariantSelection();
    initOrderForm();
    initFAQAccordion();
    initScrollAnimations();
    initCODButton();
    initShippingOptions();
});

// Image Gallery Functionality
function initGallery() {
    const mainImage = document.querySelector('.main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (!mainImage || !thumbnails.length) return;
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            try {
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                this.classList.add('active');
                
                // Update main image
                mainImage.src = this.src.replace('width=416', 'width=1946');
                mainImage.alt = this.alt;
                
                // Add fade effect
                mainImage.style.opacity = '0.5';
                setTimeout(() => {
                    mainImage.style.opacity = '1';
                }, 150);
                
            } catch (error) {
                console.error('Error updating gallery image:', error);
            }
        });
        
        // Handle image load errors
        thumb.onerror = function() {
            console.error('Failed to load thumbnail image:', this.src);
            this.style.display = 'none';
        };
    });
    
    // Handle main image load errors
    mainImage.onerror = function() {
        console.error('Failed to load main image:', this.src);
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE2Ij5Ürün Görseli</text></svg>';
    };
}

// Variant Selection Functionality
function initVariantSelection() {
    const variantInputs = document.querySelectorAll('input[name="variant"]');
    const variantOptions = document.querySelectorAll('.variant-option');
    
    if (!variantInputs.length) return;
    
    variantInputs.forEach(input => {
        input.addEventListener('change', function() {
            try {
                // Update variant selection UI
                variantOptions.forEach(option => option.classList.remove('selected'));
                this.closest('.variant-option').classList.add('selected');
                
                // Update pricing
                updatePricing(this.value);
                
                // Update order form if visible
                updateOrderSummary(this.value);
                
            } catch (error) {
                console.error('Error updating variant selection:', error);
            }
        });
    });
}

function updatePricing(selectedVariant) {
    const priceElement = document.querySelector('.current-price');
    const submitButton = document.querySelector('.btn-submit-order');
    
    if (!priceElement) return;
    
    const prices = {
        '1': { current: '399.90TL', original: '799.90TL' },
        '2': { current: '719.82TL', original: '1,599.80TL' },
        '3': { current: '1,019.75TL', original: '2,399.70TL' }
    };
    
    const selectedPrice = prices[selectedVariant] || prices['1'];
    
    priceElement.textContent = selectedPrice.current;
    
    if (submitButton) {
        submitButton.textContent = `Siparişi Tamamlayın - ${selectedPrice.current}`;
    }
    
    // Add animation effect
    priceElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        priceElement.style.transform = 'scale(1)';
    }, 200);
}

function updateOrderSummary(selectedVariant) {
    const selectedVariantElement = document.querySelector('.selected-variant');
    const selectedPriceElement = document.querySelector('.selected-price');
    
    if (!selectedVariantElement || !selectedPriceElement) return;
    
    const variants = {
        '1': { title: '1 Adet Duş Başlığı', price: '399.90TL' },
        '2': { title: '2 Adet Duş Başlığı', price: '719.82TL' },
        '3': { title: '3 Adet Duş Başlığı', price: '1,019.75TL' }
    };
    
    const selected = variants[selectedVariant] || variants['1'];
    
    selectedVariantElement.textContent = selected.title;
    selectedPriceElement.textContent = selected.price;
}

// Order Form Functionality
function initOrderForm() {
    const orderForm = document.querySelector('#order-form');
    const citySelect = document.querySelector('#city');
    const districtSelect = document.querySelector('#district');
    
    if (!orderForm) return;
    
    // City/District dependency
    if (citySelect && districtSelect) {
        const districts = {
            'istanbul': ['Kadıköy', 'Beşiktaş', 'Şişli', 'Beyoğlu', 'Fatih', 'Üsküdar'],
            'ankara': ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Sincan', 'Altındağ'],
            'izmir': ['Konak', 'Karşıyaka', 'Bornova', 'Buca', 'Bayraklı', 'Gaziemir'],
            'bursa': ['Osmangazi', 'Nilüfer', 'Yıldırım', 'Mudanya', 'Gemlik', 'İnegöl'],
            'antalya': ['Muratpaşa', 'Kepez', 'Konyaaltı', 'Aksu', 'Döşemealtı', 'Manavgat']
        };
        
        citySelect.addEventListener('change', function() {
            const selectedCity = this.value;
            const cityDistricts = districts[selectedCity] || [];
            
            // Clear district options
            districtSelect.innerHTML = '<option value="">İlçe Seçin</option>';
            
            // Add new district options
            cityDistricts.forEach(district => {
                const option = document.createElement('option');
                option.value = district.toLowerCase();
                option.textContent = district;
                districtSelect.appendChild(option);
            });
            
            districtSelect.disabled = cityDistricts.length === 0;
        });
    }
    
    // Form submission
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        try {
            if (validateForm(this)) {
                submitOrder(this);
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            showNotification('Sipariş gönderilirken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
        }
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            displayError(field, 'Bu alan zorunludur.');
        } else {
            // Specific validations
            if (field.type === 'tel' && !isValidPhone(field.value)) {
                isValid = false;
                displayError(field, 'Geçerli bir telefon numarası giriniz.');
            }
        }
    });
    
    return isValid;
}

function isValidPhone(phone) {
    const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function displayError(field, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
    field.style.borderColor = '#e63946';
    
    // Remove error on input
    field.addEventListener('input', function() {
        errorElement.remove();
        field.style.borderColor = '';
    }, { once: true });
}

function submitOrder(form) {
    const submitButton = form.querySelector('.btn-submit-order');
    const originalHTML = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = 'Sipariş Gönderiliyor...';
    submitButton.disabled = true;
    form.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        // Reset form state
        submitButton.innerHTML = originalHTML;
        submitButton.disabled = false;
        form.classList.remove('loading');
        
        // Show success message
        showNotification('Siparişiniz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.', 'success');
        
        // Reset form
        form.reset();
        
        // Hide order form modal
        const orderFormModal = document.querySelector('#order-form-modal');
        if (orderFormModal) {
            orderFormModal.style.display = 'none';
            document.body.style.overflow = '';
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    }, 2000);
}

// FAQ Accordion Functionality
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (!question) return;
        
        question.addEventListener('click', function() {
            try {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active', !isActive);
                
                // Smooth scroll to question if opening
                if (!isActive) {
                    setTimeout(() => {
                        question.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest' 
                        });
                    }, 300);
                }
                
            } catch (error) {
                console.error('Error toggling FAQ item:', error);
            }
        });
    });
}

// COD Button Functionality
function initCODButton() {
    const codButton = document.querySelector('.btn-cod');
    const orderFormModal = document.querySelector('#order-form-modal');
    const modalClose = document.querySelector('#modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    if (!codButton || !orderFormModal) return;
    
    // Open modal
    codButton.addEventListener('click', function() {
        try {
            orderFormModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Update modal content with selected variant
            updateModalContent();
            
        } catch (error) {
            console.error('Error showing order form:', error);
        }
    });
    
    // Close modal functions
    function closeModal() {
        orderFormModal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    // Close on X button
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close on overlay click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && orderFormModal.style.display === 'flex') {
            closeModal();
        }
    });
}

// Update modal content with selected variant
function updateModalContent() {
    const selectedVariant = document.querySelector('input[name="variant"]:checked');
    if (!selectedVariant) return;
    
    const variantValue = selectedVariant.value;
    const variants = {
        '1': { title: 'Filtreli Duş Başlığı', price: '399.90TL' },
        '2': { title: 'Filtreli Duş Başlığı (2 Adet)', price: '719.82TL' },
        '3': { title: 'Filtreli Duş Başlığı (3 Adet)', price: '1,019.75TL' }
    };
    
    const selected = variants[variantValue] || variants['1'];
    
    // Update product details in modal
    const productTitle = document.querySelector('.modal-body .product-details h3');
    const productPrice = document.querySelector('.modal-body .selected-price');
    const subtotal = document.querySelector('.subtotal');
    
    if (productTitle) productTitle.textContent = selected.title;
    if (productPrice) productPrice.textContent = selected.price;
    if (subtotal) subtotal.textContent = selected.price;
    
    // Update total calculation
    updateModalTotal();
}

// Update modal total calculation
function updateModalTotal() {
    const subtotalElement = document.querySelector('.subtotal');
    const shippingFeeElement = document.querySelector('.shipping-fee');
    const totalPriceElement = document.querySelector('.total-price');
    const orderTotalElement = document.querySelector('.order-total');
    
    if (!subtotalElement || !shippingFeeElement || !totalPriceElement) return;
    
    const subtotal = parseFloat(subtotalElement.textContent.replace('TL', '').replace(',', '.'));
    const shippingFee = parseFloat(shippingFeeElement.textContent.replace('TL', '').replace(',', '.'));
    const total = subtotal + shippingFee;
    
    const totalFormatted = total.toFixed(2).replace('.', ',') + 'TL';
    totalPriceElement.textContent = totalFormatted;
    
    if (orderTotalElement) {
        orderTotalElement.textContent = totalFormatted;
    }
    
    // Update submit button
    const submitButton = document.querySelector('.btn-submit-order');
    if (submitButton) {
        submitButton.innerHTML = `Siparişi Tamamlayın - <span class="order-total">${totalFormatted}</span>`;
    }
}

// Initialize shipping options
function initShippingOptions() {
    const shippingInputs = document.querySelectorAll('input[name="shipping"]');
    const shippingOptions = document.querySelectorAll('.shipping-option');
    
    shippingInputs.forEach(input => {
        input.addEventListener('change', function() {
            try {
                // Update UI
                shippingOptions.forEach(option => option.classList.remove('selected'));
                this.closest('.shipping-option').classList.add('selected');
                
                // Update shipping fee
                const shippingFeeElement = document.querySelector('.shipping-fee');
                const selectedPrice = this.value === 'ptt' ? '95.00TL' : '75.00TL';
                
                if (shippingFeeElement) {
                    shippingFeeElement.textContent = selectedPrice;
                }
                
                // Recalculate total
                updateModalTotal();
                
            } catch (error) {
                console.error('Error updating shipping option:', error);
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.feature-item, .review-item, .guarantee-section, .faq-item'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#e63946' : '#007bff'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(notificationStyles);

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add to cart functionality (placeholder)
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-add-cart')) {
        e.preventDefault();
        showNotification('Ürün sepete eklendi!', 'success');
        
        // Update cart button animation
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 150);
    }
});

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if needed
if (document.querySelectorAll('img[data-src]').length > 0) {
    initLazyLoading();
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}
