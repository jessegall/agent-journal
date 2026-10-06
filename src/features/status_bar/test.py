import time

from features.status_bar.group import grouped, ran
from features.status_bar.queue import queue as messages
from features.status_bar.queue import HOLD
from features.status_bar.bar import bar, current
from tests.conftest import fresh, refused


NOW = 1_000_000.0


def shell(command, at=NOW, **more):
    return {"command": command, "tool": "Bash", "at": at, **more}


def edit(name, at=NOW, **more):
    return {"command": f"editing {name}", "tool": "Edit", "files": [name], "at": at, "effect": "writes", **more}


def queue(commands, now=NOW):
    return messages(grouped(ran(list(commands))), now)


def text(commands, now=NOW):
    return [[p["value"] for p in one["parts"]] for one in queue(list(commands), now)]


def used(tool, subject, at=NOW, **more):
    return {"command": f"using {subject}", "tool": tool, "subject": subject, "at": at, **more}


def read(name, at=NOW, **more):
    return {"command": f"reading {name}", "tool": "Read", "files": [name], "at": at, "effect": "reads", **more}


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
    assert [text([{"command": f"reading {f}", "tool": "Read", "at": NOW, "effect": "reads", "files": [f]}])[0][0] for f in ("a.png", "b.mp4")] == \
        ["viewing", "watching"], "a picture and a film have their own words"
    from features.status_bar.spoken import spoken
    assert (spoken(["todo"], [{"name": "todo", "names": {}}]), spoken(["nothing-known"], [])) == ("listing todos", "checking nothing-known"), \
        "a noun with no word after it is a listing of its rows, and an unknown one is a check"
    created = [shell("x", effect="writes", files=["a.py"], made=["a.py"])]
    assert (text(created)[0][0], queue(created, NOW)[0]["hold"]) == ("creating", HOLD), \
        "creating has its own word and holds its line like editing"
    assert [text([shell("x", effect=e, files=["a.py"])])[0][0] for e in ("writes", "reads", "deletes", "tests", "installs", "builds", "")] == \
        ["editing", "reading", "deleting", "testing", "installing", "building", "running"], "every kind has its own verb"
    assert text([shell("journal question answer 10"), shell("journal todo add 12", NOW + 1), shell("journal work log 12 x", NOW + 2)]) == \
        [["journalling", ["answering", "adding", "logging"], ["question", "todo", "work"], ["10", "12", "12"]]], \
        "a run of journal commands is one message whose every column rolls on its own"
    assert coloured([shell("journal message read 601")])[0][:2] == [("journalling", "gray"), ("reading", "muted")], \
        "a journal command is rooted under journalling and what it did there is muted"
    assert [text([shell(command)]) for command in ("python3 tools/build.py", "node", "bash <<EOF\necho\nEOF")] == \
        [[["running", "python3", "build.py"]], [["running", "node"]], [["running", "bash", "script"]]], \
        "a program that runs a script is named with the script, and a typed-in script is only called one"
    assert coloured([edit("a.py", changed={"added": 3, "removed": 1}), edit("a.py", NOW + 1, changed={"added": 2})]) == \
        [[("editing", "gray"), ("a.py", "muted"), (5, "green"), (1, "red")]], "edits of one file add up what was added and removed in green and red"
    assert coloured([edit("a.py", changed={"added": 3}), edit("b.py", NOW + 1, changed={"removed": 2})])[0][2:] == [([3, 6], "green"), ([0, 2], "red")], \
        "edits of two files roll the running totals from one to the next"
    from features.status_bar.shell import parsed
    roots = lambda command: [(piece.root, piece.args) for piece in parsed(command)]
    assert roots("timeout 10 perl -e x git status") == [("git status", ())] and roots("env FOO=1 nice -n 5 git log") == [("git log", ())] \
        and roots("sudo -u me --preserve git pull") == [("git pull", ())], "a command is named by what a wrapper runs, however the wrapper is told to behave"
    assert roots('echo "a\\" b" && git add x') == [("git add", ("x",))] and roots("a=1; echo $a $b") == [], \
        "a quoted separator does not split a command, and a command that only talks or sets a name is nothing to show"
    assert roots("git commit -m a\\ b") == [("git commit", ("a\\ b",))] and roots("git log $(git rev-parse HEAD) && ls") == [("git log", ()), ("ls", ())] \
        and roots("nohup nice -n 5 timeout 10 pytest -q") == [("pytest", ())] and roots("perl -e 'print 1' git status") == [("git status", ())], \
        "an escaped space stays in its word, a command inside another's arguments is not counted, and wrappers with their own arguments are skipped"
    assert roots("x=$(git rev-parse HEAD); git show $x") == [("git rev-parse", ("HEAD",)), ("git show", ())] \
        and roots("(git push) | tail -3") == [("git push", ())] and roots("for f in a; do npm run build; done") == [("npm run build", ())], \
        "a command inside a capture, a group or a loop is found, and a filter after it is left out"


