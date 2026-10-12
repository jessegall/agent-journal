import threading
import time
import traceback
from functools import wraps
from collections import defaultdict
from contextlib import contextmanager
from typing import Callable

from engine.transaction import WORK, undoable
from events.answers import Allowed, Answer
from resources.base import Event

Listener = Callable[[Event, object], None]
ANY = "*"

_listeners: dict[str, list[tuple[str, Listener]]] = defaultdict(list)
_watchers: list[Listener] = []
_cause = threading.local()
_command = threading.local()


def always(record) -> bool:
    return True


def on(pattern: str, listener: Listener, enabled: Callable = always) -> Callable[[], None]:
    entry = (enabled, listener)
    _listeners[pattern].append(entry)
    _dispatch.joins(pattern, listener, enabled)

    def off() -> None:
        _listeners[pattern].remove(entry)
        _dispatch.leaves(pattern, listener)
    return off


def watch(watcher: Listener) -> Callable[[], None]:
    _watchers.append(watcher)
    return lambda: _watchers.remove(watcher)


def tell_watchers(event: Event, record=None) -> None:
    for watcher in list(_watchers):
        watcher(event, record)


def emit(event: Event, record=None) -> None:
    if WORK.bus_queue is not None:
        WORK.bus_queue.append((event, record))
        return
    run(event, record)


def announce(record, type: str, n: int, action: str, actor: str, data: dict | None = None, at: float | None = None) -> None:
    emit(Event(0, time.time() if at is None else at, type, n, action, actor, data or {}), record)


def commanded(type_: str, name: str, fn):
    @wraps(fn)
    def run_command(*args, **kwargs):
        if getattr(_command, "word", None):
            return fn(*args, **kwargs)
        _command.word = (type_, name)
        try:
            return fn(*args, **kwargs)
        finally:
            _command.word = None
    return run_command


def command(type_: str) -> str:
    word = getattr(_command, "word", None)
    return word[1] if word and word[0] == type_ else ""


def cause() -> str:
    return getattr(_cause, "actor", "")


def caused_by() -> str:
    """The engine's name for the event being handled here, which the writes made under it are caused by."""
    return getattr(_cause, "named", "")


@contextmanager
def causing(named: str):
    """Names the event a tick is handling, so every write it makes says what caused it and the activity list can show the chain as a tree. The actor keeps its own field: who set something off and what it came out of are two different facts."""
    before = caused_by()
    _cause.named = named or before
    try:
        yield
    finally:
        _cause.named = before


def patterns(event) -> tuple[str, ...]:
    return (ANY, event.type, event.action, f"{event.type}.{event.action}", event.data.get("event") or "", f"hook.{event.data.get('hook')}" if event.data.get("hook") else "", "hook.*" if event.data.get("hook") else "")


def over_the_listeners(event: Event, record=None) -> None:
    """Every listener of this event, run here and now: the 2.x way, and what a process with no engine behind it does."""
    for pattern in patterns(event):
        for enabled, listener in list(_listeners.get(pattern, ())):
            if record is None or enabled(record):
                listener(event, record)


def nobody_joins(pattern: str, listener: Listener, enabled: Callable) -> None:
    """The walk needs no telling who joined: a listener on the bus is already where it runs."""


def nobody_leaves(pattern: str, listener: Listener) -> None:
    """The walk needs no telling who left, for the same reason."""


def nobody_answers(request, record) -> Answer:
    """No engine is seated to answer a request, so what was asked about goes on as it was."""
    return Allowed()


class Dispatch:
    """How a told event reaches what acts on it: the walk over the listeners until the engine is seated, and then the engine's own lane, which runs the same receivers inside a tick. A request is answered the same way: by nobody until the engine is seated."""

    def __init__(self, reaches: Listener, joins=nobody_joins, leaves=nobody_leaves, asks=nobody_answers):
        self.reaches, self.joins, self.leaves, self.asks = reaches, joins, leaves, asks


_dispatch = Dispatch(over_the_listeners)


def dispatched_by(reaches: Listener, joins=nobody_joins, leaves=nobody_leaves) -> None:
    """Who the told events go to now, and how a listener registered later joins it and leaves it, so the bus keeps one way to be reached."""
    _dispatch.reaches, _dispatch.joins, _dispatch.leaves = reaches, joins, leaves


def answered_by(asks: Callable) -> None:
    """Who answers a request from now on: the engine's answerers, once it is seated."""
    _dispatch.asks = asks


