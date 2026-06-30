# ==========================================
# STAGE 1: Build Composer Dependencies
# ==========================================
FROM composer:2.8 as builder

WORKDIR /app

# Copy composer files from backend
COPY backend/composer.json backend/composer.lock ./

# Install dependencies (no dev, optimized)
RUN composer install \
    --no-dev \
    --ignore-platform-reqs \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --prefer-dist

# ==========================================
# STAGE 2: Runtime Environment (Production)
# ==========================================
FROM php:8.4-fpm-alpine as runner

WORKDIR /var/www/html

# Install install-php-extensions helper (pre-compiled binaries, much faster than manual compile)
ADD --chmod=0755 https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

# Install all required PHP extensions in one fast layer
RUN install-php-extensions \
    pdo_pgsql \
    pgsql \
    bcmath \
    gd \
    zip \
    opcache \
    intl \
    redis

# Copy custom php.ini configuration
COPY docker/backend/php.ini /usr/local/etc/php/conf.d/custom.ini

# Copy opcache preload script
COPY docker/backend/opcache-preload.php /usr/local/etc/php/opcache-preload.php

# Use the default production configuration
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Copy backend source files
COPY backend/ .

# Copy vendors from builder stage
COPY --from=builder /app/vendor ./vendor

# Set permissions for Laravel storage & bootstrap/cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port 9000 for PHP-FPM
EXPOSE 9000

# Start php-fpm as www-data
USER www-data

CMD ["php-fpm"]
