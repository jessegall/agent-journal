from controllers.types import Agents, Notices
from tests.kit import handle
from providers import DRIVERS, PROVIDERS
from resources.base import SYSTEM
from tests.conftest import fresh


def test_a_permission_the_agent_waits_on_is_shown_in_the_chat_until_it_is_answered():
    record = fresh()
    provider = PROVIDERS["claude"]()
    hook = {"session_id": "claude-1", "tool_name": "Bash", "tool_input": {"command": "git push"}}

    def waiting():
        return [n.title for n in Notices(record, actor=SYSTEM).rows.standing() if n.data.get("action") == "permission"]

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
    from features.permission_prompts.skipping import launch_args
    typed = fresh()
    typed.set_setting("permission_prompts", {"skip": False})
    assert (launch_args(typed, "claude", ["--dangerously-skip-permissions"]), typed.setting("permission_prompts", {}).get("skip")) == \
        (["--dangerously-skip-permissions"], True), "a flag typed at launch passes through and turns the switch back on"
    assert launch_args(typed, "claude", []) == ["--dangerously-skip-permissions"], "so the next launch carries it by itself"
    assert launch_args(fresh(), "claude", []) == ["--dangerously-skip-permissions"], "a project that never set the switch runs without prompts"
    off = fresh()
    off.set_setting("features", {"work_tracking.auto": False})
    off.set_setting("permission_prompts", {"skip": False})
    assert launch_args(off, "claude", ["--model", "opus"]) == ["--model", "opus"], "switched off in Settings, no flag is added"
    codex = DRIVERS["codex"]
    assert codex.skipping(["x"], True) == ["--dangerously-bypass-approvals-and-sandbox", "x"], "Codex runs its commands without asking"
    assert codex.skipping(["--approve-for-me", "x"], True) == ["--dangerously-bypass-approvals-and-sandbox", "x"], \
        "Codex refuses approve-for-me beside the bypass, so skipping drops it"
    asked = b"\x1b[2m> Ask Codex to do anything\x1b[0m\r\nDo you trust the contents of this directory?\r\n\xe2\x80\xba 1. Yes, continue\r\n  2. No, quit"
    assert (codex.consent(asked), codex.opening(asked)) == (b"1\r", ""), "Codex's trust question is answered Yes by number, before the opening"
    assert codex.opening(b"\x1b[2m> Ask Codex to do anything\x1b[0m") == codex.OPENING, "at its empty prompt Codex is given the journal's opening line"
    assert codex.consent(asked + b"\r\n> Ask Codex to do anything") == b"", "once Codex is at its prompt, nothing more is typed into the question"
    folder = b"Folder access /p Trust this folder?\r\nCodex can read, edit, and run files here.\r\n\xe2\x80\xba 1. Trust and continue\r\n  2. Quit"
    assert codex.consent(folder) == b"1\r", "Codex 0.160 words its trust question differently, and it is answered the same way"
    screen = ("Running printf 'hi' > hello.txt\r\nWould you like to run the following command?\r\nReason: May I create hello.txt?\r\n"
              "$ printf 'hi' > hello.txt\r\n\u203a 1. Yes, proceed (y)\r\n  2. Yes, and don't ask again (p)\r\n  3. No, and tell Codex what to do differently (esc)")
    driver = codex(fresh(), "codex-ask")
    driver.printed.parent.mkdir(parents=True, exist_ok=True)
    driver.printed.write_bytes(f"\x1b[2m> Ask Codex to do anything\x1b[0m\r\nesc to interrupt\r\n{screen}".encode())
    assert (driver.asked().tool, driver.asked().call, codex.ALLOW) == ("exec_command", "printf 'hi' > hello.txt", b"y"), \
        "Codex's approval prompt is read off its screen with its command, and Allow presses y"
    driver.last_report = lambda: None
    driver.send("todo 5 next")
    assert driver.held == ["todo 5 next"], "nothing is typed into Codex while its approval prompt waits on the user; the line waits too"
    del driver.last_report
    driver.printed.write_bytes(f"{screen}\r\n\x1b[2m> Ask Codex to do anything\x1b[0m".encode())
    assert driver.asked() is None, "once the prompt is gone, nothing is asked"
    from runner.engine import Engine
    from tests.kit import report
    record = driver.record
    report(record, "working", "PreToolUse", session="codex-ask", provider="codex")
    engine, row = Engine(record, driver), lambda: Agents(record, actor=SYSTEM).by_session("codex-ask")
    calls = []
    for command in ("printf 'hi' > hello.txt", "rm hello.txt"):
        asking_screen = screen.replace("printf 'hi' > hello.txt", command)
        driver.printed.write_bytes(f"esc to interrupt\r\n{asking_screen}".encode())
        driver.reported = (float("-inf"), None)
        engine.screen_asks()
        calls.append(row().asking["call"])
    assert calls == ["printf 'hi' > hello.txt", "rm hello.txt"], "a second approval right after the first replaces the command shown in the chat"
    claude = DRIVERS["claude"]
    warning = "WARNING: Loading development channels\r\n--dangerously-load-development-channels is for local channel development only.\r\n" \
              "❯ 1. I am using this for local development\r\n  2. Exit\r\nEnter to confirm".encode()
    assert (claude.consent(warning), claude.consent(warning + "\r\n❯ ".encode())) == (b"\r", b""), \
        "Claude's development channels warning is answered with Enter while its menu is the last thing on screen, never once the prompt is back"
    update = b"\x1b[2m> Ask Codex to do anything\x1b[0m\r\nUpdate available 0.159.3 \xe2\x86\x92 0.160.0\r\n\xe2\x80\xba 1. Update now\r\n  2. Skip\r\n  3. Skip until next version"
    assert (codex.consent(update), codex.opening(update)) == (b"2\r", ""), "Codex's update question is skipped, and the opening waits until it is gone"
    assert (codex.carried_on(["continue"]), codex.carried_on(["--resume", "abc"]), codex.carried_on(["-c", "k=v"])) == \
        (["resume", "--last"], ["resume", "abc"], ["-c", "k=v"]), "Codex continues and resumes with its resume subcommand, and -c stays its config flag"
    assert codex.carried_on(codex.resumed(codex.skipping(["continue"], True), "abc")) == \
        ["resume", "abc", "--dangerously-bypass-approvals-and-sandbox"], "Codex restarts in the same conversation"


