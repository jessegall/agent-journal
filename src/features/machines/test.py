import importlib
import re
from pathlib import Path
import shutil

import pytest

import features
from commands.invoke import invoked
from controllers import base, stored
from controllers.features import Features
from controllers.requests import deliver, request
from controllers.types import Rules, Todos
from engine.event_log import EventLog
from engine.machines import Lease, this_machine
from engine.numbers import BLOCK, Leases, Numbers, rows
from engine.outbox import Request
from engine.record import Record
from engine.sync import NEVER_TRAVELS_FIELDS, NEVER_TRAVELS_TYPES, PROTOCOL, Comparison, Hello, Release, Shape, Step, Welcome, connect, travelling, travels
from features.machines.details import MachinesDetails
from resources.base import AGENT, PROJECT, SYSTEM, USER, Stale
from tests.conftest import fresh, refused


def test_two_machines_leasing_from_one_record_never_hand_out_the_same_number(tmp_path):
    record = fresh()
    laptop, server = Numbers(tmp_path / "laptop", Leases(record.root)), Numbers(tmp_path / "server", Leases(record.root))
    sequence = rows("elsewhere", "todo")
    drawn = {"laptop": [], "server": []}
    for turn in range(3 * BLOCK):
        machine = "laptop" if turn % 3 else "server"
        drawn[machine].append((laptop if machine == "laptop" else server).draw(sequence, lambda: 1))
    together = drawn["laptop"] + drawn["server"]
    assert len(set(together)) == len(together), "no number is handed out twice"
    assert all(drawn[m] == sorted(drawn[m]) for m in drawn), "each machine's numbers rise"

    alone = Todos(record, actor=AGENT)
    assert [alone.create(f"step {i}").n for i in range(BLOCK + 2)] == list(range(1, BLOCK + 3)), \
        "one machine alone numbers its rows one after another, across the end of a block"

    other = Record(record.root, record.env)
    other.numbers = Numbers(tmp_path / "other", Leases(record.root))
    first, second, third = alone.create("made here"), Todos(other, actor=AGENT).create("made there"), alone.create("made here again")
    assert second.n > third.n, "the other machine's block lies above this one's"
    assert [row["n"] for row in alone.rows.summaries()][-3:] == [first.n, second.n, third.n], "lists follow the order rows were made, not their numbers"
    stored.SUMMARIES.clear()
    stored.INDEXED.clear()
    assert [row["n"] for row in alone.rows.summaries()][-3:] == [first.n, second.n, third.n], "a list read afresh keeps that order"


def test_an_existing_record_upgrades_with_its_numbers_continuing():
    record = fresh()
    todos = Todos(record, actor=AGENT)
    for i in range(5):
        todos.create(f"old {i}")
    last_event = record.event_log.last_id()
    shutil.rmtree(record.root / "project" / "numbers")
    shutil.rmtree(record.root / "runtime" / "numbers")
    importlib.import_module("migrations.m0069_numbers_leased_per_writer").run(record.root)

    again = Record(record.root, record.env)
    assert Todos(again, actor=AGENT).create("new").n == 6, "the next row follows the highest number already in use"
    assert again.event_log.last_id() > last_event, "events go on numbering above the last one written"
    assert [r.title for r in Todos(again, actor=AGENT).all()][:5] == [f"old {i}" for i in range(5)], "every row is still there, in order"


def test_a_project_row_writes_its_event_into_the_project_log_and_its_writer_still_reads_it():
    record = fresh("here")
    elsewhere = Record(record.root, "there")
    elsewhere.home.mkdir(parents=True)
    rule = Rules(record, actor=AGENT).create("Keep it plain", brief="why", keywords="plain")
    Todos(record, actor=AGENT).create("a step")
    project_events = record.event_log.project.events()
    assert [(e.type, e.n, e.env) for e in project_events] == [("rule", rule.n, "here")], "the rule's event is in the project's own log, naming who wrote it"
    assert [e.type for e in EventLog.events(record.event_log)] == ["todo"], "the environment's own log holds only its own rows' events"
    assert [e.type for e in record.event_log.events()] == ["rule", "todo"], "the environment reads both, in the order they were written"
    assert record.event_log.events(since=project_events[0].id) == record.event_log.events()[1:], "one cursor walks both logs"
    assert elsewhere.event_log.events() == [], "another environment does not take the event as its own"


