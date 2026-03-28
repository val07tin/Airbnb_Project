import re
import json

input_file = "clean_ward1.txt"
output_file = "ward1.geojson"

# Read full file
with open(input_file, "r") as f:
    text = f.read()

# Find coordinate pairs
pattern = r'(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)'
matches = re.findall(pattern, text)

# Build coordinate list
coordinates = []
for x, y in matches:
    coordinates.append([float(x), float(y)])

# Create GeoJSON structure
geojson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": coordinates
            },
            "properties": {}
        }
    ]
}

# Write file
with open(output_file, "w") as f:
    json.dump(geojson, f, indent=2)

print("GeoJSON created:", output_file)