def test_every_flag_typed_at_launch_reaches_the_agent_whatever_the_switch_says():
    from providers import DRIVERS
    from features.permission_prompts.skipping import launch_args
    for name, driver in DRIVERS.items():
        typed = ["--model", "opus", "--some-flag", "value", *driver.SKIP_ARGS]
        for skip in (True, False):
            record = fresh()
            record.set_setting("permission_prompts", {"skip": skip})
            given = launch_args(record, name, typed)
            assert all(arg in given for arg in typed), f"{name}, switch {'on' if skip else 'off'}: every typed flag is passed on"
            assert given[given.index("--model"):given.index("--model") + 4] == typed[:4], f"{name}: in the order they were typed"


def test_the_start_asks_about_permission_prompts_only_when_the_flag_is_not_typed():
    from tests.kit import asked_prompts
    record = fresh()
    asked = []
    asked_prompts(record, "claude", ["--dangerously-skip-permissions"], ask=lambda _: asked.append(1) or "", answering=True)
    assert asked == [], "a typed flag is the answer already"
    asked_prompts(record, "claude", [], ask=lambda _: "2", answering=True)
    assert record.setting("permission_prompts", {}).get("skip") is False, "No keeps the prompts, and is remembered"


def test_claude_is_kept_out_of_the_record_files_but_not_their_attachments(tmp_path):
    from providers import PROVIDERS
    from providers.base import HookCommand
    from providers.claude import RECORD_FILES
    claude = PROVIDERS["claude"]()
    claude.save(tmp_path, {"permissions": {"deny": ["Read(./.env)"]}})
    hook = HookCommand(tmp_path / ".journal" / "src" / "hook.sh", "claude", tmp_path / ".journal")
    claude.wire(tmp_path, hook)
    claude.wire(tmp_path, hook)
    deny = claude.settings(tmp_path)["permissions"]["deny"]
    assert deny == ["Read(./.env)", *RECORD_FILES], "rows are denied once, beside what the project already denied"
    assert all("*/*.md" in rule for rule in RECORD_FILES), "only the row files: an attached picture a folder deeper stays readable"


