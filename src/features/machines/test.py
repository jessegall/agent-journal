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


def test_a_copy_that_connects_is_told_how_its_release_and_its_record_stand_against_the_servers():
    server = Hello("2.265.0", Shape(PROTOCOL, frozenset({"m1", "m2"})))
    assert connect(Hello("2.265.0", Shape(PROTOCOL, frozenset({"m1", "m2"}))), server) == Welcome(Release.SAME, Comparison(Step.IN_STEP)), \
        "a copy in step with the server is let sync as it is"
    assert connect(Hello("2.9.0", Shape(PROTOCOL, frozenset({"m1"}))), server) == Welcome(Release.BEHIND, Comparison(Step.UPGRADE_HERE, ("m2",))), \
        "releases are compared by number, not by text, and a copy behind is told which migrations it lacks"
    assert connect(Hello("2.266.0", Shape(PROTOCOL + 1, frozenset())), server) == Welcome(Release.AHEAD, Comparison(Step.PULL_AGAIN)), \
        "a copy with another protocol number pulls everything again, whichever release it is"
    assert "too old" in refused(lambda: connect(Hello("2.100.0", Shape(0, frozenset())), server)), \
        "a copy from before the sync carried its checks on what never travels is refused, not brought along"