def test_the_whole_bar_is_the_queue_and_nothing_else():
    class Row:
        commands = [read("before.py"), edit("now.py", NOW + 1)]

    assert [one["key"] for one in bar(Row(), NOW + 2)["queue"]] == ["reading before.py", "editing now.py"], "the bar is the queue"


def test_a_terminal_answering_a_query_is_not_the_user_typing():
    from supervisor import typing
    assert (typing(b"\x1bP>|iTerm2 3.5\x1b\\"), typing(b"\x1b]11;rgb:1616/1818/1d1d\x07"), typing(b"a")) == (False, False, True), \
        "a version or colour reply comes in on the keyboard but holds nothing"


def test_every_viewer_is_handed_the_whole_queue_and_keeps_its_own_place():
    record = fresh()
    queue = [{"at": 1.0, "done": True}, {"at": 2.0, "done": True}, {"at": time.time(), "done": False}]
    record.state("status_bar").set("bar", {"queue": queue})
    assert current(record)["queue"] == current(record)["queue"] == queue, "no tab's reading moves another tab's place in the queue"


def test_a_model_change_is_typed_into_the_terminal_whole_and_raw(monkeypatch):
    import os
    from engine import runtime
    from tests.kit import engine_module
    from providers.drivers import MARK
    from tests.kit import Engine
    from engine.stored import write_json
    from providers import DRIVERS
    from agents import control
    from tests.kit import report
    record = fresh()
    report(record, "idle", "Stop")
    engine = Engine(record, DRIVERS["claude"](record, "claude-1"))
    typed = []
    monkeypatch.setattr(engine.agent.driver, "_wrote", lambda raw: typed.append(raw) or True)
    monkeypatch.setattr(engine_module.time, "sleep", lambda seconds: None)
    seat = runtime.session_file(record.root, "claude-1", "seat.json")
    write_json(seat, {"at": time.time(), "agent": "claude", "env": record.env, "report": {"title": "claude-1", "provider": "claude"}})
    os.utime(seat, None)
    monkeypatch.setattr(control, "choice", lambda provider, action, value, model: {"label": "Luna", "commands": ["/model", "\x1b[B\x1b[B", ""]})
    control.request(record.root, record.env, "claude-1", "model", "luna")
    assert engine.shelled() == "", "the terminal box's reader leaves a model or effort change alone"
    assert engine.control(stopped=True) == "controlled: Luna"
    entered = [raw for raw in typed if raw.strip(b"\x05\x15\x7f")]
    assert entered == [b"/model", b"\r", b"\x1b[B\x1b[B", b"\r", b"\r"] and not any(MARK.encode() in raw for raw in typed), \
        "every step of a picker is typed in order, raw, with no journal mark, and none is dropped"
    monkeypatch.setattr(control, "choice", lambda provider, action, value, model: {"label": value, "command": f"/{action} {value}"})
    monkeypatch.setattr(engine.agent, "state", lambda: "busy")
    control.request(record.root, record.env, "claude-1", "model", "haiku")
    control.request(record.root, record.env, "claude-1", "effort", "low")
    engine.controlled_at = 0.0
    assert (engine.control(), engine.control()) == ("controlled: low", ""), "Claude's effort is typed while it works; a model waits for its turn to end"


