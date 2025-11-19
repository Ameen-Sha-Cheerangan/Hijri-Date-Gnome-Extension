import GObject from 'gi://GObject';
import St from 'gi://St';
import GLib from 'gi://GLib';
import Clutter from 'gi://Clutter';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

// IMPORTANT: You must ensure your suncalc.js has "export" statements.
// See the note below this code block.
import * as SunCalc from './suncalc.cjs';

const DEFAULT_LATITUDE = 21.4224779;
const DEFAULT_LONGITUDE = 39.8251832;

const HijriDateIndicator = GObject.registerClass(
class HijriDateIndicator extends PanelMenu.Button {
    _init(extensionObject) {
        super._init(0.0, 'HijriDateIndicator', false);

        // We store the extension object to access settings and path
        this._extension = extensionObject;
        this._settings = this._extension.getSettings('org.gnome.shell.extensions.my-hijri-date-extension');
        this.dateLabel = new St.Label({
            style_class: 'hijri-date-label',
            y_align: Clutter.ActorAlign.CENTER
        });

        this.add_child(this.dateLabel);

        // Settings Menu Item
        this.settingsItem = new PopupMenu.PopupMenuItem('🌙 Open Settings');
        this.menu.addMenuItem(this.settingsItem);
        this.settingsItem.connect('activate', () => {
            this._extension.openPreferences();
        });

        // Connect signals
        this._settingsSignals = [];
        const signalIds = ['date-adjustment', 'mycolor', 'latitude', 'longitude'];
        
        signalIds.forEach(key => {
            let id = this._settings.connect(`changed::${key}`, () => this._updateDate());
            this._settingsSignals.push(id);
        });

        this._updateDate();
        
        // Start periodic timer (every 60 seconds)
        this._periodicTimeout = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 60, () => {
            this._updateDate();
            return GLib.SOURCE_CONTINUE;
        });
    }

    _getLatLon() {
        let latitude = this._settings.get_double('latitude');
        let longitude = this._settings.get_double('longitude');

        if (!latitude || !longitude) {
            latitude = DEFAULT_LATITUDE;
            longitude = DEFAULT_LONGITUDE;
        }
        return [latitude, longitude];
    }

    _getSunsetTime(date, lat, lon) {
        try {
            // Using the imported SunCalc module
            const times = SunCalc.getTimes(date, lat, lon);

            if (!times.sunset || isNaN(times.sunset.getTime())) {
                console.warn(`Invalid sunset time. Using defaults.`);
                return SunCalc.getTimes(date, DEFAULT_LATITUDE, DEFAULT_LONGITUDE).sunset;
            }

            return times.sunset;
        } catch (error) {
            console.error(`SunCalc error: ${error.message}. Using default fallback.`);
            // Fallback logic
            try {
                return SunCalc.getTimes(date, DEFAULT_LATITUDE, DEFAULT_LONGITUDE).sunset;
            } catch (e) {
                const fallbackSunset = new Date(date);
                fallbackSunset.setHours(18, 0, 0, 0);
                return fallbackSunset;
            }
        }
    }

    _updateDate() {
        if (!this.dateLabel) return;

        const change = this._settings.get_int('date-adjustment');
        const [latitude, longitude] = this._getLatLon();

        const currentDate = new Date();
        let sunset = this._getSunsetTime(new Date(), latitude, longitude);

        let hijriDate = new Date(currentDate);
        
        // If current time is past sunset, it is the next Islamic day
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

        let color = this._settings.get_string('mycolor') || 'rgba(212, 215, 155, 1)';
        this.dateLabel.set_style(`color: ${color};`);
        this.dateLabel.set_text(`${modifiedHijriDate}`);
    }

    destroy() {
        // Cleanup timeout
        if (this._periodicTimeout) {
            GLib.source_remove(this._periodicTimeout);
            this._periodicTimeout = null;
        }

        // Cleanup signals
        if (this._settingsSignals) {
            this._settingsSignals.forEach(id => this._settings.disconnect(id));
            this._settingsSignals = [];
        }
        
        // settings are automatically garbage collected, usually no need to explicitly nullify, 
        // but good practice to clear refs
        this._settings = null; 

        super.destroy();
    }
});

export default class MyHijriDateExtension extends Extension {
    enable() {
        this._indicator = new HijriDateIndicator(this);
        this._settings = this.getSettings();

        this._updatePosition();

        // Watch for position changes
        this._posSignalId = this._settings.connect('changed::panel-position', () => {
            this._updatePosition();
        });
    }

    _updatePosition() {
        // Remove if already exists
        if (this._indicator.get_parent()) {
            this._indicator.get_parent().remove_child(this._indicator);
        }

        let position = this._settings.get_string('panel-position') || 'left';
        
        if (position === 'right') {
            // Standard GNOME Shell Status Area
            Main.panel.addToStatusArea(this.uuid, this._indicator, 0, 'right');
        } else {
            // Left Box insertion
            // Note: index 1 usually places it after the "Activities" button
            Main.panel._leftBox.insert_child_at_index(this._indicator, 1);
        }
    }

    disable() {
        if (this._posSignalId) {
            this._settings.disconnect(this._posSignalId);
            this._posSignalId = null;
        }

        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
        
        this._settings = null;
    }
}