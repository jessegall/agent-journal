import features
from controllers.types import Messages, Reports
from resources.base import SYSTEM, USER
from tests.conftest import fresh
from tests.kit import nudges, report


def recap(record, summary: str):
    return Reports(record, actor=SYSTEM).action("recap")(summary)


def test_asking_for_an_update_starts_writing_one_and_the_agent_saying_it_does_not():
    from payload import Chunk
    from framework.displayed import announce_chunk as displayed
    from engine.sessions import Sessions
    from controllers.types import Sequences
    from features.sequences.shipped import ship
    from controllers.triggers.controller import Triggers
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse", provider="claude")
    Sessions(record.root).bind("claude-1", record.env, provider="claude")
    ship(record)
    sequences = Sequences(record, actor=SYSTEM)
    writing = next(s for s in sequences.rows.summaries() if s.title == "Writing an update")
    trigger = next(t for t in Triggers(record, actor=SYSTEM).rows.every() if t.title == "Writing an update")
    assert (trigger.words_in, sequences.load(writing.n).starts_on) == ("user", f"trigger:{trigger.n}"), \
        "the sequence starts on its own trigger, which watches only what the user writes"

    displayed(record.root, Chunk.from_json({"session_id": "claude-1", "hook_event_name": "MessageDisplay", "message_id": "a", "index": 0, "final": True,
                            "delta": "TL;DR: the tests pass."}))
    assert sequences.load(writing.n).runs == {}, "the agent saying it starts nothing"
    Messages(record, actor=USER).create("tldr?")
    assert len(sequences.load(writing.n).runs) == 1, "the user asking starts writing an update"


def test_a_commit_reminds_the_agent_it_may_write_an_update_at_most_hourly():
    features.load()
    record = fresh()
    record.event_log.set_cursor_text("close_from_commits", "aaa")
    report(record, "idle", "Stop")
    offers = lambda: [n for n in nudges(record) if n.startswith("you committed work")]
    assert offers() == [], "the first commit seen only sets the mark"
    record.event_log.set_cursor_text("close_from_commits", "bbb")
    record.event_log.set_cursor_text("update-offered", "aaa 0")
    report(record, "idle", "Stop")
    assert len(offers()) == 1, "a new commit reminds the agent once"
    record.event_log.set_cursor_text("close_from_commits", "ccc")
    report(record, "idle", "Stop")
    assert len(offers()) == 1, "another commit within the hour says nothing more"
    waiting = recap(record, "What happened")
    record.event_log.set_cursor_text("update-offered", "ccc 0")
    record.event_log.set_cursor_text("close_from_commits", "ddd")
    report(record, "idle", "Stop")
    assert len(offers()) == 1, "no offer while an update the user has not read waits, even long after the last one"
    assert record.event_log.cursor_text("update-offered") == "ddd 0", "the unread update held the offer back and kept the old mark"
    Reports(record, actor=USER).read(waiting.n)
    record.event_log.set_cursor_text("close_from_commits", "eee")
    report(record, "idle", "Stop")
    assert record.event_log.cursor_text("update-offered") != "ddd 0", "once it is read, the next commit after the hour offers again and restarts the hour"


def test_an_update_report_never_starts_the_sequence_for_research_reports():
    from controllers.types import Sequences
    from features.sequences.shipped import ship
    from resources.base import AGENT
    features.load()
    record = fresh()
    report(record, "idle", "Stop")
    ship(record)
    writing = Sequences(record, actor=SYSTEM).rows.by_title("Writing a report")
    Reports(record, actor=AGENT).action("recap")("Two fixes landed.")
    assert not Sequences(record, actor=SYSTEM).load(writing.n).runs, "an update is written by recap, not part by part"
    Reports(record, actor=AGENT).create("What the review found", brief="the answer")
    assert Sequences(record, actor=SYSTEM).load(writing.n).runs, "a research report still starts it"
