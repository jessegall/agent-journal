import features
from controllers.types import Agents, Messages
from features.triggers.controller import Triggers
from providers.payload import ToolUse
from tests.conftest import fresh
from tests.kit import nudges, report


def call(command: str) -> ToolUse:
    return ToolUse.read({"tool_name": "Bash", "tool_input": {"command": command}})


def fired(record, command: str) -> str:
    from features import FEATURES
    from features.parts import AgentContext
    from features.triggers.handlers import WatchWhatTheAgentDoes
    feature = FEATURES["triggers"]
    agent = Agents(record, actor="system").by_session("claude-1")
    return WatchWhatTheAgentDoes().intercept(AgentContext.of(feature, record, agent), call(command))


def test_a_trigger_denies_a_command_and_nudges_on_a_word():
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    Triggers(record, actor="user").create("no force pushes", text="force pushing rewrites the shared history",
                                          **{"words": ["--force"], "does": "deny", "words_in": "commands"})
    Triggers(record, actor="user").create("mind the migrations", text="run the migration test after touching them",
                                          **{"words": ["migration"], "does": "nudge"})
    assert "no force pushes" in fired(record, "git push --force origin main"), "a deny refuses the call with its reason"
    assert fired(record, "grep migration engine") == "", "a nudge lets the call through"
    assert [n for n in nudges(record) if "mind the migrations" in n], "and says its line to the agent"


def test_a_trigger_fires_on_what_the_user_writes():
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    Triggers(record, actor="user").create("ship it", text="run the suite before the release", **{"words": ["release"]})
    Messages(record, actor="user").create("time for a release")
    assert [n for n in nudges(record) if "ship it" in n], "the user's own words fire it too"
