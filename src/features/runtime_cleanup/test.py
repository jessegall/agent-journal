import json
import os
import time
from pathlib import Path


from engine import runtime
from features import FEATURES
from features.runtime_cleanup.tidy import tidy
from tests.kit import tick
from tests.conftest import fresh


def aged(path, days: float):
    then = time.time() - days * 86400
    for f in path.iterdir() if path.is_dir() else [path]:
        os.utime(f, (then, then))


def test_captures_are_cut_to_their_tail_and_quiet_sessions_are_removed_whole(monkeypatch):
    house = FEATURES["runtime_cleanup"]
    record = fresh()
    monkeypatch.setattr("features.runtime_cleanup.tidy.FOLD_CACHE", record.root.parent / "folds")
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
    assert (text.removed, text.trimmed, text.events, text.leftovers) == (1, 2, 0, 0), "it says what it did"

    with big.open("ab") as out:
        out.write(b"+more")
    assert big.read_bytes().endswith(b"THE END+more") is True, "an append after the trim continues the tail"


def test_a_quiet_launch_log_goes_and_a_running_one_keeps_its_last_megabyte(monkeypatch):
    record = fresh()
    monkeypatch.setattr("features.runtime_cleanup.tidy.FOLD_CACHE", record.root.parent / "folds")
    launches = runtime.folder(record.root) / "launches"
    launches.mkdir(parents=True)
    spent, running = launches / "main-old-helper.log", launches / "main-busy-helper.log"
    spent.write_bytes(b"done")
    aged(spent, 3)
    running.write_bytes(b"x" * (2 * 1024 * 1024) + b"still going\n")

    tidy(record.root, 2)

    assert not spent.exists(), "a launch log quiet past the days goes"
    assert running.stat().st_size == 1024 * 1024, "a running launch log is cut to its last megabyte"
    assert running.read_bytes().endswith(b"still going\n"), "and ends as it did"


def test_an_ended_session_loses_its_terminal_captures_after_a_day(monkeypatch):
    record = fresh()
    monkeypatch.setattr("features.runtime_cleanup.tidy.FOLD_CACHE", record.root.parent / "folds")
    sessions = {}
    for name, pid in (("claude-ended", 999_999_999), ("claude-live", os.getpid())):
        folder = runtime.sessions(record.root) / name
        folder.mkdir(parents=True)
        (folder / "session.json").write_text(json.dumps({"environment": "main", "pid": pid}))
        for capture in ("printed", "screen"):
            (folder / capture).write_bytes(b"frames")
        aged(folder, 1.5)
        sessions[name] = folder

    tidy(record.root, 2)

    assert sorted(f.name for f in sessions["claude-ended"].iterdir()) == ["session.json"], "an ended session's captures go after a day"
    assert sorted(f.name for f in sessions["claude-live"].iterdir()) == ["printed", "screen", "session.json"], "a live session keeps them"


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
    from features.runtime_cleanup.tidy import Tidied
    assert (Tidied(trimmed=2, removed=1, events=3, leftovers=1).summary, Tidied().summary) == \
        ("2 logs cut to their tail; 1 quiet session folder removed; 3 old events dropped; 1 leftover removed", "nothing to tidy"), \
        "what housekeeping did is said in one line, and nothing done says so"


def test_it_runs_on_its_own_on_the_engines_clock():
    record = fresh()
    capture = runtime.session_file(record.root, "x", "printed")
    capture.parent.mkdir(parents=True)
    capture.write_bytes(b"y" * 200_000)
    tick(record)
    assert capture.stat().st_size == 64 * 1024, "the first tick sweeps"
    capture.write_bytes(b"y" * 200_000)
    tick(record)
    assert capture.stat().st_size == 200_000, "a second tick within the hour finds it tidied and leaves it"
    (runtime.folder(record.root) / "tidied").unlink()
    from features.runtime_cleanup.handlers import claim
    held = claim(runtime.folder(record.root) / "tidying.lock")
    tick(record)
    held.close()
    assert capture.stat().st_size == 200_000, "a sweep another process is already making is not made twice"


