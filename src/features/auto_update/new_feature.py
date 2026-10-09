import json
import re
from dataclasses import dataclass

DECLARATION = re.compile(r"<!-- new-feature (\{.*?\}) -->", re.DOTALL)
ENTRY = re.compile(r"^## (\S+)", re.MULTILINE)
ART_FOLDER = "announcements"


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


def new_features(changelog: str) -> list[Announcement]:
    """Every new feature the changelog announces, newest first."""
    marks = list(ENTRY.finditer(changelog))
    entries = [(mark.group(1), changelog[mark.end():marks[at + 1].start() if at + 1 < len(marks) else len(changelog)]) for at, mark in enumerate(marks)]
    return [one for version, raw in entries for one in NewFeature.declared(version, raw)]
