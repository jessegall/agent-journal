from controllers.types import Messages
from features.command_tags.reading import REPLY_WITH
from features.messages.answering import acknowledges
from engine.wording import plural
from resources.base import AGENT, SYSTEM, USER


def said(row, several: bool = False) -> str:
    """The message as the line names it: who wrote it, the message it answers, and their words, the number only where several come in one line; a long message or one with files says where the rest is."""
    who = row.data.get("peer") or ("the user" if row.author == USER else row.author)
    answers = "".join(f", answering message {ref.partition(':')[2]}" for ref in row.refs if ref.startswith("message:"))
    more = [part for part in (plural(len(row.files), "file") if row.files else "", plural(len(row.sections), "section") if row.sections else "") if part]
    rest = f" (and {' and '.join(more)}: journal message read {row.n})" if more else ""
    return f"{who} wrote{f' {row.n}' if several else ''}{answers}: {(row.brief or row.title).strip()}{rest}"


def answered(numbers: list, record, **_) -> str:
    messages = Messages(record, actor=SYSTEM)
    rows = [messages.load(n) for n in numbers if messages.rows.exists(n)]
    for row in rows:
        if AGENT not in row.seen:
            Messages(record, actor=AGENT).read(row.n)
    panel = {row.n: row.data[REPLY_WITH] for row in rows if REPLY_WITH in row.data}
    told = [said(row, several=len(rows) > 1) for row in rows]
    told += [f"answer message {n} with {how}, never in the chat" for n, how in panel.items()]
    acknowledging = [row.n for row in rows if row.n not in panel and acknowledges(row)]
    told += [f'message {n} only acknowledges: react to it with journal message react {n} "👍", no words needed' for n in acknowledging]
    here = [n for n in numbers if n not in panel and n not in acknowledging]
    if here:
        told.append(tagged(here))
    return "; ".join(told)


def tagged(numbers: list) -> str:
    return f"answer by opening your turn with [!reply:{numbers[0]}]" if len(numbers) == 1 else "answer each by opening a turn with [!reply:<n>]"
