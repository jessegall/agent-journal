import features
import json
import pytest
import subprocess

from features.statusline.group import grouped, ran
from features.statusline.queue import queue as messages
from features.statusline.queue import CLOCK_AFTER, DRAINING, FLIP_EVERY, HOLD, LINGERS, MOST
from features.statusline.feature import bar
from features.statusline.dissect import base
from features.statusline.shell import parsed
from features.statusline.spoken import spoken
from pathlib import Path
from providers.claude import Claude
from providers.codex import Codex


NOW = 1_000_000.0


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def shell(what, at=NOW, **more):
    return {"what": what, "tool": "Bash", "at": at, **more}


def edit(name, at=NOW, **more):
    return {"what": f"editing {name}", "tool": "Edit", "files": [name], "at": at, "effect": "writes", **more}


def queue(commands, now=NOW):
    return messages(grouped(ran(list(commands))), now)


def said(commands, now=NOW):
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
    assert said([edit("a.vue"), edit("b.py"), edit("c.md")]) == [["editing", ["a.vue", "b.py", "c.md"]]], \
        "a run of the same kind is one message, naming everything it worked on in order"
    assert said([edit("a.vue"), shell("git commit -m x"), edit("c.md")]) == \
        [["editing", "a.vue"], ["git", "committing", "changes"], ["editing", "c.md"]], \
        "a command of another kind closes the message and opens the next"
    assert said([edit("one.py"), edit("two.py"), shell("journal todo add x", NOW + 1), shell("git commit -m x", NOW + 2), edit("three.py", NOW + 3)]) == \
        [["editing", ["one.py", "two.py"]], ["journalling", "adding", "todo"], ["git", "committing", "changes"], ["editing", "three.py"]], \
        "the user's case: two writes, a journal command, a commit, a write"
    assert queue([], NOW) == [], "nothing that has not run is in the queue: an empty ring is an empty queue"
    assert said([shell("")]) == [], "a command with nothing to say is left out"


def test_the_verb_is_the_root_and_the_only_unmuted_part():
    assert coloured([used("mcp__x__y", "playwright · browser evaluate")])[0][:2] == [("using", "gray"), ("playwright", "muted")], \
        "the verb is gray and everything else muted"
    assert said([shell("git add -A"), shell("git commit -m x", NOW + 1, effect="writes", done=NOW + 2), shell("git push", NOW + 3)]) == \
        [["git", ["tracking", "committing", "pushing"], ["files", "changes", "changes"]]], \
        "a run of git commands is one message, rooted under git"
    assert [said([{"what": f"reading {f}", "tool": "Read", "at": NOW, "effect": "reads", "files": [f]}])[0][0] for f in ("a.png", "b.mp4")] == \
        ["viewing", "watching"], "a picture and a film have their own words"
    assert (said([shell("x", effect="writes", files=["a.py"], made=["a.py"])])[0][0],
            queue([shell("x", effect="writes", files=["a.py"], made=["a.py"])], NOW)[0]["hold"]) == ("creating", HOLD), \
        "creating has its own word and holds its line like editing"
    assert [said([shell("x", effect=e, files=["a.py"])])[0][0] for e in ("writes", "reads", "deletes", "tests", "installs", "builds", "")] == \
        ["editing", "reading", "deleting", "testing", "installing", "building", "running"], "every kind has its own verb"
    assert said([shell("journal question answer 10"), shell("journal todo add 12", NOW + 1), shell("journal work log 12 x", NOW + 2)]) == \
        [["journalling", ["answering", "adding", "logging"], ["question", "todo", "work"], ["10", "12", "12"]]], \
        "a run of journal commands is one message whose every column rolls on its own"
    assert coloured([shell("journal message read 601")])[0][:2] == [("journalling", "gray"), ("reading", "muted")], \
        "a journal command is rooted under journalling and what it did there is muted"


def test_the_whole_bar_is_the_queue_and_nothing_else():
    class Row:
        commands = [read("before.py"), edit("now.py", NOW + 1)]

    assert [one["key"] for one in bar(Row(), NOW + 2)["queue"]] == ["reading before.py", "editing now.py"], "the bar is the queue"


def test_a_journal_command_is_said_in_its_own_words():
    assert [said("/opt/homebrew/Cellar/python@3.14/3.14.7/Frameworks/Python.framework/Versions/3.14/Resources/Python.app/Contents/MacOS/Python /u/.journal/src/journal.py --root /u/.journal todo add x", lambda w: spoken(w, TODO)),
            said("journal --env main message read 7", lambda w: spoken(w, MESSAGE))] == \
        [["adding todo"], ["reading message 7"]], \
        "the journal run through Python by its full path reads as the journal command, flags and their values left out"
    assert [spoken(["message", "read", "$n"], MESSAGE), spoken(["work", "log", "$W"], WORK)] == ["reading message", "logging work"], \
        "a shell variable is never shown as if it were a number"
    assert (spoken(["message", "paths", "104"], MESSAGE), spoken(["message", "tag", "105", "x.png", "words"], MESSAGE)) == \
        ("reading message 104", "tagging message 105"), "an unknown word ending in s is a thing of the row, not a verb to conjugate"
    assert spoken(["todo", "add", "5"], TODO) == "adding todo 5", "a type's own word for a method is understood"
    assert [spoken(["open"], MESSAGE), spoken(["status"], MESSAGE), spoken(["message", "reply", "625"], MESSAGE)] == \
        ["checking open work", "checking status", "replying message 625"], \
        "every journal command is an action, a resource and an id, and a query has no id"


def test_claude_reads_its_plan_windows_from_its_status_line(tmp_path, monkeypatch):
    home = tmp_path / "home"
    home.mkdir()
    monkeypatch.setenv("HOME", str(home))
    assert Claude().usage(Path("/x/abc-1.jsonl")) is None, "Claude with nothing from its status line reports no windows"
    (home / ".journal" / "claude-status").mkdir(parents=True)
    (home / ".journal" / "claude-status" / "abc-1.json").write_text(json.dumps({"session_id": "abc-1", "rate_limits": {
        "five_hour": {"used_percentage": 37.5, "resets_at": 1789900000},
        "seven_day": {"used_percentage": 12, "resets_at": "2026-09-25T10:00:00Z"}}}))
    assert Claude().usage(Path("/x/abc-1.jsonl")) == {"windows": [
        {"key": "five_hour", "label": "5h", "used": 37.5, "minutes": 300, "resets": 1789900000},
        {"key": "seven_day", "label": "7d", "used": 12.0, "minutes": 10080, "resets": 1790330400}]}, \
        "Claude's plan windows come from what its status line was told, in the same shape as Codex's"
    script = Path(__file__).resolve().parents[3] / "claude-status.sh"
    subprocess.run(["sh", str(script)], input=json.dumps({"session_id": "live-2", "rate_limits": {"five_hour": {"used_percentage": 50, "resets_at": 1}}}),
                   text=True, timeout=10, env={"HOME": str(home)})
    assert json.loads((home / ".journal" / "claude-status" / "live-2.json").read_text())["rate_limits"]["five_hour"]["used_percentage"] == 50, \
        "the status-line script keeps what Claude hands it, under the session's name"
