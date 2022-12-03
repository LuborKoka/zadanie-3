FROM postgres
ENV POSTGRES_PASSWORD postgres
ENV POSTGRES_DB VAVJS
COPY vavjs.sql /docker-entrypoint-initdb.d/

EXPOSE 5432