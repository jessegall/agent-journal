from controllers.messages import unquoted
from controllers.types import Messages
from features.command_tags.reading import REPLY_WITH
from features.messages.answering import acknowledges
from resources.text import plural
from resources.base import AGENT, SYSTEM, USER


def carried(messages, row) -> str:
    """What the message brings with it, named so the agent can open it without a second command: its files by their path, and the rows it links to by their reference."""
    paths = messages.paths(row.n) if row.files else []
    linked = [ref for ref in row.refs if not ref.startswith("message:")]
    brought = [part for part in (", ".join(paths), ", ".join(linked)) if part]
    sections = f" (and {plural(len(row.sections), 'section')}: journal message read {row.n})" if row.sections else ""
    return (f" — it brings {'; '.join(brought)}" if brought else "") + sections


def said(row, messages=None) -> str:
    """The message as the line names it, as short as it can be and still complete: who wrote it, its number, the message it answers, their words, and whatever it carries - its files by path and its linked rows - so nothing of what was sent is left behind a second command."""
    who = row.data.get("peer") or ("user" if row.author == USER else row.author)
    answers = "".join(f" on message {ref.partition(':')[2]}" for ref in row.refs if ref.startswith("message:"))
    rest = carried(messages, row) if messages is not None else ""
    words = (row.brief or row.title).strip()
    return f"{who} message {row.n}{answers}: {unquoted(words) if answers else words}{rest}"


def answered(numbers: list, record, **_) -> str:
    messages = Messages(record, actor=SYSTEM)
    rows = [messages.load(n) for n in numbers if messages.rows.exists(n)]
    if not rows:
        return ""
    for row in rows:
        if AGENT not in row.seen:
            Messages(record, actor=AGENT).read(row.n)
    panel = {row.n: row.data[REPLY_WITH] for row in rows if REPLY_WITH in row.data}
    row_lines = [said(row, messages=messages) for row in rows]
    row_lines += [f"answer {n} with {how}, never in the chat" for n, how in panel.items()]
    acknowledging = [row.n for row in rows if row.n not in panel and acknowledges(row)]
    row_lines += [f'{n} only acknowledges: journal message react {n} "👍"' for n in acknowledging]
    here = [n for n in numbers if n not in panel and n not in acknowledging]
    if here:
        row_lines.append(tagged(here))
    return "; ".join(row_lines)


def tagged(numbers: list) -> str:
    return f"reply by opening your turn with [!reply:{numbers[0]}]" if len(numbers) == 1 else "reply by opening each turn with [!reply:<n>]"
