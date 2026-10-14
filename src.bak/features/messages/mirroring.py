"""When the words the display hook brought become a message in the chat, and what is made of a turn the hook did not deliver: the policy over the ledger in framework.displayed."""

from pathlib import Path

from framework.displayed import (COMMIT, DONE, FAULTS, FELL_BACK, FINALS, KEPT_DONE, KEPT_SENT, MATCHED, PRIVATE, SENT, DisplayedLedger, belongs, fingerprint)
from resources.text import plural


def collect(ledger: DisplayedLedger, message: str, index: int, delta: str, final: bool) -> str:
    """Keeps one part of a message; the whole text once its last part and every part before it are in, else nothing."""
    with ledger.changing() as held:
        if message in held.get(DONE, []):
            return ""
        parts = held[message] = {**held.get(message, {}), str(index): delta}
        finals = held[FINALS] = {**held.get(FINALS, {})}
        if final:
            finals[message] = index
        if message not in finals or any(str(i) not in parts for i in range(finals[message] + 1)):
            return ""
        last = finals[message]
    return "".join(parts[str(i)] for i in range(last + 1))


def finish(ledger: DisplayedLedger, message: str, text: str) -> None:
    """A message went to the chat: a fault held for its words is dropped, and the message is done."""
    withdraw(ledger, text)
    with ledger.changing() as held:
        held.pop(message, None)
        held[FINALS] = {key: value for key, value in held.get(FINALS, {}).items() if key != message}
        held[DONE] = [*held.get(DONE, []), message][-KEPT_DONE:]


def cut_off(ledger: DisplayedLedger, text: str) -> list[str]:
    """The messages whose parts are the beginning or the end of these last words, taken out of the ledger as done; none when the words are not theirs."""
    with ledger.changing() as held:
        cut = [message for message, parts in held.items() if not message.startswith(PRIVATE) and belongs(text, parts)]
        if not cut:
            return []
        for message in cut:
            del held[message]
        held[FINALS] = {key: value for key, value in held.get(FINALS, {}).items() if key not in cut}
        held[DONE] = [*held.get(DONE, []), *cut][-KEPT_DONE:]
    return cut


def next_turn(ledger: DisplayedLedger) -> None:
    """A new turn begins: the commit marks go, since the same commit words may be said again. What the display hook delivered stays, by its words, because that is the only thing the catch-up can recognise a transcript turn by: the hook knows a message by the provider's id and the transcript knows it by its own. The catch-up consumes each one as it uses it, so the list neither grows nor covers a second turn."""
    with ledger.changing() as held:
        held[SENT] = [mark for mark in held.get(SENT, []) if not COMMIT.fullmatch(mark)]


def undelivered(ledger: DisplayedLedger, turns: list) -> tuple[list, str]:
    """The turns of the transcript the display hook did not bring, with the state of the ledger as it was found, for the line kept when the transcript fills the chat."""
    with ledger.changing() as held:
        sent = [*held.get(SENT, [])]
        streamed = [*held.get(MATCHED, [])]
        pending = []
        for turn in turns:
            key = turn.key
            if key in sent:
                continue
            matched = fingerprint(turn.text)
            if matched in sent:
                sent.remove(matched)
                sent.append(key)
                continue
            if matched in streamed:
                streamed.remove(matched)
                sent.append(key)
                continue
            pending.append(turn)
        held[SENT] = sent[-KEPT_SENT:]
        held[MATCHED] = streamed[-KEPT_SENT:]
        partial = {message: sorted(parts, key=int) for message, parts in held.items() if not message.startswith(PRIVATE) and isinstance(parts, dict)}
        found = (f"sent {len(sent)} last {sent[-5:]} matched {len(streamed)} last {streamed[-5:]} partial {partial} done {held.get(DONE, [])[-5:]}")
    return pending, found


def hold_fault(ledger: DisplayedLedger, fingerprints: list[str], due: float) -> None:
    """Holds the fault that the transcript carried agent text the display hook never delivered, by the fingerprint of each message, so a hook that has stopped arriving is never hidden by the fallback covering for it, and a hook that was only late is never blamed: the fault is raised when nothing with the same words has come within the window."""
    with ledger.changing() as held:
        held[FAULTS] = {**{one: due for one in fingerprints}, **held.get(FAULTS, {})}


def withdraw(ledger: DisplayedLedger, text: str) -> None:
    """The words a held fault was about have come through the display hook after all: the fault is dropped, with no word said, since a notice that takes the first one back teaches people to wait for the second."""
    with ledger.changing() as held:
        held[FAULTS] = {one: at for one, at in held.get(FAULTS, {}).items() if one != fingerprint(text)}


def over(ledger: DisplayedLedger, now: float) -> int:
    """Takes out the faults whose window has run out with nothing arriving and says how many, and no others."""
    with ledger.changing() as held:
        faults = held.get(FAULTS, {})
        due = [one for one, at in faults.items() if at <= now]
        if due:
            held[FAULTS] = {one: at for one, at in faults.items() if one not in due}
    return len(due)


def fault_brief(count: int, session: str) -> tuple[str, str]:
    """What the log says and what the report says of messages the chat was filled with from the transcript."""
    said = plural(count, "message")
    return (f"{FELL_BACK}: {said} in session {session} came from the transcript instead",
            f"The chat was filled from the provider's transcript for {said} the display hook never delivered, in session {session}. "
            "Nothing was lost here, but the chat is meant to come from the hook alone, and the transcript misses text a turn's tool calls follow: find out why the hook did not arrive.")
