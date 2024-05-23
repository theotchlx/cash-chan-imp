# syntax=docker/dockerfile:1

FROM php:7.4-apache
WORKDIR /app
COPY . .
CMD ["php", "-S", "0.0.0.0:3000"]
EXPOSE 3000