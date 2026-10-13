from pathlib import Path

from controllers.types import Features, environment_records
from engine.ledger import applied
from engine.stored import read_json, write_json
from resources.base import Refused, SYSTEM

LAST_OF_VERSION_2 = "m0085_developer_error_reports_off"
BEFORE_THE_LEDGER = ("pins.json", "reminders.json", "inbox.json", "questions.json", "todo")
FORM, MASCOT, AVATAR = "form_of_address", "mascot", "avatar"


def run(root: Path) -> str:
    """Brings a record that went through the whole 2.x line to version 3's shape: the voice figure's switch moves from the form of address to the avatar feature, the one change the record needs. A record that did not go through 2.x is refused."""
    root = Path(root)
    if came_before_version_2(root):
        raise Refused("this record is older than version 3 can upgrade: update to the last 2.x release first, let it migrate the record, then upgrade to version 3 again")
    return avatar_switch_moved(root)


def came_before_version_2(root: Path) -> bool:
    done = applied(root)
    if done:
        return LAST_OF_VERSION_2 not in done
    return any((home / name).exists() for home in (root / "environments").glob("*") for name in BEFORE_THE_LEDGER)


def avatar_switch_moved(root: Path) -> str:
    file = root / "settings.json"
    held = read_json(file, dict, {})
    form = held.get(FORM, {})
    if MASCOT not in form:
        return "the record is in version 3's shape already"
    chosen = bool(form.pop(MASCOT))
    write_json(file, held, indent=2)
    records = list(environment_records(root))
    if records:
        Features(records[0], actor=SYSTEM).switch(AVATAR, chosen)
    return f"the voice figure's switch moved to the avatar feature, {'on' if chosen else 'off'}"
