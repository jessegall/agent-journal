from controllers.types import Messages
from features.command_tags.reading import REPLY_WITH
from features.messages.answering import acknowledges
from resources.base import AGENT, SYSTEM


SHOWN_WHOLE = 2000


def words(row) -> str:
    """What the line says of a message: its words, the names of its attachments and the message it answers, so the agent need not read it first; no record and no mark, since the channel gives its own."""
    text = (row.brief or row.title).strip()
    clipped = text if len(text) <= SHOWN_WHOLE else f"{text[:SHOWN_WHOLE].rstrip()}... (clipped: journal message read {row.n} for the rest)"
    attached = f" [attached: {', '.join(row.files)}]" if row.files else ""
    answers = ", ".join(ref.partition(":")[2] for ref in row.refs if ref.startswith("message:"))
    return f"message {row.n}: {clipped}{attached}" + (f" (it answers message {answers})" if answers else "")


def answered(numbers: list, record, **_) -> str:
    messages = Messages(record, actor=SYSTEM)
    rows = [messages.load(n) for n in numbers if messages.rows.exists(n)]
    for row in rows:
        if AGENT not in row.seen:
            Messages(record, actor=AGENT).read(row.n)
    panel = {row.n: row.data[REPLY_WITH] for row in rows if REPLY_WITH in row.data}
    told = [words(row) for row in rows]
    told += [f"answer message {n} with {how}, never in the chat" for n, how in panel.items()]
    acknowledging = [row.n for row in rows if row.n not in panel and acknowledges(row)]
    told += [f'message {n} only acknowledges: react to it with journal message react {n} "👍", no words needed' for n in acknowledging]
    here = [n for n in numbers if n not in panel and n not in acknowledging]
    if here:
        told.append(tagged(here))
    return "; ".join(told)


def tagged(numbers: list) -> str:
    return f"answer by opening your turn with [!reply:{numbers[0]}]" if len(numbers) == 1 else "answer each by opening a turn with [!reply:<n>]"