def test_a_machine_that_handed_an_environment_over_is_refused_when_it_writes_again():
    record = fresh()
    here = Todos(record, actor=AGENT)
    here.create("written before anyone leased it")
    laptop = Record(record.root, record.env, writer=record.hand_over("", "laptop"))
    Todos(laptop, actor=AGENT).create("the laptop holds it")
    assert "refused" in refused(lambda: here.create("this machine does not hold it")), "a machine the environment was not handed to cannot write it"

    record.hand_over("", "server")
    assert "refused" in refused(lambda: Todos(laptop, actor=AGENT).create("back after the handover")), \
        "the laptop, back with the epoch it held before the handover, is refused"
    assert "refused" in refused(lambda: laptop.emit("todo", 1, "updated", AGENT)), "its events are refused as well"
    server = Record(record.root, record.env, writer=Lease("server", 2))
    Todos(server, actor=AGENT).create("the new owner writes")
    assert [r.title for r in Todos(laptop, actor=AGENT).all()] == ["written before anyone leased it", "the laptop holds it", "the new owner writes"], \
        "nothing the stale writer tried landed, and it can still read"
    from engine.machines import Pushing
    pushed = Record(record.root, record.env, writer=Pushing("laptop"))
    assert "refused" in refused(lambda: Todos(pushed, actor=AGENT).create("pushed by the laptop, which the server holds")), \
        "a connection from a machine that was handed nothing writes nothing"
    record.hand_over("", "laptop")
    assert Todos(pushed, actor=AGENT).create("pushed by its owner").title == "pushed by its owner" and \
        "refused" in refused(lambda: Todos(Record(record.root, record.env, writer=Pushing("phone")), actor=AGENT).create("pushed by another")), \
        "a push writes only the scope its connection's machine was handed"
    assert Pushing("laptop").attributed({"member": "server", "title": "x"}) == {"member": "laptop", "title": "x"}, \
        "the member of a pushed row comes from the connection, whatever the row says"
    from engine.handover import accept, give
    from engine.offline import Waiting
    mine = fresh()
    given = give(mine, "", "server")
    assert (given, "refused" in refused(lambda: Todos(mine, actor=AGENT).create("after handing it over"))) == (Lease("server", 1), True), \
        "a machine that hands an environment over writes it no more"
    assert "refused" in refused(lambda: give(mine, "", "laptop")), "a machine that no longer holds it cannot hand it on"
    server_copy = fresh()
    there = Record(server_copy.root, server_copy.env, writer=Lease("server", 1))
    assert accept(there, "", given) == given and refused(lambda: Todos(there, actor=AGENT).create("written on the server")) == "", \
        "the server takes the lease and writes the environment"
    assert "older" in refused(lambda: accept(there, "", given)), "a handover is taken once: the same epoch again is refused"
    waiting_here = fresh()
    Waiting(waiting_here.root).hold("", "todo", "create", ["still waiting"])
    assert "still wait" in refused(lambda: give(waiting_here, "", "server")), "writes still waiting for the server go first, then the environment is handed over"