def test_the_event_log_keeps_the_last_hundred_and_whatever_a_live_reader_has_not_reached():
    record = fresh()
    for i in range(150):
        record.emit("todo", i, "created", "system", quiet=True)
    first = record.event_log.events(last=150)[0].id
    record.event_log.set_cursor("slow", first + 19)
    record.event_log.set_cursor("gone", first + 4)
    two_days_ago = time.time() - 2 * 86400
    os.utime(record.home / "runtime" / "cursor-gone", (two_days_ago, two_days_ago))
    tidy(record.root, 2)
    kept = [e.id for e in record.event_log.events()]
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
    (root / "runtime" / "channels").mkdir(parents=True, exist_ok=True)
    (root / "runtime" / "channels" / "4242.jsonl").write_text("x" * (2 * 1024 * 1024))
    (root / "runtime" / "channels" / "4243.jsonl").write_text("x" * (2 * 1024 * 1024))
    (root / "runtime" / "channels" / "4243.on").touch()
    (root / "runtime" / "outputs").mkdir()
    unkept = root / "runtime" / "outputs" / "output-abc"
    unkept.write_text("a command's whole output that never became a row")
    os.utime(unkept, (old, old))
    (root / "runtime" / "slow").mkdir()
    for i in range(52):
        profile = root / "runtime" / "slow" / f"{i:03}-GET-_api_summary-60ms.txt"
        profile.write_text("profile")
        os.utime(profile, (old + i, old + i))
    tidy(root, 2)
    assert not unkept.exists(), "an output file left behind for a day goes"
    assert sorted(f.name[:3] for f in (root / "runtime" / "slow").iterdir())[:1] == ["002"], "only the newest fifty slow-request profiles are kept"
    assert (stale.exists(), fresh_one.exists()) == (False, True), "a checkout an install left behind goes after an hour; one being installed stays"
    assert (gone.exists(), snapshot.exists(), recent.exists()) == (False, True, True), "an old environment archive goes; upgrade snapshots are kept by their own count"
    assert (root / "runtime" / "channels" / "4242.jsonl").stat().st_size == 1024 * 1024, "an agent's channel log is cut to its tail"
    assert (root / "runtime" / "channels" / "4243.jsonl").stat().st_size == 2 * 1024 * 1024, "a channel log an agent's channel is still reading is left whole, so the channel keeps its place"
    import shutil
    from engine import attic
    packed = root / "environments" / "late-writer"
    (packed / "runtime").mkdir(parents=True)
    (packed / "runtime" / "state.json").write_text("{}")
    removing, tries = shutil.rmtree, []
    def busy(folder, **given):
        tries.append(folder)
        if len(tries) == 1:
            raise OSError(66, "Directory not empty")
        removing(folder, **given)
    shutil.rmtree = busy
    try:
        attic.pack(packed, "late-writer")
    finally:
        shutil.rmtree = removing
    assert not packed.exists() and len(tries) == 2, "a folder a late write kept busy is removed on the next try, so packing never fails over it"
    assert {Path(folder).name for folder in tries} == {".late-writer.removing"}, \
        "the folder leaves its place in one rename before it is deleted, so nothing reads it half removed"
    from controllers.stored import saved
    from engine.event_log import EventLog, RecordEvents
    from contextlib import nullcontext
    saved(packed / "todo", {})
    RecordEvents("late-writer", packed, nullcontext, EventLog(root, nullcontext, lambda: [])).set_cursor_text("plugin", "7")
    assert not packed.exists(), "a late index save or a reader's place never brings back the folder of a removed environment"


def test_an_installed_update_tidies_at_once():
    from controllers.types import Notifications
    from features import load
    from resources.base import SYSTEM
    from features.auto_update.announcing import KIND
    load()
    record = fresh()
    left = record.root / "plugins" / ".staging-old"
    left.mkdir(parents=True)
    old = time.time() - 2 * 3600
    os.utime(left, (old, old))
    Notifications(record, actor=SYSTEM)._logged("Journal updated to 9.9.9", brief="from 9.9.8", kind=KIND, version="9.9.9")
    assert not left.exists(), "a new version is housekept the moment it is announced, not an hour later"


