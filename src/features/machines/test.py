import importlib
import shutil

from controllers import stored
from controllers.types import Rules, Todos
from engine.event_log import EventLog
from engine.machines import Lease
from engine.numbers import BLOCK, Leases, Numbers, rows
from engine.record import Record
from resources.base import AGENT
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

