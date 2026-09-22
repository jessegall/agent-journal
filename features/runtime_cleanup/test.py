import os
import time


from engine import runtime
from features import FEATURES
from features.runtime_cleanup.tidy import tidy
from tests.kit import tick
from tests.conftest import fresh


def aged(path, days: float):
    then = time.time() - days * 86400
    for f in path.iterdir() if path.is_dir() else [path]:
        os.utime(f, (then, then))


def test_captures_are_cut_to_their_tail_and_quiet_sessions_are_removed_whole():
    house = FEATURES["runtime_cleanup"]
    record = fresh()
    big = runtime.session_file(record.root, "codex-1", "printed")
    big.parent.mkdir(parents=True)
    big.write_bytes(b"old" * 100_000 + b"THE END")
    small = runtime.session_file(record.root, "claude-2", "printed")
    small.parent.mkdir(parents=True)
    small.write_bytes(b"short")
    log = runtime.folder(record.root) / "commands.log"
    log.write_bytes(b"x" * (2 * 1024 * 1024) + b"last line\n")
    gone = runtime.sessions(record.root) / "gone"
    gone.mkdir()
    for name in ("trigger-work.json", "gate-main.json", "seat.json", "session.json", "printed"):
        (gone / name).write_text("{}")
    aged(gone, 8)
    kept = runtime.folder(record.root) / "env"
    kept.write_text("main")
    aged(kept, 8)

    text = tidy(record.root, house.values(record).days)

    assert (big.stat().st_size, big.read_bytes().endswith(b"THE END")) == (64 * 1024, True), \
        "a large capture is cut to its last 64 KB, ending as it did"
    assert small.read_bytes() == b"short", "a small capture is left alone"
    assert (log.stat().st_size, log.read_bytes().endswith(b"last line\n")) == (1024 * 1024, True), "a log keeps its last megabyte"
    assert (gone.exists(), small.exists()) == (False, True), "a session's folder quiet past the days goes whole, a live one stays"
    assert kept.read_text() == "main", "files that are not per-session stay, however old"
    assert text == {"removed": 1, "trimmed": 2}, "it says what it did"

    with big.open("ab") as out:
        out.write(b"+more")
    assert big.read_bytes().endswith(b"THE END+more") is True, "an append after the trim continues the tail"


def test_the_days_to_keep_is_a_setting():
    house = FEATURES["runtime_cleanup"]
    record = fresh()
    old = runtime.session_file(record.root, "a", "seat.json")
    old.parent.mkdir(parents=True)
    old.write_text("{}")
    aged(old, 2)
    record.set_setting("runtime_cleanup", {"days": 1})
    tidy(record.root, house.values(record).days)
    assert old.parent.exists() is False, "housekeeping.days shortens the wait"


def test_it_runs_on_its_own_on_the_engines_clock():
    record = fresh()
    capture = runtime.session_file(record.root, "x", "printed")
    capture.parent.mkdir(parents=True)
    capture.write_bytes(b"y" * 200_000)
    tick(record)
    assert capture.stat().st_size == 64 * 1024, "the first tick sweeps"
