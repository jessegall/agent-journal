import json
import re
from dataclasses import dataclass
from pathlib import Path

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
    art: str = ""
    note: str = ""
    eyebrow: str = "Hey, new feature"

    @classmethod
    def declared(cls, version: str, raw: str) -> list["NewFeature"]:
        """The new feature a changelog entry announces, none when it announces none or announces it wrong."""
        found = DECLARATION.search(raw)
        if found is None:
            return []
        try:
            given = json.loads(found.group(1))
            return [cls(version=version, **{**given, "art": f"{ART_FOLDER}/{given['art']}" if given.get("art") else ""})]
        except (ValueError, TypeError):
            return []


def new_features(changelog: str) -> list[NewFeature]:
    """Every new feature the changelog announces, newest first."""
    marks = list(ENTRY.finditer(changelog))
    entries = [(mark.group(1), changelog[mark.end():marks[at + 1].start() if at + 1 < len(marks) else len(changelog)]) for at, mark in enumerate(marks)]
    return [one for version, raw in entries for one in NewFeature.declared(version, raw)]


def seen(root: Path) -> list[str]:
    return read_json(root / SEEN, list, [])


def unseen(root: Path, changelog: str) -> list[NewFeature]:
    """The new features not yet seen, oldest first, so the releases an update skipped over announce themselves one after another."""
    held = seen(root)
    return [one for one in reversed(new_features(changelog)) if one.id not in held]


def mark_seen(root: Path, id: str) -> None:
    held = seen(root)
    if id not in held:
        write_json(root / SEEN, [*held, id])


def mark_all_seen(root: Path, changelog: str) -> str:
    """A first install has nothing new to announce: everything its changelog announces is seen from the start."""
    for one in new_features(changelog):
        mark_seen(root, one.id)
    return "new features seen"
