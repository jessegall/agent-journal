from controllers.types import Messages, Works
from engine.gates import held
from providers import PROVIDERS
from resources.base import AGENT, USER
from runner.hooks import handle
from tests.conftest import fresh
from tests.kit import report

HELD = "the conversation was compacted — read the latest {} messages before any other write — journal message recent"


def working():
    record = fresh()
    Works(record, actor=AGENT).create("the work in hand")
    return record


def compacted(record) -> None:
    report(record, "compacting", "PreCompact")


def recent(record) -> str:
    return Messages(record, actor=AGENT).action("recent")()


def use(record, tool: str, given: dict) -> dict:
    return handle(PROVIDERS["claude"](), record.root, record.env,
                  {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": tool, "tool_input": given})


def refusal(answer: dict) -> str:
    return answer.get("reason", "") if answer.get("hookSpecificOutput", {}).get("permissionDecision") == "deny" else ""


def test_a_compaction_holds_writes_until_the_latest_messages_are_read():
    record = working()
    Messages(record, actor=USER).create("what you were doing")
    assert held(record, "claude-1") == "", "before a compaction nothing is held"
    compacted(record)
    assert held(record, "claude-1") == HELD.format(50), "a compaction holds the writes and names the command and the count"
    assert HELD.format(50) in refusal(use(record, "Edit", {"file_path": str(record.root.parent / "a.py"), "old_string": "a", "new_string": "b"})), \
        "an edit is refused with the line that says what to run"
    assert refusal(use(record, "Read", {"file_path": str(record.root.parent / "a.py")})) == "", "reading is never held"
    assert "what you were doing" in recent(record), "the command prints the messages"
    assert held(record, "claude-1") == "", "reading them releases the hold"
    assert refusal(use(record, "Edit", {"file_path": str(record.root.parent / "a.py"), "old_string": "a", "new_string": "b"})) == "", \
        "once read, the edit goes through"


def test_the_latest_messages_are_printed_in_full_oldest_first_with_who_wrote_each():
    record = working()
    first = Messages(record, actor=USER).create("Merge the pull requests", brief="Merge the pull requests\ninto main, within the hour")
    second = Messages(record, actor=AGENT).create("All six are merged")
    third = Messages(record, actor=USER).create("Thank you")
    printed = recent(record).split("\n\n")
    assert [entry.splitlines()[0].split(" · ")[:2] for entry in printed] == \
        [[f"message {first.n}", "the user"], [f"message {second.n}", "you"], [f"message {third.n}", "the user"]], \
        "each message is named by number and by who wrote it, oldest first"
    assert printed[0].splitlines()[1:] == ["Merge the pull requests", "into main, within the hour"], "a message's whole text is printed, every line of it"
    assert all(len(entry.splitlines()[0].split(" · ")[2]) == len("2026-10-07 15:11") for entry in printed), "each carries the date and time it was written"


def test_closed_messages_are_read_and_deleted_ones_are_not():
    record = working()
    messages = Messages(record, actor=USER)
    closed = messages.create("an answered question")
    gone = messages.create("a message taken back")
    Messages(record, actor=AGENT).complete(closed.n, how="answered")
    messages.delete(gone.n, "sent by mistake")
    printed = recent(record)
    assert ("an answered question" in printed, "a message taken back" in printed) == (True, False), \
        "a message already handled still counts as conversation; a deleted one never does"


def test_the_count_setting_decides_how_many_messages_are_read_and_the_hold_names_it():
    record = working()
    record.set_setting("catching_up", {"count": 3})
    for word in ("one", "two", "three", "four", "five"):
        Messages(record, actor=USER).create(word)
    compacted(record)
    assert held(record, "claude-1") == HELD.format(3), "the hold names the count from the setting"
    assert [entry.splitlines()[1] for entry in recent(record).split("\n\n")] == ["three", "four", "five"], "only the latest three are printed"


def test_fewer_messages_than_the_count_prints_them_all_and_none_still_releases():
    record = working()
    compacted(record)
    assert recent(record) == "no messages yet", "with no messages it says so plainly"
    assert held(record, "claude-1") == "", "and still releases the hold, since there is nothing to read"
    Messages(record, actor=USER).create("only one")
    assert len(recent(record).split("\n\n")) == 1, "fewer messages than the count prints every one there is"


def test_switched_off_a_compaction_holds_nothing():
    record = working()
    record.set_setting("features", {"catching_up": False})
    compacted(record)
    assert held(record, "claude-1") == "", "with the feature off a compaction holds nothing"


def test_every_compaction_holds_again_after_the_last_was_read():
    record = working()
    compacted(record)
    recent(record)
    assert held(record, "claude-1") == "", "the first compaction is read and released"
    compacted(record)
    assert held(record, "claude-1") == HELD.format(50), "the next compaction holds again"


def test_reading_releases_only_its_own_hold_never_a_context_mark():
    record = working()
    report(record, "working", "PostToolUse", context=52)
    compacted(record)
    recent(record)
    assert held(record, "claude-1").startswith("context 52% full"), "the context mark still waits for its own decision"


def test_reading_with_no_compaction_only_prints():
    record = working()
    Messages(record, actor=USER).create("just checking")
    assert ("just checking" in recent(record), held(record, "claude-1")) == (True, ""), "the command works any time and holds nothing"
