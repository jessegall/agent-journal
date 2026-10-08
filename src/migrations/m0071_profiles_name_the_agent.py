from pathlib import Path

from controllers.types import environment_records
from features.form_of_address.controller import Profiles
from features.form_of_address.voices import SHIPPED, Voice
from resources.base import SYSTEM

NAMES = {voice.title: voice.agent_name for voice in SHIPPED}


def run(root: Path) -> list[str]:
    records = list(environment_records(Path(root)))
    if not records:
        return []
    profiles = Profiles(records[0], actor=SYSTEM)
    return [named(profiles, row) for row in profiles.rows.every() if not row.agent_name]


def named(profiles: Profiles, row) -> str:
    name = NAMES[row.title] if row.system and row.title in NAMES else Voice.agent_name
    profiles.stamp(row.n, agent_name=name)
    return f"profile {row.n}, {row.title}, is addressed as {name} by its helpers and subagents"
