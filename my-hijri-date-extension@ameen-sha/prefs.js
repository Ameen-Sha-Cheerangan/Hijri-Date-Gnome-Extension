const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Gdk = imports.gi.Gdk;

const ExtensionUtils = imports.misc.extensionUtils;

function init() { }

function buildPrefsWidget() {
    let settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.my-hijri-date-extension');

    let box = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 12
    });
    let label = new Gtk.Label({
        label: "Hijri Date Adjustment (days):",
        halign: Gtk.Align.START,
        margin_top: 12,
        margin_bottom: 6
    });

    let spinButton = new Gtk.SpinButton({
        adjustment: new Gtk.Adjustment({
            lower: -3,
            upper: 3,
            step_increment: 1,
        }),
        value: settings.get_int('date-adjustment'),
        digits: 0,
        margin_bottom: 12
    });

    spinButton.connect('value-changed', () => {
        settings.set_int('date-adjustment', spinButton.get_value_as_int());
    });

    let colorLabel = new Gtk.Label({
        label: "Pick a color for the date:",
        halign: Gtk.Align.START,
        margin_bottom: 6
    });

    let colorButton = new Gtk.ColorButton();
    let rgba = new Gdk.RGBA();
    // Make sure your schema has a string key "mycolor"
    rgba.parse(settings.get_string('mycolor'));
    colorButton.set_rgba(rgba);

    colorButton.connect('color-set', (widget) => {
        let newRgba = widget.get_rgba();
        settings.set_string('mycolor', newRgba.to_string());
    });


    box.append(label);
    box.append(spinButton);
    box.append(colorLabel);
    box.append(colorButton);
    box.show();

    return box;
}
