import re

from resources.base import AGENT

ASKING = re.compile(r"\?|\b(?:relay|reply|answer me|tell me|let me know|what do you think|do you (?:think|agree|understand)|your (?:opinion|view|take)"
                    r"|geef (?:het |dit |dat )?door|reageer|antwoord (?:me|mij)|vertel (?:me|mij)|laat (?:het )?(?:me|mij) weten|wat (?:denk|vind) je"
                    r"|denk je|ben je het (?:ermee )?eens|begrijp je|snap je|jouw (?:mening|kijk|idee))\b", re.I)


def theirs(message) -> bool:
    return message.seen[:1] != [AGENT]


def asks(message) -> bool:
    return bool(ASKING.search(f"{message.title}\n{message.brief}"))


def replied(journal, message) -> bool:
    return any(r.seen[:1] == [AGENT] for r in journal.comments.linked_to(message.ref))


def answered(journal, message) -> bool:
    if asks(message):
        return replied(journal, message)
    if message.refs or message.sections:
        return True
    return replied(journal, message) or any(r.seen[:1] == [AGENT] for r in journal.reactions.linked_to(message.ref))


def read_and_open(journal) -> list:
    return [m for m in journal.messages._standing() if AGENT in m.seen and theirs(m)]


def in_hand(journal):
    held = read_and_open(journal)
    return held[-1] if held else None


def unanswered(journal) -> list:
    return [m for m in read_and_open(journal) if not answered(journal, m)]
