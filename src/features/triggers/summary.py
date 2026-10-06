import re

from features.triggers.resource import DENY, INSTRUCT, MESSAGE, NUDGE, START, Trigger

EMPTY = "Add the words to watch for and choose what happens, and this sentence will say what the trigger does."
NO_TEXT = "no text yet"
NO_SEQUENCE = "None is picked yet, so nothing happens"
ENDS = re.compile(r"[.!?]”?$")


def quoted(word: str) -> str:
    return f"“{word}”"


def words_text(words: list) -> str:
    quotes = [quoted(word) for word in words[:3]]
    more = len(words) - 3
    if more > 0:
        return f"{', '.join(quotes)} or {more} other {'phrase' if more == 1 else 'phrases'}"
    return f"{', '.join(quotes[:-1])} or {quotes[-1]}" if len(quotes) > 1 else quotes[0]


def watching(words: str, where: str) -> str:
    return {
        "user": f"When you write {words}",
        "text": f"When {words} comes up in what you or the agent write",
        "commands": f"When the agent runs a command with {words}",
        "both": f"When {words} comes up in what is written or run",
        "everything": f"When {words} comes up anywhere in the agent's work or your messages",
    }.get(where, f"When {words} comes up")


def doing(row: Trigger, titles: list[str]) -> str:
    text = quoted(row.text) if row.text else NO_TEXT
    return {
        MESSAGE: f"send a message from you, {text}",
        NUDGE: f"remind the agent {text}",
        INSTRUCT: f"tell the agent to do this now: {text}",
        DENY: f"block it and tell the agent {text}",
        START: f"start the sequence {' and '.join(titles)}" if titles else f"start a sequence. {NO_SEQUENCE}",
    }[str(row.does)]


def summary(row: Trigger, titles: list[str]) -> str:
    if not row.words:
        return EMPTY
    text = f"{watching(words_text(list(row.words)), str(row.words_in))}, {doing(row, titles)}"
    return text if ENDS.search(text) or text.endswith(NO_SEQUENCE) else f"{text}."
