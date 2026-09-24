import features
from controllers.types import Messages, Questions, Reports, Todos
from resources.base import SYSTEM, USER
from tests.conftest import fresh, refused
from tests.kit import nudges, report


def recap(record, summary: str):
    return Reports(record, actor=SYSTEM).action("recap")(summary)


def test_an_update_covers_what_happened_since_the_user_opened_the_last_one():
    features.load()
    record = fresh()
    todos = Todos(record, actor=SYSTEM)
    first, second = todos.create("Settings page made calmer"), todos.create("Files page redesign")
    todos.complete(first.n, how="shipped")
    asked = Questions(record, actor=SYSTEM).create("Should New work pick drafts for you?")
    one = recap(record, "The settings page is calmer; one question waits on you.")
    assert (one.title, one.data["number"], [(i["section"], i["ref"]) for i in one.data["items"]]) == (
        "What happened in the last day", 1, [("need", f"question:{asked.n}"), ("done", f"todo:{first.n}")]), \
        "the first update covers the last day, what waits on the user first"

    Reports(record, actor=USER).read(one.n)
    todos.complete(second.n, how="shipped")
    two = recap(record, "The files page is redesigned.")
    assert (two.title, two.data["number"], two.data["since"]) == ("What happened since your last update", 2, one.data["until"]), \
        "the next starts where the last opened one ended"
    assert [i["ref"] for i in two.data["items"] if i["section"] == "done"] == [f"todo:{second.n}"], "and lists only what is new"


def test_notes_items_and_drops_change_only_an_update():
    features.load()
    record = fresh()
    reports = Reports(record, actor=SYSTEM)
    done = Todos(record, actor=SYSTEM).create("Files page redesign")
    Todos(record, actor=SYSTEM).complete(done.n, how="shipped")
    update = recap(record, "The files page is redesigned.")
    reports.action("note")(update.n, f"todo:{done.n}", "every file says where it came from")
    reports.action("item")(update.n, "need", "plan:3", "Hand the agent a document", "Waiting for your approval")
    reports.action("item")(update.n, "commits", "commit:20b9ce1", "The plan card can be dismissed")
    items = reports.load(update.n).data["items"]
    assert [(i["section"], i["note"]) for i in items] == [("need", "Waiting for your approval"), ("done", "every file says where it came from"),
                                                         ("commits", "")], "rows keep the order of the sections"
    reports.action("drop")(update.n, "plan:3")
    assert [i["ref"] for i in reports.load(update.n).data["items"]] == [f"todo:{done.n}", "commit:20b9ce1"], "a dropped row is gone"
    Reports(record, actor=USER).action("dismiss")(update.n)
    assert reports.load(update.n).data["dismissed"] is True, "the user takes an update out of the chat's dock"

    plain = reports.create("Why the updater gets stuck", brief="it installs main")
    assert "is not an update" in refused(lambda: reports.action("note")(plain.n, "todo:1", "a note")), "only an update takes rows"
    Reports(record, actor=USER).action("dismiss")(plain.n)
    assert reports.load(plain.n).data["dismissed"] is True, "any report is taken out of the dock the same way"
    assert "sections are" in refused(lambda: reports.action("item")(update.n, "later", "todo:1", "a row")), "a row goes under a known section"
    assert "has no row" in refused(lambda: reports.action("note")(update.n, "todo:999", "a note")), "a note names a row that is there"


def test_asking_for_an_update_starts_writing_one_and_the_agent_saying_it_does_not():
    from engine.hooks import displayed
    from engine.sessions import Sessions
    from features.sequences.controller import Sequences
    from features.sequences.shipped import ship
    from features.triggers.controller import Triggers
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse", provider="claude")
    Sessions(record.root).bind("claude-1", record.env, provider="claude")
    ship(record)
    sequences = Sequences(record, actor=SYSTEM)
    writing = next(s for s in sequences.summaries() if s["title"] == "Writing an update")
    trigger = next(t for t in Triggers(record, actor=SYSTEM)._every() if t.title == "Writing an update")
    assert (trigger.words_in, sequences.load(writing["n"]).starts_on) == ("user", f"trigger:{trigger.n}"), \
        "the sequence starts on its own trigger, which watches only what the user writes"

    displayed(record.root, {"session_id": "claude-1", "hook_event_name": "MessageDisplay", "message_id": "a", "index": 0, "final": True,
                            "delta": "TL;DR: the tests pass."})
    assert sequences.load(writing["n"]).runs == {}, "the agent saying it starts nothing"
    Messages(record, actor=USER).create("tldr?")
    assert len(sequences.load(writing["n"]).runs) == 1, "the user asking starts writing an update"


def test_a_commit_reminds_the_agent_it_may_write_an_update_at_most_hourly():
    features.load()
    record = fresh()
    record.set_cursor_text("close_from_commits", "aaa")
    report(record, "idle", "Stop")
    offers = lambda: [n for n in nudges(record) if n.startswith("you committed work")]
    assert offers() == [], "the first commit seen only sets the mark"
    record.set_cursor_text("close_from_commits", "bbb")
    record.set_cursor_text("update-offered", "aaa 0")
    report(record, "idle", "Stop")
    assert len(offers()) == 1, "a new commit reminds the agent once"
    record.set_cursor_text("close_from_commits", "ccc")
    report(record, "idle", "Stop")
    assert len(offers()) == 1, "another commit within the hour says nothing more"
