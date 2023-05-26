const St = imports.gi.St;
const Main = imports.ui.main;

let dateLabel;

function setDate() {
    const change = -1; // Change this value to 0, -1, or 1 to adjust the date
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + change);

    const formatter = new Intl.DateTimeFormat("ar-IN-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    const modifiedHijriDate = formatter.format(currentDate);
    dateLabel.set_text(`${modifiedHijriDate}`);
}

function init() {

}

function enable() {
    dateLabel = new St.Label({
        style: "text-align: center; position: relative; top: 50%; transform: translateY(-50%);  padding-left: 20px; padding-right: 15px; padding-bottom: 3px; padding-top: 3px;",
    });
    setDate();
    Main.panel._leftBox.insert_child_at_index(dateLabel, 1);
    Main.panel._leftBox.set_child_at_index(dateLabel, 1);
}

function disable() {
    Main.panel._leftBox.remove_child(dateLabel);
    dateLabel.destroy();
    dateLabel = null;
}