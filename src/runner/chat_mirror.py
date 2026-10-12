import re
import threading
import time
from contextlib import contextmanager
from copy import deepcopy
from pathlib import Path
from typing import Iterator

import features
from controllers.types import Agents
from engine import chat, runtime, waits
from engine.after_answer import after_answered, answering
from engine.record import Record
from engine.sessions import Sessions
from engine.stored import read_json, write_json
from resources.text import digest, plural
from features.dev_faults.diagnostics import logged
from providers import PROVIDERS
from payload import Chunk
from resources.base import SYSTEM

DISPLAYED = "displayed.json"
PRIVATE = "_"
DONE = "_done"
SENT = "_sent"
MATCHED = "_matched"
FINALS = "_finals"
FAULTS = "_faults"
KEPT_DONE = 50
KEPT_SENT = 500
FELL_BACK = "the display hook did not deliver what the agent said"
COMMIT = re.compile(r"[0-9a-f]{40}")
CATCH_UP = 600.0
SETTLE = 3.0
SETTLE_STEP = 0.05
HELD_FOR = 30.0
"""How long a fallback is only provisional: the display hook was seen delivering words three seconds after the turn that carried them ended, past the wait for them, so the fault is raised only when no chunk with the same words has come within this long, which is ten times what was seen."""
REPLAYING = threading.Lock()


class SessionLocks:
    def __init__(self):
        self.locks: dict[str, waits.Lock] = {}
        self.guard = threading.Lock()

    def of(self, session: str) -> waits.Lock:
        with self.guard:
            return self.locks.setdefault(session, waits.Lock("showing"))


LOCKS = SessionLocks()


class DisplayedLedger:
    def __init__(self, root: Path, session: str):
        self.session = session
        self.file = runtime.session_file(root, session, DISPLAYED)

    @contextmanager
    def changing(self) -> Iterator[dict]:
        with LOCKS.of(self.session):
            held = read_json(self.file, dict, {})
            before = deepcopy(held)
            yield held
            if held != before:
                write_json(self.file, held)


def unsent(root: Path) -> Path:
    return runtime.folder(root) / "unsent"


def replay_file(root: Path, kept: Path, body: dict | None = None) -> None:
    """A kept display event goes to the chat; the file is taken whatever it holds."""
    raw = body if body is not None else read_json(kept, dict, {})
    kept.unlink(missing_ok=True)
    with REPLAYING:
        for chunk in display_chunks(raw):
            shown(root, chunk)


def display_chunks(raw: dict) -> list[Chunk]:
    return [chunk for provider in PROVIDERS.values() if (chunk := provider.display_chunk(raw)) is not None]


def displayed(root: Path, chunk: Chunk) -> None:
    shown(root, chunk)


def traced(root: Path, line: str) -> None:
    """What the catch-up found the hook had not brought, kept beside the other diagnostics. It fires only when the transcript fills the chat, which is rare and is the thing worth a line forever; the per-chunk evidence that named the cause of to-do 4549 is gone, since the hook's path is hot and a line per delta grows without bound."""
    logged(root, f"display {line}")


def shown(root: Path, chunk: Chunk) -> None:
    session, message = chunk.session, chunk.message
    ledger = DisplayedLedger(root, session)
    with ledger.changing() as held:
        if message in held.get(DONE, []):
            return
        parts = held[message] = {**held.get(message, {}), str(chunk.index): chunk.delta}
        finals = held[FINALS] = {**held.get(FINALS, {})}
        if chunk.final:
            finals[message] = chunk.index
        if message not in finals or any(str(i) not in parts for i in range(finals[message] + 1)):
            return
        last = finals[message]
    text = "".join(parts[str(i)] for i in range(last + 1))
    if not send_to_chat(root, session, text, message or None, streamed=True):
        return
    withdrawn(root, session, text)
    with ledger.changing() as held:
        held.pop(message, None)
        held[FINALS] = {key: value for key, value in held.get(FINALS, {}).items() if key != message}
        held[DONE] = [*held.get(DONE, []), message][-KEPT_DONE:]


def joined_parts(parts: dict) -> str:
    return "".join(parts[i] for i in sorted(parts, key=int)).strip()


def belongs(text: str, parts: dict) -> bool:
    piece = joined_parts(parts)
    return bool(piece) and (text.strip().startswith(piece) or ("0" not in parts and text.strip().endswith(piece)))


def fingerprint(text: str) -> str:
    return digest(" ".join(text.split()))


def turn_ended(root: Path, session: str, row, last_message: str, until: float = 0.0) -> None:
    """Ends the turn once the display hook has brought its last words, or SETTLE has gone by. The words arrive as a job of this session's lane, queued behind this one, so waiting here would only hold them back: the wait is put at the back of the lane, behind whatever the hook has sent meanwhile."""
    if not until:
        raise_held(root, session)
        until = time.time() + SETTLE
    while last_message and not arrives(root, session, last_message) and time.time() < until:
        time.sleep(SETTLE_STEP)
        if answering():
            after_answered(lambda: turn_ended(root, session, row, last_message, until))
            return
    if last_message:
        stopped(root, session, last_message)
    unfinished(root, session, row)


def arrived(held: dict, text: str) -> bool:
    """Whether the display hook has brought these words, whole or in the parts a turn's end completes."""
    return fingerprint(text) in held.get(MATCHED, []) or any(not message.startswith(PRIVATE) and belongs(text, parts)
                                                             for message, parts in held.items())


def arrives(root: Path, session: str, text: str) -> bool:
    """Whether the display hook has brought the turn's last words. The provider sends them and the hook that ends the turn
    at the same moment, each as its own process, and a loaded machine lets the end arrive first; without the wait for them the
    catch-up calls words that are still on their way undelivered, and fills the chat from the transcript instead."""
    return arrived(read_json(DisplayedLedger(root, session).file, dict, {}), text)


