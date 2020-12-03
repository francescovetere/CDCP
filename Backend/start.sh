echo "Starting mysql..."
sudo mysql -u root -proot < DB/makeDB.sql

echo "Starting server..."
node src/server.js
