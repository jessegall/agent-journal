import time

from features.status_bar.group import grouped, ran
from features.status_bar.queue import queue as messages
from features.status_bar.queue import HOLD
from features.status_bar.bar import bar, bar_file, played, current
from engine.stored import write_json
from tests.conftest import fresh


NOW = 1_000_000.0


def shell(what, at=NOW, **more):
    return {"what": what, "tool": "Bash", "at": at, **more}


def edit(name, at=NOW, **more):
    return {"what": f"editing {name}", "tool": "Edit", "files": [name], "at": at, "effect": "writes", **more}


def queue(commands, now=NOW):
    return messages(grouped(ran(list(commands))), now)


def text(commands, now=NOW):
    return [[p["value"] for p in one["parts"]] for one in queue(list(commands), now)]


def used(tool, subject, at=NOW, **more):
    return {"what": f"using {subject}", "tool": tool, "subject": subject, "at": at, **more}


def read(name, at=NOW, **more):
    return {"what": f"reading {name}", "tool": "Read", "files": [name], "at": at, "effect": "reads", **more}


def coloured(commands, now=NOW):
    return [[(p["value"], p["color"]) for p in one["parts"]] for one in queue(list(commands), now)]


MESSAGE = [{"name": "message", "title": "Message", "names": {}}]


TODO = [{"name": "todo", "title": "To-do", "names": {"create": "add"}}]


WORK = [{"name": "work", "title": "Work", "names": {}}]


def test_one_message_per_run_of_consecutive_commands_of_the_same_kind():
    assert text([edit("a.vue"), edit("b.py"), edit("c.md")]) == [["editing", ["a.vue", "b.py", "c.md"]]], \
        "a run of the same kind is one message, naming everything it worked on in order"
    assert text([edit("a.vue"), shell("git commit -m x"), edit("c.md")]) == \
        [["editing", "a.vue"], ["git", "committing", "changes"], ["editing", "c.md"]], \
        "a command of another kind closes the message and opens the next"
    assert text([edit("one.py"), edit("two.py"), shell("journal todo add x", NOW + 1), shell("git commit -m x", NOW + 2), edit("three.py", NOW + 3)]) == \
        [["editing", ["one.py", "two.py"]], ["journalling", "adding", "todo"], ["git", "committing", "changes"], ["editing", "three.py"]], \
        "the user's case: two writes, a journal command, a commit, a write"
    assert queue([], NOW) == [], "nothing that has not run is in the queue: an empty ring is an empty queue"
    assert text([shell("")]) == [], "a command with nothing to say is left out"


def test_the_verb_is_the_root_and_the_only_unmuted_part():
    assert coloured([used("mcp__x__y", "playwright · browser evaluate")])[0][:2] == [("using", "gray"), ("playwright", "muted")], \
        "the verb is gray and everything else muted"
    assert text([shell("git add -A"), shell("git commit -m x", NOW + 1, effect="writes", done=NOW + 2), shell("git push", NOW + 3)]) == \
        [["git", ["tracking", "committing", "pushing"], ["files", "changes", "changes"]]], \
        "a run of git commands is one message, rooted under git"
    assert [text([{"what": f"reading {f}", "tool": "Read", "at": NOW, "effect": "reads", "files": [f]}])[0][0] for f in ("a.png", "b.mp4")] == \
        ["viewing", "watching"], "a picture and a film have their own words"
    assert (text([shell("x", effect="writes", files=["a.py"], made=["a.py"])])[0][0],
            queue([shell("x", effect="writes", files=["a.py"], made=["a.py"])], NOW)[0]["hold"]) == ("creating", HOLD), \
        "creating has its own word and holds its line like editing"
    assert [text([shell("x", effect=e, files=["a.py"])])[0][0] for e in ("writes", "reads", "deletes", "tests", "installs", "builds", "")] == \
        ["editing", "reading", "deleting", "testing", "installing", "building", "running"], "every kind has its own verb"
    assert text([shell("journal question answer 10"), shell("journal todo add 12", NOW + 1), shell("journal work log 12 x", NOW + 2)]) == \
        [["journalling", ["answering", "adding", "logging"], ["question", "todo", "work"], ["10", "12", "12"]]], \
        "a run of journal commands is one message whose every column rolls on its own"
    assert coloured([shell("journal message read 601")])[0][:2] == [("journalling", "gray"), ("reading", "muted")], \
        "a journal command is rooted under journalling and what it did there is muted"


