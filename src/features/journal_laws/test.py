from contextlib import chdir
from pathlib import Path


import features
from engine.hooks import handle
from engine.queries import start_block
from features.journal_laws.policy import BEGIN, brief
from providers import PROVIDERS
from tests.conftest import fresh


def test_the_law_is_fixed_on_and_carried_by_every_start():
    record = fresh()
    law = features.FEATURES["journal_laws"]
    assert (law.enabled(record), law.describe()["fixed"]) == (True, True), "the law is fixed on"
    record.features = {"journal_laws": False}
    assert law.enabled(record) is True, "a setting cannot switch the law off"
    assert all(name in start_block(record) for name in ("L1", "L2", "L3")) is True, "every start carries every law"


def test_the_briefing_writes_both_agent_files_preserving_project_text(tmp_path):
    record = fresh()
    project = record.root.parent
    (project / "CLAUDE.md").write_text("# Kept\n")
    assert [f.name for f in brief(project)] == ["AGENTS.md", "CLAUDE.md"], "the briefing writes both agent files"
    assert (project / "CLAUDE.md").read_text().startswith("# Kept\n") is True, "the briefing preserves project text"
    (project / "relative").mkdir()
    with chdir(project / "relative"):
        brief(Path("."))
    assert (project / "relative" / "AGENTS.md").read_text().splitlines()[0] == f"# {(project / 'relative').name}", \
        "a relative project path still names its briefing"
    (project / "CLAUDE.md").write_text((project / "CLAUDE.md").read_text().replace("least expensive", "edited"))
    brief(project)
    assert ((project / "CLAUDE.md").read_text().count(BEGIN), "edited" in (project / "CLAUDE.md").read_text()) == (1, False), \
        "the managed block is restored once"


def test_the_law_refuses_an_unbounded_dispatch_and_allows_a_bounded_one():
    record = fresh()
    cases = (("claude", "Agent", {"subagent_type": "general-purpose", "model": "sonnet"}),
             ("claude", "Agent", {"subagent_type": "Explore"}),
             ("codex", "collaboration.spawn_agent", {"task_name": "general", "model": "gpt-5.6-luna"}),
             ("codex", "collaboration.spawn_agent", {"task_name": "search_history"}),
             ("codex", "collaboration.spawn_agent", {"agent_type": "default", "model": "gpt-5.6-luna"}),
             ("codex", "collaboration.spawn_agent", {"agent_type": "risk_reviewer"}))
    for name, tool, given in cases:
        result = handle(PROVIDERS[name](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": f"{name}-law", "tool_name": tool, "tool_input": given})
        assert result.get("decision") == "block", f"{name}: the law refuses an invalid dispatch"

    allowed = (("claude", "Agent", {"subagent_type": "Explore", "model": "haiku"}),
               ("codex", "collaboration.spawn_agent", {"task_name": "search_history", "model": "gpt-5.6-luna"}),
               ("codex", "collaboration.spawn_agent", {"agent_type": "risk_reviewer", "model": "gpt-5.6-luna"}))
    for name, tool, given in allowed:
        result = handle(PROVIDERS[name](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": f"{name}-law", "tool_name": tool, "tool_input": given})
        assert result == {}, f"{name}: a bounded dispatch with a model goes through"


def test_a_law_is_whispered_on_its_keyword_and_the_largest_result_is_named_once():
    from controllers.types import Nudges
    record = fresh()
    claude = PROVIDERS["claude"]()
    call = {"session_id": "claude-1", "tool_name": "Bash", "tool_input": {"command": "cat features/parts.py"}}
    handle(claude, record.root, record.env, {**call, "hook_event_name": "PreToolUse"})
    assert [n.title for n in Nudges(record).all() if n.title.startswith("law L3")], "a keyword whispers its law"
    for size in (30_000, 25_000, 40_000, 1_000):
        handle(claude, record.root, record.env, {**call, "hook_event_name": "PostToolUse", "tool_response": {"stdout": "x" * size}})
    named = [n.title for n in Nudges(record).all() if "the largest this session" in n.title]
    assert [title.split(" characters")[0].split()[-1] for title in named] == ["30,014", "40,014"], "only a new largest result is named"


def test_a_dispatch_is_an_event_a_plugin_can_cancel_even_when_the_laws_allow_it():
    from controllers.types import Plugins
    from features import load
    from features.plugins.source import folder, home
    from resources.base import SYSTEM
    load()
    record = fresh()
    where = folder(record.root, "quiet")
    home(record.root).mkdir(parents=True, exist_ok=True)
    where.mkdir(parents=True, exist_ok=True)
    (where / "cancel.sh").write_text("cat > /dev/null; echo '{\"cancel\": \"no subagents during the demo\"}'")
    Plugins(record, actor=SYSTEM).create("quiet", enabled=True, token="t0ken", settings={}, manifest={"name": "quiet", "cancels": {"agent.dispatching": "sh cancel.sh"}})
    hook = lambda tool, given: handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "claude-cancel", "tool_name": tool, "tool_input": given})
    refused = hook("Agent", {"subagent_type": "Explore", "model": "haiku"})
    assert refused.get("decision") == "block" and "no subagents during the demo" in refused.get("reason", ""), refused
    assert hook("Read", {"file_path": "a.py"}).get("decision") != "block", "only the dispatch is asked about"


def test_reading_a_long_file_whole_is_refused_and_a_range_or_a_short_file_passes():
    from features import load
    load()
    record = fresh()
    project = record.root.parent
    (project / "long.py").write_text("x = 1\n" * 400)
    (project / "short.py").write_text("x = 1\n" * 20)
    hook = lambda tool, given: handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "claude-read", "tool_name": tool,
                                                                                        "cwd": str(project), "tool_input": given})
    whole = hook("Read", {"file_path": str(project / "long.py")})
    assert whole.get("decision") == "block" and "has 400 lines: read a range (offset and limit)" in whole.get("reason", ""), whole
    from controllers.types import Agents
    card = Agents(record).by_session("claude-read").data["cards"][-1]
    assert card["label"] == "Refused reading a long file whole" and "has 400 lines" in card["detail"], card
    assert hook("Read", {"file_path": str(project / "long.py"), "offset": 1, "limit": 50}).get("decision") != "block", "a range passes"
    assert hook("Read", {"file_path": str(project / "short.py")}).get("decision") != "block", "a short file passes whole"
    cat = hook("Bash", {"command": "cat long.py"})
    assert cat.get("decision") == "block" and "print a range with sed -n" in cat.get("reason", ""), cat
    assert hook("Bash", {"command": "cat long.py | head -20"}).get("decision") != "block", "a cat already cut short passes"


