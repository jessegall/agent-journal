import subprocess
import threading
import time
from pathlib import Path

from engine.package import entry
from engine.transcript import IDLE
from controllers.types import Agents, environment_records
from providers import PROVIDERS, search_folds, transcript_reader
from providers.jsonl import WholeRead
from resources.base import SYSTEM

SETTLE, SETTLE_STEP = 1.5, 0.05
TURNS: dict[str, tuple] = {}
READING: dict[str, threading.Lock] = {}
READING_LOCK = threading.Lock()
BUILDER: subprocess.Popen | None = None
WAITING: dict[str, str] = {}
READ_NOW: dict[str, str] = {}
TRIED: dict[str, float] = {}
FIRST_INLINE = 200_000
GROWN_INLINE = 4_000_000
RETRY_AFTER = 600.0


def settled(provider, path: Path, agent) -> None:
    until = time.time() + SETTLE
    while agent.status == IDLE and provider.settling(path) and time.time() < until:
        time.sleep(SETTLE_STEP)


def _settled_provider(agent):
    provider = transcript_reader(agent)
    if provider is None:
        return None
    settled(provider, Path(agent.transcript), agent)
    return provider


def every_turn(agent) -> list:
    """All the turns of an agent's transcript for a search: kept on disk and in memory, extended by what the file has grown by; a large conversation nobody has read yet is read by a process of its own at low priority, and the search answers without it until then."""
    try:
        provider = _settled_provider(agent)
        if not provider:
            return []
        path = Path(agent.transcript)
        found = path.stat()
    except OSError:
        return []
    with reading(agent.transcript):
        held = TURNS.get(agent.transcript)
        whole = held[0] if held and held[1] == found.st_ino and held[0].end <= found.st_size else search_folds.restored(path, found.st_size)
        if whole is None:
            if found.st_size > FIRST_INLINE:
                begin_reading(agent)
                return []
            whole = provider.whole_turns(path, WholeRead.SEARCH)
        elif whole.end < found.st_size:
            if found.st_size - whole.end > GROWN_INLINE:
                begin_reading(agent)
                return whole.turns
            whole = provider.grown_turns(path, whole)
        else:
            TURNS[agent.transcript] = (whole, found.st_ino)
            return whole.turns
        TURNS[agent.transcript] = (whole, found.st_ino)
        search_folds.keep(path, whole)
        return whole.turns


def begin_reading(agent) -> None:
    """Queues a conversation for the one low-priority process that keeps conversations' turns on disk, and leaves it be for a while after it was tried; loading() starts the process once the search has queued them all."""
    if time.monotonic() - TRIED.get(agent.transcript, -RETRY_AFTER) < RETRY_AFTER:
        return
    TRIED[agent.transcript] = time.monotonic()
    WAITING[agent.transcript] = agent.provider


def loading() -> int:
    """How many conversations are queued or being read by the process of their own; starts the process when there is work and none runs."""
    global BUILDER
    if BUILDER and BUILDER.poll() is None:
        return len(WAITING) + len(READ_NOW)
    if WAITING:
        READ_NOW.clear()
        READ_NOW.update(WAITING)
        WAITING.clear()
        pairs = [part for path, provider in READ_NOW.items() for part in (provider, path)]
        BUILDER = subprocess.Popen([*entry("providers.fold"), *pairs], stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
        return len(READ_NOW)
    READ_NOW.clear()
    return 0


def reading(transcript: str) -> threading.Lock:
    """One reader per transcript at a time, so two searches that meet on a transcript parse it once."""
    with READING_LOCK:
        return READING.setdefault(transcript, threading.Lock())


def turns(agent) -> list:
    """The turns an agent spoke, read from the saved cursor so a hook never parses the transcript from its first byte."""
    provider = _settled_provider(agent)
    return [t for t in provider.turns(Path(agent.transcript)) if t.has_agent_text] if provider else []


def last_turn(agent):
    provider = _settled_provider(agent)
    if not provider:
        return None
    recent = [t for t in provider.last_turns(agent.transcript) if t.has_agent_text] or turns(agent)
    return recent[-1] if recent else None


def last_text(agent) -> str:
    written = last_turn(agent)
    return written.text if written else ""


def read_transcripts(root: Path) -> None:
    for record in environment_records(root):
        for agent in Agents(record, actor=SYSTEM).rows.standing():
            if agent.status != "stopped" and agent.transcript and agent.provider in PROVIDERS:
                PROVIDERS[agent.provider]().read_ahead(Path(agent.transcript))
