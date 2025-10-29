#!/bin/sh

# Espera o PostgreSQL iniciar completamente
echo "Waiting for postgres..."
while ! nc -z postgres 5432; do
  sleep 0.1
done
echo "PostgreSQL started"

# Roda as migrações
echo "Running migrations..."
npm run typeorm -- migration:run -d dist/db/data-source.js

# Inicia a aplicação
echo "Starting the app..."
exec "$@"