def test_a_paused_agent_and_its_subagents_have_every_tool_call_refused():
    from controllers.types import Agents
    from tests.kit import PAUSED, handle
    from providers import PROVIDERS
    record, claude = fresh(), PROVIDERS["claude"]()
    call = {"session_id": "claude-1", "tool_name": "Bash", "tool_input": {"command": "ls"}, "hook_event_name": "PreToolUse"}
    handle(claude, record.root, record.env, call)
    agents = Agents(record)
    agents.update(agents.by_session("claude-1").n, paused=time.time())
    refused = lambda asked: handle(claude, record.root, record.env, asked).get("reason")
    assert (refused(call), refused({**call, "agent_id": "sub-1"})) == (PAUSED, PAUSED), "the agent and its subagents stand still while paused"
    agents.update(agents.by_session("claude-1").n, paused=0)
    assert refused(call) != PAUSED, "resuming lets tool calls through again"
    import features
    features.load()
    loop = {"session_id": "claude-1", "hook_event_name": "PostToolUse", "tool_name": "CronCreate",
            "tool_input": {"cron": "7,22,37,52 * * * *", "prompt": "Check the ticket agents"}, "tool_response": {"id": "749f34bc"}}
    handle(claude, record.root, record.env, loop)
    assert agents.by_session("claude-1").data["loops"]["749f34bc"]["schedule"] == "7,22,37,52 * * * *", "a loop the agent schedules is kept on its row"
    handle(claude, record.root, record.env, {**loop, "tool_name": "CronDelete", "tool_input": {"id": "749f34bc"}, "tool_response": {}})
    assert agents.by_session("claude-1").data["loops"] == {}, "and dropped when it deletes it"
    tests = {"session_id": "claude-1", "tool_name": "Bash", "tool_input": {"command": "pytest -q"}, "hook_event_name": "PreToolUse"}
    handle(claude, record.root, record.env, tests)
    marks = lambda: [(card["label"], card["state"]) for card in agents.by_session("claude-1").data.get("cards", []) if card.get("key", "").startswith("tests:")]
    assert marks() == [("Running tests", "running")], "a test run shows as a mark while it runs"
    handle(claude, record.root, record.env, {**tests, "hook_event_name": "PostToolUse", "tool_response": {"stdout": "3 passed, 1 failed in 0.2s"}})
    assert marks() == [("Tests failed", "failed")], "and turns red in place when a test fails"


