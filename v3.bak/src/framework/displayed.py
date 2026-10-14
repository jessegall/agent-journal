"""What the chat knows of what it was shown: the ledger of the words the display hook brought and the turns already sent, kept apart from the policy of when a turn is sent.

The engine sends a turn through here when its provider shows nothing as it is displayed, and the messages feature reads and writes it as the display hook's words arrive; so it sits
below both."""

import re
import threading
from contextlib import contextmanager
from copy import deepcopy
from pathlib import Path
from typing import Iterator

from controllers.agents import Agents
from engine import bus, chat, runtime, waits
from engine.sessions import Sessions
from engine.stored import read_json, write_json
from events.agents import CHUNK
from payload import Chunk
from resources.base import AGENT, SYSTEM
from serving import SERVED, Providers
from resources.text import digest
from engine.record import Record

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


def joined_parts(parts: dict) -> str:
    return "".join(parts[i] for i in sorted(parts, key=int)).strip()


def belongs(text: str, parts: dict) -> bool:
    piece = joined_parts(parts)
    return bool(piece) and (text.strip().startswith(piece) or ("0" not in parts and text.strip().endswith(piece)))


def fingerprint(text: str) -> str:
    return digest(" ".join(text.split()))


def arrived(held: dict, text: str) -> bool:
    """Whether the display hook has brought these words, whole or in the parts a turn's end completes."""
    return fingerprint(text) in held.get(MATCHED, []) or any(not message.startswith(PRIVATE) and belongs(text, parts)
                                                             for message, parts in held.items())


def arrives(root: Path, session: str, text: str) -> bool:
    """Whether the display hook has brought the turn's last words. The provider sends them and the hook that ends the turn
    at the same moment, each as its own process, and a loaded machine lets the end arrive first; without the wait for them the
    catch-up calls words that are still on their way undelivered, and fills the chat from the transcript instead."""
    return arrived(read_json(DisplayedLedger(root, session).file, dict, {}), text)


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


def display_chunks(raw: dict) -> list[Chunk]:
    return [chunk for provider in SERVED.given(Providers).every() if (chunk := provider.display_chunk(raw)) is not None]


def announce_chunk(root: Path, chunk: Chunk) -> None:
    """A word of the display hook is told as an event of the agent it came from, which the messages feature collects into the turn it belongs to; a session with no row has no chat to fill."""
    record = recording(root, chunk.session)
    row = Agents(record, actor=SYSTEM).rows.by_title(chunk.session)
    if row is not None:
        bus.announce(record, "agent", row.n, CHUNK, AGENT, {"message": chunk.message, "index": chunk.index, "delta": chunk.delta, "final": chunk.final})


def replay_file(root: Path, kept: Path, body: dict | None = None) -> None:
    """A kept display event goes to the chat; the file is taken whatever it holds."""
    raw = body if body is not None else read_json(kept, dict, {})
    kept.unlink(missing_ok=True)
    with REPLAYING:
        for chunk in display_chunks(raw):
            announce_chunk(root, chunk)
