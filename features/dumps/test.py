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
