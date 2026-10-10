import pytest
import features
from controllers.types import Agents, Messages, Nudges, Todos
from resources.base import AGENT, SYSTEM, USER, Refused
from tests.conftest import fresh, refused


def test_a_reply_links_the_new_to_dos_it_names_and_points_out_the_one_it_leaves_unlinked(monkeypatch):
    import time
    features.load()
    record = fresh()
    Agents(record, actor=SYSTEM).create("claude-1")
    todos = Todos(record, actor=AGENT)
    now = time.time
    monkeypatch.setattr(time, "time", lambda: now() - 3600)
    old = todos.create("filed an hour ago")
    monkeypatch.setattr(time, "time", now)
    asked = Messages(record, actor=USER).create("make the tunnel restart itself and fix the label")
    named, elsewhere, forgotten = (todos.create(title).n for title in ("restart the tunnel", "already linked", "fix the label"))
    Messages(record, actor=USER).link(Messages(record, actor=USER).create("an earlier ask").n, f"todo:{elsewhere}")
    Messages(record, actor=AGENT).read(asked.n)
    Messages(record, actor=AGENT).reply(asked.n, f"Filed as to-do {named}, to-do {elsewhere} and to-do {old.n}.")
    refs = Messages(record, actor=SYSTEM).load(asked.n).refs
    assert f"todo:{named}" in refs, "a new to-do the reply names is linked to the message it answers"
    assert f"todo:{elsewhere}" not in refs, "a to-do another message already links is left where it is"
    assert f"todo:{old.n}" not in refs, "a to-do older than the setting's minutes is not linked"
    nudged = [n.title for n in Nudges(record, actor=SYSTEM).rows.every()]
    assert f"to-do {forgotten} came from message {asked.n}?" in nudged, "a new to-do the reply leaves unnamed and unlinked is pointed out"
    assert "already answered" in refused(lambda: Messages(record, actor=AGENT).reply(asked.n, "And one more thing.")), "a second reply goes into the first"
    assert [n.title for n in Nudges(record, actor=SYSTEM).rows.every()].count(f"to-do {forgotten} came from message {asked.n}?") == 1, "once"


def test_a_message_is_filed_replied_edited_and_processed_by_the_agent_that_reads_it(tmp_path):
    import features
    from controllers.types import Comments, Docs, Messages, Todos
    from resources.base import AGENT, USER
    from tests.conftest import fresh, refused
    features.load()
    record = fresh()
    user, agent = Messages(record, actor=USER), Messages(record, actor=AGENT)
    first = user.create("make the tunnel restart itself")
    second = user.create("and the phone dialog too")
    note = tmp_path / "notes.txt"
    note.write_text("details")
    user.attach(first.n, str(note))
    assert "has no file" in refused(lambda: agent.file(first.n, "missing.txt")), "a file the message lacks is named"
    agent.file(first.n, "notes.txt")
    assert agent.load(first.n).files["notes.txt"] == "kept", "a file is kept on the message by default"
    doc = Docs(record, actor=AGENT).create("Tunnel notes")
    agent.file(first.n, "notes.txt", into=f"doc {doc.n}")
    assert agent.load(first.n).files["notes.txt"] == f"filed into doc {doc.n}", "a file can be filed into a doc"
    assert "that part is not in message" in refused(lambda: agent.process(first.n, "something else", "todo 1")), "processing quotes the words it is about"
    todo = Todos(record, actor=AGENT).create("restart the tunnel")
    agent.process(first.n, "tunnel restart", f"todo {todo.n}, nonsense")
    assert f"todo:{todo.n}" in agent.load(first.n).refs, "a message is linked to what it became"
    assert "name the message" in refused(lambda: agent.reply("  ", "hello")), "a reply must say which message"
    assert "read message" in refused(lambda: agent.reply(str(second.n), "seen it")), "a message the agent has not read is never answered"
    agent.read(first.n)
    agent.read(second.n)
    assert "is a reaction" in refused(lambda: agent.reply(str(first.n), "👍")), "a reply that is only a face is a reaction"
    made = agent.reply(f"{first.n},{second.n}", "both are on the list", file=str(note))
    assert "> make the tunnel restart itself" in made.brief and "both are on the list" in made.brief, "a reply quotes what it answers"
    assert Comments(record, actor=AGENT).load(made.n).files, "a reply can carry a file"
    assert f"message:{second.n}" in Comments(record, actor=AGENT).load(made.n).refs, "a reply to several messages is linked to each"
    from controllers.stored import RowStore
    third = user.create("one more small question")
    agent.read(third.n)
    saved, written = [], RowStore.write_file
    RowStore.write_file = lambda self, r: saved.append((r.type, r.n)) or written(self, r)
    try:
        agent.reply(str(third.n), "a short answer")
    finally:
        RowStore.write_file = written
    assert (saved.count(("message", third.n)), saved.count(("comment", 2))) == (1, 1), "a reply writes the message it answers once, since its closing already says it was commented, and its comment once"
    assert "has been read" in refused(lambda: user.edit(first.n, "changed")), "a message that was read cannot be reworded by the person"
    fresh_one = user.create("a draft")
    assert user.edit(fresh_one.n, "a better draft").brief == "a better draft", "a message nobody read can be reworded"
    assert "written by the user" in refused(lambda: agent.archive(second.n, "done")), "an agent cannot put away what the person wrote"
    assert user.archive(second.n, "done").deleted, "the person can put a message away"


