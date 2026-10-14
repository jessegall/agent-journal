from framework.agent_types import written
from tests.conftest import fresh


def test_the_researcher_planner_and_debugger_are_written_for_each_agent_and_none_can_write():
    record = fresh()
    project = record.root.parent
    (project / ".claude").mkdir(exist_ok=True)
    (project / ".codex").mkdir(exist_ok=True)
    record.set_setting("agent_profiles", {"profile_model": {"claude": "sonnet", "codex": "gpt-6-sol"}})
    profiles = {(f.stem, f.suffix): f.read_text() for f in written(project, record)}
    names = ("researcher", "planner", "debugger")
    assert all((name, ".md") in profiles and (name, ".toml") in profiles for name in names), "each profile is written for Claude and for Codex"
    assert all("model: sonnet" in profiles[name, ".md"] and 'model = "gpt-6-sol"' in profiles[name, ".toml"] for name in names), \
        "each runs on the model Settings chose for its agent"
    claude_tools = [line for name in names for line in profiles[name, ".md"].splitlines() if line.startswith("tools:")]
    assert not any(word in tools for tools in claude_tools for word in ("Bash", "Edit", "Write")), "no profile can run a shell or change a file"
    assert all('sandbox_mode = "read-only"' in profiles[name, ".toml"] for name in names), "and Codex runs each in a read-only sandbox"