def turn_began(root: Path, session: str, row) -> None:
    raise_held(root, session)
    unfinished(root, session, row)
    next_turn(root, session)


def stopped(root: Path, session: str, text: str) -> None:
    with DisplayedLedger(root, session).changing() as held:
        cut = [message for message, parts in held.items() if not message.startswith(PRIVATE) and belongs(text, parts)]
        if not cut:
            return
        for message in cut:
            del held[message]
        held[FINALS] = {key: value for key, value in held.get(FINALS, {}).items() if key not in cut}
        held[DONE] = [*held.get(DONE, []), *cut][-KEPT_DONE:]
    send_to_chat(root, session, text, cut[0] or None, streamed=True)
    withdrawn(root, session, text)


def next_turn(root: Path, session: str) -> None:
    """A new turn begins: the commit marks go, since the same commit words may be said again. What the display hook delivered stays, by its words, because that is the only thing the catch-up can recognise a transcript turn by: the hook knows a message by the provider's id and the transcript knows it by its own. The catch-up consumes each one as it uses it, so the list neither grows nor covers a second turn."""
    with DisplayedLedger(root, session).changing() as held:
        held[SENT] = [mark for mark in held.get(SENT, []) if not COMMIT.fullmatch(mark)]


def unfinished(root: Path, session: str, row) -> None:
    provider = PROVIDERS.get(row.provider)
    if provider is None or not row.transcript:
        return
    turns = [turn for turn in provider().turns(Path(row.transcript)) if turn.has_agent_text and turn.at >= time.time() - CATCH_UP]
    ledger = DisplayedLedger(root, session)
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
    if not pending:
        return
    traced(root, f"fallback session {session} pending {[(turn.key, fingerprint(turn.text), len(turn.text)) for turn in pending]} "
                 f"sent {len(sent)} last {sent[-5:]} matched {len(streamed)} last {streamed[-5:]} partial {partial} done {held.get(DONE, [])[-5:]}")
    if provider.shows_what_is_said() and not provider().interrupted_by_user(Path(row.transcript)):
        fell_back(root, session, [fingerprint(turn.text) for turn in pending])
    for turn in pending:
        send_to_chat(root, session, turn.text, turn.key)


def fell_back(root: Path, session: str, fingerprints: list[str]) -> None:
    """Holds the fault that the transcript carried agent text the display hook never delivered, by the fingerprint of each message, so a hook that has stopped arriving is never hidden by the fallback covering for it, and a hook that was only late is never blamed: the fault is raised when nothing with the same words has come within HELD_FOR. A provider that shows nothing as it is displayed is read from its transcript by design and is never reported."""
    due = time.time() + HELD_FOR
    with DisplayedLedger(root, session).changing() as held:
        held[FAULTS] = {**{one: due for one in fingerprints}, **held.get(FAULTS, {})}
    if HELD_FOR <= 0:
        raise_held(root, session)
        return
    timer = threading.Timer(HELD_FOR + SETTLE_STEP, raise_held, (root, session))
    timer.daemon = True
    timer.start()


def withdrawn(root: Path, session: str, text: str) -> None:
    """The words a held fault was about have come through the display hook after all: the fault is dropped, with no word said, since a notice that takes the first one back teaches people to wait for the second."""
    with DisplayedLedger(root, session).changing() as held:
        held[FAULTS] = {one: at for one, at in held.get(FAULTS, {}).items() if one != fingerprint(text)}


def raise_held(root: Path, session: str) -> None:
    """Raises the faults whose window has run out with nothing arriving, and no others; the timer calls it, and so does the next turn, in case the server was reloaded while the fault was held."""
    now = time.time()
    with DisplayedLedger(root, session).changing() as held:
        faults = held.get(FAULTS, {})
        over = [one for one, at in faults.items() if at <= now]
        if not over:
            return
        held[FAULTS] = {one: at for one, at in faults.items() if one not in over}
    said = plural(len(over), "message")
    logged(root, f"{FELL_BACK}: {said} in session {session} came from the transcript instead")
    faults = features.FEATURES.get("dev_faults")
    if faults is None:
        return
    faults.reports.file(recording(root, session), FELL_BACK, f"The chat was filled from the provider's transcript for {said} the display hook never delivered, in session {session}. "
                        "Nothing was lost here, but the chat is meant to come from the hook alone, and the transcript misses text a turn's tool calls follow: find out why the hook did not arrive.")


def recording(root: Path, session: str) -> Record:
    """The record a session's chat is written to."""
    return Record(root, Sessions(root).environment(session) or runtime.env(root))


def send_to_chat(root: Path, session: str, text: str, turn: str | None = None, streamed: bool = False) -> bool:
    if not text.strip():
        return False
    record = recording(root, session)
    row = Agents(record, actor=SYSTEM).rows.by_title(session)
    if row is None:
        return False
    return send_row_to_chat(record, row, text, turn, streamed)


def send_row_to_chat(record: Record, row, text: str, turn: str | None = None, streamed: bool = False) -> bool:
    ledger = DisplayedLedger(record.root, row.title)
    key = fingerprint(text)
    mark = key if turn is None else turn
    with ledger.changing() as held:
        sent, matched = held.get(SENT, []), held.get(MATCHED, [])
        if mark in sent or key in sent or key in matched:
            return True
        held[SENT] = [*sent, mark][-KEPT_SENT:]
        held[MATCHED] = [*matched, key][-KEPT_SENT:]
    chat.send(record, row, text, turn=turn)
    return True
