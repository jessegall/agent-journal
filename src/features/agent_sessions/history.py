from pathlib import Path

from controllers.types import Messages
from engine.sessions import Sessions
from engine.transcript import AGENT as AGENT_TURN, HUMAN
from resources.base import AGENT, SYSTEM, USER

OUTCOME = "brought in from the conversation's transcript"


def history(record, provider, path: Path, conversation: str) -> int:
    turns = [(USER if turn.kind == HUMAN else AGENT, turn.text, turn.at) for turn in provider.turns(path) if turn.kind in (HUMAN, AGENT_TURN) and turn.text.strip()]
    Messages(record, actor=SYSTEM)._imported(turns, OUTCOME)
    Sessions(record.root).bind(conversation, record.env, provider=provider.name)
    return len(turns)
