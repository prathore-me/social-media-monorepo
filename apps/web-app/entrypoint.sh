#!/bin/sh
# Exit immediately if a command exits with a non-zero status.
set -e

echo "Injecting Runtime Environment Variables..."

# Find all JS files in the Nginx html folder
# We use | as a delimiter in sed because URLs contain forward slashes /
for file in /usr/share/nginx/html/assets/*.js; do
  echo "Processing $file..."
  sed -i "s|REPLACE_WITH_VITE_AUTH_API_URL|${VITE_AUTH_API_URL}|g" "$file"
  sed -i "s|REPLACE_WITH_VITE_USERS_API_URL|${VITE_USERS_API_URL}|g" "$file"
done

# Hand off to the original Nginx command
exec "$@"