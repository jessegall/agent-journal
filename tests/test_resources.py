import threading

from controllers.types import CONTROLLERS, Comments, Todos
from engine.record import Record
from resources.base import ABSTRACT_MAX, ACTORS, AGENT, ENVIRONMENT, PLUGIN, PROJECT, TITLE_MAX, ACTIONS, USER
from resources.types import TYPES
from tests.conftest import fresh, refused as kit_refused


def refused(call):
    return bool(kit_refused(call))


def test_every_resource_type_supports_the_common_lifecycle_and_emits_its_actions(tmp_path_factory):
    records = {}
    for type_ in TYPES:
        record = records[type_] = Record(tmp_path_factory.mktemp(type_) / ".journal", "main")
        c = CONTROLLERS[type_](record)
        r = c.create(f"a {type_} to keep", abstract="one short line about it", brief="as long as it needs to be\n\nwith paragraphs")
        assert (r.n, r.title, r.abstract, r.brief.split("\n")[0]) == \
            (1, f"a {type_} to keep", "one short line about it", "as long as it needs to be"), \
            f"{type_}: created as number 1 with its three texts"
        assert c.show(1).dump() == r.dump(), f"{type_}: read back from its file unchanged"
        assert refused(lambda: c.create("x" * (TITLE_MAX + 1))) is True, f"{type_}: a title past {TITLE_MAX} characters is refused"
        assert refused(lambda: c.create("the thing: explained")) is True, f"{type_}: a title with a colon is refused"
        assert refused(lambda: c.create("fine", abstract="y" * (ABSTRACT_MAX + 1))) is True, \
            f"{type_}: an abstract past {ABSTRACT_MAX} characters is refused"
        if type_ == "work":
            c.update(1, parked="set aside for the next check")
        long = c.create("fine", brief="z" * 50_000)
        assert len(c.show(long.n).brief) == 50_000, f"{type_}: the brief is unlimited"
        c.section(1, "Why", "because")
        note = c.comment(1, "a note")
        c.link(1, "todo:9")
        got = c.show(1)
        assert (got.sections, got.refs, note.type, note.refs[0], [x.title for x in c.comments(1)]) == \
            ([{"title": "Why", "body": "because"}], ["todo:9"], "comment", f"{type_}:1", ["a note"]), \
            f"{type_}: a section and a link stick, and a comment is a resource of its own on it"
        if type_ == "comment":
            assert note.refs[0] == "comment:1", "comment: commenting on a comment is the same act"
        reply = Comments(record).comment(note.n, "a comment on the comment")
        assert (reply.refs[0], [x.title for x in Comments(record).comments(note.n)]) == \
            (f"comment:{note.n}", ["a comment on the comment"]), f"{type_}: a comment can have a comment"
        c.complete(1, "finished")
        if type_ == "environment":
            assert (refused(lambda: c.show(1)), refused(lambda: c.complete(1))) == (True, True), \
                "environment: remove is terminal and physical"
            continue
        assert (c.show(1).completed > 0, refused(lambda: c.complete(1))) == (True, True), \
            f"{type_}: completed is the final phase, marked once"
        c.reopen(1, "closed too soon")
        assert (c.show(1).completed, c.show(1).outcome) == (0.0, ""), f"{type_}: reopening puts it back with no outcome"
        c.complete(1, "finished")
        others = [x.n for x in c.all() if x.n > 2]
        c.delete(1, "no longer needed")
        assert ([x.n for x in c.all()], c.show(1).deleted > 0) == ([2] + others, True), \
            f"{type_}: deleted is soft — gone from the list, still on disk"
        c.restore(1)
        c.force_delete(2)
        assert ([x.n for x in c.all()], refused(lambda: c.show(2))) == ([1] + others, True), \
            f"{type_}: force delete removes the file"

    for type_ in TYPES:
        mine = [e for e in records[type_].events() if e.type == type_]
        expected = set(ACTIONS) - ({"completed", "reopened"} if type_ == "environment" else set())
        assert sorted({e.action for e in mine}) == sorted(expected), \
            f"{type_}: every action left an event, and only its terminal actions"
        assert (mine[0].actor, mine[0].ref) == ("user", f"{type_}:1"), f"{type_}: an event says who did it and what it is about"


