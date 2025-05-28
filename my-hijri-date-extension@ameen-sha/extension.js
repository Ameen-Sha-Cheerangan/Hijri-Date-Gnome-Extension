const St = imports.gi.St;
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;

let dateLabel;
let settings;
let settingsChangedSignal;
let colorChangedSignal;

function setDate() {
    const change = settings.get_int('date-adjustment');
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + change);

    const formatter = new Intl.DateTimeFormat("ar-IN-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    const modifiedHijriDate = formatter.format(currentDate);
    // Get color from settings (default to white if not set)
    let color = settings.get_string('mycolor') || 'rgba(255,255,255,1)';
    dateLabel.set_style(`color: ${color};`);
    dateLabel.set_text(`${modifiedHijriDate}`);
}

function init() {
    // Initialize GSettings
    settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.my-hijri-date-extension');
}

function enable() {
    dateLabel = new St.Label({
        style_class: "hijri-date-label",
    });
    setDate();
    Main.panel._leftBox.insert_child_at_index(dateLabel, 1);
    Main.panel._leftBox.set_child_at_index(dateLabel, 1);
    // Listen for changes in the setting and update date
    settingsChangedSignal = settings.connect('changed::date-adjustment', setDate);
    colorChangedSignal = settings.connect('changed::mycolor', setDate);

}

function disable() {
    if (settingsChangedSignal) {
        settings.disconnect(settingsChangedSignal);
        settingsChangedSignal = null;
    }
    if (colorChangedSignal) {
        settings.disconnect(colorChangedSignal);
        colorChangedSignal = null;
    }
    Main.panel._leftBox.remove_child(dateLabel);
    dateLabel.destroy();
    dateLabel = null;
}
