FROM php:8.2-apache

# Cài extension Laravel cần
RUN apt-get update && apt-get install -y \
    libonig-dev \
    libxml2-dev \
    zip unzip curl git mariadb-client \
    && docker-php-ext-install pdo pdo_mysql mbstring bcmath

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Cài Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Laravel code nằm tại /var/www (cho rõ ràng)
WORKDIR /var/www

COPY . .

# Laravel permission fix (QUAN TRỌNG)
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Cài dependency
RUN composer install --optimize-autoloader --no-dev

# CHỈNH Apache DocumentRoot về đúng thư mục public
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/public|' /etc/apache2/sites-available/000-default.conf

# Sửa luôn <Directory> để hỗ trợ mod_rewrite
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Bỏ lỗi ServerName
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Expose port
EXPOSE 8080

CMD ["apache2-foreground"]
