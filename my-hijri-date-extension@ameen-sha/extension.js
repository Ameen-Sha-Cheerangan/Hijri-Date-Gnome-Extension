const St = imports.gi.St;
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const GLib = imports.gi.GLib;  // ADD THIS LINE
Me.imports.suncalc;


const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const GObject = imports.gi.GObject;


let dateLabel;
let settings;
let periodicTimeout;  // ADD THIS LINE

// Default values of Holy city of Mecca
const DEFAULT_LATITUDE = 21.4224779;
const DEFAULT_LONGITUDE = 39.8251832;

const HijriDateIndicator = GObject.registerClass(
    class HijriDateIndicator extends PanelMenu.Button {
        _init() {
            super._init(0.0, 'HijriDateIndicator', false);

            this._settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.my-hijri-date-extension');

            // Create the main label that appears in the panel
            this.dateLabel = new St.Label({
                style_class: 'hijri-date-label',
                y_align: St.Align.MIDDLE
            });

            this.add_child(this.dateLabel);

            // Add a simple menu item
            this.settingsItem = new PopupMenu.PopupMenuItem('🌙 Open Settings');
            this.menu.addMenuItem(this.settingsItem);

            // Connect the menu item to open preferences
            this.settingsItem.connect('activate', () => {
                ExtensionUtils.openPrefs();
            });

            // Set up settings connections
            this._settings.connect('changed::date-adjustment', () => this._updateDate());
            this._settings.connect('changed::mycolor', () => this._updateDate());
            this._settings.connect('changed::latitude', () => this._updateDate());
            this._settings.connect('changed::longitude', () => this._updateDate());

            // Initial date update
            this._updateDate();
        }

        _updateDate() {
            const change = this._settings.get_int('date-adjustment');
            const [latitude, longitude] = getLatLon();

            const currentDate = new Date();
            let sunset = getSunsetTime(new Date(), latitude, longitude);

            let hijriDate = new Date(currentDate);
            if (currentDate >= sunset) {
                hijriDate.setDate(hijriDate.getDate() + 1);
            }

            hijriDate.setDate(hijriDate.getDate() + change);
            const formatter = new Intl.DateTimeFormat("ar-IN-u-ca-islamic", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
            const modifiedHijriDate = formatter.format(hijriDate);

            // Get color from settings
            let color = this._settings.get_string('mycolor') || 'rgb(212, 215, 155)';
            this.dateLabel.set_style(`color: ${color};`);
            this.dateLabel.set_text(`${modifiedHijriDate}`);
        }
    }
);


function getLatLon() {
    let latitude = settings.get_double('latitude');
    let longitude = settings.get_double('longitude');
    // Use default if not set or 0
    if (!latitude || !longitude) {
        latitude = DEFAULT_LATITUDE;
        longitude = DEFAULT_LONGITUDE;
    }
    return [latitude, longitude];
}

function getSunsetTime(date, lat, lon) {
    try {
        const times = SunCalc.getTimes(date, lat, lon);

        // Check if sunset time is valid
        if (!times.sunset || isNaN(times.sunset.getTime())) {
            log(`Invalid sunset time calculated. Using Mecca defaults.`);
            return SunCalc.getTimes(date, DEFAULT_LATITUDE, DEFAULT_LONGITUDE).sunset;
        }

        return times.sunset;
    } catch (error) {
        log(`SunCalc error: ${error.message}. Using Mecca defaults.`);
        // Fallback to Mecca coordinates
        try {
            return SunCalc.getTimes(date, DEFAULT_LATITUDE, DEFAULT_LONGITUDE).sunset;
        } catch (fallbackError) {
            log(`Fallback SunCalc error: ${fallbackError.message}. Using 6 PM as sunset.`);
            // Ultimate fallback: assume 6 PM sunset
            const fallbackSunset = new Date(date);
            fallbackSunset.setHours(18, 0, 0, 0);
            return fallbackSunset;
        }
    }
}

function setDate() {

    const change = settings.get_int('date-adjustment');
    const [latitude, longitude] = getLatLon();

    const currentDate = new Date();
    let sunset = getSunsetTime(new Date(), latitude, longitude);

    let hijriDate = new Date(currentDate);
    if (currentDate >= sunset) {
        hijriDate.setDate(hijriDate.getDate() + 1);
    }

    hijriDate.setDate(hijriDate.getDate() + change);
    const formatter = new Intl.DateTimeFormat("ar-IN-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    const modifiedHijriDate = formatter.format(hijriDate);
    // Get color from settings (default to white if not set)
    let color = settings.get_string('mycolor') || 'rgba(255,255,255,1)';
    dateLabel.set_style(`color: ${color};`);
    dateLabel.set_text(`${modifiedHijriDate}`);
}

function init() {
}

function enable() {
    settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.my-hijri-date-extension');
    dateLabel = new HijriDateIndicator();

    // Get position from settings
    let position = settings.get_string('panel-position') || 'left';
    let area = position === 'right' ? 'right' : 'left';
    let index = position === 'right' ? 0 : 1;

    Main.panel.addToStatusArea('hijri-date-indicator', dateLabel, index, area);

    // Listen for position changes and recreate the indicator
    settings.connect('changed::panel-position', () => {
        // Remove current indicator
        if (dateLabel) {
            dateLabel.destroy();
        }

        // Create new indicator with new position
        dateLabel = new HijriDateIndicator();
        let newPosition = settings.get_string('panel-position') || 'left';
        let newArea = newPosition === 'right' ? 'right' : 'left';
        let newIndex = newPosition === 'right' ? 0 : 1;

        Main.panel.addToStatusArea('hijri-date-indicator', dateLabel, newIndex, newArea);
    });

    periodicTimeout = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 60, () => {
        try {
            if (dateLabel && dateLabel._updateDate) {
                dateLabel._updateDate();
            } else {
                setDate();
            }
        } catch (error) {
            log(`Periodic update error: ${error}`);
        }
        return GLib.SOURCE_CONTINUE;
    });
}

function disable() {
    if (periodicTimeout) {
        GLib.source_remove(periodicTimeout);
        periodicTimeout = null;
    }

    if (dateLabel) {
        dateLabel.destroy();
        dateLabel = null;
    }

    settings = null;
}
