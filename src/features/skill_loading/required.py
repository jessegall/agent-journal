import time

from controllers.types import Agents, Messages
from features.skill_loading.catalogue import available, loaded_at
from resources.base import SYSTEM, USER


def required(record, session: str):
    return record.state("skill_loading", session)


def require(record, session: str, skills: dict[str, float]) -> None:
    state = required(record, session)
    held = state.get("required", {})
    added = {name: at for name, at in skills.items() if name not in held or float(held[name]) < at}
    if added:
        state.set("required", {**held, **added})


def require_only(record, session: str, skills: dict[str, float]) -> None:
    required(record, session).set("required", skills)


def outstanding(record, row) -> list[str]:
    state = required(record, row.title)
    held = state.get("required", {})
    if not held:
        return []
    loaded = loaded_at(row)
    left = {name: at for name, at in held.items() if not loaded.get(name) or float(loaded[name]) < float(at)}
    if left != held:
        state.set("required", left)
    return sorted(left)


def require_primary(record, names: list[str], at: float) -> None:
    agent = Agents(record, actor=SYSTEM).primary()
    present = [name for name in names if name in available(record.root.parent)]
    if agent and present:
        require(record, agent.title, dict.fromkeys(present, at))


def load_now(record, name: str) -> str:
    require_primary(record, [name], time.time())
    Messages(record, actor=USER).create(f"Please load the {name} skill now", brief=f"Skill: {name} — every tool call waits until it is loaded.")
    return "the agent is asked, and its tool calls wait until the skill is loaded"