def test_claudes_status_line_payload_is_kept_and_read_back_as_usage_and_context(tmp_path, monkeypatch):
    import json
    import subprocess
    from pathlib import Path
    from providers import PROVIDERS
    from providers.base import HookCommand
    script = Path(__file__).resolve().parents[2] / "claude-status.sh"
    payload = {"session_id": "s-9", "context_window": {"context_window_size": 1000000},
               "rate_limits": {"five_hour": {"used_percentage": 42, "resets_at": 1791300000}}}
    env = {"PATH": "/usr/bin:/bin", "HOME": str(tmp_path), "AGENT_JOURNAL_ACTIVE": "1"}
    subprocess.run(["sh", str(script)], input=json.dumps(payload), env=env, capture_output=True, text=True, timeout=10, check=True)
    monkeypatch.setenv("HOME", str(tmp_path))
    claude = PROVIDERS["claude"]()
    usage = claude.usage(tmp_path / "s-9.jsonl")
    assert [(w.key, w.used, w.resets) for w in usage] == [("five_hour", 42.0, 1791300000)], "the status line's rate limits come back as usage windows"
    assert claude.reported(tmp_path / "s-9.jsonl", "context_window") == {"context_window_size": 1000000}, "and its context window size"
    from features.status_bar.usage import observe
    kept = observe("claude", str(tmp_path / "s-9.jsonl"), {}, now=1791200000)
    assert [w["key"] for w in kept["windows"]] == ["five_hour"], "a window that has not reset yet is kept on the agent"
    assert observe("claude", str(tmp_path / "s-9.jsonl"), kept, now=1791400000) == {"windows": []}, "a window past its reset time is dropped"
    assert (observe("claude", str(tmp_path / "none.jsonl"), kept), observe("claude", str(tmp_path / "none.jsonl"), {})) == ({}, None), \
        "an agent whose usage can no longer be read has its old windows cleared, and one that never had any is left alone"
    project = tmp_path / "project"
    (project / ".claude").mkdir(parents=True)
    claude.save(project, {"statusLine": {"type": "command", "command": "my-own-status"}})
    claude.wire(project, HookCommand(tmp_path / "hook.sh", "claude", project / ".journal"))
    assert claude.settings(project)["statusLine"]["command"] == "my-own-status", "a status line the user already has is kept"
    from providers.claude import STATUS_HOME
    from providers.payload import Hook
    odd = tmp_path.joinpath(*STATUS_HOME)
    (odd / "s-10.json").write_text(json.dumps({"rate_limits": {"five_hour": {"used_percentage": 5, "resets_at": "2026-10-01T00:00:00Z"}, "seven_day": {"used_percentage": None}}}))
    (odd / "s-11.json").write_text(json.dumps({"rate_limits": {"five_hour": "none", "seven_day": {"used_percentage": 1, "resets_at": "31536000"}}}))
    assert [(w.key, w.resets) for w in claude.usage(odd / "s-10.jsonl")] == [("five_hour", 1790812800)], "a reset time given as a date is read, and a window with no use reported is passed over"
    assert [(w.key, w.resets) for w in claude.usage(odd / "s-11.jsonl")] == [("seven_day", 31536000)], "a reset time given as a number of seconds in text is read, and a window that is no object is passed over"
    assert (claude.window(Hook(transcript=tmp_path / "s-9.jsonl"), 10), claude.window(Hook(transcript=tmp_path / "none.jsonl"), 10)) == (1000000, 200000), \
        "the window the agent reports is the window; otherwise the usual one"
    shared_file = project / ".claude" / "settings.json"
    shared_file.write_text(json.dumps({"hooks": {"Stop": [{"hooks": [{"type": "command", "command": f"sh {tmp_path}/hook.sh claude {project}/.journal"}]}]},
                                       "statusLine": {"type": "command", "command": "sh /somewhere/claude-status.sh"}}))
    claude.shared(project)
    assert json.loads(shared_file.read_text()) == {}, "the journal's hooks and status line are taken out of the project's shared settings, so they live in the local ones"
    (tmp_path / ".claude" / "projects" / "p").mkdir(parents=True)
    (tmp_path / ".claude" / "projects" / "p" / "conversation-1.jsonl").write_text("")
    assert (claude.conversation_file("conversation-1").name, claude.conversation_file("nowhere")) == ("conversation-1.jsonl", None), "a conversation is found by its name among the projects' transcripts"
    from providers.claude_rows import Block
    from providers.payload import ToolCall
    assert claude.stopped({"u1": ("returned", 1.0), "u2": ("failed", 1.0)}, [ToolCall(name="TaskStop", task="t1", at=5.0), ToolCall(name="TaskStop", task="t2", at=6.0)],
                          {"u1": "t1", "u2": "t2"}) == {"u1": ("stopped", 5.0), "u2": ("failed", 1.0)}, "a task the agent stopped says so, unless it had already ended some other way"
    assert (claude.refused_by_hook(Block(is_error=True, content="PreToolUse hook error: no")), claude.refused_by_hook(Block(is_error=True, content="boom"))) == (True, False), \
        "a tool call a hook turned back is told from one that failed"
    (tmp_path / "hook.sh").write_text("")
    (project / ".journal").mkdir()
    (project / ".mcp.json").write_text(json.dumps({"mcpServers": {"journal": {"command": "/no/such/python"}}}))
    assert "which is gone" in claude.wiring_trouble(project), "a channel whose Python is gone is told so"
    (project / ".mcp.json").write_text(json.dumps({"mcpServers": {"journal": {"command": "/bin/echo"}}}))
    assert "not Python 3.10 or newer" in claude.wiring_trouble(project), "a channel whose Python is too old is told so"
    import sys
    (project / ".mcp.json").write_text(json.dumps({"mcpServers": {"journal": {"command": sys.executable}}}))
    assert claude.wiring_trouble(project) == "", "a channel whose Python runs and is new enough is no trouble"


