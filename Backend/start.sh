echo "Starting mysql..."
echo "root" > sudo mysql -u root -p < DB/makeDB.sql

echo "Starting node server..."
node src/server.js