def test_a_write_into_an_environment_another_machine_holds_waits_for_it_as_a_request():
    record = fresh("here")
    there = Record(record.root, "there")
    there.home.mkdir(parents=True)
    there.hand_over("", "server")
    request(record.root, Request("there", "todo", "create", ["filed from here"]))
    assert Todos(there, actor=AGENT).all() == [], "nothing is written into the environment another machine holds"
    assert deliver(record.root) == 0, "while the other machine holds it, the request waits"

    rule = Rules(record, actor=AGENT).create("Keep it plain", brief="why", keywords="plain")
    record.hand_over(PROJECT, "server")
    assert Rules(record, actor=USER).read(rule.n).n == rule.n, "a row of a scope held elsewhere can be read"
    assert USER not in Rules(record, actor=AGENT).load(rule.n).seen, "and reading it writes nothing there"

    there.hand_over("", this_machine())
    record.hand_over(PROJECT, this_machine())
    assert deliver(record.root) == 2, "once this machine holds both, the waiting writes run"
    assert [r.title for r in Todos(there, actor=AGENT).all()] == ["filed from here"], "the to-do lands where it was meant"
    assert USER in Rules(record, actor=AGENT).load(rule.n).seen, "and the read mark with it"


def test_two_people_pressing_the_same_row_with_the_machines_feature_on_the_second_is_refused():
    features.load()
    record = fresh()
    todos = Todos(record, actor=USER)
    row = todos.create("one row")
    seen = row.updated
    invoked(Todos(record, actor=USER), "update", (row.n,), {"title": "first press", "unchanged_since": seen})
    invoked(Todos(record, actor=USER), "update", (row.n,), {"title": "second press", "unchanged_since": seen})
    assert todos.load(row.n).title == "second press", "with the feature off, the last press wins, as on one machine"

    Features(record, actor=SYSTEM).switch(MachinesDetails.name, True)
    seen = todos.load(row.n).updated
    invoked(Todos(record, actor=USER), "done", (row.n,), {"how": "first", "unchanged_since": seen})
    for word, args in (("update", {"title": "late"}), ("section", {"title": "part", "body": "late"}), ("reopen", {"why": "late"}),
                       ("delete", {"why": "late"})):
        with pytest.raises(Stale):
            invoked(Todos(record, actor=USER), word, (row.n,), {**args, "unchanged_since": seen})
    assert (todos.load(row.n).outcome, todos.load(row.n).title) == ("first", "second press"), "the first press stands and the late ones change nothing"
    invoked(Todos(record, actor=USER), "update", (row.n,), {"title": "fresh", "unchanged_since": todos.load(row.n).updated})
    assert todos.load(row.n).title == "fresh", "a press made on what the row is now goes through"


def test_a_retry_with_the_same_key_makes_no_second_row(monkeypatch):
    record = fresh()
    todos = Todos(record, actor=AGENT)
    first = todos.create("file the report", idempotency="press-1")
    monkeypatch.setattr(base, "TWICE_WITHIN", 0)
    again = todos.create("file the report", idempotency="press-1")
    other = todos.create("file the report", idempotency="press-2")
    assert (again.n, len(todos.all())) == (first.n, 2), "the retry gets the row the lost answer made, and a new key makes a new row"
    assert other.n != first.n


def test_the_sync_compares_its_own_protocol_number_and_the_migrations_a_copy_went_through():
    server = Shape(PROTOCOL, frozenset({"m1", "m2"}))
    assert Shape(PROTOCOL, frozenset({"m1", "m2"})).compared(server) == Comparison(Step.IN_STEP), "a copy in step syncs as it is"
    assert Shape(PROTOCOL, frozenset({"m1"})).compared(server) == Comparison(Step.UPGRADE_HERE, ("m2",)), \
        "a copy behind the server upgrades, and its own migrations bring the rows it pulled along"
    assert Shape(PROTOCOL, frozenset({"m1", "m2", "m3"})).compared(server) == Comparison(Step.MIGRATE_PULLED, ("m3",)), \
        "a copy ahead of the server runs its newer migrations over what it pulls, instead of being rebuilt"
    assert Shape(PROTOCOL + 1, frozenset({"m1", "m2"})).compared(server) == Comparison(Step.PULL_AGAIN), \
        "only a new protocol number, not a new release, makes a copy pull everything again"


