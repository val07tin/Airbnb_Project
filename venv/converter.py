import re #search test patterns

input_file = "ward1.txt"
output_file = "clean_ward1.txt"

# Read the whole file
with open(input_file, "r") as f:
    text = f.read()

# Find all coordinate pairs (number space number)
pattern = r'(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)'
matches = re.findall(pattern, text)

# Write cleaned coordinates
with open(output_file, "w") as f:
    for x, y in matches:
        f.write(f"{x},{y}\n")

print("Finished cleaning coordinates.")
print(f"Saved to {output_file}")