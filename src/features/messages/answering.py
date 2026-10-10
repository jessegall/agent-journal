import re

from resources.base import AGENT
from controllers.types import Comments, Messages, Reactions

ASKING = re.compile(r"\?|\b(?:relay|reply|answer me|tell me|let me know|what do you think|do you (?:think|agree|understand)|your (?:opinion|view|take)"
                    r"|geef (?:het |dit |dat )?door|reageer|antwoord (?:me|mij)|vertel (?:me|mij)|laat (?:het )?(?:me|mij) weten|wat (?:denk|vind) je"
                    r"|denk je|ben je het (?:ermee )?eens|begrijp je|snap je|jouw (?:mening|kijk|idee))\b", re.I)


NODS = r"ok(?:ay|é)?|thanks?(?: you)?|got it"
ACKNOWLEDGING = re.compile(rf"^\W*(?:{NODS}|thx|cool|nice|great|perfect|splendid|sure|sounds good|good|top|prima|mooi"
                           r"|dank(?:je|jewel| je| u)?|bedankt|helemaal goed|lekker)\b[\W\s]*(?:sir|jesse|man)?[\W\s]*$", re.I)


def acknowledges(message) -> bool:
    text = message.brief or message.title
    return not asks(message) and not message.files and bool(ACKNOWLEDGING.match(text))


def theirs(message) -> bool:
    return message.author != AGENT


def asks(message) -> bool:
    return bool(ASKING.search(f"{message.title}\n{message.brief}"))


def replied(journal, message) -> bool:
    return any(r.author == AGENT for r in journal.get(Comments).linked_to(message.ref))


def answered(journal, message) -> bool:
    if asks(message):
        return replied(journal, message)
    if message.refs or message.sections:
        return True
    return replied(journal, message) or any(r.author == AGENT for r in journal.get(Reactions).linked_to(message.ref))


def answers(kind: str, message) -> bool:
    """Whether an answer of this kind, written just now, settles the message: a reply always does, a reaction unless the message asks."""
    return kind == "comment" or not asks(message)


def read_and_open(journal) -> list:
    """The open messages the agent has read that are not its own: only the rows its summary says it has seen are read from disk, not every open message."""
    messages = journal.get(Messages)
    return [m for m in (messages.load(row["n"]) for row in messages.rows.standing_summaries() if AGENT in row["seen"]) if theirs(m)]


def unanswered(journal) -> list:
    return [m for m in read_and_open(journal) if not answered(journal, m)]


def still_unanswered(journal, rows: tuple[str, ...]) -> bool:
    return any(m.ref in rows for m in unanswered(journal))
