FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=sesame
ENV MYSQL_DATABASE=stubank
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=password

COPY data.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
