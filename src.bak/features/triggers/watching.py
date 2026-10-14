from resources.types import IDLE as AGENT_IDLE
from framework import watched
from framework.recital import mentioned
from framework.sending import Sent
from resources.triggers import FROM_USER, IDLE, WORKING

WATCHING, REMINDING = "watching", "reminding"


def firing(triggers, text_of, from_user: bool = False) -> list:
    """The word triggers whose words come up in the text, which the scope a trigger names picks out of what the caller offers."""
    return [row for row in triggers.rows.standing()
            if not row.is_state and (from_user or row.words_in != FROM_USER) and mentioned(row.words, text_of(str(row.words_in or "both")))]


def in_state(row, agent) -> bool:
    return {IDLE: agent.status == AGENT_IDLE, WORKING: agent.status != AGENT_IDLE}.get(str(row.only_when), True)


def current(row, context, agent) -> list[Sent]:
    looked = watched.Watched.of(row)
    if not in_state(row, agent) or not watched.FACTS.holds(looked, context.record):
        return []
    return watched.found(looked, context, agent)
