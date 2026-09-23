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
    assert text == {"removed": 1, "trimmed": 2, "events": 0, "leftovers": 0}, "it says what it did"

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


def test_the_event_log_keeps_the_last_hundred_and_whatever_a_live_reader_has_not_reached():
    record = fresh()
    for i in range(150):
        record.emit("todo", i, "created", "system", quiet=True)
    first = record.events(last=150)[0].id
    record.set_cursor("slow", first + 19)
    record.set_cursor("gone", first + 4)
    two_days_ago = time.time() - 2 * 86400
    os.utime(record.home / "runtime" / "cursor-gone", (two_days_ago, two_days_ago))
    tidy(record.root, 2)
    kept = [e.id for e in record.events()]
    assert (kept[0], len(kept)) == (first + 20, 130), "the last 100 stay, and everything after a live reader's place; a reader gone for days holds nothing"
    assert record.emit("todo", 1, "updated", "system", quiet=True).id == first + 150, "ids keep counting up"


def test_leftover_plugin_checkouts_and_old_environment_archives_are_removed_and_snapshots_kept():
    record = fresh()
    root = record.root
    old = time.time() - 100 * 86400
    stale, fresh_one = root / "plugins" / ".staging-a", root / "plugins" / ".staging-b"
    for d in (stale, fresh_one):
        (d / ".git").mkdir(parents=True)
    os.utime(stale, (old, old))
    (root / "attic").mkdir()
    gone, snapshot, recent = root / "attic" / "old-env.tar.gz", root / "attic" / "before-1.0.0-1.tar.gz", root / "attic" / "new-env.tar.gz"
    for f in (gone, snapshot, recent):
        f.write_bytes(b"")
    for f in (gone, snapshot):
        os.utime(f, (old, old))
    (root / "runtime").mkdir(exist_ok=True)
    (root / "runtime" / "channel.jsonl").write_text("x" * (2 * 1024 * 1024))
    (root / "runtime" / "outputs").mkdir()
    unkept = root / "runtime" / "outputs" / "output-abc"
    unkept.write_text("a command's whole output that never became a row")
    os.utime(unkept, (old, old))
    tidy(root, 2)
    assert not unkept.exists(), "an output file left behind for a day goes"
    assert (stale.exists(), fresh_one.exists()) == (False, True), "a checkout an install left behind goes after an hour; one being installed stays"
    assert (gone.exists(), snapshot.exists(), recent.exists()) == (False, True, True), "an old environment archive goes; upgrade snapshots are kept by their own count"
    assert (root / "runtime" / "channel.jsonl").stat().st_size == 1024 * 1024, "the channel log is cut to its tail"


def test_an_installed_update_tidies_at_once():
    from controllers.types import Notifications
    from features import load
    from resources.base import SYSTEM
    from surfaces.updates import KIND
    load()
    record = fresh()
    left = record.root / "plugins" / ".staging-old"
    left.mkdir(parents=True)
    old = time.time() - 2 * 3600
    os.utime(left, (old, old))
    Notifications(record, actor=SYSTEM)._logged("Journal updated to 9.9.9", brief="from 9.9.8", kind=KIND, version="9.9.9")
    assert not left.exists(), "a new version is housekept the moment it is announced, not an hour later"