def asked(request, record) -> Answer:
    """The one answer to a request, read before anything about it is written."""
    return _dispatch.asks(request, record)


def run(event: Event, record=None) -> None:
    tell_watchers(event, record)
    before = cause()
    _cause.actor = event.data.get("cause") or event.actor
    try:
        _dispatch.reaches(event, record)
    finally:
        _cause.actor = before


@contextmanager
def held():
    previous, WORK.bus_queue = WORK.bus_queue, []
    try:
        yield WORK.bus_queue
    finally:
        WORK.bus_queue = previous


@contextmanager
def settled():
    if WORK.bus_queue is not None:
        yield
        return
    queue: list = []
    try:
        with held() as queue:
            yield
    finally:
        release(queue)


@contextmanager
def unit():
    with settled(), undoable():
        yield


def defer(job: Callable[[], None]) -> None:
    if WORK.bus_queue is None:
        job()
        return
    WORK.bus_queue.append((job, None))


def defer_once(key: str, job: Callable[[], None]) -> None:
    queue, after = WORK.bus_queue, WORK.bus_after
    if queue is not None:
        if key not in (held for item, held in queue if callable(item)):
            queue.append((job, key))
        return
    if after is not None:
        after.setdefault(key, job)
        return
    job()


BACKGROUND = True
_spaced_lock = threading.Lock()
_spaced_last: dict[str, float] = {}
_spaced_waiting: dict[str, Callable[[], None]] = {}


def spaced(key: str, every: float, job: Callable[[], None]) -> None:
    """Runs the job at most once every so many seconds per key; one asked for sooner is kept, the newest of them replacing the rest, and runs when the time is up, so the last state always lands; with the thread switched off it runs at once."""
    if not BACKGROUND:
        job()
        return
    with _spaced_lock:
        wait = _spaced_last.get(key, 0.0) + every - time.monotonic()
        if wait > 0:
            if key not in _spaced_waiting:
                timer = threading.Timer(wait, _spaced_due, (key, every))
                timer.daemon = True
                timer.start()
            _spaced_waiting[key] = job
            return
        _spaced_last[key] = time.monotonic()
    job()


def _spaced_due(key: str, every: float) -> None:
    with _spaced_lock:
        job = _spaced_waiting.pop(key, None)
        _spaced_last[key] = time.monotonic()
    if job:
        try:
            job()
        except Exception:
            traceback.print_exc()


class Background:
    """The work nobody waits for, and the one thread that runs it: a job is kept under its key until the thread reaches it, so asking twice before it starts runs it once."""

    def __init__(self):
        self.waiting: dict[str, Callable[[], None]] = {}
        self.thread = threading.Thread(target=lambda: None)
        self.lock = threading.Lock()

    def takes(self, key: str, job: Callable[[], None]) -> None:
        with self.lock:
            self.waiting[key] = job
            if self.thread.is_alive():
                return
            self.thread = threading.Thread(target=self.work_through, daemon=True)
            self.thread.start()

    def finished(self, within: float) -> bool:
        until = time.monotonic() + within
        while time.monotonic() < until:
            with self.lock:
                if not self.waiting and not self.thread.is_alive():
                    return True
            time.sleep(0.005)
        return False

    def work_through(self) -> None:
        while True:
            with self.lock:
                if not self.waiting:
                    return
                key = next(iter(self.waiting))
                job = self.waiting.pop(key)
            try:
                job()
            except Exception:
                traceback.print_exc()


BEHIND = Background()


def background(key: str, job: Callable[[], None]) -> None:
    """Runs work nobody waits for on a thread of its own, once per key if it is asked for again before it started, so the request that asked for it is not held up by it; with the thread switched off it runs at once."""
    if not BACKGROUND:
        job()
        return
    BEHIND.takes(key, job)


def background_finished(within: float = 5.0) -> bool:
    """Whether the background thread has run everything asked of it, waited for up to `within` seconds; for a test or a shutdown that must see its work done."""
    return BEHIND.finished(within)


def release(queue: list) -> None:
    previous, WORK.bus_after = WORK.bus_after, {}
    try:
        for item, record in queue:
            if callable(item):
                item()
                continue
            emit(item, record)
    finally:
        after, WORK.bus_after = WORK.bus_after, previous
    for job in after.values():
        job()


def listening() -> bool:
    return any(_listeners.values())


def heard(pattern: str) -> bool:
    return bool(_listeners.get(pattern))


def clear() -> None:
    _listeners.clear()
    _watchers.clear()
    dispatched_by(over_the_listeners)
