from controllers.types import Agents, Notices
from engine.hooks import handle
from providers import DRIVERS, PROVIDERS
from resources.base import SYSTEM
from tests.conftest import fresh


def test_a_permission_the_agent_waits_on_is_shown_in_the_chat_until_it_is_answered():
    record = fresh()
    provider = PROVIDERS["claude"]()
    hook = {"session_id": "claude-1", "tool_name": "Bash", "tool_input": {"command": "git push"}}

    def waiting():
        return [n.title for n in Notices(record, actor=SYSTEM)._standing() if n.data.get("action") == "permission"]

    handle(provider, record.root, record.env, {**hook, "hook_event_name": "PreToolUse"})
    assert waiting() == [], "a tool use alone asks for nothing"
    handle(provider, record.root, record.env, {**hook, "hook_event_name": "PermissionRequest"})
    assert waiting() == ["Waiting for permission - Bash git push"], "the prompt is shown, naming the call"
    assert Agents(record, actor=SYSTEM).by_session("claude-1").asking["tool"] == "Bash"
    handle(provider, record.root, record.env, {**hook, "hook_event_name": "PostToolUse"})
    assert waiting() == [], "the call ran: the notice goes"


def test_the_skip_switch_restarts_in_the_same_conversation_with_the_flag():
    claude = DRIVERS["claude"]
    assert claude.resumed(claude.skipping(["-c", "--model", "opus"], True), "abc") == \
        ["--dangerously-skip-permissions", "--model", "opus", "--resume", "abc"], "skip on, resumed in place of continue"
    assert claude.skipping(["--dangerously-skip-permissions", "x"], False) == ["x"], "skip off drops the flag"
    from features.work_tracking.auto import launch_args
    typed = fresh()
    assert (launch_args(typed, "claude", ["--dangerously-skip-permissions"]), typed.setting("permission_prompts", {}).get("skip")) == \
        (["--dangerously-skip-permissions"], True), "a flag typed at launch passes through and turns the switch on"
    assert launch_args(typed, "claude", []) == ["--dangerously-skip-permissions"], "so the next launch carries it by itself"
    assert DRIVERS["codex"].skipping(["x"], True) == ["--dangerously-bypass-approvals-and-sandbox", "x"], "Codex runs its commands without asking"
