import os

# Script to restructure the frontend files
os.makedirs('frontend', exist_ok=True)
os.makedirs('backend', exist_ok=True)

files_to_move = [
    'package.json', 'package-lock.json', 'vite.config.js', 'index.html', 'README.md', 'src', 'node_modules'
]

for file in files_to_move:
    if os.path.exists(file):
        try:
            os.rename(file, os.path.join('frontend', file))
            print(f"Moved {file} to frontend/")
        except Exception as e:
            print(f"Error moving {file}: {e}")

print("Restructure complete.")