def test_a_long_command_output_keeps_its_ends_and_the_whole_of_it_as_an_output_row(tmp_path):
    import subprocess
    import sys
    from pathlib import Path
    from engine.terminal import output_cap
    from features import load
    from features.journal_laws.controller import Outputs
    from providers import PROVIDERS
    load()
    record = fresh()
    src = Path(__file__).resolve().parents[2]
    shim = tmp_path / "journal"
    shim.write_text(f'#!/bin/sh\nexec "{sys.executable}" "{src / "journal.py"}" --root "{record.root}" --env "{record.env}" "$@"\n')
    shim.chmod(0o755)
    from controllers.types import Agents
    agent = Agents(record).by_session("session-1")
    env = {"PATH": f"{tmp_path}:/usr/bin:/bin", "JOURNAL_OUTPUT_LINES": "3", "JOURNAL_OUTPUT_DIR": str(tmp_path / "outputs"),
           **PROVIDERS["claude"]().shell_wrapper(src / "output_cap.sh"), "JOURNAL_PROVIDER": "claude", "CLAUDE_CODE_SESSION_ID": "session-1"}
    wrapped = "source /dev/null 2>/dev/null || true && eval 'seq 1 1000; echo '\"'\"'done'\"'\"' >/dev/null; exit 3' < /dev/null && pwd -P >| /dev/null"
    ran = subprocess.run([str(src / "output_cap.sh"), wrapped], capture_output=True, text=True, env=env, timeout=30)
    assert (ran.returncode, ran.stdout.splitlines()[:3], ran.stdout.splitlines()[-3:]) == (3, ["1", "2", "3"], ["998", "999", "1000"]), ran.stdout + ran.stderr
    cut = ran.stdout.splitlines()[3]
    assert "994 lines cut here" in cut and "output 1," in cut, cut
    row = Outputs(record).load(1)
    kept = Path(cut.split(" at ", 1)[1].split(": grep", 1)[0])
    assert (row.title, row.data["lines"], kept.read_text().split()) == ("seq 1 1000; echo 'done' >/dev/null; exit 3", 1000, [str(i) for i in range(1, 1001)]), row
    card = Agents(record).load(agent.n).data["cards"][-1]
    assert card["label"] == "Cut 994 of 1,000 lines from a long output, kept whole as output 1" and card["detail"] == row.title, card
    short = subprocess.run([str(src / "output_cap.sh"), "seq 1 5"], capture_output=True, text=True, env=env, timeout=20)
    assert short.stdout.split() == ["1", "2", "3", "4", "5"] and Outputs(record).numbers() == [1], "short output passes whole and keeps no row"
    Outputs(record).force_delete(1)
    assert not kept.exists(), "a pruned output takes its file with it"
    launched = output_cap(record.root, record.env, PROVIDERS["claude"]())
    assert launched["JOURNAL_PROVIDER"] == "claude" and launched["CLAUDE_CODE_SHELL_PREFIX"] == str(record.root / "src" / "output_cap.sh") and launched["JOURNAL_OUTPUT_LINES"] == "200", launched
    assert output_cap(record.root, record.env, PROVIDERS["codex"]()) == {}, "codex has no shell prefix and caps its own output"
    record.set_setting("journal_laws", {"output_lines": 0})
    assert output_cap(record.root, record.env, PROVIDERS["claude"]()) == {}, "0 keeps every line"


def test_codex_reading_a_long_file_whole_through_its_shell_is_refused_too():
    from features import load
    load()
    record = fresh()
    project = record.root.parent
    (project / "long.py").write_text("x = 1\n" * 400)
    hook = lambda tool, given: handle(PROVIDERS["codex"](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "codex-read", "tool_name": tool,
                                                                                       "cwd": str(project), "tool_input": given})
    for tool, given in (("exec", {"input": "cat long.py"}), ("exec_command", {"cmd": "cat long.py"}), ("shell", {"command": ["cat", "long.py"]})):
        refused = hook(tool, given)
        assert refused.get("decision") == "block" and "print a range with sed -n" in refused.get("reason", ""), (tool, refused)
    assert hook("exec", {"input": "sed -n '1,50p' long.py"}).get("decision") != "block", "a range passes"
