from pathlib import Path

from controllers.types import Features, Profiles, environment_records
from engine.ledger import applied
from engine.stored import read_json, write_json
from resources.base import Refused, SYSTEM
from resources.text import plural

LAST_OF_VERSION_2 = "m0085_developer_error_reports_off"
BEFORE_THE_LEDGER = ("pins.json", "reminders.json", "inbox.json", "questions.json", "todo/[0-9][0-9][0-9]-*.md")
FORM, MASCOT, AVATAR = "form_of_address", "mascot", "avatar"


def run(root: Path) -> str:
    """Brings a record that went through the whole 2.x line to version 3's shape: the voice figure's switch moves from the form of address to the avatar feature, and a profile names its voice rather than a picture's file. A record that did not go through 2.x is refused."""
    root = Path(root)
    if came_before_version_2(root):
        raise Refused("this record is older than version 3 can upgrade: update to the last 2.x release first, let it migrate the record, then upgrade to version 3 again")
    done = [step for step in (avatar_switch_moved(root), profiles_name_their_voice(root)) if step]
    return "; ".join(done) or "the record is in version 3's shape already"


def came_before_version_2(root: Path) -> bool:
    done = applied(root)
    if done:
        return LAST_OF_VERSION_2 not in done
    return any(next(home.glob(name), None) for home in (root / "environments").glob("*") for name in BEFORE_THE_LEDGER)


def avatar_switch_moved(root: Path) -> str:
    file = root / "settings.json"
    held = read_json(file, dict, {})
    form = held.get(FORM, {})
    if MASCOT not in form:
        return ""
    chosen = bool(form.pop(MASCOT))
    write_json(file, held, indent=2)
    records = list(environment_records(root))
    if records:
        Features(records[0], actor=SYSTEM).switch(AVATAR, chosen)
    return f"the voice figure's switch moved to the avatar feature, {'on' if chosen else 'off'}"


def profiles_name_their_voice(root: Path) -> str:
    """A profile kept its voice as the file of a picture since removed, such as butler.webp; it keeps the voice's name now, which is all that file name was ever read for."""
    moved = 0
    for record in environment_records(root):
        profiles = Profiles(record, actor=SYSTEM)
        for row in profiles.rows.summaries():
            profile = profiles.load(row.n)
            if "art" not in profile.data:
                continue
            profile.data["voice"] = Path(profile.data.pop("art")).stem.lower()
            profiles.save(profile, "updated", fields=["voice"])
            moved += 1
    return f"{plural(moved, 'profile')} now named by voice" if moved else ""
