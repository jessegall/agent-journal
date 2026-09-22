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
    typed.set_setting("permission_prompts", {"skip": False})
    assert (launch_args(typed, "claude", ["--dangerously-skip-permissions"]), typed.setting("permission_prompts", {}).get("skip")) == \
        (["--dangerously-skip-permissions"], True), "a flag typed at launch passes through and turns the switch back on"
    assert launch_args(typed, "claude", []) == ["--dangerously-skip-permissions"], "so the next launch carries it by itself"
    assert launch_args(fresh(), "claude", []) == ["--dangerously-skip-permissions"], "a project that never set the switch runs without prompts"
    off = fresh()
    off.set_setting("permission_prompts", {"skip": False})
    assert launch_args(off, "claude", ["--model", "opus"]) == ["--model", "opus"], "switched off in Settings, no flag is added"
    assert DRIVERS["codex"].skipping(["x"], True) == ["--dangerously-bypass-approvals-and-sandbox", "x"], "Codex runs its commands without asking"


def test_every_flag_typed_at_launch_reaches_the_agent_whatever_the_switch_says():
    from providers import DRIVERS
    from features.work_tracking.auto import launch_args
    for name, driver in DRIVERS.items():
        typed = ["--model", "opus", "--some-flag", "value", *driver.SKIP_ARGS]
        for skip in (True, False):
            record = fresh()
            record.set_setting("permission_prompts", {"skip": skip})
            given = launch_args(record, name, typed)
            assert all(arg in given for arg in typed), f"{name}, switch {'on' if skip else 'off'}: every typed flag is passed on"
            assert given[given.index("--model"):given.index("--model") + 4] == typed[:4], f"{name}: in the order they were typed"


def test_the_start_asks_about_permission_prompts_only_when_the_flag_is_not_typed():
    from commands.queries import asked_prompts
    record = fresh()
    asked = []
    asked_prompts(record, "claude", ["--dangerously-skip-permissions"], ask=lambda _: asked.append(1) or "", answering=True)
    assert asked == [], "a typed flag is the answer already"
    asked_prompts(record, "claude", [], ask=lambda _: "2", answering=True)
    assert record.setting("permission_prompts", {}).get("skip") is False, "No keeps the prompts, and is remembered"


def test_claude_is_kept_out_of_the_record_files_but_not_their_attachments(tmp_path):
    from providers import PROVIDERS
    from providers.claude import RECORD_FILES
    claude = PROVIDERS["claude"]()
    claude.save(tmp_path, {"permissions": {"deny": ["Read(./.env)"]}})
    claude.wire(tmp_path, f"sh {tmp_path}/.journal/src/hook.sh claude {tmp_path}/.journal")
    claude.wire(tmp_path, f"sh {tmp_path}/.journal/src/hook.sh claude {tmp_path}/.journal")
    deny = claude.settings(tmp_path)["permissions"]["deny"]
    assert deny == ["Read(./.env)", *RECORD_FILES], "rows are denied once, beside what the project already denied"
    assert all("*/*.md" in rule for rule in RECORD_FILES), "only the row files: an attached picture a folder deeper stays readable"