def test_a_tool_runs_a_face_is_given_once_and_a_to_do_waits_on_another():
    import features
    from controllers.types import Messages, Todos, Tools
    from resources.base import AGENT, SYSTEM, USER
    from tests.conftest import fresh, refused
    features.load()
    record = fresh()
    tool = Tools(record, actor=SYSTEM).create("echoer", entry="echo")
    assert Tools(record, actor=SYSTEM).run(tool.n, "hello")["out"].strip() == "hello", "a tool runs its entry with the words given"
    Tools(record, actor=SYSTEM).update(tool.n, entry="/definitely/not/a/program")
    assert "could not run" in refused(lambda: Tools(record, actor=SYSTEM).run(tool.n)), "a tool that cannot start says so"
    message = Messages(record, actor=USER).create("hello")
    reactions = Messages(record, actor=AGENT)
    assert "a reaction is one of" in refused(lambda: reactions.react(message.n, "zzz")), "only the known faces are reactions"
    first = reactions.react(message.n, "👍")
    assert reactions.react(message.n, "👍").n == first.n, "the same face twice in a moment is one reaction"
    assert reactions.comments(message.n) == [], "a message with no comment has none"
    todos = Todos(record, actor=SYSTEM)
    one, two = todos.create("one"), todos.create("two")
    assert "has no open question" in refused(lambda: todos.answer(one.n, "x")), "answering a to-do with no question is refused"
    todos.ask(one.n, "Which way?")
    assert todos.answer(one.n, "this way").completed, "an answer closes the question a to-do waits on"
    assert "has no open question" in refused(lambda: todos.answer(one.n, "again")), "and a question already answered is not answered twice"
    from types import SimpleNamespace
    assert todos.waits(SimpleNamespace(after=["nothing:1", "todo:99999"])) == [], "something a to-do waits on that cannot be found is no longer waited on"
    handed = SimpleNamespace(type="todo", completed=False, pending=True, assigned="helper:7")
    assert (todos.mark(handed), todos.mark(SimpleNamespace(type="plan"))) == ("  [done by helper 7, waits for its merge]", ""), \
        "a to-do a helper finished says it waits for its merge, and a row of another kind is not marked"
    assert "waits on another to-do" in refused(lambda: todos.after(one.n, "banana")), "a to-do waits on a to-do or a plan"
    todos.after(two.n, one.n)
    assert todos.mark(todos.load(two.n)).startswith("  [waits on"), "a to-do that waits says on what"
    from agents.actors import System, User
    from controllers.base import check_abstract, controller_of
    from controllers.types import warm
    record = fresh()
    todos = Todos(record, actor=SYSTEM)
    row = todos.create("a row to mark")
    todos.block(row.n, "waiting for the build")
    assert todos.mark(todos.load(row.n)) == "  [blocked: waiting for the build]", "a blocked to-do says why"
    todos.unblock(row.n)
    todos.assign(row.n, "helper:3")
    assert todos.mark(todos.load(row.n)) == "  [assigned to helper 3]", "an assigned to-do says to whom"
    todos.complete(row.n, how="finished")
    assert todos.mark(todos.load(row.n)) == "  [done]", "a finished to-do says so"
    assert controller_of(record, f"todo:{row.n}").load(row.n).title == "a row to mark", "a reference names the row it points to"
    assert "is not a row" in refused(lambda: controller_of(record, "nothing:1")), "a reference to a type that does not exist is refused"
    assert "an abstract is at most" in refused(lambda: check_abstract("x " * 400)), "a long abstract is sent back to be shortened"
    note = Todos(record, actor=AGENT).create("a row with a file")
    folder = todos.folder(note.n)
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "found.txt").write_text("here")
    assert "found.txt" in todos.index(note.n).files, "a file that was put beside a row by hand is indexed"
    event = record.event_log.events(0, 5)[0]
    User(record).notify(event)
    System(record).notify(event)
    assert (User(record).cursor(), System(record).cursor()) == (event.id, event.id), "the person's and the system's events are marked as handled"
    from controllers.features import setting_value
    from controllers.types import Agents, Features
    assert "name the task to stop" in refused(lambda: Agents(record, actor=SYSTEM).stop_task(1, " ")), "stopping a task needs its name"
    assert Agents(record, actor=SYSTEM)._shared("claude-77").title == "claude-77", "a session the journal has not met is made as stopped when it is first asked for"
    assert "has settings" in refused(lambda: Features(record, actor=SYSTEM).configure("nothing", "k", "v")), "a feature that does not exist has no settings to set"
    assert "has no setting" in refused(lambda: Features(record, actor=SYSTEM).configure("sharing", "nokey", "v")), "a setting the feature lacks is refused with the ones it has"
    assert (setting_value("3"), setting_value("[1]"), setting_value("plain")) == (3, "[1]", "plain"), "a setting is read as a number or switch when it is one, and otherwise as the text given"
    from controllers.types import Notices, Works
    from resources.base import check_title
    from resources.shapes import check, typed as shaped_value
    assert "calls that processed" in refused(lambda: Messages(record, actor=AGENT).method("complete")), "a message is closed with the word it has for it, not the general one"
    quoting = Messages(record, actor=USER).create("An old quote and new words", brief="> an old quote\n\nthe new words\nsecond line")
    assert Messages(record, actor=AGENT)._quoted(quoting.n) == "> the new words\n> second line", "a reply quotes what was written, without the quotes already in it"
    assert Notices(record, actor=SYSTEM)._damaged("todo/1.md", "bad") is None, "a notice board has nothing to say about a damaged row of its own"
    finished = Todos(record, actor=AGENT).create("already finished")
    Todos(record, actor=AGENT).complete(finished.n, "done")
    assert "is already done" in refused(lambda: Works(record, actor=AGENT).create("working on it", todo=finished.n)), "work is not opened on a row that is done"
    assert (shaped_value("[broken"), shaped_value("2.5"), isinstance(check("p", "number", "high"), (int, float))) == ("[broken", 2.5, True), \
        "text that only looks like a list stays text, and a named priority is a number"
    assert "a title is required" in refused(lambda: check_title("   ")), "a title of nothing is refused"
    from controllers.stored import INDEXED, STAMPED, SUMMARIES
    hurt = Todos(record, actor=AGENT).create("a row that will be damaged")
    Todos(record, actor=SYSTEM).path(hurt.n).write_text("this is not a row")
    STAMPED.clear()
    INDEXED.clear()
    SUMMARIES.clear()
    from engine.record import Record
    listed = [row["n"] for row in Todos(Record(record.root, record.env), actor=SYSTEM).rows.summaries()]
    assert hurt.n not in listed and listed, "a row file that cannot be read is left out of the list, and the rest still list"
    from controllers.stored import DEFER, UNSAVED, WRITTEN, flush_indexes, index_file
    shelf = Todos(Record(record.root, record.env), actor=SYSTEM)
    folder = shelf.rows.folder()
    WRITTEN[str(folder)] = 0.0
    index_file(folder).unlink(missing_ok=True)
    DEFER.set()
    try:
        added = Todos(record, actor=AGENT).create("a row the index has not seen")
        STAMPED.clear()
        INDEXED.clear()
        SUMMARIES.clear()
        shelf.rows.summaries()
        waiting = index_file(folder).exists(), str(folder) in UNSAVED
        flush_indexes()
    finally:
        DEFER.clear()
    assert (waiting, index_file(folder).exists(), str(folder) in UNSAVED) == ((False, True), True, False), \
        "a read that finds the row index due leaves its write to the background, which saves it; nothing waits for it on the request"
    assert any("could not be read" in notice.brief for notice in Notices(record, actor=SYSTEM).all()), "and the damage is filed for the user"
    import controllers.discussion as discussion
    faces = Messages(record, actor=AGENT)
    liked = Messages(record, actor="user").create("a message to like")
    faces.react(liked.n, "👍")
    window = discussion.TWICE_WITHIN
    discussion.TWICE_WITHIN = 0
    try:
        assert faces.react(liked.n, "👍") is None, "a face given again after a while takes the reaction back"
    finally:
        discussion.TWICE_WITHIN = window
    import controllers.base as base
    said = Messages(record, actor=USER)
    first, second = said.create("same words", brief="again"), said.create("other words", brief="other")
    assert said.create("same words", brief="again").n == first.n, "the same words said twice at once are one message"
    window = base.TWIN_WINDOW
    base.TWIN_WINDOW = 1
    try:
        assert said.create("same words", brief="again").n > second.n, "a create looks for its twin among the newest rows only, never through every row of the store"
    finally:
        base.TWIN_WINDOW = window
    from controllers.types import Docs
    from engine import transaction
    todos = Todos(record, actor=SYSTEM)
    kept = todos.create("kept as it was")
    todos.rows.summaries()
    with pytest.raises(RuntimeError):
        with transaction.undoable():
            todos.update(kept.n, title="rolled back")
            assert todos.load(kept.n).title == "rolled back", "inside the transaction the change is read"
            raise RuntimeError("the transaction fails")
    assert (todos.load(kept.n).title, [row["title"] for row in todos.rows.summaries() if row["n"] == kept.n]) == ("kept as it was", ["kept as it was"]), \
        "a transaction that is rolled back leaves nothing of what it wrote in memory, neither the row nor the list of rows"
    mine = Messages(record, actor=USER).create("written by the user", brief="their words")
    agent_messages = Messages(record, actor=AGENT)
    held = agent_messages.rows.peek(mine.n)
    held.brief = "changed in place"
    with pytest.raises(Refused):
        agent_messages.save(held, "updated")
    assert agent_messages.rows.peek(mine.n).brief == "their words", "a save that is refused leaves the held row as the disk has it, also when the row was changed in place"
    docs = Docs(record, actor=SYSTEM)
    docs.create("a doc in a folder of its own")
    folder = docs.rows.folder()
    assert docs.rows._stamps(folder) is docs.rows._stamps(folder), "the stamps of a type with a folder per row are kept while its folder has not changed, not read from every row folder again"
    warm(record.root)




