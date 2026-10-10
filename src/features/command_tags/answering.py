from controllers.types import Messages
from features.command_tags.reading import REPLY_WITH
from features.messages.answering import acknowledges
from resources.base import AGENT, SYSTEM


def said(row) -> str:
    """The message as the line names it: a header with its number and the message it answers, then what journal message read prints, whole, so no context is lost and the agent need not read it first."""
    answers = "".join(f",reply:{ref.partition(':')[2]}" for ref in row.refs if ref.startswith("message:"))
    return f"[journal][message:{row.n}{answers}]\n{row.dump().strip()}"


def answered(numbers: list, record, **_) -> str:
    messages = Messages(record, actor=SYSTEM)
    rows = [messages.load(n) for n in numbers if messages.rows.exists(n)]
    for row in rows:
        if AGENT not in row.seen:
            Messages(record, actor=AGENT).read(row.n)
    panel = {row.n: row.data[REPLY_WITH] for row in rows if REPLY_WITH in row.data}
    told = [said(row) for row in rows]
    told += [f"answer message {n} with {how}, never in the chat" for n, how in panel.items()]
    acknowledging = [row.n for row in rows if row.n not in panel and acknowledges(row)]
    told += [f'message {n} only acknowledges: react to it with journal message react {n} "👍", no words needed' for n in acknowledging]
    here = [n for n in numbers if n not in panel and n not in acknowledging]
    if here:
        told.append(tagged(here))
    return "; ".join(told)


def tagged(numbers: list) -> str:
    return f"answer by opening your turn with [!reply:{numbers[0]}]" if len(numbers) == 1 else "answer each by opening a turn with [!reply:<n>]"
