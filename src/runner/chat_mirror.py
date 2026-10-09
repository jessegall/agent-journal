import re
import threading
import time
from contextlib import contextmanager
from copy import deepcopy
from pathlib import Path
from typing import Iterator

from controllers.types import Agents
from engine import chat, runtime, waits
from engine.record import Record
from engine.sessions import Sessions
from engine.stored import read_json, write_json
from engine.wording import digest
from providers import PROVIDERS
from providers.payload import Chunk
from resources.base import SYSTEM

DISPLAYED = "displayed.json"
PRIVATE = "_"
DONE = "_done"
SENT = "_sent"
MATCHED = "_matched"
FINALS = "_finals"
KEPT_DONE = 50
KEPT_SENT = 500
LINE_KEY = re.compile(r"transcript:\d+")
COMMIT = re.compile(r"[0-9a-f]{40}")
CATCH_UP = 600.0
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


def replay(root: Path) -> None:
    with REPLAYING:
        for f in sorted(unsent(root).glob("*.json"), key=lambda f: (f.stat().st_mtime_ns, f.name)):
            raw = read_json(f, dict, {})
            f.unlink(missing_ok=True)
            for chunk in display_chunks(raw):
                shown(root, chunk)


def display_chunks(raw: dict) -> list[Chunk]:
    return [chunk for provider in PROVIDERS.values() if (chunk := provider.display_chunk(raw)) is not None]


def displayed(root: Path, chunk: Chunk) -> None:
    replay(root)
    shown(root, chunk)


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
    if not send_to_chat(root, session, "".join(parts[str(i)] for i in range(last + 1)), message or None, streamed=True):
        return
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


def turn_ended(root: Path, session: str, row, last_message: str) -> None:
    if last_message:
        stopped(root, session, last_message)
    unfinished(root, session, row)


def turn_began(root: Path, session: str, row) -> None:
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


def next_turn(root: Path, session: str) -> None:
    with DisplayedLedger(root, session).changing() as held:
        held[SENT] = [mark for mark in held.get(SENT, []) if not COMMIT.fullmatch(mark)]
        held[MATCHED] = []


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
        if any(LINE_KEY.fullmatch(key) for key in sent):
            written = ledger.file.stat().st_mtime
            sent = [turn.key for turn in turns if turn.at <= written]
            turns = [turn for turn in turns if turn.at > written]
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
    for turn in pending:
        send_to_chat(root, session, turn.text, turn.key)


def send_to_chat(root: Path, session: str, text: str, turn: str | None = None, streamed: bool = False) -> bool:
    if not text.strip():
        return False
    record = Record(root, Sessions(root).environment(session) or runtime.env(root))
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
