from resources.base import AGENT


def theirs(message) -> bool:
    return message.seen[:1] != [AGENT]


def answered(journal, message) -> bool:
    if message.refs or message.sections:
        return True
    said = journal.comments.linked_to(message.ref) + journal.reactions.linked_to(message.ref)
    return any(r.seen[:1] == [AGENT] for r in said)


def read_and_open(journal) -> list:
    return [m for m in journal.messages._standing() if AGENT in m.seen and theirs(m)]


def in_hand(journal):
    held = read_and_open(journal)
    return held[-1] if held else None


def unanswered(journal) -> list:
    return [m for m in read_and_open(journal) if not answered(journal, m)]
