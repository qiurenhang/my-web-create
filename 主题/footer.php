<?php
/**
 * 主题底部模板
 *
 * @package Tobacco_Wine_Shop
 * @since 1.0.0
 */
?>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>关于我们</h4>
                    <p>专业烟酒销售平台，正品保障，品质服务</p>
                </div>
                <div class="footer-section">
                    <h4>服务支持</h4>
                    <ul>
                        <li><a href="#">配送说明</a></li>
                        <li><a href="#">退换货政策</a></li>
                        <li><a href="#">常见问题</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>联系方式</h4>
                    <p>客服热线：400-888-8888</p>
                    <p>工作时间：9:00-21:00</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. 保留所有权利.</p>
            </div>
        </div>
    </footer>

    <?php wp_footer(); ?>
</body>
</html>