def codex_models(*models) -> list:
    return [{"slug": slug, "display_name": slug.upper(), "visibility": "list", "supported_in_api": True, "default_reasoning_level": default,
             "supported_reasoning_levels": [{"effort": effort} for effort in efforts]} for slug, default, efforts in models]


def test_the_codex_model_and_effort_picker_moves_by_arrow_keys_and_refuses_what_the_catalog_lacks(tmp_path, monkeypatch):
    import json
    from providers import PROVIDERS
    from resources.base import Refused
    codex = PROVIDERS["codex"]
    monkeypatch.setenv("HOME", str(tmp_path))
    (tmp_path / codex.home).mkdir()
    down, up = "\x1b[B", "\x1b[A"
    (tmp_path / codex.home / "config.toml").write_text('model = "beta"\nmodel_reasoning_effort = "high"\nproject_doc_max_bytes = 4096\n')
    cache = tmp_path / codex.home / "models_cache.json"
    cache.write_text(json.dumps({"models": codex_models(("alpha", "medium", ["low", "medium", "high", "max", "ultra"]), ("beta", "high", ["low", "high"]), ("bare", "", []))}))
    options = codex.control_options("")
    assert [choice["value"] for choice in options["groups"][1]["choices"]] == ["low", "high"], "with no model named, the configured model's efforts are offered"
    assert [group["key"] for group in options["groups"][:1]] == ["model"]
    assert codex.control_choice("effort", "low", "")["commands"] == ["/model", "", up], "an effort is one key press from the current one"
    assert codex.commands_for("effort", "max", "alpha") == ["/model", "", down, ""], "max is the row after the standard ones, which the picker lists beside them"
    assert codex.commands_for("effort", "ultra", "alpha") == ["/model", "", down, down], "ultra is the one after max"
    assert codex.commands_for("model", "alpha", "beta") == ["/model", up, ""], "a model above the current one is one key up, and its own default effort needs no move"
    assert codex.commands_for("model", "bare", "beta")[:2] == ["/model", down], "a model that lists no effort is chosen without an effort step"
    assert codex.matched(codex.catalog(), "alpha-2026").slug == "alpha", "a dated name finds its model"
    assert refused(lambda: codex.control_choice("model", "nowhere", "beta")), "a model the catalog lacks is refused"
    from providers.codex import arguments_of, initial_effort
    assert (codex().dispatch_model("alpha"), codex().dispatch_model("nowhere")) == ("alpha", "beta"), "a model the catalog lacks is dispatched as the configured one"
    assert [initial_effort("effort", "ultra", ["low"], "high"), initial_effort("effort", "", ["low"], "high"), initial_effort("model", "", ["low"], ""), initial_effort("model", "", [], "")] == \
        ["", "high", "low", ""], "an effort the list lacks is not kept, and otherwise the default or the first standard one is the start"
    assert [arguments_of({"a": 1}), arguments_of("not json"), arguments_of("[1]"), arguments_of(None)] == [{"a": 1}, {}, {}, {}], "tool arguments that are no object read as none"
    assert codex.configuration(tmp_path / "missing.toml").model == "", "a configuration file that is not there names no model"
    cache.write_text("{}")
    assert codex.control_options("beta")["groups"] == [] and refused(lambda: codex.control_choice("model", "beta", "beta")), "an empty catalog offers nothing, and its choice is refused"


