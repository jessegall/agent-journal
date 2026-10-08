from pathlib import Path

from controllers.types import environment_records
from engine.paths import environments
from engine.stored import read_json, write_json
from features.form_of_address.controller import Profiles
from features.form_of_address.names import in_use
from features.form_of_address.voices import BUTLER, CARTOON, SCIENTISTS
from resources.base import SYSTEM

LAWS, TOGGLE = "journal_laws", "cartoon_names"
FORM, PROFILE = "form_of_address", "profile"


def run(root: Path) -> list[str]:
    root = Path(root)
    files = [file for file in (root / "settings.json", *(home / "settings.json" for home in environments(root).glob("*"))) if file.is_file()]
    cartoons = [file for file in files if dropped_toggle(file)]
    records = list(environment_records(root))
    if not records:
        return []
    profiles = Profiles(records[0], actor=SYSTEM)
    named = [own_naming(profiles, row) for row in profiles.rows.every() if not row.system and not row.naming]
    if not cartoons:
        return named
    return [*named, cartoon_naming(root, profiles, in_use(records[0]))]


def dropped_toggle(file: Path) -> bool:
    held = read_json(file, dict, {})
    laws = held.get(LAWS)
    if not isinstance(laws, dict) or TOGGLE not in laws:
        return False
    chosen = bool(laws.pop(TOGGLE))
    write_json(file, held, indent=2)
    return chosen


def own_naming(profiles: Profiles, row) -> str:
    profiles.stamp(row.n, naming=SCIENTISTS.text)
    return f"profile {row.n}, {row.title}, names its agents as the journal did: after famous scientists and designers"


def cartoon_naming(root: Path, profiles: Profiles, chosen: int) -> str:
    standing = [profiles.load(chosen)] if chosen else [row for row in profiles.rows.every() if row.system and row.title == BUTLER.title]
    if not standing:
        return "the switch for cartoon names is gone, and no profile was there to carry its choice"
    row = standing[0]
    if not row.system:
        profiles.stamp(row.n, naming=CARTOON.text)
        return f"profile {row.n}, {row.title}, names its agents after cartoon characters, as the switch did"
    copy = profiles.duplicate(row.n)
    profiles.stamp(copy.n, naming=CARTOON.text)
    settings = read_json(root / "settings.json", dict, {})
    write_json(root / "settings.json", {**settings, FORM: {**settings.get(FORM, {}), PROFILE: str(copy.n)}}, indent=2)
    return f"{copy.title} is in use and names its agents after cartoon characters, as the switch did"
