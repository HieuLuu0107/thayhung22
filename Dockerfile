FROM php:8.2-apache

# Cài extension cần thiết
RUN apt-get update && apt-get install -y \
    libzip-dev unzip \
    && docker-php-ext-install pdo pdo_mysql zip

# Cài Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy source code vào container
COPY . /var/www/html

WORKDIR /var/www/html

# Cài đặt Laravel
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Tạo key app
RUN php artisan key:generate

# Phân quyền cho storage và cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Bật mod_rewrite
RUN a2enmod rewrite

# Cấu hình Apache cho Laravel public/
RUN echo "<Directory /var/www/html/public>\n\
    AllowOverride All\n\
</Directory>" >> /etc/apache2/apache2.conf

EXPOSE $PORT
