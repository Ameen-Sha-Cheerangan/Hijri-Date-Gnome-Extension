import Gtk from 'gi://Gtk';
import Gdk from 'gi://Gdk';
import Gio from 'gi://Gio';
import Adw from 'gi://Adw'; // Required for the window container

import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class MyHijriDatePrefs extends ExtensionPreferences {

    fillPreferencesWindow(window) {
        // 1. Use built-in settings method
        const settings = this.getSettings('org.gnome.shell.extensions.my-hijri-date-extension');
        // 2. Load CSS (Fixed for GTK4)
        this._loadCss();

        // 3. Create the standard Adwaita page structure
        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup();

        // 4. Build your custom UI
        const customBox = this._buildUI(settings);
        
        // Add your box to the group, and group to page
        group.add(customBox);
        page.add(group);
        
        window.add(page);
    }

    _loadCss() {
        let cssProvider = new Gtk.CssProvider();
        // ExtensionPreferences provides 'this.dir' (Gio.File)
        let cssPath = this.dir.get_child('stylesheet.css');
        
        try {
            cssProvider.load_from_file(cssPath);
            Gtk.StyleContext.add_provider_for_display(
                Gdk.Display.get_default(),
                cssProvider,
                Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
            );
        } catch (e) {
            console.error(`Failed to load CSS: ${e.message}`);
        }
    }

    _buildUI(settings) {
        let sizeGroup = new Gtk.SizeGroup({ mode: Gtk.SizeGroupMode.HORIZONTAL });

        let box = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 18,
            margin_top: 24,
            margin_bottom: 24,
            margin_start: 24,
            margin_end: 24
        });

        // --- Hijri Date Adjustment ---
        let spin = new Gtk.SpinButton({
            adjustment: new Gtk.Adjustment({ lower: -3, upper: 3, step_increment: 1 }),
            value: settings.get_int('date-adjustment'),
            digits: 0,
            halign: Gtk.Align.END,
            width_request: 150
        });
        spin.connect('value-changed', () => {
            settings.set_int('date-adjustment', spin.get_value_as_int());
        });
        sizeGroup.add_widget(spin);

        box.append(this._createRow(
            "Hijri Date Adjustment",
            "Adjust the Hijri date by this many days to match local moonsighting.",
            spin
        ));

        // --- Date Color ---
        let colorButton = new Gtk.ColorButton({
            halign: Gtk.Align.END,
            width_request: 150
        });
        
        try {
            let rgba = new Gdk.RGBA();
            rgba.parse(settings.get_string('mycolor'));
            colorButton.set_rgba(rgba);
        } catch (e) { 
            console.warn("Color parse error, using default"); 
        }

        colorButton.connect('color-set', (widget) => {
            let newRgba = widget.get_rgba();
            settings.set_string('mycolor', newRgba.to_string());
        });
        sizeGroup.add_widget(colorButton);

        box.append(this._createRow(
            "Date Color",
            "Choose the color for the Hijri date display in the top panel.",
            colorButton
        ));

        // --- Location entries ---
        let entriesBox = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 8,
            halign: Gtk.Align.END,
            width_request: 150
        });

        let latEntry = new Gtk.Entry({
            placeholder_text: "Latitude (e.g. 28.6139)",
            text: settings.get_double('latitude') ? settings.get_double('latitude').toString() : ""
        });
        latEntry.connect('changed', () => {
            let val = parseFloat(latEntry.get_text());
            if (!isNaN(val) && val >= -90 && val <= 90) {
                settings.set_double('latitude', val); 
                latEntry.remove_css_class('error'); // GTK4 Syntax
            } else if (latEntry.get_text() !== '') {
                latEntry.add_css_class('error');    // GTK4 Syntax
            }
        });

        let lonEntry = new Gtk.Entry({
            placeholder_text: "Longitude (e.g. 77.2090)",
            text: settings.get_double('longitude') ? settings.get_double('longitude').toString() : ""
        });
        lonEntry.connect('changed', () => {
            let val = parseFloat(lonEntry.get_text());
            if (!isNaN(val) && val >= -180 && val <= 180) {
                settings.set_double('longitude', val);
                lonEntry.remove_css_class('error'); // GTK4 Syntax
            } else if (lonEntry.get_text() !== '') {
                lonEntry.add_css_class('error');    // GTK4 Syntax
            }
        });

        entriesBox.append(latEntry);
        entriesBox.append(lonEntry);
        sizeGroup.add_widget(entriesBox);

        box.append(this._createRow(
            "Location (optional)",
            "The Islamic day starts at sunset. Providing coordinates ensures accurate sunset times.",
            entriesBox,
            true
        ));

        // --- Panel Position ---
        let positionContainer = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            halign: Gtk.Align.END,
            width_request: 150
        });

        let positionCombo = new Gtk.ComboBoxText({ hexpand: true });
        positionCombo.append('left', 'Left Side');
        positionCombo.append('right', 'Right Side');
        positionCombo.set_active_id(settings.get_string('panel-position'));
        positionCombo.connect('changed', () => {
            settings.set_string('panel-position', positionCombo.get_active_id());
        });

        positionContainer.append(positionCombo);
        sizeGroup.add_widget(positionContainer);

        box.append(this._createRow(
            "Panel Position",
            "Select your preferred location for the Hijri date display",
            positionContainer
        ));

        return box;
    }

    _createRow(title, desc, control, use_markup = false) {
        let row = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 24,
            margin_top: 12,
            margin_bottom: 12,
            homogeneous: false
        });

        // Left side
        let labelBox = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 4,
            hexpand: true,
            hexpand_set: true
        });

        let titleLabel = new Gtk.Label({
            label: `<b>${title}</b>`,
            use_markup: true,
            halign: Gtk.Align.START,
            xalign: 0
        });

        let descLabel = new Gtk.Label({
            label: desc,
            use_markup: use_markup,
            wrap: true,
            halign: Gtk.Align.START,
            xalign: 0
        });
        
        // GTK4 Syntax: add_css_class
        descLabel.add_css_class('dim-label');

        labelBox.append(titleLabel);
        labelBox.append(descLabel);

        // Right side
        let controlContainer = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            halign: Gtk.Align.END,
            valign: Gtk.Align.CENTER,
            hexpand: false,
            hexpand_set: true
        });

        controlContainer.append(control);

        row.append(labelBox);
        row.append(controlContainer);

        return row;
    }
}