---

# Hijri-Date-Gnome-Extension

Display the Hijri date in the GNOME top panel.

> **Note:**  
> The Hijri date may differ by one or more days depending on local moon sightings. This extension uses a standard algorithm and provides an option to adjust the date for your region. **Do not use for important things.**

---

## Description

Hijri Date Extension is a GNOME Shell extension that displays the current Hijri date in the top panel of the GNOME Shell, with options to adjust the date and customize its appearance.

---

## Features

- **Displays the current Hijri date** in the GNOME top panel.
- **User-adjustable date offset** to match local moon sighting (±3 days).
- **Color customization**: Pick your preferred date color using a color picker.
- **Automatic daily update** based on system time.
- **Easy configuration** through a graphical preferences dialog.

---

## Installation

### **A. Install via GNOME Extensions Website (Recommended)**

1. Visit [Hijri Date Extension on extensions.gnome.org](https://extensions.gnome.org/extension/YOUR-EXTENSION-ID/)  
   *(Replace with your actual extension URL)*
2. Click the toggle to install.
3. Approve the installation in your browser and GNOME Shell.
4. The extension will appear in your top panel automatically.

### **B. Manual Installation from GitHub**

1. Download or clone this repository:
   ```sh
   git clone https://github.com/Ameen-Sha-Cheerangan/Hijri-Date-Gnome-Extension.git
   ```
2. Copy the extension folder to your local GNOME extensions directory:
   ```sh
   cp -r Hijri-Date-Gnome-Extension/my-hijri-date-extension@ameen-sha ~/.local/share/gnome-shell/extensions/
   ```
3. Enable the extension:
   ```sh
   gnome-extensions enable my-hijri-date-extension@ameen-sha
   ```
4. Restart GNOME Shell:
   - On Xorg: Press `Alt+F2`, type `r`, and press Enter.
   - On Wayland: Log out and log back in.

---

## Usage & Features

### **1. Adjusting the Hijri Date for Local Moon Sighting**

- Right-click the extension in the Extensions app and select the **gear icon** (Preferences), or run:
  ```sh
  gnome-extensions prefs my-hijri-date-extension@ameen-sha
  ```
- In the preferences dialog, use the **"Hijri Date Adjustment (days)"** spin button to shift the date forward or backward (e.g., +1 or -1) to match your local moon sighting.

### **2. Customizing the Date Color**

- In the same preferences dialog, use the **color picker** to choose your preferred color for the date display in the top panel.
- The date color will update instantly.

### **3. Automatic Updates**

- The extension updates the Hijri date automatically based on your system time.
- No manual refresh is needed.

---

## Contributing

Contributions are welcome!  
If you have suggestions, improvements, or bug fixes, please [open an issue](https://github.com/Ameen-Sha-Cheerangan/Hijri-Date-Gnome-Extension/issues) or submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

**Enjoy your customizable Hijri date in GNOME!**
