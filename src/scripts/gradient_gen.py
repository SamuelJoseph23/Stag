import webcolors


def hex_to_rgb(hex_color):
    """Converts a hex color string to an (R, G, B) tuple."""
    return webcolors.hex_to_rgb(hex_color)


def rgb_to_hex(rgb_tuple):
    """Converts an (R, G, B) tuple to a hex color string."""
    # webcolors returns lowercase hex, which is fine for CSS
    return webcolors.rgb_to_hex(rgb_tuple)


def interpolate_color(start_hex, end_hex, num_steps, category_name):
    """
    Generates a color ramp by linear interpolation between two hex colors,
    and formats them as a string of CSS variables.
    """
    start_rgb = hex_to_rgb(start_hex)
    end_rgb = hex_to_rgb(end_hex)

    # Initialize the output string
    css_variables_string = ""

    # Calculate the step size for each color channel (R, G, B)
    # The step calculation is based on the linear interpolation formula
    # Step = (End - Start) / (N - 1)
    r_step = (end_rgb.red - start_rgb.red) / (num_steps - 1)
    g_step = (end_rgb.green - start_rgb.green) / (num_steps - 1)
    b_step = (end_rgb.blue - start_rgb.blue) / (num_steps - 1)

    for i in range(num_steps):
        # Calculate the interpolated RGB values for step i
        r = int(round(start_rgb.red + r_step * i))
        g = int(round(start_rgb.green + g_step * i))
        b = int(round(start_rgb.blue + b_step * i))

        # Ensure values are clamped between 0 and 255
        r = max(0, min(255, r))
        g = max(0, min(255, g))
        b = max(0, min(255, b))

        # Convert the new RGB value back to hex
        new_hex = rgb_to_hex((r, g, b))

        # Format the CSS variable string
        variable_name = f"--color-chart-{category_name}-{i + 1}"
        css_variables_string += f"{variable_name}: {new_hex};\n"

    return css_variables_string


# --- Configuration ---
# 1. Choose the category name
CATEGORY = "Red"

# 2. Use the recommended Tailwind compatible hex codes
START_HEX = "#fca5a5"  # Fuchsia-300
END_HEX = "#dc2626"  # Fuchsia-600

# 3. Define the number of colors in the range
NUM_COLORS = 100
# ---------------------


# Generate and print the output
css_output = interpolate_color(START_HEX, END_HEX, NUM_COLORS, CATEGORY)
print(css_output)