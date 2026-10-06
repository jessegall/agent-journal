import features
from controllers.types import Agents, Messages, Nudges, Todos
from resources.base import AGENT, SYSTEM, USER
from tests.conftest import fresh


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
    Messages(record, actor=AGENT).reply(asked.n, f"Filed as to-do {named}, to-do {elsewhere} and to-do {old.n}.")
    refs = Messages(record, actor=SYSTEM).load(asked.n).refs
    assert f"todo:{named}" in refs, "a new to-do the reply names is linked to the message it answers"
    assert f"todo:{elsewhere}" not in refs, "a to-do another message already links is left where it is"
    assert f"todo:{old.n}" not in refs, "a to-do older than the setting's minutes is not linked"
    nudged = [n.title for n in Nudges(record, actor=SYSTEM).rows.every()]
    assert f"to-do {forgotten} came from message {asked.n}?" in nudged, "a new to-do the reply leaves unnamed and unlinked is pointed out"
    Messages(record, actor=AGENT).reply(asked.n, "And one more thing.")
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
    assert "is a reaction" in refused(lambda: agent.reply(str(first.n), "👍")), "a reply that is only a face is a reaction"
    made = agent.reply(f"{first.n},{second.n}", "both are on the list", file=str(note))
    assert "> make the tunnel restart itself" in made.brief and "both are on the list" in made.brief, "a reply quotes what it answers"
    assert Comments(record, actor=AGENT).load(made.n).files, "a reply can carry a file"
    assert f"message:{second.n}" in Comments(record, actor=AGENT).load(made.n).refs, "a reply to several messages is linked to each"
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
    assert "waits on another to-do" in refused(lambda: todos.after(one.n, "banana")), "a to-do waits on a to-do or a plan"
    todos.after(two.n, one.n)
    assert todos.mark(todos.load(two.n)).startswith("  [waits on"), "a to-do that waits says on what"
