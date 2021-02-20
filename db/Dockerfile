FROM mysql:5.7

# Rename metadata so it sorts before the chart data and is imported first.
ADD https://files.ourworldindata.org/owid_metadata.sql.gz /docker-entrypoint-initdb.d/owid__metadata.sql.gz
ADD https://files.ourworldindata.org/owid_chartdata.sql.gz /docker-entrypoint-initdb.d/owid_chartdata.sql.gz
RUN chmod -R +r /docker-entrypoint-initdb.d
