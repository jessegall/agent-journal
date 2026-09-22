import os
import time


from features import FEATURES
from features.runtime_cleanup.tidy import tidy
from tests.kit import idle
from tests.conftest import fresh


def test_captures_are_cut_to_their_tail_and_files_of_quiet_sessions_are_removed():
    house = FEATURES["runtime_cleanup"]
    record = fresh()
    runtime = record.root / "runtime"
    runtime.mkdir(exist_ok=True)
    week_ago = time.time() - 8 * 86400

    big = runtime / "printed-codex-1"
    big.write_bytes(b"old" * 100_000 + b"THE END")
    small = runtime / "printed-claude-2"
    small.write_bytes(b"short")
    log = runtime / "commands.log"
    log.write_bytes(b"x" * (2 * 1024 * 1024) + b"last line\n")
    stale = {name: runtime / name for name in ("trigger-gone-work.json", "gate-main-gone.json", "seat-gone.json", "session-gone.json", "printed-gone")}
    for f in stale.values():
        f.write_text("{}")
        os.utime(f, (week_ago, week_ago))
    fresh_session = runtime / "session-here.json"
    fresh_session.write_text("{}")
    kept = runtime / "env"
    kept.write_text("main")
    os.utime(kept, (week_ago, week_ago))
    ended, live = record.state("once", "gone"), record.state("once", "here")
    ended.set("done", 1)
    live.set("done", 1)
    for f in ended.path.parent.iterdir():
        os.utime(f, (week_ago, week_ago))

    text = tidy(record.root, house.values(record).days)

    assert (big.stat().st_size, big.read_bytes().endswith(b"THE END")) == (64 * 1024, True), \
        "a large capture is cut to its last 64 KB, ending as it did"
    assert small.read_bytes() == b"short", "a small capture is left alone"
    assert (log.stat().st_size, log.read_bytes().endswith(b"last line\n")) == (1024 * 1024, True), "a log keeps its last megabyte"

    assert [f.exists() for f in stale.values()] == [False] * 5, "every per-session file quiet past the days is removed"
    assert fresh_session.exists() is True, "a session touched recently stays"
    assert kept.read_text() == "main", "files that are not per-session stay, however old"
    assert (ended.path.parent.exists(), live.path.exists()) == (False, True), "a session's state folder quiet past the days goes, a live one stays"
    assert text == {"removed": 6, "trimmed": 2}, "it says what it did"

    with big.open("ab") as out:
        out.write(b"+more")
    assert big.read_bytes().endswith(b"THE END+more") is True, "an append after the trim continues the tail"


def test_the_days_to_keep_is_a_setting():
    house = FEATURES["runtime_cleanup"]
    record = fresh()
    (record.root / "runtime").mkdir(exist_ok=True)
    old = record.root / "runtime" / "seat-a.json"
    old.write_text("{}")
    two_days = time.time() - 2 * 86400
    os.utime(old, (two_days, two_days))
    record.set_setting("runtime_cleanup", {"days": 1})
    tidy(record.root, house.values(record).days)
    assert old.exists() is False, "housekeeping.days shortens the wait"


def test_it_runs_on_its_own_on_the_agents_activity_once_the_hour_has_passed():
    record = fresh()
    (record.root / "runtime").mkdir(exist_ok=True)
    capture = record.root / "runtime" / "printed-x"
    capture.write_bytes(b"y" * 200_000)
    idle(record)
    assert capture.stat().st_size == 64 * 1024, "the first activity sweeps"