def test_keys_hashes_and_tokens_never_travel_to_another_machine():
    from resources.base import Resource

    def kinds(base):
        return [base, *(found for sub in base.__subclasses__() for found in kinds(sub))]

    features.load()
    secretive = {"key", "token", "hash", "password", "secret", "passkey", "challenge", "unlock"}
    declared = {(kind.type, field.name) for kind in kinds(Resource) if getattr(kind, "type", "")
                for field in kind.__dict__.get("data_fields", []) if secretive & set(field.name.split("_"))}
    kept = {(type_, name) for type_, names in NEVER_TRAVELS_FIELDS.items() for name in names}
    stays = {(type_, name) for type_, name in declared if type_ in NEVER_TRAVELS_TYPES}
    assert declared - kept - stays <= {("secret", "secret_fields")}, \
        f"every field named like a key, hash, token or password is withheld from the sync, or belongs to a row that stays: {sorted(declared - kept - stays)}"
    assert (travels("record/runtime/sock"), travels("phone-push.json"), travels("a/vault/owner.json"), travels("todo/1.json")) == (False, False, False, True), \
        "the files that hold keys and live state stay on their machine"
    assert (travelling("phone", {"key": "x"}, Path("/p")), travelling("share", {"target": "doc:1", "token": "t", "password": "p"}, Path("/p"))) == (None, {"target": "doc:1"}), \
        "a phone never travels, and a share travels without its token or password"
    from engine.sync import relative, utc_minute
    project = Path("/home/a/project")
    assert (relative("/home/a/project/.claude/worktrees/x", project), relative("/home/a/.claude/projects/t.jsonl", project), relative("src/a.py", project)) == \
        (".claude/worktrees/x", "", "src/a.py"), "a path inside the project is written from its root, one outside it stays on its machine"
    assert travelling("helper", {"checkout": "/home/a/project/platform", "worktree": "/home/a/elsewhere", "name": "Rhea"}, project) == \
        {"checkout": "platform", "worktree": "", "name": "Rhea"}, "a row's folders are made relative before the first copy exists"
    assert re.fullmatch(r"\d{4}-\d\d-\d\d \d\d:\d\d UTC", utc_minute()), "a date written into a row's text says it is UTC"
    from engine.comparison import Differences, Listing, compare
    before = Listing({"todo/1.md": "a", "todo/2.md": "b", "todo/3.md": "c", "environments/old/todo/1.md": "d", "environments/old/events.jsonl": "e"}, frozenset())
    after = Listing({"todo/1.md": "a2", "doc/2.md": "b", "todo/4.md": "f"}, frozenset({"old"}))
    assert compare(before, after) == Differences(added=("todo/4.md",), changed=("todo/1.md",), removed=("todo/3.md",), renamed=(("todo/2.md", "doc/2.md"),),
                                                 archived=("environments/old/events.jsonl", "environments/old/todo/1.md")), \
        "the comparison sees a rename as a rename, a removal as a removal, and an environment moved to the attic as archived rather than lost"
    folder = fresh().root
    (folder / "todo").mkdir()
    (folder / "todo" / "1.md").write_text("x")
    (folder / "runtime").mkdir()
    (folder / "runtime" / "sock").write_text("live")
    listed = Listing.of(folder).files
    assert ("todo/1.md" in listed, [path for path in listed if path.startswith("runtime/")]) == (True, []), "a listing holds only the files that travel"