def test_auto_mode_launches_each_agent_in_its_own_approval_mode():
    from features.permission_prompts.skipping import launch_args
    record = fresh()
    record.features = {**record.features, "work_tracking.auto": True}
    record.set_setting("permission_prompts", {"skip": False})
    assert launch_args(record, "claude", ["--model", "sonnet"]) == ["--dangerously-skip-permissions", "--model", "sonnet"], \
        "in auto mode Claude never stops at a permission prompt"
    assert launch_args(record, "codex", ["--model", "gpt-5"]) == ["--dangerously-bypass-approvals-and-sandbox", "--model", "gpt-5"], \
        "in auto mode Codex never stops for an approval"
    assert launch_args(record, "claude", ["--permission-mode=dontAsk"]) == ["--permission-mode=dontAsk"], \
        "an explicit Claude permission choice wins"
    assert launch_args(record, "codex", ["--ask-for-approval", "never"]) == ["--ask-for-approval", "never"], \
        "an explicit Codex approval choice wins"


def test_an_agents_controls_are_pressed_from_the_viewer_only_for_a_session_that_is_online(monkeypatch):
    import time
    import features
    from commands.http import dispatch
    from controllers.types import Agents, Notices
    from engine import runtime
    from engine.stored import write_json
    from resources.base import SYSTEM
    from tests.conftest import fresh
    features.load()
    record = fresh()
    seat = runtime.session_file(record.root, "claude-7", "seat.json")
    write_json(seat, {"at": time.time(), "agent": "claude", "env": record.env, "report": {"title": "claude-7", "provider": "claude", "model": "opus"}, "reported": {"title": "claude-7", "provider": "claude", "model": "opus"}})
    from engine.sessions import Sessions
    Sessions(record.root).bind("claude-7", record.env, provider="claude")
    Agents(record, actor=SYSTEM).create("claude-7", provider="claude", status="idle")
    post = lambda action, body=None, session="claude-7", env=None: dispatch("POST", f"/api/{env or record.env}/agent/{session}/{action}", record.root, {}, body or {})
    for action in ("force", "pause", "resume"):
        assert post(action).code == 200, f"{action} queues for a live session"
    assert post("permit", {"allow": True}).code == 200 and post("permit", {"allow": False}).code == 200, "a permission is allowed or denied from the viewer"
    assert post("shell", {"command": "  "}).code == 400, "an empty shell line is refused"
    assert post("shell", {"command": "ls", "now": True}).code == 200, "a shell line can be run at once"
    assert post("pause", session="claude-404").code == 400, "a session that is not online is refused"
    assert post("pause", env="elsewhere").code == 400, "a session of another environment is refused"
    assert (post("control", {"action": "model", "value": "opus"}).body["label"], post("control", {"action": "effort", "value": "high"}).body["label"]) == ("Opus", "High"), "a model or an effort chosen in the viewer is queued for the agent"
    assert "does not support" in post("control", {"action": "effort", "value": "bogus"}).body["error"], "a choice the agent does not offer is refused"
    controls = dispatch("GET", "/api/agent-controls/claude", record.root, {"model": "opus", "effort": "high"}, {})
    assert controls.code == 200 and controls.body["provider"] == "claude", "the controls offered are the provider's"
    assert dispatch("GET", "/api/agent-controls/nobody", record.root, {}, {}).body["groups"] == [], "an agent with no controls offers none"
