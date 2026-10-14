import subprocess
import threading
import time
from dataclasses import dataclass, field
from pathlib import Path

from engine.package import entry
from engine.transcript import IDLE
from controllers.types import Agents, environment_records
from providers import PROVIDERS, search_folds, transcript_reader
from providers.jsonl import WholeRead
from providers.transcript_cache import CONVERSATIONS_HELD
from resources.memo import Memo
from resources.base import SYSTEM

SETTLE, SETTLE_STEP = 1.5, 0.05
TURNS = Memo(CONVERSATIONS_HELD)
READING: dict[str, threading.Lock] = {}
READING_LOCK = threading.Lock()
FIRST_INLINE = 200_000
GROWN_INLINE = 4_000_000
RETRY_AFTER = 600.0
PAUSE = 0.02


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


@dataclass
class LoadLimit:
    """How long one search may spend loading conversations, and the ones it left to load behind its answer."""
    until: float
    left: list = field(default_factory=list)

    @classmethod
    def after(cls, seconds: float) -> "LoadLimit":
        return cls(time.monotonic() + seconds)

    def spent(self) -> bool:
        return time.monotonic() > self.until


def every_turn(agent, limit: LoadLimit | None = None) -> list:
    """All the turns of an agent's transcript for a search: kept on disk and in memory, extended by what the file has grown by; a large conversation nobody has read yet is read by a process of its own at low priority, and the search answers without it until then."""
    try:
        provider = _settled_provider(agent)
        if not provider:
            return []
        path = Path(agent.transcript)
        found = path.stat()
    except OSError:
        return []
    if limit and not TURNS.contains(agent.transcript) and limit.spent():
        limit.left.append(agent.transcript)
        LATER.add(agent)
        return []
    with reading(agent.transcript):
        held = TURNS.kept(agent.transcript)
        whole = held[0] if held and held[1] == found.st_ino and held[0].end <= found.st_size else search_folds.restored(path, found.st_size)
        if whole is None:
            if found.st_size > FIRST_INLINE:
                FOLDS.queue(agent)
                return []
            whole = provider.whole_turns(path, WholeRead.SEARCH)
        elif whole.end < found.st_size:
            if found.st_size - whole.end > GROWN_INLINE:
                FOLDS.queue(agent)
                return whole.turns
            whole = provider.grown_turns(path, whole)
        else:
            TURNS.put(agent.transcript, found.st_ino, (whole, found.st_ino))
            return whole.turns
        TURNS.put(agent.transcript, found.st_ino, (whole, found.st_ino))
        search_folds.keep(path, whole)
        return whole.turns


class LaterLoads:
    """The conversations a search left to load after it answered, read one at a time by a thread of their own, so a search never waits on
    more than its time limit."""

    def __init__(self) -> None:
        self.waiting: dict[str, object] = {}
        self.lock = threading.Lock()
        self.thread: threading.Thread | None = None

    def add(self, agent) -> None:
        with self.lock:
            self.waiting[agent.transcript] = agent
            if self.thread and self.thread.is_alive():
                return
            self.thread = threading.Thread(target=self.load_each, daemon=True)
            self.thread.start()

    def load_each(self) -> None:
        while True:
            with self.lock:
                if not self.waiting:
                    return
                agent = next(iter(self.waiting.values()))
            try:
                every_turn(agent)
            finally:
                with self.lock:
                    self.waiting.pop(agent.transcript, None)
            time.sleep(PAUSE)

    def count(self) -> int:
        return len(self.waiting)


class FoldBuilder:
    """The one low-priority process that keeps conversations' turns on disk, and the conversations queued for it; a conversation it tried is
    left be for RETRY_AFTER."""

    def __init__(self) -> None:
        self.waiting: dict[str, str] = {}
        self.reading: dict[str, str] = {}
        self.tried: dict[str, float] = {}
        self.process: subprocess.Popen | None = None

    def queue(self, agent) -> None:
        if time.monotonic() - self.tried.get(agent.transcript, -RETRY_AFTER) < RETRY_AFTER:
            return
        self.tried[agent.transcript] = time.monotonic()
        self.waiting[agent.transcript] = agent.provider

    def run(self) -> int:
        """How many conversations are queued or being read; starts the process when there is work and none runs."""
        if self.process and self.process.poll() is None:
            return len(self.waiting) + len(self.reading)
        self.reading = dict(self.waiting)
        self.waiting.clear()
        if not self.reading:
            return 0
        pairs = [part for path, provider in self.reading.items() for part in (provider, path)]
        self.process = subprocess.Popen([*entry("providers.fold"), *pairs], stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
        return len(self.reading)


LATER = LaterLoads()
FOLDS = FoldBuilder()


def loading() -> int:
    """How many conversations are queued, being read by the fold process, or left to load after a search."""
    return FOLDS.run() + LATER.count()


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


AHEAD_WITHIN = 6 * 3600.0
AHEAD_PAUSE = 0.05


def read_transcripts(root: Path) -> None:
    """Reads ahead the conversations of the agents that were heard from lately, one at a time with a pause between, so a start does not parse every conversation at once."""
    for record in environment_records(root):
        heard_lately = (agent for agent in Agents(record, actor=SYSTEM).rows.standing() if agent.status != "stopped" and agent.transcript and agent.provider in PROVIDERS and time.time() - float(agent.at) < AHEAD_WITHIN)
        for agent in heard_lately:
            PROVIDERS[agent.provider]().read_ahead(Path(agent.transcript))
            time.sleep(AHEAD_PAUSE)
