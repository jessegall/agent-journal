import sys
from contextlib import chdir
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from engine.hooks import handle  # noqa: E402
from engine.queries import start_block  # noqa: E402
from features.law.policy import BEGIN, brief  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
law = features.FEATURES["law"]
check("the law is fixed on", (law.enabled(record), law.describe()["fixed"]), (True, True))
record.features = {"law": False}
check("a setting cannot switch the law off", law.enabled(record), True)
check("every start carries both laws", all(name in start_block(record) for name in ("L1", "L2")), True)

project = record.root.parent
(project / "CLAUDE.md").write_text("# Kept\n")
check("the briefing writes both agent files", [f.name for f in brief(project)], ["AGENTS.md", "CLAUDE.md"])
check("the briefing preserves project text", (project / "CLAUDE.md").read_text().startswith("# Kept\n"), True)
(project / "relative").mkdir()
with chdir(project / "relative"):
    brief(Path("."))
check("a relative project path still names its briefing", (project / "relative" / "AGENTS.md").read_text().splitlines()[0], f"# {(project / 'relative').name}")
(project / "CLAUDE.md").write_text((project / "CLAUDE.md").read_text().replace("least expensive", "edited"))
brief(project)
check("the managed block is restored once", ((project / "CLAUDE.md").read_text().count(BEGIN), "edited" in (project / "CLAUDE.md").read_text()), (1, False))

cases = (("claude", "Agent", {"subagent_type": "general-purpose", "model": "sonnet"}),
         ("claude", "Agent", {"subagent_type": "Explore"}),
         ("codex", "collaboration.spawn_agent", {"task_name": "general", "model": "gpt-5.6-luna"}),
         ("codex", "collaboration.spawn_agent", {"task_name": "search_history"}))
for name, tool, given in cases:
    result = handle(PROVIDERS[name](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": f"{name}-law", "tool_name": tool, "tool_input": given})
    check(f"{name}: the law refuses an invalid dispatch", result.get("decision"), "block")

allowed = (("claude", "Agent", {"subagent_type": "Explore", "model": "haiku"}),
           ("codex", "collaboration.spawn_agent", {"task_name": "search_history", "model": "gpt-5.6-luna"}))
for name, tool, given in allowed:
    result = handle(PROVIDERS[name](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": f"{name}-law", "tool_name": tool, "tool_input": given})
    check(f"{name}: a bounded dispatch with a model goes through", result, {})

done()
