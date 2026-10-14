from controllers.types import Comments, Messages, Reactions
from resources.base import AGENT


def theirs(message) -> bool:
    return message.author != AGENT


def read_and_open(messages) -> list:
    """The open messages the agent has read that are not its own: only the rows its summary says it has seen are read from disk, not every open message."""
    return [m for m in (messages.peek(row.n) for row in messages.rows.standing_summaries() if AGENT in row.seen) if theirs(m)]


UNANSWERED: dict[tuple, tuple] = {}


def unanswered(messages, comments, reactions) -> list:
    """The messages read and open that have no answer; held while the messages, comments and reactions are as they were, so a hook that changed none of them does not look at every open message again."""
    marks = (messages.rows.summaries(), comments.rows.summaries(), reactions.rows.summaries())
    key = (str(messages.record.root), messages.record.env)
    held = UNANSWERED.get(key)
    if held and all(kept is now for kept, now in zip(held[0], marks)):
        return list(held[1])
    found = [m for m in read_and_open(messages) if not messages.is_answered(m)]
    UNANSWERED[key] = (marks, found)
    return list(found)


def unanswered_in(journal) -> list:
    return unanswered(journal.get(Messages), journal.get(Comments), journal.get(Reactions))


def still_unanswered(journal, rows: tuple[str, ...]) -> bool:
    return any(m.ref in rows for m in unanswered_in(journal))
