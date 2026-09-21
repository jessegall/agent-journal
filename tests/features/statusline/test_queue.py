import pytest

import features
from features.statusline.feature import bar
from features.statusline.group import grouped, ran
from features.statusline.queue import CLOCK_AFTER, DRAINING, FLIP_EVERY, HOLD, LINGERS, MOST
from features.statusline.queue import queue as messages

NOW = 1_000_000.0


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def shell(what, at=NOW, **more):
    return {"what": what, "tool": "Bash", "at": at, **more}


def used(tool, subject, at=NOW, **more):
    return {"what": f"using {subject}", "tool": tool, "subject": subject, "at": at, **more}


def read(name, at=NOW, **more):
    return {"what": f"reading {name}", "tool": "Read", "files": [name], "at": at, "effect": "reads", **more}


def edit(name, at=NOW, **more):
    return {"what": f"editing {name}", "tool": "Edit", "files": [name], "at": at, "effect": "writes", **more}


def queue(commands, now=NOW):
    return messages(grouped(ran(list(commands))), now)


def said(commands, now=NOW):
    return [[p["value"] for p in one["parts"]] for one in queue(list(commands), now)]


def coloured(commands, now=NOW):
    return [[(p["value"], p["color"]) for p in one["parts"]] for one in queue(list(commands), now)]


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


def test_every_space_is_a_part_and_only_the_part_that_differs_rolls():
    assert said([read("Screenshot 2026-09-20 at 15.40.08.png")]) == [["viewing", "Screenshot 2026-09-20 at 15.40.08.png"]], \
        "a file name stays one part however many spaces it has"
    assert said([shell("sed -n 88,94p providers/base.py", effect="reads")]) == [["reading", "base.py"]], \
        "a read names a path, never a flag's value"
    assert said([used("mcp__playwright__browser_evaluate", "playwright · browser evaluate")]) == \
        [["using", "playwright", "·", "browser", "evaluate"]], "every word of a name is a part of its own"
    assert said([shell("journal message read 109"), shell("journal message read 110", NOW + 1)]) == \
        [["journalling", "reading", "message", ["109", "110"]]], \
        "what two names share stands still and only the word that differs rolls"
    assert said([shell("npx prettier --write 'a b.vue'")]) == [["running", "npx", "prettier"]], "a quoted string stays one part"
    assert queue([shell("git add -A"), shell("git commit -m x", NOW + 1)], NOW)[0]["parts"][-1]["duration"] == FLIP_EVERY, \
        "the rolling part says how often"


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


def test_what_a_message_names_depends_on_what_it_is_doing():
    assert said([shell("npx prettier --write src/a.vue >/dev/null 2>&1")]) == [["running", "npx", "prettier"]], \
        "a shell command is named by its root and subcommand, with no flags or arguments"
    assert said([shell("git add -A && git commit -m x && git push")]) == [["git", "tracking", "files"]], \
        "a one-liner of several commands is named once, by the first of them"
    assert said([shell("python3 - <<'EOF'\nopen('x','w')\nEOF", effect="writes", files=["web/src/a.vue", "tests/t.py"])]) == \
        [["editing", ["a.vue", "t.py"]]], "editing names the files that actually changed, never the command that changed them"
    assert queue([shell("git mv a b", effect="writes")], NOW) == [], \
        "a write that does not know its files yet says nothing at all, rather than half of it"
    assert [[q["value"] for q in one["parts"]] for one in queue([edit("a.py", done=NOW + 1), shell("sed -i x", NOW + 2, effect="writes")], NOW + 3)] == \
        [["editing", "a.py"]], "a write still running does not add a name it does not have"
    assert [[p["value"] for p in one["parts"]] for one in queue([shell("git mv a b", effect="writes", done=NOW + 1, files=["b"])], NOW + 2)] == \
        [["editing", "b"]], "once it knows them it says so"
    assert [one["id"] for one in queue([edit("a.py"), shell("ls", NOW + 1, effect="reads")], NOW + 2)] == [NOW, NOW + 1], \
        "every message carries an id, which is when its run began"
    assert (said([shell("python3 - <<'EOF'\nopen('x','w')\nEOF", effect="writes", done=NOW + 1)]),
            said([shell("cd /x && touch a", effect="writes", done=NOW + 1)])) == \
        ([["running", "python3", "script"]], [["running", "touch", "a"]]), \
        "an edit that named no file is not editing anything: it is the command, running"
    assert said([read("t.py", changed={"added": 8, "removed": 1})]) == [["reading", "t.py"]], \
        "only editing and deleting count lines; a read that was stamped with them says nothing"
    assert (said([read("VERSION")]), said([shell("cat features/statusline/feature.py", effect="reads")]), said([shell("ls", effect="reads")])) == \
        ([["reading", "VERSION"]], [["reading", "feature.py"]], [["reading", "files"]]), \
        "reading never names the command, only what it read"
    assert said([shell("python3 tests/test_serve.py 2>&1|tail -2", effect="tests")]) == [["testing", "test_serve.py"]], \
        "a test run names its subject, never its runner"
    assert said([edit("x.py"), edit("x.py", NOW + 1)]) == [["editing", "x.py"]], "the same name twice in a run is named once"
    assert len(queue([edit(f"f{i}.py", NOW + i) for i in range(40)], NOW)[0]["parts"][1]["value"]) == MOST, "only the last names are kept"
    assert said([edit("a-name-far-longer-than-any-status-bar-would-ever-show.py")])[0][1] == \
        "a-name-far-longer-than-any-status-bar-wou…", "a name too long to show is cut with an ellipsis"


