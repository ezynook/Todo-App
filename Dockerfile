FROM php:8.3-apache
MAINTAINER Pasit Y.

WORKDIR /var/www/html

RUN apt-get update -y && apt-get install -y vim net-tools
RUN apt-get install -y libbz2-dev sqlite3 libsqlite3-dev \
    libssl-dev libcurl4-openssl-dev libjpeg-dev \
    libonig-dev libreadline-dev libtidy-dev libxslt-dev \
    libzip-dev

RUN cp /usr/local/etc/php/php.ini-development /usr/local/etc/php/php.ini

COPY ./App/ .

RUN docker-php-ext-install mysqli pdo pdo_mysql pdo_sqlite \
    && a2enmod rewrite \
    && a2enmod headers