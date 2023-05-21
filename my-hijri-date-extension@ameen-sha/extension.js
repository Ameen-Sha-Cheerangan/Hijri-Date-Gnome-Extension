const St = imports.gi.St;
const Main = imports.ui.main;

let dateLabel;

function setDate() {
    const hijriDate = new Intl.DateTimeFormat("en-US-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());

    dateLabel.set_text(`${hijriDate}`);
}

function init() {
    dateLabel = new St.Label({
        style: "text-align: center; position: relative; top: 50%; transform: translateY(-50%);",
    });
    setDate();
}

function enable() {
    Main.panel._leftBox.insert_child_at_index(dateLabel, 1);
    Main.panel._leftBox.set_child_at_index(dateLabel, 1);
}

function disable() {
    Main.panel._leftBox.remove_child(dateLabel);
}
