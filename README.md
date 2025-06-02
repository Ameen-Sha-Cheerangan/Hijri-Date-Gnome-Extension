---

# Hijri-Date-Gnome-Extension
[![Available on GNOME Extensions](https://img.shields.io/badge/GNOME%20Extensions-Available-brightgreen?logo=gnome)](https://extensions.gnome.org/extension/5995/hijri-date-extension/)

> 📦 **Officially published on [extensions.gnome.org](https://extensions.gnome.org/extension/5995/hijri-date-extension/)!**
>
> For the easiest installation and updates, use the official GNOME Extensions website.

Display the Hijri date in the GNOME top panel.
### Extension in Top Panel
![Extension in Panel](images/screenshot.png)

### Preferences Dialog
![Preferences Dialog](images/preferences.png)

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
- **Location-based sunset calculation**: Provide latitude/longitude for accurate Islamic day transitions.
- **Panel positioning**: Choose left or right side placement in the top panel.
- **Automatic daily update** based on system time and sunset calculations.
- **Easy configuration** through a graphical preferences dialog.

---

## System Requirements

- **GNOME Shell**: Version 42-43
- **Dependencies**: No additional packages required (SunCalc library included)

---

## Installation



### **A. Install via GNOME Extensions Website**

>#### Prerequisites
>  - If you are new to using gnome-extensions, Search online for understanding how to use gnome extensions for your distro.
>  - Make sure that the extension is supported ( You can check the metadata.json ).
        >  - To know your gnome shell version you can type ```gnome-shell --version``` , 
        >  - If the metadata.json lists support for 4x (e.g., 42), then all versions like 4x.y (e.g., 42.9) are also supported.
>  - For web installation, you may need browser connector support (varies by distribution). 
        
1. Visit [Hijri Date Extension on extensions.gnome.org](https://extensions.gnome.org/extension/5995/hijri-date-extension/) 
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
3. Restart GNOME Shell:
   - On Xorg: Press `Alt+F2`, type `r`, and press Enter.
   - On Wayland: Log out and log back in.
44. Enable the extension:
   ```sh
   gnome-extensions enable my-hijri-date-extension@ameen-sha
   ```
5. Restart GNOME Shell:
   - On Xorg: Press `Alt+F2`, type `r`, and press Enter.
   - On Wayland: Log out and log back in.

---

## Usage & Configuration

### **1. Adjusting the Hijri Date for Local Moon Sighting**

- Click on the date in the top panel to access the dropdown menu, then select settings
- Or right-click the extension in the Extensions app and select the **gear icon** (Preferences)
- Use the **"Hijri Date Adjustment (days)"** spin button to shift the date forward or backward (±3 days) to match your local moon sighting

### **2. Setting Your Location for Accurate Sunset Times**

- In the preferences dialog, enter your **latitude** and **longitude** coordinates
- This ensures accurate sunset calculations since Islamic days begin at sunset
- Find your coordinates at [latlong.net](https://www.latlong.net/)
- If no coordinates are provided, the extension defaults to Mecca's coordinates

### **3. Customizing Appearance**

- **Date Color**: Use the color picker to choose your preferred color for the date display
- **Panel Position**: Select whether to display the date on the left or right side of the top panel
- Changes apply instantly without requiring a restart

### **4. Automatic Updates**

- The extension automatically updates the Hijri date based on your system time
- Sunset times are calculated daily using your provided coordinates
- No manual refresh is needed

---


## Troubleshooting

### **Extension Not Appearing**

- Verify GNOME Shell version compatibility: `gnome-shell --version`
- Ensure the extension is enabled: `gnome-extensions list --enabled`
- Check for errors: `journalctl -f -o cat /usr/bin/gnome-shell`

### **Incorrect Date Display**

- Verify your latitude/longitude coordinates are correct
- Adjust the date offset in preferences to match local announcements from islamic authorities.

### **Preferences Not Opening**

- Try opening preferences via command line:
  ```bash
  gnome-extensions prefs my-hijri-date-extension@ameen-sha
  ```
---

---

## Contributing

Contributions are welcome! If you have suggestions, improvements, or bug fixes:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

Please [open an issue](https://github.com/Ameen-Sha-Cheerangan/Hijri-Date-Gnome-Extension/issues) for bug reports or feature requests.

---

## ⭐ Support

If you find this extension useful:
- Star the repository on [GitHub](https://github.com/Ameen-Sha-Cheerangan/Hijri-Date-Gnome-Extension)
- Rate it on [GNOME Extensions](https://extensions.gnome.org/extension/5995/hijri-date-extension/)
- Share it with others who might benefit

---

## License

This project is licensed under the [MIT License](LICENSE).

---