def test_scope_a_project_resource_is_one_for_every_environment(tmp_path):
    root = tmp_path
    here, there = Record(root, "here"), Record(root, "there")
    for type_ in TYPES:
        CONTROLLERS[type_](here).create("shared" if TYPES[type_].scope == PROJECT else "own")
        seen_there = [r.title for r in CONTROLLERS[type_](there).all()]
        if TYPES[type_].scope == PROJECT:
            assert (seen_there, CONTROLLERS[type_](here).path(1).parent.parent) == (["shared"], root), \
                f"{type_}: project scope, listed from every environment, filed under the root"
        else:
            assert (seen_there, CONTROLLERS[type_](here).path(1).parent.parent.parent) == ([], root / "environments"), \
                f"{type_}: environment scope, its own"
    assert sorted(n for n, t in TYPES.items() if t.scope == PROJECT) == ["connection", "doc", "environment", "plugin", "rule", "style", "tool"], \
        "rules, docs, tools, style, plugins and connections are the project's"
    assert {t.scope for t in TYPES.values()} <= {ENVIRONMENT, PROJECT}, "every scope is one of the two"


def test_numbers_past_999_are_listed_and_counted_on_never_overwritten(tmp_path):
    record = Record(tmp_path / ".journal", "main")
    todos = CONTROLLERS["todo"](record)
    for i in range(1, 1003):
        todos.create(f"row {i}")
    rows = todos.all()
    assert (len(rows), [r.n for r in rows][-3:], rows[-1].title) == (1002, [1000, 1001, 1002], "row 1002"), \
        "the thousandth row and those after it are listed, each its own"


def test_the_plugin_actor_writes_like_any_other_and_its_events_say_so():
    record = fresh()
    made = Todos(record, actor=PLUGIN).create("filed by a plugin")
    assert (made.seen, [e.actor for e in record.events() if e.type == "todo"][-1]) == ([PLUGIN], PLUGIN), "a plugin writes as itself"
    assert (PLUGIN in ACTORS) is True, "and it is one of the actors the manifest offers"


def test_a_row_being_written_is_never_half_a_row_to_whoever_is_reading_it():
    racing = Todos(fresh(), actor=AGENT)
    row = racing.create("read me while I am written")
    trouble = []

    def rewrite():
        for i in range(200):
            racing.update(row.n, brief="x" * (i % 97) * 40)

    def reread():
        for _ in range(200):
            try:
                racing.load(row.n)
            except Exception as e:
                trouble.append(repr(e))

    writer = threading.Thread(target=rewrite)
    reader = threading.Thread(target=reread)
    writer.start(), reader.start()
    writer.join(), reader.join()
    assert trouble == [], "two hundred reads during two hundred writes see a whole row every time"


def test_what_completing_a_row_is_told_is_kept_on_the_row_not_only_the_event():
    rows = Todos(fresh(), actor=AGENT)
    struck = rows.strike(rows.create("abandon me").n, "it stopped being worth doing")
    assert (struck.data.get("struck"), struck.outcome) == (True, "struck: it stopped being worth doing"), \
        "a struck row says so on the row itself, with its why"
    closed = rows.complete(rows.create("close me").n, "done", handed="the other agent")
    assert closed.data.get("handed") == "the other agent", "anything else set while completing is kept too"


def test_a_row_closed_by_mistake_is_put_back_with_the_reason_on_the_record():
    record = fresh()
    rows = Todos(record, actor=USER)
    row = rows.create("a row closed too soon")
    assert ("is not done" in kit_refused(lambda: rows.reopen(row.n, "x"))) is True, "a row that is open cannot be reopened"
    rows.complete(row.n, "closed by a commit trailer that named the wrong number")
    back = rows.reopen(row.n, "the trailer named a plan row, not this work")
    assert (bool(back.completed), back.outcome) == (False, ""), "it is open again with no outcome"
    assert [(e.action, e.data.get("why")) for e in record.events() if e.type == "todo"][-1] == \
        ("reopened", "the trailer named a plan row, not this work"), "and the record says it was reopened and why"
    rows.delete(row.n, "archived")
    assert ("archived" in kit_refused(lambda: rows.reopen(row.n, "x"))) is True, "an archived row is restored before it is reopened"
