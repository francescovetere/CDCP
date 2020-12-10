echo "Starting mysql..."
PSW="root"
mysql -u root -p$PSW < DB/makeDB.sql

echo "Starting node server..."
node src/server.js