def test_the_whole_bar_is_the_queue_and_nothing_else():
    class Row:
        commands = [read("before.py"), edit("now.py", NOW + 1)]

    assert [one["key"] for one in bar(Row(), NOW + 2)["queue"]] == ["reading before.py", "editing now.py"], "the bar is the queue"


def test_the_band_tracks_the_cursor_through_keyboard_codes_and_scroll_regions():
    from engine.band import ROWS, Cursor, Translator
    cursor = Cursor(40, 120)
    cursor.feed(Translator(40).feed(b"\x1b[5;3H\x1b[<u\x1b[>5u\x1b[>4;2m\x1b(B\x0f"))
    assert (cursor.row, cursor.col) == (5 + ROWS, 3), "a private-parameter code prints nothing, so the column stays put"
    cursor.feed(Translator(40).feed(b"\x1b[H\x1b[2;30r"))
    assert (cursor.row, cursor.col) == (ROWS + 1, 1), "setting a region homes the cursor to the top of the agent's screen, below the band"


def test_the_header_names_the_installed_version(tmp_path):
    import re
    from engine.band import Band
    from engine.version import version
    current = re.sub(r"\x1b\[[0-9;]*m", "", Band(tmp_path, "main", "claude-1", "project").banner(120, "main", {}))
    assert f"JOURNAL {version()}" in current, current


def test_a_terminal_answering_a_query_is_not_the_user_typing():
    from engine.supervisor import typing
    assert (typing(b"\x1bP>|iTerm2 3.5\x1b\\"), typing(b"\x1b]11;rgb:1616/1818/1d1d\x07"), typing(b"a")) == (False, False, True), \
        "a version or colour reply comes in on the keyboard but holds nothing"


def test_with_the_header_off_nothing_is_drawn_or_wiped():
    from engine import band
    assert (band.SHOWN, band.release()) == (False, b""), "the terminal is the agent's alone: an exit clears none of its rows"


def test_a_played_line_is_not_played_again(tmp_path):
    lately = time.time()
    write_json(bar_file(tmp_path, "main"), {"queue": [{"at": 1.0, "done": True}, {"at": 2.0, "done": True}, {"at": lately, "done": False}]})
    played(tmp_path, "main", 2.0)
    assert [one["at"] for one in current(tmp_path, "main")["queue"]] == [lately]
    played(tmp_path, "main", lately)
    assert [one["at"] for one in current(tmp_path, "main")["queue"]] == [lately], "the line still running stays"
    write_json(bar_file(tmp_path, "main"), {"queue": [{"at": lately, "done": True, "for": 0, "lingers": 10.0}]})
    assert [one["at"] for one in current(tmp_path, "main")["queue"]] == [lately], "a finished line lingers before it goes"
    played(tmp_path, "main", 2.0)
    write_json(bar_file(tmp_path, "main"), {"queue": [{"at": 2.0, "done": True, "for": 0, "lingers": 10.0}]})
    assert current(tmp_path, "main")["queue"] == [], "once it has lingered, a played line is not played again"


def test_an_agent_waiting_on_its_scheduled_wakeup_is_idle_not_busy():
    from controllers.types import Agents
    from engine.hooks import handle
    from providers import PROVIDERS
    record = fresh()
    claude = PROVIDERS["claude"]()
    for event, tool in (("Stop", ""), ("PreToolUse", "ScheduleWakeup"), ("SubagentStop", "")):
        handle(claude, record.root, record.env, {"hook_event_name": event, "session_id": "claude-wake", "tool_name": tool, "tool_input": {"delaySeconds": 1200}})
    assert Agents(record).by_session("claude-wake").status == "idle", "the turn ended with a wakeup scheduled, so the agent waits, it is not busy"
