// 全局状态
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentCategory = 'all';
let currentSort = 'default';
let currentProducts = [...productsData];

// DOM元素
const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const favoritesSidebar = document.getElementById('favoritesSidebar');
const overlay = document.getElementById('overlay');
const cartBtn = document.getElementById('cartBtn');
const favoritesBtn = document.getElementById('favoritesBtn');
const closeCart = document.getElementById('closeCart');
const closeFavorites = document.getElementById('closeFavorites');
const cartBody = document.getElementById('cartBody');
const favoritesBody = document.getElementById('favoritesBody');
const cartCount = document.getElementById('cartCount');
const favoritesCount = document.getElementById('favoritesCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const navLinks = document.querySelectorAll('.nav-link');
const sectionTitle = document.getElementById('sectionTitle');
const productModal = document.getElementById('productModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');
const toast = document.getElementById('toast');
const scrollToTop = document.getElementById('scrollToTop');
const searchSuggestions = document.getElementById('searchSuggestions');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();
    updateFavoritesCount();
    initBanner();
    initEventListeners();
    initScrollReveal();
    initScrollToTop();
    initRippleEffects();
    initKeyboardShortcuts();
    initDragAndDrop();
});

// 初始化轮播图
function initBanner() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev');
            if (i === index) {
                slide.classList.add('active');
            } else if (i < index) {
                slide.classList.add('prev');
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // 自动轮播
    setInterval(nextSlide, 5000);

    // 点击指示器切换
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
}

// 初始化事件监听器
function initEventListeners() {
    // 购物车按钮
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openSidebar('cart');
    });

    // 收藏按钮
    favoritesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openSidebar('favorites');
    });

    // 关闭侧边栏
    closeCart.addEventListener('click', () => closeSidebar('cart'));
    closeFavorites.addEventListener('click', () => closeSidebar('favorites'));
    overlay.addEventListener('click', () => {
        closeSidebar('cart');
        closeSidebar('favorites');
        closeProductModal();
    });

    // 分类导航
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            currentCategory = category;
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            updateSectionTitle(category);
            filterProducts();
        });
    });

    // 排序
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        sortProducts();
    });

    // 搜索
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        filterProducts(keyword);
        showSearchSuggestions(keyword);
    });

    // 搜索框聚焦
    searchInput.addEventListener('focus', () => {
        const keyword = searchInput.value.toLowerCase();
        if (keyword) {
            showSearchSuggestions(keyword);
        }
    });

    // 点击外部关闭搜索建议
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            searchSuggestions.classList.remove('show');
        }
    });

    // 结算按钮
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('购物车是空的', 'error');
            return;
        }
        showToast('结算功能开发中...', 'success');
    });

    // 关闭模态框
    closeModal.addEventListener('click', closeProductModal);
}

// 更新分类标题
function updateSectionTitle(category) {
    const titles = {
        'all': '全部商品',
        'wine': '白酒',
        'beer': '啤酒',
        'whiskey': '洋酒'
    };
    sectionTitle.textContent = titles[category] || '全部商品';
}

// 筛选商品
function filterProducts(keyword = '') {
    let filtered = [...productsData];

    // 按分类筛选
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }

    // 按关键词搜索
    if (keyword) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(keyword) ||
            p.description.toLowerCase().includes(keyword)
        );
    }

    currentProducts = filtered;
    sortProducts();
}

// 排序商品
function sortProducts() {
    const sorted = [...currentProducts];

    switch (currentSort) {
        case 'price-asc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'sales':
            sorted.sort((a, b) => b.sales - a.sales);
            break;
        default:
            break;
    }

    currentProducts = sorted;
    renderProducts();
}

