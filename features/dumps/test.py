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
    named = agent.name(dump.n, "Q3 planning meeting")
    doc, task = Docs(record, actor=AGENT).create("Tuesday's meeting"), Todos(record, actor=AGENT).create("send the recap")
    agent.filed(dump.n, "text", "summarised into a doc, one follow-up filed", f"{doc.ref}, {task.ref}")
    assert (agent.items(dump.n)[0], set(agent.load(dump.n).refs) >= {doc.ref, task.ref}) == \
        ("text: filed - summarised into a doc, one follow-up filed", True), "filed records what was done and links what it made"
    collection = CONTROLLERS["collection"](record, actor=USER).load(named.n)
    assert (collection.title, {doc.ref, task.ref} <= set(collection.refs)) == ("Q3 planning meeting", True), \
        "the agent names the collection, and what is filed later still goes into it"

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


def test_what_a_dump_makes_stays_inside_it_until_the_user_confirms_it():
    record = fresh()
    earlier = Docs(record, actor=AGENT).create("An older doc")
    dump = CONTROLLERS["dump"](record, actor=USER).create("Launch notes", brief="notes")
    collections, docs = CONTROLLERS["collection"](record, actor=USER), Docs(record, actor=USER)
    agent = CONTROLLERS["dump"](record, actor=AGENT)
    doc, task = Docs(record, actor=AGENT).create("The launch"), Todos(record, actor=AGENT).create("book the room")
    agent.filed(dump.n, "text", "a doc and a to-do, and the older doc extended", f"{doc.ref}, {task.ref}, {earlier.ref}")
    made = collections.load(agent._collection(agent.load(dump.n)))
    assert collections.members(made.n) == [f"dump {dump.n}  Launch notes", "doc 2  The launch", "todo 1  book the room", "doc 1  An older doc"], \
        "the dump's collection holds everything it filed"
    assert ([c.n for c in collections.all()], [d.n for d in docs.all()], [t.n for t in Todos(record, actor=USER).all()]) == ([], [earlier.n], []), \
        "until confirmed, what it made is listed nowhere; a row it only extended stays listed"
    assert refused(lambda: agent.confirm(dump.n)) == "only the user confirms a dump: they do it in the dump window", "the agent cannot confirm"
    CONTROLLERS["dump"](record, actor=USER).leave(dump.n, task.ref)
    CONTROLLERS["dump"](record, actor=USER).confirm(dump.n)
    assert ([c.n for c in collections.all()], sorted(d.n for d in docs.all()), bool(Todos(record, actor=USER).load(task.n).deleted)) == \
        ([made.n], [earlier.n, doc.n], True), "confirmed, it all appears at once, less what the user left out"


def test_one_dump_is_worked_at_a_time_its_log_is_kept_and_filing_asks_for_the_next_step():
    from tests.kit import nudges, report
    record = fresh()
    report(record, "working", "PreToolUse")
    dump = CONTROLLERS["dump"](record, actor=USER).create("One note", brief="a note")
    later = CONTROLLERS["dump"](record, actor=USER).create("Another", brief="more")
    assert not [n for n in nudges(record) if n.startswith(f"dump {later.n},")], "a dump dropped while one is open waits"
    agent = CONTROLLERS["dump"](record, actor=AGENT)
    agent.log(dump.n, "reading the note")
    agent.ask(dump.n, "is this about the launch or the audit")
    assert refused(lambda: agent.answer(dump.n, "the launch")) == "only the user answers a question on a dump", "the agent cannot answer itself"
    CONTROLLERS["dump"](record, actor=USER).answer(dump.n, "the launch")
    assert (nudges(record)[-1], agent.load(dump.n).data["question"]) == \
        (f"the user answered your question on dump {dump.n} - the launch", {}), "the answer reaches the agent and the question clears"
    assert [e["text"] for e in agent.load(dump.n).data["log"]] == ["reading the note"], "the log keeps what the agent said it is doing"
    assert refused(lambda: agent.log(dump.n, " ")) == "say what you are doing", "a log entry needs words"
    agent.failed(dump.n, "text", "nothing in it to keep")
    assert f"dump {dump.n} is filed (0 filed, 1 failed) - suggest the next step" in nudges(record), "closing the dump asks for the next step"
    assert nudges(record)[-1] == f"dump {later.n}, Another, has 1 item to file - journal dump items {later.n}", "and hands over the next one"
    CONTROLLERS["dump"](record, actor=USER).stop(later.n)
    assert (agent.load(later.n).outcome, [n for n in nudges(record) if n.startswith(f"dump {later.n} is filed")]) == \
        ("stopped, 0 filed, 1 left out", []), "a stopped dump says what was left out and asks for no next step"


def test_a_message_declared_a_transcript_becomes_a_dump(tmp_path):
    from controllers.types import Messages
    record = fresh()
    standup = Messages(record, actor=USER).create("Standup", brief="Alice: ship it. Bob: tests first.")
    notes = tmp_path / "audio-notes.txt"
    notes.write_text("notes")
    Messages(record, actor=USER).attach(standup.n, str(notes))
    Messages(record, actor=AGENT).declare(standup.n, "transcript")
    dumps = CONTROLLERS["dump"](record, actor=AGENT)
    made = [d for d in dumps.all() if standup.ref in d.refs]
    assert (len(made), made[0].brief, dumps.items(made[0].n)) == (1, standup.brief, ["text: not read yet", "audio-notes.txt: not read yet"]), \
        "its text and its files become the dump's items"
    assert made[0].ref in Messages(record, actor=USER).load(standup.n).refs, "the message links the dump"
