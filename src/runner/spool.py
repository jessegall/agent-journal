import os
import threading
from dataclasses import dataclass, field, replace
from pathlib import Path

from engine.memo import Memo
from engine.stored import read_json
from providers import PROVIDERS
from providers.payload import Hook
from resources.fields import Loaded
from runner import chat_mirror
from runner.hooks import answer

REPLAYING = threading.Lock()
WAITING = Memo()


@dataclass(frozen=True)
class Spooled(Loaded):
    """A hook event the server did not answer, kept by the hook with who sent it."""

    agent: str = ""
    env: str = ""
    pid: int = 0
    body: dict = field(default_factory=dict)


def kept_stamp(root: Path) -> int:
    try:
        return os.stat(chat_mirror.unsent(root)).st_mtime_ns
    except OSError:
        return 0


def replay(root: Path, most: int = 0) -> None:
    """Takes every event kept while the server could not answer (the oldest `most` of them, when given), oldest first: a shown message goes to the chat, any other event is handled as if it had just arrived, at the time the hook kept it."""
    if not REPLAYING.acquire(blocking=False):
        return
    try:
        waiting = WAITING.get(str(root), kept_stamp(root), lambda: sorted(chat_mirror.unsent(root).glob("*.json"), key=lambda f: (f.stat().st_mtime_ns, f.name)))
        for kept in waiting[:most] if most else waiting:
            handle(root, kept)
    finally:
        REPLAYING.release()


def handle(root: Path, kept: Path) -> None:
    spooled = Spooled.from_json(read_json(kept, dict, {}))
    provider = PROVIDERS.get(spooled.agent)
    if provider is None or not spooled.body:
        chat_mirror.replay_file(root, kept)
        return
    if provider.display_chunk(spooled.body) is not None:
        chat_mirror.replay_file(root, kept, spooled.body)
        return
    at = kept.stat().st_mtime
    kept.unlink(missing_ok=True)
    answer(provider(), root, replace(Hook.read(spooled.body, provider.tool_kinds), at=at), spooled.pid, spooled.env)
