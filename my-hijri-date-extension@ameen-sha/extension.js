const St = imports.gi.St;
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const GLib = imports.gi.GLib;  // ADD THIS LINE
Me.imports.suncalc;

let dateLabel;
let settings;
let settingsChangedSignal;
let colorChangedSignal;
let latChangedSignal;
let lonChangedSignal;
let periodicTimeout;  // ADD THIS LINE

// Default values of Holy city of Mecca
const DEFAULT_LATITUDE = 21.4224779;
const DEFAULT_LONGITUDE = 39.8251832;

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
    let times = SunCalc.getTimes(new Date(), latitude, longitude);
    let sunset = times.sunset;

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
    dateLabel = new St.Label({
        style_class: "hijri-date-label",
    });
    setDate();
    Main.panel._leftBox.insert_child_at_index(dateLabel, 1);
    Main.panel._leftBox.set_child_at_index(dateLabel, 1);
    // Listen for changes in the setting and update date
    settingsChangedSignal = settings.connect('changed::date-adjustment', setDate);
    colorChangedSignal = settings.connect('changed::mycolor', setDate);
    latChangedSignal = settings.connect('changed::latitude', setDate);
    lonChangedSignal = settings.connect('changed::longitude', setDate);
    // Add periodic refresh every 60 seconds to catch sunset transitions
    periodicTimeout = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 60, () => {
        setDate();
        return GLib.SOURCE_CONTINUE; // Keep the timeout running
    });
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
    if (latChangedSignal) {
        settings.disconnect(latChangedSignal);
        latChangedSignal = null;
    }
    if (lonChangedSignal) {
        settings.disconnect(lonChangedSignal);
        lonChangedSignal = null;
    }
    // ADD THESE LINES
    if (periodicTimeout) {
        GLib.source_remove(periodicTimeout);
        periodicTimeout = null;
    }
    Main.panel._leftBox.remove_child(dateLabel);
    dateLabel.destroy();
    dateLabel = null;
    settings = null;
}
