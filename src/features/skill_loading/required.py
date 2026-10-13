import time

from controllers.types import Agents, Messages
from framework.recital import mentioned
from features.skill_loading.catalogue import available, keywords, loaded_at, loaded_before_compaction
from resources.base import SYSTEM, USER


STATE = "skill_loading"


def pending(record, session: str) -> dict:
    return record.state(STATE).get(f"required.{session}", {})


def keep(record, session: str, skills: dict[str, float]) -> None:
    record.state(STATE).set(f"required.{session}", skills)


def require(record, session: str, skills: dict[str, float]) -> None:
    held = pending(record, session)
    added = {name: at for name, at in skills.items() if name not in held or float(held[name]) < at}
    if added:
        keep(record, session, {**held, **added})


def require_only(record, session: str, skills: dict[str, float]) -> None:
    keep(record, session, skills)


def outstanding(record, row) -> list[str]:
    held = pending(record, row.title)
    if not held:
        return []
    loaded = loaded_at(row)
    left = {name: at for name, at in held.items() if not loaded.get(name) or float(loaded[name]) < float(at)}
    if left != held:
        keep(record, row.title, left)
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


def named_skills(record, row, text: str, at: float) -> dict[str, float]:
    """The skills the text names by their words that the agent has not loaded."""
    loaded = {**loaded_before_compaction(row), **loaded_at(row)}
    return {name: at for name, words in keywords(record).items() if not loaded.get(name) and mentioned(words, text)}


def require_named(record, row, text: str) -> None:
    named = named_skills(record, row, text, time.time())
    if named:
        require(record, row.title, named)
