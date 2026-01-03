<?php
/**
 * 精品烟酒商城主题 - 主模板文件
 *
 * @package Tobacco_Wine_Shop
 * @since 1.0.0
 */

get_header();
?>
    <!-- 顶部导航栏 -->
    <header class="header">
        <div class="container">
            <div class="header-top">
                <div class="logo">
                    <i class="fas fa-wine-bottle"></i>
                    <span><?php bloginfo('name'); ?></span>
                </div>
                <div class="header-actions">
                    <div class="search-box" style="position: relative;">
                        <input type="text" id="searchInput" placeholder="搜索商品...">
                        <button class="search-btn"><i class="fas fa-search"></i></button>
                        <div class="search-suggestions" id="searchSuggestions"></div>
                    </div>
                    <div class="user-actions">
                        <a href="#" class="action-btn" id="favoritesBtn">
                            <i class="fas fa-heart"></i>
                            <span class="badge" id="favoritesCount">0</span>
                        </a>
                        <a href="#" class="action-btn" id="cartBtn">
                            <i class="fas fa-shopping-cart"></i>
                            <span class="badge" id="cartCount">0</span>
                        </a>
                        <a href="#" class="action-btn">
                            <i class="fas fa-user"></i>
                        </a>
                    </div>
                </div>
            </div>
            <nav class="main-nav">
                <ul>
                    <li><a href="<?php echo esc_url(home_url('/')); ?>" class="nav-link">主页</a></li>
                    <li><a href="#" class="nav-link active" data-category="all">全部商品</a></li>
                    <li><a href="#" class="nav-link" data-category="wine">白酒</a></li>
                    <li><a href="#" class="nav-link" data-category="beer">啤酒</a></li>
                    <li><a href="#" class="nav-link" data-category="whiskey">洋酒</a></li>
                    <li><a href="<?php echo esc_url(get_page_url_by_title('我的账户')); ?>" class="nav-link">我的账户</a></li>
                    <li><a href="<?php echo esc_url(get_page_url_by_title('购物车')); ?>" class="nav-link">购物车</a></li>
                    <li><a href="<?php echo esc_url(get_page_url_by_title('联系我们')); ?>" class="nav-link">联系我们</a></li>
                    <li><a href="<?php echo esc_url(get_page_url_by_title('隐私政策')); ?>" class="nav-link">隐私政策</a></li>
                    <li><a href="<?php echo esc_url(get_page_url_by_title('退款和退货策略')); ?>" class="nav-link">退款退货</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- 轮播图 -->
    <section class="banner">
        <div class="banner-slider">
            <div class="slide active">
                <div class="slide-content">
                    <h2>精品烟酒，品质保证</h2>
                    <p>正品保障，假一赔十</p>
                    <button class="btn-primary">立即购买</button>
                </div>
            </div>
            <div class="slide">
                <div class="slide-content">
                    <h2>新用户专享优惠</h2>
                    <p>首单立减50元</p>
                    <button class="btn-primary">立即领取</button>
                </div>
            </div>
            <div class="slide">
                <div class="slide-content">
                    <h2>限时特惠</h2>
                    <p>全场满500减100</p>
                    <button class="btn-primary">查看详情</button>
                </div>
            </div>
        </div>
        <div class="banner-dots">
            <span class="dot active" data-slide="0"></span>
            <span class="dot" data-slide="1"></span>
            <span class="dot" data-slide="2"></span>
        </div>
    </section>

    <!-- 主要内容区域 -->
    <main class="main-content">
        <div class="container">
            <!-- 商品分类标题 -->
            <div class="section-header">
                <h2 id="sectionTitle">全部商品</h2>
                <div class="sort-options">
                    <select id="sortSelect">
                        <option value="default">默认排序</option>
                        <option value="price-asc">价格从低到高</option>
                        <option value="price-desc">价格从高到低</option>
                        <option value="sales">销量优先</option>
                    </select>
                </div>
            </div>

            <!-- 商品列表 -->
            <div class="products-grid" id="productsGrid">
                <!-- 商品卡片将通过JavaScript动态生成 -->
            </div>
        </div>
    </main>

    <!-- 购物车侧边栏 -->
    <div class="cart-sidebar" id="cartSidebar">
        <div class="cart-header">
            <h3>购物车</h3>
            <button class="close-btn" id="closeCart"><i class="fas fa-times"></i></button>
        </div>
        <div class="cart-body" id="cartBody">
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>购物车是空的</p>
            </div>
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <span>总计：</span>
                <span class="total-price">¥<span id="cartTotal">0.00</span></span>
            </div>
            <button class="btn-checkout" id="checkoutBtn">去结算</button>
        </div>
    </div>

    <!-- 收藏侧边栏 -->
    <div class="favorites-sidebar" id="favoritesSidebar">
        <div class="favorites-header">
            <h3>我的收藏</h3>
            <button class="close-btn" id="closeFavorites"><i class="fas fa-times"></i></button>
        </div>
        <div class="favorites-body" id="favoritesBody">
            <div class="empty-favorites">
                <i class="fas fa-heart"></i>
                <p>还没有收藏商品</p>
            </div>
        </div>
    </div>

    <!-- 遮罩层 -->
    <div class="overlay" id="overlay"></div>

    <!-- 商品详情模态框 -->
    <div class="product-modal" id="productModal">
        <div class="modal-content">
            <button class="modal-close" id="closeModal"><i class="fas fa-times"></i></button>
            <div class="modal-body" id="modalBody">
                <!-- 商品详情内容将通过JavaScript动态生成 -->
            </div>
        </div>
    </div>

    <!-- 提示消息 -->
    <div class="toast" id="toast"></div>

    <!-- 滚动到顶部按钮 -->
    <button class="scroll-to-top" id="scrollToTop" title="回到顶部">
        <i class="fas fa-arrow-up"></i>
    </button>

<?php get_footer(); ?>