def test_codex_usage_comes_from_the_newest_token_count_and_its_crew_from_the_rollout(tmp_path):
    import json
    from providers.payload import Hook
    from providers.codex import Codex
    codex = Codex()
    lines = lambda *rows: "".join(json.dumps({"timestamp": "2026-10-02T10:00:00Z", **row}, separators=(",", ":")) + "\n" for row in rows)
    counted = lambda limits, used=0, window=0: {"type": "event_msg", "payload": {"type": "token_count", "rate_limits": limits, "info": {
        "last_token_usage": {"total_tokens": used}, "model_context_window": window}}}
    rollout = tmp_path / "rollout-2026-10-02T10-00-00-aaaaaaaa-0000-0000-0000-000000000001.jsonl"
    rollout.write_text(lines(counted({"primary": {"used_percent": 10, "window_minutes": 300, "resets_at": 5}}),
                             counted({"primary": {"used_percent": 20, "window_minutes": 300, "resets_at": 6},
                                      "secondary": {"usedPercent": 30, "windowDurationMins": 10080, "resetsAt": 7}}, used=50000, window=200000),
                             counted(None, used=100000, window=200000),
                             counted({"primary": {"used_percent": None}, "secondary": {"used_percent": 1, "window_minutes": 2880, "resets_at": 9}})))
    assert [(w.key, w.label, w.used, w.minutes, w.resets) for w in codex.usage(rollout)] == [("secondary", "2d", 1.0, 2880, 9)], \
        "usage is the newest count that carries limits, and a window with no figures is left out"
    rollout.write_text(lines(counted({"primary": {"used_percent": 20, "window_minutes": 300, "resets_at": 6},
                                      "secondary": {"usedPercent": 30, "windowDurationMins": 10080, "resetsAt": 7}}, used=50000, window=200000),
                             counted(None, used=100000, window=200000)))
    assert [(w.key, w.label, w.used) for w in codex.usage(rollout)] == [("primary", "5h", 20.0), ("secondary", "7d", 30.0)], "both spellings of a window are read; a count without limits is passed over"
    assert codex.context(Hook(transcript=rollout)) == 50.0 and (codex.usage(tmp_path / "none.jsonl"), codex.context(Hook(transcript=tmp_path / "none.jsonl"))) == (None, None), \
        "context is the newest count's share of its window, and a missing rollout reports nothing"
    assert [codex.window_label(m) for m in (300, 1440, 10080, 4320, 120, 45, 0)] == ["5h", "1d", "7d", "3d", "2h", "45m", "0m"]

    child = "bbbbbbbb-0000-0000-0000-000000000002"
    day = tmp_path / "2026" / "10" / "02"
    day.mkdir(parents=True)
    main = day / "rollout-2026-10-02T10-00-00-aaaaaaaa-0000-0000-0000-000000000001.jsonl"
    call = lambda name, key, **more: {"type": "response_item", "payload": {"type": "function_call", "name": name, "call_id": key, **more}}
    out = lambda key, text: {"type": "response_item", "payload": {"type": "function_call_output", "call_id": key, "output": text}}
    script = 'const a = await tools.spawn_agent({task_name: "scan", agent_type: "explorer", model: "gpt-6-sol"});'
    main.write_text(lines(call("exec", "s1", arguments=script), out("s1", json.dumps({"agent_id": child, "nickname": "Pip"})),
                          call("exec_command", "b1", arguments=json.dumps({"cmd": "sleep 99 &"})), out("b1", "Script running with cell ID 7"),
                          call("wait", "w1", arguments=json.dumps({"cell_id": "7"})), out("w1", "Script completed"),
                          {"type": "compacted", "payload": {}}))
    (day / f"rollout-2026-10-02T10-05-00-{child}.jsonl").write_text(lines({"type": "event_msg", "payload": {"type": "task_started"}}, {"type": "event_msg", "payload": {"type": "task_complete"}}))
    crew = codex.crew(main)
    subagent, = crew["subagent_rows"]
    assert (subagent["task"], subagent["type"], subagent["model"], subagent["running"], subagent["session"]) == ("scan", "explorer", "gpt-6-sol", False, child), \
        "a subagent spawned inside a script is found by its agent id, and its last task event says it finished"
    assert (crew["subagents"], crew["compacting"]) == (1, True), "the rollout ending on a compaction says the agent is compacting"
    assert codex.subagent_state(main, "cccccccc-0000-0000-0000-000000000003") == (True, 0.0), "a subagent whose rollout is not written yet is running"
    from providers.codex import SpawnedAgent
    assert (codex.spawned_session(main, SpawnedAgent("scan", "explorer", "m", "", 0.0)), codex.spawned_session(main, SpawnedAgent("scan", "explorer", "m", "", 0.0, "root/scan"))) == ("", ""), \
        "a subagent that was not given a path, or whose rollout has not been written, is not found among the sessions"
