import re

from framework import watched
from resources.triggers import DENY, HOLD, IDLE, INSTRUCT, MESSAGE, NUDGE, START, WORKING, Trigger

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
        "text": f"When {words} appears in what you or the agent write",
        "commands": f"When the agent runs a command with {words}",
        "both": f"When {words} appears in what is written or run",
        "everything": f"When {words} appears anywhere in the agent's work or your messages",
    }.get(where, f"When {words} appears")


def doing(row: Trigger, titles: list[str]) -> str:
    text = quoted(row.text) if row.text else NO_TEXT
    return {
        MESSAGE: f"send a message from you, {text}",
        NUDGE: f"remind the agent {text}",
        INSTRUCT: f"tell the agent to do this now: {text}",
        DENY: f"block it and tell the agent {text}",
        HOLD: f"hold the agent's writes until that stops being true, saying {text}",
        START: f"start the sequence {' and '.join(titles)}" if titles else f"start a sequence. {NO_SEQUENCE}",
    }[str(row.does)]


def asleep(row: Trigger) -> str:
    return (f"Asleep: nothing in this journal watches {row.fact} now, because the feature that finds it is off or gone. "
            f"It does nothing until that comes back, and can still be changed, retired or deleted.")


def state_watching(row: Trigger, fact: watched.Fact) -> str:
    gate = {IDLE: " while the agent is idle", WORKING: " while the agent is working"}.get(str(row.only_when), "")
    return f"When {fact.sentence(row.over)}{gate}"


def repeating(row: Trigger) -> str:
    if row.does not in (NUDGE, INSTRUCT):
        return ""
    if not row.timing:
        return " It says so once for each."
    return f" It says so again every {int(row.timing)} minutes, at most {int(row.most)} times for each."


def opening(row: Trigger, record) -> str:
    if not row.is_state:
        return watching(words_text(list(row.words)), str(row.words_in)) if row.words else ""
    if not row.fact:
        return ""
    return state_watching(row, watched.FACTS.get(watched.Watched.of(row), record))


def summary(row: Trigger, titles: list[str], record) -> str:
    if row.is_state and row.fact and not watched.FACTS.holds(watched.Watched.of(row), record):
        return asleep(row)
    opening_text = opening(row, record)
    if not opening_text:
        return EMPTY
    text = f"{opening_text}, {doing(row, titles)}"
    return (text if ENDS.search(text) or text.endswith(NO_SEQUENCE) else f"{text}.") + (repeating(row) if row.is_state else "")
