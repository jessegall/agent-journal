from pathlib import Path

from controllers.types import Messages
from engine.sessions import Sessions
from engine.stored import write_text
from engine.transcript import AGENT as AGENT_TURN, HUMAN
from resources.base import AGENT, SYSTEM, USER, titled

OUTCOME = "brought in from the conversation's transcript"


def history(record, provider, path: Path, conversation: str) -> int:
    turns = [turn for turn in provider.transcript(path) if turn.kind in (HUMAN, AGENT_TURN) and turn.text.strip()]
    messages = Messages(record, actor=SYSTEM)
    with record.locked():
        n = (messages.numbers() or [0])[-1]
        for turn in turns:
            n += 1
            actor = USER if turn.kind == HUMAN else AGENT
            row = messages.resource(n=n, title=titled(turn.text.strip().splitlines()[0]), brief=turn.text, seen=[actor, USER if actor == AGENT else AGENT],
                                    created=turn.at, updated=turn.at, completed=turn.at, outcome=OUTCOME)
            write_text(messages.path(n), row.dump())
    Sessions(record.root).bind(conversation, record.env, provider=provider.name)
    return len(turns)
