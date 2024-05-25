# syntax=docker/dockerfile:1

FROM php:8.2-cli

LABEL maintainer="theotchlx"
LABEL version="1.0"
LABEL description="cash-chan"

# Install PostgreSQL extension for PHP.
#RUN apt-get update && apt-get install -y php-pgsql
RUN docker-php-ext-install

USER www-data
COPY .src/ /usr/src/cash-chan
WORKDIR /usr/src/cash-chan

USER root
CMD ["php", "-S", "0.0.0.0:3000"]
EXPOSE 3000
