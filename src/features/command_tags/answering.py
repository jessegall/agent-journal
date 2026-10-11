from controllers.types import Messages
from features.command_tags.reading import REPLY_WITH
from features.messages.answering import acknowledges
from engine.wording import plural
from resources.base import AGENT, SYSTEM, USER


def carried(messages, row) -> str:
    """What the message brings with it, named so the agent can open it without a second command: its files by their path, and the rows it links to by their reference."""
    paths = messages.paths(row.n) if row.files else []
    linked = [ref for ref in row.refs if not ref.startswith("message:")]
    brought = [part for part in (", ".join(paths), ", ".join(linked)) if part]
    sections = f" (and {plural(len(row.sections), 'section')}: journal message read {row.n})" if row.sections else ""
    return (f" — it brings {'; '.join(brought)}" if brought else "") + sections


def said(row, several: bool = False, messages=None) -> str:
    """The message as the line names it: who wrote it, the message it answers, their words, and whatever it carries - its files by path and its linked rows - so nothing of what the user sent is left behind a second command."""
    who = row.data.get("peer") or ("the user" if row.author == USER else row.author)
    answers = "".join(f", answering message {ref.partition(':')[2]}" for ref in row.refs if ref.startswith("message:"))
    rest = carried(messages, row) if messages is not None else ""
    return f"{who} wrote{f' {row.n}' if several else ''}{answers}: {(row.brief or row.title).strip()}{rest}"


def answered(numbers: list, record, **_) -> str:
    messages = Messages(record, actor=SYSTEM)
    rows = [messages.load(n) for n in numbers if messages.rows.exists(n)]
    for row in rows:
        if AGENT not in row.seen:
            Messages(record, actor=AGENT).read(row.n)
    panel = {row.n: row.data[REPLY_WITH] for row in rows if REPLY_WITH in row.data}
    row_lines = [said(row, several=len(rows) > 1, messages=messages) for row in rows]
    row_lines += [f"answer message {n} with {how}, never in the chat" for n, how in panel.items()]
    acknowledging = [row.n for row in rows if row.n not in panel and acknowledges(row)]
    row_lines += [f'message {n} only acknowledges: react to it with journal message react {n} "👍", no words needed' for n in acknowledging]
    here = [n for n in numbers if n not in panel and n not in acknowledging]
    if here:
        row_lines.append(tagged(here))
    return "; ".join(row_lines)


def tagged(numbers: list) -> str:
    return f"answer by opening your turn with [!reply:{numbers[0]}]" if len(numbers) == 1 else "answer each by opening a turn with [!reply:<n>]"
