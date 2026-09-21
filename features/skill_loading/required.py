import time
from pathlib import Path

from controllers.types import Agents, Messages
from engine.stored import read_json, write_json
from features.skill_loading.catalogue import loaded_at
from resources.base import SYSTEM, USER


def required_file(record, session: str) -> Path:
    return record.root / "runtime" / f"skills-required-{session}.json"


def require(record, session: str, skills: dict[str, float]) -> None:
    f = required_file(record, session)
    held = read_json(f, {})
    added = {name: at for name, at in skills.items() if name not in held}
    if added:
        write_json(f, {**held, **added})


def outstanding(record, row) -> list[str]:
    f = required_file(record, row.title)
    held = read_json(f, {})
    if not held:
        return []
    loaded = loaded_at(row)
    left = {name: at for name, at in held.items() if not loaded.get(name) or float(loaded[name]) < float(at)}
    if left and left != held:
        write_json(f, left)
    elif not left:
        f.unlink(missing_ok=True)
    return sorted(left)


def load_now(record, name: str) -> str:
    agent = Agents(record, actor=SYSTEM).primary()
    if agent:
        require(record, agent.title, {name: time.time()})
    Messages(record, actor=USER).create(f"Please load the {name} skill now", brief=f"Skill: {name} — every tool call waits until it is loaded.")
    return "the agent is asked, and its tool calls wait until the skill is loaded"
