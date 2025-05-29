const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Gdk = imports.gi.Gdk;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = imports.misc.extensionUtils.getCurrentExtension();

let cssProvider = new Gtk.CssProvider();
cssProvider.load_from_path(Me.path + '/stylesheet.css');
Gtk.StyleContext.add_provider_for_display(
    Gdk.Display.get_default(),
    cssProvider,
    Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
);


function init() { }

function createRow(title, desc, control, use_markup = false) {
    let row = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 24,
        margin_top: 12,
        margin_bottom: 12,
        homogeneous: false  // Allow different proportions
    });

    // Left side: ~70% of available space
    let labelBox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 4,
        hexpand: true,  // Expand to fill available space
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
    descLabel.get_style_context().add_class('dim-label');

    labelBox.append(titleLabel);
    labelBox.append(descLabel);

    // Right side: control container
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

function buildPrefsWidget() {
    let settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.my-hijri-date-extension');

    let sizeGroup = new Gtk.SizeGroup({ mode: Gtk.SizeGroupMode.HORIZONTAL });

    // Main container with proper margins
    let box = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 18,
        margin_top: 24,
        margin_bottom: 24,
        margin_start: 24,
        margin_end: 24
    });

    // Hijri Date Adjustment Row
    let spin = new Gtk.SpinButton({
        adjustment: new Gtk.Adjustment({ lower: -3, upper: 3, step_increment: 1 }),
        value: settings.get_int('date-adjustment'),
        digits: 0,
        halign: Gtk.Align.END,
        width_request: 150  // Fixed width
    });
    spin.connect('value-changed', () => {
        settings.set_int('date-adjustment', spin.get_value_as_int());
    });
    sizeGroup.add_widget(spin);  // Add to size group

    box.append(createRow(
        "Hijri Date Adjustment",
        "Adjust the Hijri date by this many days to match local moonsighting.",
        spin
    ));

    // Date Color Row
    let colorButton = new Gtk.ColorButton({
        halign: Gtk.Align.END,
        width_request: 150  // Same fixed width
    });
    let rgba = new Gdk.RGBA();
    rgba.parse(settings.get_string('mycolor'));
    colorButton.set_rgba(rgba);
    colorButton.connect('color-set', (widget) => {
        let newRgba = widget.get_rgba();
        settings.set_string('mycolor', newRgba.to_string());
    });
    sizeGroup.add_widget(colorButton);  // Add to size group

    box.append(createRow(
        "Date Color",
        "Choose the color for the Hijri date display in the top panel.",
        colorButton
    ));

    // Location entries
    let entriesBox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 8,
        halign: Gtk.Align.END,
        width_request: 150  // Same fixed width
    });

    let latEntry = new Gtk.Entry({
        placeholder_text: "Latitude (e.g. 28.6139)",
        text: settings.get_double('latitude') ? settings.get_double('latitude').toString() : ""
    });
    latEntry.connect('changed', () => {
        let val = parseFloat(latEntry.get_text());
        if (!isNaN(val) && val >= -90 && val <= 90) {
            settings.set_double('latitude', val); latEntry.get_style_context().remove_class('error');
        } else if (latEntry.get_text() !== '') {
            latEntry.get_style_context().add_class('error');
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
            lonEntry.get_style_context().remove_class('error');
        } else if (lonEntry.get_text() !== '') {
            lonEntry.get_style_context().add_class('error');
        }
    });

    entriesBox.append(latEntry);
    entriesBox.append(lonEntry);
    sizeGroup.add_widget(entriesBox);  // Add to size group

    box.append(createRow(
        "Location (optional)",
        "The Islamic day starts at sunset, which varies by location. Providing your coordinates ensures accurate sunset times. <a href='https://www.latlong.net/'>How to get your coordinates?</a>",
        entriesBox,
        true
    ));

    return box;
}
