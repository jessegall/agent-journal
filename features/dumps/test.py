from controllers.types import CONTROLLERS, Docs, Todos
from resources.base import AGENT, USER
from tests.conftest import fresh, refused


def test_a_dump_is_read_and_filed_item_by_item_and_closes_when_every_item_is_settled(tmp_path):
    record = fresh()
    dumps = CONTROLLERS["dump"](record, actor=USER)
    dropped = tmp_path / "notes.md"
    dropped.write_text("# meeting notes")
    dump = dumps.create("Tuesday's meeting", brief="the transcript of the meeting")
    dumps.attach(dump.n, str(dropped))
    agent = CONTROLLERS["dump"](record, actor=AGENT)
    assert agent.items(dump.n) == ["text: not read yet", "notes.md: not read yet"], "the pasted text and every file are items"

    agent.note(dump.n, "text", "a transcript of Tuesday's planning meeting")
    doc, task = Docs(record, actor=AGENT).create("Tuesday's meeting"), Todos(record, actor=AGENT).create("send the recap")
    agent.filed(dump.n, "text", "summarised into a doc, one follow-up filed", f"{doc.ref}, {task.ref}")
    assert (agent.items(dump.n)[0], set(agent.load(dump.n).refs) >= {doc.ref, task.ref}) == \
        ("text: filed - summarised into a doc, one follow-up filed", True), "filed records what was done and links what it made"

    assert "has no item 'other.md'" in refused(lambda: agent.note(dump.n, "other.md", "x")), "an item the dump does not have is refused"
    assert "say why" in refused(lambda: agent.failed(dump.n, "notes.md", " ")), "a failure needs words"
    agent.failed(dump.n, "notes.md", "the file is empty")
    closed = agent.load(dump.n)
    assert (bool(closed.completed), closed.outcome) == (True, "1 filed, 1 failed"), "the last settled item closes the dump"


def test_the_agent_is_told_when_a_dump_arrives_and_when_more_is_dropped_on_it(tmp_path):
    from tests.kit import nudges, report
    record = fresh()
    report(record, "working", "PreToolUse")
    dumps = CONTROLLERS["dump"](record, actor=USER)
    dump = dumps.create("A pile", brief="some pasted text")
    arrived = [n for n in nudges(record) if n.startswith(f"dump {dump.n}")]
    assert arrived == [f"dump {dump.n}, A pile, has 1 item to file - journal dump items {dump.n}"], "a new dump is named with what waits"
    more = tmp_path / "later.png"
    more.write_bytes(b"png")
    dumps.attach(dump.n, str(more))
    assert f"dump {dump.n}, A pile, has 2 items to file - journal dump items {dump.n}" in nudges(record), "a file dropped on it later is named again"
    CONTROLLERS["dump"](record, actor=AGENT).create("the agent's own", brief="notes")
    assert not [n for n in nudges(record) if "the agent's own" in n], "a dump the agent made is not announced to it"


def test_a_dump_makes_its_own_collection_and_everything_it_files_joins_it():
    record = fresh()
    dump = CONTROLLERS["dump"](record, actor=USER).create("Launch notes", brief="notes")
    collections = CONTROLLERS["collection"](record, actor=USER)
    made = [c for c in collections.all() if c.title == f"Dump {dump.n}, Launch notes"]
    assert (len(made), collections.members(made[0].n)) == (1, [f"dump {dump.n}  Launch notes"]), "a new dump has its collection, with itself in it"
    agent = CONTROLLERS["dump"](record, actor=AGENT)
    doc, task = Docs(record, actor=AGENT).create("The launch"), Todos(record, actor=AGENT).create("book the room")
    agent.filed(dump.n, "text", "a doc and a to-do", f"{doc.ref}, {task.ref}")
    assert collections.members(made[0].n)[1:] == ["doc 1  The launch", "todo 1  book the room"], "what it files joins the same collection"
    assert made[0].ref in agent.load(dump.n).refs, "the dump links its collection"


def test_the_agent_is_asked_for_the_next_step_once_a_dump_is_filed():
    from tests.kit import nudges, report
    record = fresh()
    report(record, "working", "PreToolUse")
    dump = CONTROLLERS["dump"](record, actor=USER).create("One note", brief="a note")
    CONTROLLERS["dump"](record, actor=AGENT).failed(dump.n, "text", "nothing in it to keep")
    assert f"dump {dump.n} is filed (0 filed, 1 failed) - suggest the next step" in nudges(record), "closing the dump asks for the next step"