def test_a_copy_that_connects_is_told_how_its_release_and_its_record_stand_against_the_servers():
    server = Hello("2.265.0", Shape(PROTOCOL, frozenset({"m1", "m2"})))
    assert connect(Hello("2.265.0", Shape(PROTOCOL, frozenset({"m1", "m2"}))), server) == Welcome(Release.SAME, Comparison(Step.IN_STEP)), \
        "a copy in step with the server is let sync as it is"
    assert connect(Hello("2.9.0", Shape(PROTOCOL, frozenset({"m1"}))), server) == Welcome(Release.BEHIND, Comparison(Step.UPGRADE_HERE, ("m2",))), \
        "releases are compared by number, not by text, and a copy behind is told which migrations it lacks"
    assert connect(Hello("2.266.0", Shape(PROTOCOL + 1, frozenset())), server) == Welcome(Release.AHEAD, Comparison(Step.PULL_AGAIN)), \
        "a copy with another protocol number pulls everything again, whichever release it is"
    from engine.offline import Applied, Waiting
    root = fresh().root
    waiting, applied, away = Waiting(root), Applied(root), {"down": True}
    first, second = waiting.hold("", "todo", "create", ["first"]), waiting.hold("", "todo", "create", ["second"])
    ran = []
    deliver = lambda held: not away["down"] and applied.apply(held, lambda write: ran.append(write.args[0]))
    assert (waiting.flush(deliver), [w.args[0] for w in waiting.waiting()]) == (0, ["first", "second"]), "while the server is away the writes wait, oldest first"
    away["down"] = False
    assert (waiting.flush(deliver), waiting.waiting(), ran) == (2, [], ["first", "second"]), "once it is back they go in the order they were written"
    assert (applied.apply(first, lambda write: ran.append("again")), ran) == (True, ["first", "second"]), "a write sent again after a lost answer is not applied twice"
    assert "too old" in refused(lambda: connect(Hello("2.100.0", Shape(0, frozenset())), server)), \
        "a copy from before the sync carried its checks on what never travels is refused, not brought along"
    from engine import bus
    from engine.sync import pulled_cursor, replay
    from resources.base import Event
    heard, record = [], fresh()
    off = bus.on("todo.created", lambda event, record: heard.append(event.id))
    pulled = [Event(id=9000 + i, at=1.0, type="todo", n=900 + i, action="created", actor=AGENT, env="elsewhere") for i in range(2)]
    assert (replay(record, PROJECT, pulled), replay(record, PROJECT, pulled), heard) == (2, 0, []), \
        "pulled events are put into the log once and no feature fires on them"
    assert ([e.id for e in record.event_log.project.events(since=8999)], all(e.handled for e in record.event_log.project.events(since=8999))) == ([9000, 9001], True), \
        "they are kept as already handled"
    assert (record.event_log.cursor(pulled_cursor(PROJECT)), record.event_log.cursor(pulled_cursor(""))) == (9001, 0), "each scope has a cursor of its own"
    off()
    import hashlib
    from engine.attachments import Attachment, described, fetch
    held = root / "held"
    held.mkdir()
    (held / "photo.png").write_bytes(b"pixels")
    wanted = described(held)
    assert wanted == [Attachment("photo.png", 6, hashlib.sha1(b"pixels").hexdigest())], "a pull carries an attachment's name, size and digest and not its bytes"
    here, calls = root / "here", []
    read = lambda: calls.append("fetched") or b"pixels"
    fetch(wanted[0], here, read)
    fetch(wanted[0], here, read)
    assert ((here / "photo.png").read_bytes(), calls) == (b"pixels", ["fetched"]), "an attachment is fetched when it is opened, once"
    assert "over the" in refused(lambda: fetch(Attachment("big.bin", 30 * 1024 * 1024, "x"), here, read)) and "whole" in refused(lambda: fetch(Attachment("odd.bin", 3, "x"), here, read)), \
        "one over the size limit is not fetched, and one that arrives other than described is not kept"
    import subprocess
    from engine.snapshots import SNAPSHOT_REFS, repositories, take
    project = root / "project"
    (project / "platform").mkdir(parents=True)
    run = lambda *args, cwd=project: subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@t", *args], cwd=cwd, capture_output=True, text=True, timeout=30, check=True).stdout.strip()
    for folder in (project, project / "platform"):
        run("init", "-q", cwd=folder)
        (folder / "a.txt").write_text("one")
        run("add", "a.txt", cwd=folder)
        run("commit", "-qm", "first", cwd=folder)
    (project / "a.txt").write_text("two")
    (project / "platform" / "b.txt").write_text("new")
    (project / ".env").write_text("KEY=1")
    (project / ".journal").mkdir()
    (project / ".journal" / "settings.json").write_text("{}")
    assert repositories(project) == [".", "platform"], "the snapshot covers the project's repository and the ones nested in it"
    made = take(project, "s1")
    assert [(m.repository, m.ref) for m in made] == [(".", f"{SNAPSHOT_REFS}/s1/project"), ("platform", f"{SNAPSHOT_REFS}/s1/platform")], \
        "each repository's snapshot is kept under a ref of the journal's, so it stays reachable"
    assert (run("show", f"{made[0].ref}:a.txt"), run("ls-tree", "-r", "--name-only", made[0].ref).split(), run("show", f"{made[1].ref}:b.txt")) == ("two", ["a.txt"], "new"), \
        "it holds the working files as they stand, nested repositories apart, and leaves out the environment file and the journal's own record"
    from engine.snapshots import apply
    (project / "a.txt").write_text("changed afterwards")
    (project / "own.txt").write_text("not in the snapshot")
    (project / "platform" / "b.txt").unlink()
    assert (apply(project, made), (project / "a.txt").read_text(), (project / "platform" / "b.txt").read_text(), (project / "own.txt").read_text()) == \
        (["a.txt", "platform/a.txt", "platform/b.txt"], "two", "new", "not in the snapshot"), \
        "applying a snapshot writes the files it tracks and touches nothing else"
    assert [(project / name).exists() for name in (".env", ".journal/settings.json")] == [True, True] and run("show", f"{made[0].ref}:a.txt") == "two", \
        "the environment file and the journal's record are left as they were"
    import os
    from controllers.types import Agents
    from engine.sessions import Sessions
    from features.machines.restart import Fate, after_restart
    after = fresh()
    finished = subprocess.Popen(["true"])
    finished.wait()
    for name, pid in (("claude-up", os.getpid()), ("claude-gone", finished.pid)):
        Agents(after, actor=SYSTEM).create(name, status="working")
        Sessions(after.root).bind(name, after.env, pid=pid)
    assert after_restart(after) == {"claude-up": Fate.PICKED_UP, "claude-gone": Fate.LOST}, "after a restart an agent whose process runs is picked up and one whose process is gone is lost"
    agents_now = Agents(after, actor=SYSTEM)
    assert (agents_now.rows.by_title("claude-up").status, agents_now.rows.by_title("claude-gone").status) == ("working", "stopped"), "the lost one is shown as stopped"
    after_restart(after)
    assert [card["label"] for card in agents_now.rows.by_title("claude-gone").data["cards"]] == ["Agent lost in the restart"], "and marked once in the chat"
    from engine.handover import RESTORED, after_restore, epoch_of
    restore = fresh()
    Todos(restore, actor=AGENT).create("a row")
    restore.hand_over(PROJECT, "server")
    restore.hand_over("", "server")
    known = epoch_of(restore.root)
    assert (known, after_restore(restore.root)) == (1, False), "with no restore nothing starts a new epoch"
    (restore.root / RESTORED).write_text("1")
    assert after_restore(restore.root) and not (restore.root / RESTORED).exists(), "a restore leaves a marker, and the new epoch begins once"
    assert (epoch_of(restore.root) > 1000, Lease.read(restore.home).machine, Lease.read(restore.home).epoch == epoch_of(restore.root)) == (True, "server", True), \
        "every scope keeps its holder and moves to an epoch above any a copy saw"
    assert Shape(PROTOCOL, frozenset(), known).compared(Shape(PROTOCOL, frozenset(), epoch_of(restore.root))) == Comparison(Step.PULL_AGAIN), \
        "a copy in the old epoch pulls again instead of pushing rows from before the restore"