def test_tidy_keeps_the_saved_transcript_states_and_drops_an_old_builds_folds(monkeypatch):
    from features.runtime_cleanup.tidy import OTHER_MARKS_FOR, leftovers
    from providers.transcript_cache import STATES
    record = fresh()
    folds = record.root.parent / "folds"
    monkeypatch.setattr("features.runtime_cleanup.tidy.FOLD_CACHE", folds)
    current, old, recent = folds / STATES, folds / "old-mark", folds / "another-build"
    for place in (current, old, recent):
        place.mkdir(parents=True)
        (place / "turns.pickle").write_bytes(b"folded")
    (folds / "flat.pickle").write_bytes(b"from before marks had folders")
    stale = time.time() - OTHER_MARKS_FOR - 60
    os.utime(old, (stale, stale))
    leftovers(record.root)
    assert (current.exists(), old.exists(), recent.exists(), (folds / "flat.pickle").exists()) == (True, False, True, False), \
        "the saved states, which outlive an upgrade, stay; a folder of an old build's folds goes once it is old, and loose folds go"


def test_the_attic_packs_unpacks_and_finds_what_was_put_away_and_a_stubborn_server_is_ended_in_steps(tmp_path, monkeypatch):
    from engine import attic, stop

    root = tmp_path / ".journal"
    kept = attic.folder(root) / "main"
    kept.mkdir(parents=True)
    (kept / "row.md").write_text("kept")
    assert attic.compress(tmp_path / "no-record") == [] and attic.compress(root) == ["main"], "every folder in the attic is packed, and a project without an attic packs nothing"
    (attic.folder(root) / "main-2.tar.gz").write_text("not an archive")
    (attic.folder(root) / "main-12.tar.gz").write_text("not an archive")
    (attic.folder(root) / "main-x.tar.gz").write_text("not an archive")
    assert attic.latest(root, "main").name == "main-12.tar.gz" and attic.latest(root, "other") is None, "the newest archive of an environment is found by its number"
    assert attic.unpack(attic.folder(root) / "main.tar.gz", tmp_path / "back") == tmp_path / "back" and (tmp_path / "back" / "row.md").read_text() == "kept", \
        "an archive unpacks into the folder it came from and is used up"

    tries = []
    monkeypatch.setattr(attic.time, "sleep", lambda seconds: None)
    real = attic.shutil.rmtree

    def stubborn(path, *args, **kwargs):
        tries.append(path)
        if len(tries) < 3:
            raise OSError("busy")
        if len(tries) == 3:
            raise FileNotFoundError(path)
        return real(path, *args, **kwargs)
    monkeypatch.setattr(attic.shutil, "rmtree", stubborn)
    attic.removed(tmp_path / "back")
    assert len(tries) == 3, "a folder that is busy is tried again, and one that is already gone ends the tries"
    tries.clear()

    def busy(path, *args, **kwargs):
        tries.append(path)
        if len(tries) <= attic.REMOVE_TRIES:
            raise OSError("busy")
        return real(path, *args, **kwargs)
    monkeypatch.setattr(attic.shutil, "rmtree", busy)
    (tmp_path / "held").mkdir()
    attic.removed(tmp_path / "held")
    assert (len(tries), (tmp_path / "held").exists()) == (attic.REMOVE_TRIES + 1, False), "a folder busy at every try is removed once more at the end"

    kills, gone_after = [], iter([False, False, True])
    monkeypatch.setattr(stop, "serving", lambda root: 4242)
    monkeypatch.setattr(stop, "gone", lambda root, seconds=stop.WAIT: next(gone_after))
    monkeypatch.setattr(stop.os, "kill", lambda pid, signal_: kills.append((pid, signal_)))
    assert stop.ended(root) is True and [name for _, name in kills] == [stop.signal.SIGTERM, stop.signal.SIGKILL], "a server that ignores the polite ask is ended with the hard one"
    kills.clear()
    monkeypatch.setattr(stop, "gone", lambda root, seconds=stop.WAIT: False)
    assert stop.ended(root) is False and len(kills) == 2, "a server that cannot be ended is reported"
    monkeypatch.setattr(stop, "serving", lambda root: 0)
    monkeypatch.setattr(stop, "running", lambda root: False)
    assert stop.ended(root) is True, "a server that vanished while it was being asked is ended"
