import json
import re
from dataclasses import dataclass
from pathlib import Path

from engine.ledger import ledger
from engine.stored import read_json, write_json

DECLARATION = re.compile(r"<!-- new-feature (\{.*?\}) -->", re.DOTALL)
ENTRY = re.compile(r"^## (\S+)", re.MULTILINE)
ART_FOLDER = "announcements"
SEEN = "seen-new-features.json"


@dataclass(frozen=True)
class NewFeature:
    id: str
    version: str
    title: str
    text: str
    button: str
    profile: str = ""
    opens: str = ""
    """The page the button takes the reader to, as the viewer names it: 'settings'. Without one the button only closes the card, which is what a reader reads as nothing happening."""

    art: str = ""
    note: str = ""
    eyebrow: str = "Hey, new feature"
    off: str = ""
    setting: str = ""

    @classmethod
    def declared(cls, version: str, raw: str) -> list["NewFeature"]:
        """Every new feature a changelog entry announces, in the order it announces them; a release of two features announces both."""
        return [one for found in DECLARATION.finditer(raw) for one in cls.read(version, found.group(1))]

    @classmethod
    def read(cls, version: str, given: str) -> list["NewFeature"]:
        """The feature one declaration names, none when it is written wrong."""
        try:
            fields = json.loads(given)
            return [cls(version=version, **{**fields, "art": f"{ART_FOLDER}/{fields['art']}" if fields.get("art") else ""})]
        except (ValueError, TypeError):
            return []


def new_features(changelog: str) -> list[NewFeature]:
    """Every new feature the changelog announces, newest first."""
    marks = list(ENTRY.finditer(changelog))
    entries = [(mark.group(1), changelog[mark.end():marks[at + 1].start() if at + 1 < len(marks) else len(changelog)]) for at, mark in enumerate(marks)]
    return [one for version, raw in entries for one in NewFeature.declared(version, raw)]


def oldest_first(features: list[NewFeature]) -> list[NewFeature]:
    """The new features oldest release first, each release's own in the order it announces them."""
    releases = list(dict.fromkeys(one.version for one in features))
    return sorted(features, key=lambda one: -releases.index(one.version))


def seen(root: Path) -> list[str]:
    return read_json(root / SEEN, list, [])


def offers(one: NewFeature) -> str:
    """The setting a card asks the user to change, as feature.key; a card offering a voice asks for the profile."""
    if one.setting:
        return one.setting
    return "form_of_address.profile" if one.profile else ""


def already_chosen(record, one: NewFeature) -> bool:
    """Whether the user already has what the card offers: a voice they picked, or a switch already on. Such a card is not news, which is how a start after a long gap can offer the Squire to someone who chose him months before."""
    feature, _, key = offers(one).partition(".")
    return bool(key) and bool(record.setting(feature, {}).get(key))


def unseen(record, changelog: str) -> list[NewFeature]:
    """The new features not yet seen, oldest first, so the releases an update skipped over announce themselves one after another; one offering what the user already chose is left out, since it asks for a choice that was made."""
    held = seen(record.root)
    return [one for one in oldest_first(new_features(changelog)) if one.id not in held and not already_chosen(record, one)]


def unseen_announced(record, changelog: Path) -> list[NewFeature]:
    """What the changelog file announces and has not been seen; none when the install carries no changelog."""
    return unseen(record, changelog.read_text() if changelog.is_file() else "")


def mark_seen(root: Path, id: str) -> None:
    held = seen(root)
    if id not in held:
        write_json(root / SEEN, [*held, id])


def mark_all_seen(root: Path, changelog: str) -> str:
    """A first install has nothing new to announce: everything its changelog announces is seen from the start."""
    for one in new_features(changelog):
        mark_seen(root, one.id)
    return "new features seen"


def mark_first_start_seen(root: Path, changelog: str) -> bool:
    """A journal that starts with no record of ever being installed or updated, as a fresh one does, has nothing new to announce: every feature its changelog announces counts as seen, and only later updates announce one."""
    if ledger(root).is_file() or (Path(root) / SEEN).is_file():
        return False
    mark_all_seen(root, changelog)
    return True