def test_lines_changed_count_up_they_do_not_roll():
    assert [q["value"] for q in queue([edit("a.py", changed={"added": 5, "removed": 1}, done=NOW + 1),
                                        edit("b.py", NOW + 2, changed={"added": 7, "removed": 0}, done=NOW + 3),
                                        edit("c.py", NOW + 4, changed={"added": 2, "removed": 4})], NOW + 5)[0]["parts"][2:]] == \
        [[5, 12, 14], [1, 1, 5]], "the counts climb with the file being shown, one step per name"
    assert queue([edit("a.vue", changed={"added": 10, "removed": 4}), edit("b.py", NOW + 1, changed={"added": 3, "removed": 0})], NOW)[0]["parts"][2:] == \
        [{"value": [10, 13], "prefix": "+", "increments": True, "color": "green", "duration": FLIP_EVERY},
         {"value": 4, "prefix": "-", "increments": True, "color": "red"}], \
        "what a run added and removed are two parts of their own, which increment"
    assert len(queue([edit("a.vue")], NOW)[0]["parts"]) == 2, "a run that changed no lines says nothing about them"


def test_how_long_it_stays_and_what_it_reports_when_it_ends():
    assert [queue([shell("x", effect=e, files=["a.py"])], NOW)[0]["hold"] for e in ("writes", "deletes", "tests", "reads", "builds")] == \
        [HOLD, HOLD, HOLD, 0.0, 0.0], "editing, deleting and a test run hold their message; nothing else does"
    assert queue([edit("a.py"), edit("b.py", NOW + 1), edit("c.py", NOW + 2)], NOW)[0]["hold"] == 3 * FLIP_EVERY, \
        "a message stays long enough to walk every name it has"
    assert [one["hold"] for one in queue([edit(f"f{i}.py", NOW + i) if i % 2 else shell(f"echo {i}", NOW + i) for i in range(24)], NOW + 30)][:2] == \
        [DRAINING, DRAINING], "a message gives way at once when the queue has backed up behind it"
    assert queue([shell("ls")], NOW)[0]["lingers"] == LINGERS, "a message with nothing to replace it lingers"
    assert [one["done"] for one in queue([edit("a.vue"), shell("git commit -m x", NOW + 1)], NOW + 2)] == [True, False], \
        "only the last message of the queue can still be running"
    assert [(one["done"], one["for"]) for one in queue([shell("ls", done=NOW + 2)], NOW + 600)] == [(True, 2)], \
        "a run that has finished is done and timed by when it finished"
    assert queue([shell("ls", done=NOW + 60)], NOW + 61)[0]["clock"] is False, \
        "a message that has finished never shows a clock, however long it took"
    assert said([used("mcp__playwright__browser_take_screenshot", "playwright · browser take screenshot"),
                 used("mcp__playwright__browser_navigate", "playwright · browser navigate", NOW + 1)]) == \
        [["using", "playwright", "·", "browser", ["take screenshot", "navigate"]]], \
        "only the tail differs when two names are not the same length"
    assert queue([shell("journal todo read 1"), shell("journal todo read 2", NOW + 19)], NOW + 20)[0]["clock"] is False, \
        "a message whose newest command has just started shows no clock"
    assert [(queue([shell("ls")], NOW + s)[0]["clock"], queue([shell("ls")], NOW + s)[0]["for"]) for s in (1, CLOCK_AFTER + 1)] == \
        [(False, 1), (True, 11)], "a clock appears once a running message has been up long enough"
    assert [queue([shell("npm run build", effect="builds", done=NOW + 2, result=r)], NOW)[0]["parts"][-1] for r in ({"ok": True}, {"ok": False})] == \
        [{"value": "built", "color": "green"}, {"value": "failed", "color": "red"}], "a build says whether it built or failed"
    assert queue([shell("pytest", effect="tests", done=NOW + 2, result={"passed": 9})], NOW)[0]["parts"][-1] == \
        {"value": "passed", "color": "green"}, "a passing test run says passed"
    assert queue([shell("pytest", effect="tests", done=NOW + 2, result={"failed": 3})], NOW)[0]["parts"][-1] == \
        {"value": "3 failed", "color": "red"}, "a failing test run says how many failed"
    assert [p["color"] for p in queue([shell("pytest", effect="tests", result={"failed": 3})], NOW)[0]["parts"]] == ["gray", "muted"], \
        "while it is still running it says nothing about the outcome"


def test_the_whole_bar_is_the_queue_and_nothing_else():
    class Row:
        commands = [read("before.py"), edit("now.py", NOW + 1)]

    assert [one["key"] for one in bar(Row(), NOW + 2)["queue"]] == ["reading before.py", "editing now.py"], "the bar is the queue"
