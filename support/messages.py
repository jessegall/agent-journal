from controllers.types import Comments, Messages, Reactions
from resources.base import AGENT, SYSTEM


def theirs(message) -> bool:
    return message.seen[:1] != [AGENT]


def answered(record, message) -> bool:
    said = Comments(record, actor=SYSTEM).linked_to(message.ref) + Reactions(record, actor=SYSTEM).linked_to(message.ref)
    return any(r.seen[:1] == [AGENT] for r in said)


def read_and_open(record) -> list:
    return [m for m in Messages(record, actor=SYSTEM)._every() if AGENT in m.seen and not m.completed and theirs(m)]


def in_hand(record):
    held = read_and_open(record)
    return held[-1] if held else None


def unanswered(record) -> list:
    return [m for m in read_and_open(record) if not answered(record, m)]
