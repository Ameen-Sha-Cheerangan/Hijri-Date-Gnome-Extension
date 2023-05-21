const St = imports.gi.St;
const Main = imports.ui.main;

let dateLabel;

function setDate() {
  const hijriDate = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  dateLabel.set_text(`Hijri Date: ${hijriDate}`);
}

function init() {
  dateLabel = new St.Label();
  setDate();
}

function enable() {
  Main.panel._rightBox.insert_child_at_index(dateLabel, 1);
  Main.panel._rightBox.set_child_at_index(dateLabel, 1);
}

function disable() {
  Main.panel._rightBox.remove_child(dateLabel);
}

