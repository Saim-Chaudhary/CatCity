# CatCity Digital Twin 🐱

A community cat mapping platform where users report cat sightings,
feeding stations, shelters, and rescue requests — building a live
digital twin of street cat activity to help volunteers and rescue
organizations respond faster.

## 🚀 Tech Stack
- React + Vite
- Leaflet / React-Leaflet (interactive map)
- leaflet.heat (heatmap visualization)

## ✅ Current Features
- Auto-detects user location and flies map to their city
- Click anywhere on map to drop a report pin
- Report types: Cat Sighting, Feeding Station, Shelter, Rescue Needed
- Live heatmap showing cat activity hotspots
- Stats bar showing live counts per category
- Rescue count highlights red when rescue reports exist

## 🔜 Coming Soon
- Supabase database (persist reports across sessions)
- All users see same live data in real time
- Filter map by report type
- Deploy to Vercel

## 🛠️ Run Locally
git clone https://github.com/Saim-Chaudhary/CatCity.git
cd catcity
npm install
npm run dev