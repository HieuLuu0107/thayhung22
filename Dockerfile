FROM php:8.2-apache

# Cài extension Laravel cần
RUN apt-get update && apt-get install -y \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    curl \
    git \
    mariadb-client \
    && docker-php-ext-install pdo pdo_mysql mbstring bcmath

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Cài Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set workdir
WORKDIR /var/www/html

# Copy toàn bộ source vào image
COPY . .

# Cài dependency
RUN composer install --optimize-autoloader --no-dev

# Laravel permission
RUN chown -R www-data:www-data \
    storage \
    bootstrap/cache

# Chạy Laravel từ thư mục public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

# Expose port (Render sẽ dùng)
EXPOSE 8080

CMD ["apache2-foreground"]

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

