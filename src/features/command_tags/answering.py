from controllers.types import Messages
from features.command_tags.reading import REPLY_WITH
from resources.text import plural
from resources.base import SYSTEM, USER
def carried(messages, row) -> str:
    """What the message brings with it, named so the agent can open it without a second command: its files by their path, and the rows it links to by their reference."""
    paths = messages.paths(row.n) if row.files else []
    linked = [ref for ref in row.refs if not ref.startswith("message:")]
    brought = [part for part in (", ".join(paths), ", ".join(linked)) if part]
    sections = f" (and {plural(len(row.sections), 'section')})" if row.sections else ""
    return (f" — it brings {'; '.join(brought)}" if brought else "") + sections
def said(row, messages=None) -> str:
    """The message as the line names it: who wrote it, its number, the message it answers, and whatever it carries. Not the words, and not the command that opens it, which the messages skill teaches once: the line names what waits and stops."""
    who = row.data.get("peer") or ("user" if row.author == USER else row.author)
    answers = "".join(f" on message {ref.partition(':')[2]}" for ref in row.refs if ref.startswith("message:"))
    rest = carried(messages, row) if messages is not None else ""
    return f"{who} message {row.n}{answers}{rest}"
def still_to_answer(numbers: list, record, **_) -> str:
    """The line about a message the agent has already read and not answered: it says how to answer, because by then the agent has the words."""
    said = answered(numbers, record)
    here = [n for n in numbers if Messages(record, actor=SYSTEM).rows.exists(n)]
    return "; ".join(part for part in (said, tagged(here) if here else "") if part)


def answered(numbers: list, record, **_) -> str:
    messages = Messages(record, actor=SYSTEM)
    rows = [messages.load(n) for n in numbers if messages.rows.exists(n)]
    if not rows:
        return ""
    panel = {row.n: row.data[REPLY_WITH] for row in rows if REPLY_WITH in row.data}
    row_lines = [said(row, messages=messages) for row in rows]
    row_lines += [f"answer message {n} with {how}, never in the chat" for n, how in panel.items()]
    acknowledging = [row.n for row in rows if row.n not in panel and messages.is_acknowledgement(row)]
    row_lines += [f'{n} only acknowledges: journal message react {n} "👍"' for n in acknowledging]
    return "; ".join(row_lines)
def tagged(numbers: list) -> str:
    return f"reply by opening your turn with [!reply:{numbers[0]}]" if len(numbers) == 1 else "reply by opening each turn with [!reply:<n>]"