def test_a_row_another_process_changed_or_removed_is_patched_into_the_held_list_alone():
    import features
    from controllers.types import Todos
    from resources.base import AGENT, SYSTEM
    from tests.conftest import fresh
    features.load()
    record = fresh()
    todos = Todos(record, actor=AGENT)
    first, second, third = (todos.create(title) for title in ("one", "two", "three"))
    assert [row["title"] for row in todos.rows.summaries()] == ["one", "two", "three"], "the list is held once read"
    kept = todos.rows.summaries()[0]
    changed = todos.load(second.n)
    changed.title = "two, reworded"
    todos.rows.write_file(changed)
    todos.rows._note(second.n)
    assert [row["title"] for row in todos.rows.summaries()] == ["one", "two, reworded", "three"], "a row written by another process shows its new title"
    assert todos.rows.summaries()[0] is kept, "a row nobody touched is the very row that was held"
    todos.rows.path(third.n).unlink()
    todos.rows._note(third.n)
    assert [row["n"] for row in Todos(record, actor=SYSTEM).rows.summaries()] == [first.n, second.n], "a row whose file is gone leaves the list"


def test_a_type_keeps_its_counts_in_step_with_every_row_a_change_touches():
    from overview.counts import counts
    from resources.base import overview_weight as weigh
    features.load()
    record = fresh()
    written = Messages(record, actor=AGENT)
    reader = Messages(record, actor=USER)

    def walked() -> tuple[int, int, int]:
        rows = written.rows.summaries()
        return tuple(sum(column) for column in zip(*map(weigh, rows))) if rows else (0, 0, 0)

    def kept() -> tuple[int, int, int]:
        found = counts(written)
        return found["all"], found["open"], found["unread"]

    assert kept() == (0, 0, 0)
    first, second, third = (written.create(text).n for text in ("one", "two", "three"))
    assert kept() == walked() == (3, 3, 3), "new rows are added one by one"
    reader.read(second)
    assert kept() == walked() == (3, 2, 2), "a message of the agent the user has seen closes, and leaves the open and unread counts"
    Messages(record, actor=SYSTEM).complete(first, how="handled")
    assert kept() == walked() == (3, 1, 1), "a row closed another way leaves them too"
    Messages(record, actor=SYSTEM).delete(third, "mistake")
    assert kept() == walked() == (2, 0, 0), "a deleted row leaves every count"