// 渲染商品列表
function renderProducts() {
    if (currentProducts.length === 0) {
        productsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #999;">没有找到商品</div>';
        return;
    }

    productsGrid.innerHTML = currentProducts.map((product, index) => `
        <div class="product-card scroll-reveal" data-id="${product.id}" style="animation-delay: ${index * 0.1}s">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <button class="favorite-btn ${isFavorite(product.id) ? 'active' : ''}" 
                    onclick="toggleFavorite(${product.id}, event)">
                <i class="fas fa-heart"></i>
            </button>
            <div class="product-image" onclick="openProductModal(${product.id})">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x300?text=商品图片'">
            </div>
            <div class="product-info">
                <div class="product-name" onclick="openProductModal(${product.id})">${product.name}</div>
                <div class="product-desc">${product.description}</div>
                <div class="product-footer">
                    <div class="product-price">
                        ¥${product.price.toFixed(2)}
                        ${product.originalPrice ? `<span class="original">¥${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <button class="add-to-cart" onclick="addToCart(${product.id}, event)">
                        <i class="fas fa-cart-plus"></i> 加入购物车
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // 重新初始化滚动动画
    setTimeout(() => {
        initScrollReveal();
    }, 50);
}

// 打开商品详情模态框
function openProductModal(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    modalBody.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x400?text=商品图片'">
            </div>
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <p class="product-detail-desc">${product.description}</p>
                <div class="product-detail-price">
                    ¥${product.price.toFixed(2)}
                    ${product.originalPrice ? `<span style="font-size: 18px; color: #999; text-decoration: line-through; margin-left: 10px;">¥${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-detail-actions">
                    <button class="btn-large btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> 加入购物车
                    </button>
                    <button class="btn-large btn-favorite ${isFavorite(product.id) ? 'active' : ''}" 
                            onclick="toggleFavorite(${product.id})">
                        <i class="fas fa-heart"></i> ${isFavorite(product.id) ? '已收藏' : '收藏'}
                    </button>
                </div>
            </div>
        </div>
    `;

    productModal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 关闭商品详情模态框
function closeProductModal() {
    productModal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// 添加到购物车
function addToCart(productId, event) {
    if (event) event.stopPropagation();
    
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    // 添加波纹效果
    if (event) {
        const btn = event.target.closest('.add-to-cart, .btn-add-cart');
        if (btn) {
            addRippleEffect(btn, event);
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);
        }
    }

    // 飞入动画
    if (event && cartBtn) {
        createFlyToCartAnimation(event, cartBtn);
    }

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    renderCart();
    showToast(`${product.name} 已加入购物车`, 'success');
    
    // 购物车图标动画
    if (cartBtn) {
        cartBtn.classList.add('cart-shake');
        setTimeout(() => {
            cartBtn.classList.remove('cart-shake');
        }, 500);
    }
}

// 从购物车移除
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
    showToast('已从购物车移除', 'success');
}

// 更新购物车商品数量
function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartCount();
        renderCart();
        
        // 价格高亮动画
        const cartItem = document.querySelector(`[data-product-id="${productId}"]`);
        if (cartItem) {
            const priceElement = cartItem.querySelector('.cart-item-price');
            if (priceElement) {
                priceElement.classList.add('price-highlight');
                setTimeout(() => {
                    priceElement.classList.remove('price-highlight');
                }, 500);
            }
        }
    }
}

// 渲染购物车
function renderCart() {
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>购物车是空的</p>
            </div>
        `;
        cartTotal.textContent = '0.00';
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = total.toFixed(2);

    cartBody.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-product-id="${item.id}" style="animation-delay: ${index * 0.1}s">
            <div class="cart-item-image drag-handle" title="拖拽移动">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80x80?text=商品'">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">¥${item.price.toFixed(2)}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)" title="减少">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)" title="增加">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})" title="移除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// 切换收藏
function toggleFavorite(productId, event) {
    if (event) event.stopPropagation();
    
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const index = favorites.findIndex(f => f.id === productId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        showToast('已取消收藏', 'success');
    } else {
        favorites.push(product);
        showToast(`${product.name} 已收藏`, 'success');
    }

    saveFavorites();
    updateFavoritesCount();
    renderFavorites();
    renderProducts();
    
    // 更新模态框中的收藏按钮
    if (productModal.classList.contains('active')) {
        const favoriteBtn = modalBody.querySelector('.btn-favorite');
        if (favoriteBtn) {
            const isFav = isFavorite(productId);
            favoriteBtn.classList.toggle('active', isFav);
            favoriteBtn.innerHTML = `<i class="fas fa-heart"></i> ${isFav ? '已收藏' : '收藏'}`;
        }
    }
}

// 检查是否已收藏
function isFavorite(productId) {
    return favorites.some(f => f.id === productId);
}

// 渲染收藏列表
function renderFavorites() {
    if (favorites.length === 0) {
        favoritesBody.innerHTML = `
            <div class="empty-favorites">
                <i class="fas fa-heart"></i>
                <p>还没有收藏商品</p>
            </div>
        `;
        return;
    }

    favoritesBody.innerHTML = favorites.map(item => `
        <div class="favorite-item" onclick="openProductModal(${item.id})">
            <div class="favorite-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80x80?text=商品'">
            </div>
            <div class="favorite-item-info">
                <div class="favorite-item-name">${item.name}</div>
                <div class="favorite-item-price">¥${item.price.toFixed(2)}</div>
            </div>
        </div>
    `).join('');
}

// 打开侧边栏
function openSidebar(type) {
    if (type === 'cart') {
        cartSidebar.classList.add('active');
        renderCart();
    } else if (type === 'favorites') {
        favoritesSidebar.classList.add('active');
        renderFavorites();
    }
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 关闭侧边栏
function closeSidebar(type) {
    if (type === 'cart') {
        cartSidebar.classList.remove('active');
    } else if (type === 'favorites') {
        favoritesSidebar.classList.remove('active');
    }
    
    if (!cartSidebar.classList.contains('active') && !favoritesSidebar.classList.contains('active')) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// 更新购物车数量
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'flex' : 'none';
}

// 更新收藏数量
function updateFavoritesCount() {
    favoritesCount.textContent = favorites.length;
    favoritesCount.style.display = favorites.length > 0 ? 'flex' : 'none';
}

// 显示提示消息
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 保存购物车到本地存储
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 保存收藏到本地存储
function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// 初始化滚动显示动画
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    const elementsToReveal = document.querySelectorAll('.product-card.scroll-reveal, .section-header, .footer-section');
    elementsToReveal.forEach(el => {
        if (!el.classList.contains('revealed')) {
            observer.observe(el);
        }
    });
}

// 页面加载时渲染购物车和收藏
window.addEventListener('load', () => {
    renderCart();
    renderFavorites();
    // 重新初始化滚动动画（因为商品是动态生成的）
    setTimeout(() => {
        initScrollReveal();
    }, 100);
});

