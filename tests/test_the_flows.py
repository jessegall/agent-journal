"""The journal's core flows, played the way a user and an agent play them against a real scratch journal.

Every scenario starts a real server on a port of its own, plays an agent through the routes Claude Code reaches (hooks posted as it posts them, commands
through /api/run as the CLI sends them), and asserts what the viewer reads back. Only the outside is stood in for: no Claude or Codex process runs.
"""
import http.client
import json
import threading
import time
from contextlib import contextmanager

import pytest

from engine.record import Record
from serve import Handler, JournalServer
from tests.conftest import fresh

WAIT = 15.0
ENV = "main"


class Journal:
    """A scratch journal with its server running, spoken to over HTTP as its viewer and its agents speak to it."""

    def __init__(self, record: Record, port: int):
        self.record, self.port = record, port

    def start(self) -> None:
        """The server starts, as it does when the journal is started or restarted."""
        Handler.root = self.record.root
        self.server = JournalServer(("127.0.0.1", 0), Handler)
        threading.Thread(target=self.server.serve_forever, daemon=True).start()
        self.port = self.server.server_port

    def stop(self) -> None:
        self.server.shutdown()
        self.server.server_close()

    def ask(self, method: str, path: str, body=None, raw: bytes | None = None, kind: str = "application/json"):
        data = raw if raw is not None else (json.dumps(body).encode() if body is not None else None)
        connection = http.client.HTTPConnection("127.0.0.1", self.port, timeout=WAIT)
        try:
            connection.request(method, path, body=data, headers={"Content-Type": kind} if data is not None else {})
            reply = connection.getresponse()
            text = reply.read()
            return reply.status, (json.loads(text) if reply.getheader("Content-Type", "").startswith("application/json") and text else text.decode())
        finally:
            connection.close()

    def user(self, method: str, path: str, body=None):
        """What the viewer does."""
        return self.ask(method, f"/api/{ENV}{path}", body)

    def agent(self, *words: str, session: str = "claude-1") -> tuple[int, str]:
        """A journal command the way an agent's CLI sends it."""
        code, text = self.ask("POST", f"/api/run?actor=agent&env={ENV}&session={session}", raw="\0".join(words).encode(), kind="text/plain")
        return code, text

    def hook(self, event: str, session: str = "claude-1", provider: str = "claude", **more):
        """A hook the agent's tool posts, answered as the server answers it."""
        body = {"hook_event_name": event, "session_id": session, **more}
        query = f"root={self.record.root}&pid=0&env={ENV}"
        return self.ask("POST", f"/api/hook/{provider}?{query}", body)

    def rows(self, kind: str) -> list[dict]:
        return self.user("GET", f"/{kind}")[1]["rows"]

    def seated(self, session: str = "claude-1"):
        """The engine that sits beside the agent in a real run: it carries the agent's words into the journal as the supervisor's engine does."""
        from controllers.types import Agents
        from providers import DRIVERS
        from resources.base import SYSTEM
        from runner.engine import Engine
        transcript = self.record.root / "scratch-transcript.jsonl"
        transcript.write_text(json.dumps({"type": "user", "timestamp": "2026-10-10T10:00:00Z", "message": {"content": "go"}}) + "\n")
        agents = Agents(self.record, actor=SYSTEM)
        agents.update(agents.by_session(session).n, provider="claude", transcript=str(transcript), status="working")
        engine = Engine(self.record, DRIVERS["claude"](self.record, "claude-99"))
        engine.agent.driver.last_report = lambda: agents.by_session(session)
        engine.announce_written()
        return engine

    def says(self, text: str, engine, session: str = "claude-1") -> None:
        """The agent ends its turn with these words: its Stop hook carries them, and its engine reads them."""
        self.hook("Stop", session=session, last_assistant_message=text)
        eventually(lambda: next((row["data"].get("last_message") for row in self.rows("agent") if row["title"] == session), ""), text)
        engine.announce_written()


def eventually(read, expected=True, within: float = WAIT):
    """What the server finishes after it has answered: read until it is so, or say what it was."""
    began, seen = time.time(), None
    while time.time() - began < within:
        seen = read()
        if (seen == expected) if expected is not True else bool(seen):
            return seen
        time.sleep(0.05)
    raise AssertionError(f"never became {expected!r}; last seen {seen!r}")


@contextmanager
def journal():
    record = fresh(ENV)
    running = Journal(record, 0)
    running.start()
    try:
        yield running
    finally:
        running.stop()


@pytest.fixture
def scratch():
    with journal() as running:
        yield running


def titled(rows: list[dict]) -> list[str]:
    return [row["title"] for row in rows]


def test_a_user_writes_and_the_agent_replies_to_one_message_and_to_several_at_once(scratch):
    first = scratch.user("POST", "/message", {"title": "Is the build green?", "brief": "Is the build green?"})[1]
    second = scratch.user("POST", "/message", {"title": "And the deploy?", "brief": "And the deploy?"})[1]
    third = scratch.user("POST", "/message", {"title": "Anything else?", "brief": "Anything else?"})[1]
    for sent in (first, second, third):
        assert scratch.agent("message", "read", str(sent["n"]))[0] == 200, "the agent reads what the user wrote"
    engine = scratch.seated()
    scratch.says(f"[!reply:{first['n']}] Yes, the build is green.", engine)
    replies = eventually(lambda: titled(scratch.rows("comment")), ["Yes, the build is green."])
    assert replies == ["Yes, the build is green."], "a reply tag turns the agent's words into the reply to that message"
    scratch.says(f"[!reply:{second['n']},{third['n']}] The deploy is done and nothing else is open.", engine)
    both = eventually(lambda: len(scratch.rows("comment")), 2)
    comments = scratch.rows("comment")
    linked = {row["title"]: sorted(ref for ref in row["refs"] if ref.startswith("message:")) for row in comments}
    assert both == 2 and linked["The deploy is done and nothing else is open."] == [f"message:{second['n']}", f"message:{third['n']}"], \
        "one tag naming two messages is one reply that answers both"


def test_a_to_do_filed_from_a_message_is_linked_to_it_and_shown_in_its_words(scratch):
    sent = scratch.user("POST", "/message", {"title": "Check the logs", "brief": "Please check the logs for errors"})[1]
    scratch.agent("message", "read", str(sent["n"]))
    scratch.agent("todo", "create", "Check the logs", "--brief", "from the user's message")
    scratch.agent("message", "process", str(sent["n"]), "Please check the logs for errors", "todo 1")
    message = scratch.user("GET", f"/message/{sent['n']}")[1]
    assert message["refs"] == ["todo:1"] and "chip todo:1" in message["sections"][0]["body"], "the message links its to-do, as a chip the chat shows"
    assert message["sections"][0]["title"] == "Please check the logs for errors", "under the user's own words"
    assert titled(scratch.rows("todo")) == ["Check the logs"], "and the to-do is on the list"


@pytest.fixture
def no_agents(monkeypatch):
    """The journal starts no Claude or Codex process: a launch is only noted, and words typed to an agent are only noted."""
    import features.helpers.controller as helpers

    started, told = [], []
    monkeypatch.setattr(helpers, "launched", lambda record, place, provider, args, folder: started.append((place, provider)) or place)
    monkeypatch.setattr(helpers, "tell_soon", lambda record, place, provider, words: told.append((place, provider, words)) or True)
    return started, told


@pytest.mark.parametrize("provider,model", [("codex", "gpt-6-sol"), ("claude", "sonnet")])
def test_a_helper_is_dispatched_told_and_finished_with_the_same_marks_whichever_provider_runs_it(scratch, no_agents, provider, model):
    started, told = no_agents
    scratch.hook("PreToolUse", tool_name="Bash", tool_input={"command": "ls"})
    eventually(lambda: titled(scratch.rows("agent")), ["claude-1"])
    code, answer = scratch.agent("helper", "dispatch", "Rhea", "Profile the hooks", "--provider", provider, "--model", model, "--brief", "Find the slow ones.")
    assert code == 200 and started == [(f"{ENV}-rhea", provider)], "the dispatch starts one agent in an environment of its own"
    cards = lambda: [(card["label"], card.get("detail")) for agent in scratch.rows("agent") for card in agent["data"].get("cards") or []]
    assert cards() == [("Dispatched [[chip helper:1|helper 1]]", f"{provider} {model}")], "the dispatcher's chat marks the dispatch"
    assert scratch.agent("helper", "say", "1", "Also the stop hook.")[0] == 200 and told == [(f"{ENV}-rhea", provider, "Also the stop hook.")], "a follow-up is typed to the helper"
    assert [label for label, _ in cards()] == ["Dispatched [[chip helper:1|helper 1]]", "Continued [[chip helper:1|helper 1]]"], "and marked the same way"
    inside = scratch.ask("GET", f"/api/{ENV}-rhea/message")[1]["rows"]
    assert [(row["title"], row["data"].get("from_main")) for row in inside] == [("Profile the hooks", True), ("Also the stop hook.", True)], \
        "the helper finds both in its own chat, from the main agent"
    code, text = scratch.ask("POST", f"/api/run?actor=agent&env={ENV}-rhea&session=helper-1", raw="\0".join(["helper", "report", "The stop hook is the slow one."]).encode(), kind="text/plain")
    assert code == 200, text
    helper = eventually(lambda: scratch.rows("helper")[0]["data"].get("report"))
    assert helper == "The stop hook is the slow one.", "the helper's report is on its row"
    assert any(row["data"].get("peer") == "Rhea" and "stop hook" in row["brief"] for row in scratch.rows("message")), "and reaches the dispatcher's chat as a message from the helper"


def git_in(project, *args: str) -> str:
    import subprocess

    return subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", *args], cwd=project, check=True, capture_output=True, text=True, timeout=30).stdout


def test_a_ticket_is_started_merged_reopened_and_started_again_and_the_board_says_so_at_each_step(scratch, monkeypatch):
    import agents.terminal

    launched = []
    monkeypatch.setattr(agents.terminal, "detached", lambda root, cwd, env, agent, args: launched.append((env, agent)) or 1)
    project = scratch.record.root.parent
    git_in(project, "init", "-q", "-b", "main")
    (project / ".gitignore").write_text("/.journal\n/.claude/worktrees/\n")
    git_in(project, "add", ".gitignore")
    git_in(project, "commit", "-q", "-m", "start")
    board = scratch.user("POST", "/board", {"title": "Features", "stages": ["Ideas", "Building", "Shipped"], "meanings": {"Building": "start", "Shipped": "done"}})[1]
    ticket = scratch.user("POST", "/ticket", {"title": "Dark mode", "board": board["n"]})[1]
    at = lambda: scratch.user("GET", f"/ticket/{ticket['n']}")[1]
    scratch.user("POST", f"/ticket/{ticket['n']}/move", {"stage": "Building"})
    assert (launched, at()["data"]["stage"], at()["data"]["work_environment"]) == ([("ticket-1", "claude")], "Building", "ticket-1"), "moving a ticket to its start stage starts its agent once, in its own environment"
    git_in(project, "branch", "worktree-ticket-1")
    git_in(project, "switch", "-q", "worktree-ticket-1")
    (project / "dark.txt").write_text("dark")
    git_in(project, "add", "dark.txt")
    git_in(project, "commit", "-q", "-m", "dark mode")
    git_in(project, "switch", "-q", "main")
    assert not at()["completed"], "a ticket with work on its branch is not done until it is merged"
    scratch.user("POST", f"/ticket/{ticket['n']}/merge", {})
    assert (bool(at()["completed"]), at()["data"]["stage"], "dark mode" in git_in(project, "log", "--format=%s")) == (True, "Shipped", True), "merging lands its work on the board's branch and closes it in the done stage"
    scratch.user("POST", f"/ticket/{ticket['n']}/reopen", {"why": "closed by mistake"})
    owners = {row["title"]: row["data"].get("owner") for row in scratch.rows("environment")}
    assert (bool(at()["completed"]), at()["data"]["stage"], owners.get("ticket-1")) == (False, "Building", f"ticket:{ticket['n']}"), "reopening it gives its environment back and puts it where work starts"
    assert scratch.user("POST", f"/ticket/{ticket['n']}/start", {})[0] == 200 and launched == [("ticket-1", "claude")], "starting it again does not start a second agent while its first one is held"


def test_a_long_command_among_parallel_calls_is_moved_by_name_once_and_its_card_closes_when_its_task_ends(scratch, monkeypatch):
    import agents.control
    from features.long_commands import move
    from providers.base import BackgroundTasks
    from runner.engine import emit_ticked

    pressed = []
    monkeypatch.setattr(agents.control, "move_to_background", lambda root, env, session, running="": pressed.append((session, running)) or {"queued": True})
    scratch.record.set_setting("long_commands", {"after_seconds": 1})
    engine = scratch.seated()
    call = lambda event, use, command, **more: scratch.hook(event, tool_name="Bash", tool_use_id=use, tool_input={"command": command}, **more)
    call("PreToolUse", "t1", "journal message read 5")
    call("PreToolUse", "t2", "npm run slow")
    call("PostToolUse", "t1", "journal message read 5", tool_response={"stdout": "ok"})
    commands = eventually(lambda: [(row["command"], bool(row.get("done"))) for agent in scratch.rows("agent") for row in agent["data"].get("commands") or []],
                          [("journal message read 5", True), ("npm run slow", False)])
    started = next(row["at"] for agent in scratch.rows("agent") for row in agent["data"]["commands"] if row["command"] == "npm run slow")
    time.sleep(1.2)
    engine.beat()
    engine.beat()
    assert pressed == [("claude-1", str(started))], "the call that runs is the one moved, the press names it, and it is sent once"
    cards = lambda: [card for agent in scratch.rows("agent") for card in agent["data"].get("cards") or []]
    moved = eventually(lambda: [(card["label"], card["command"], card["state"]) for card in cards()], [("Moved a long command to the background", "npm run slow", "running")])
    assert moved, "the chat shows one card, with the command that was moved"
    monkeypatch.setattr(move, "background_tasks_of", lambda row: BackgroundTasks(started={"b1": time.time() + 1}, ended={"b1": time.time() + 2}))
    emit_ticked(scratch.record, "claude-1")
    eventually(lambda: [card["state"] for card in cards()], ["done"])


def test_a_question_the_agent_asks_is_answered_in_the_viewer_and_reaches_the_option_on_its_screen(scratch, monkeypatch):
    from features.ask_questions import handlers
    from providers import DRIVERS

    keys = []
    screen = DRIVERS["claude"](scratch.record, "claude-1")
    screen._wrote = lambda raw: keys.append(raw) or True
    screen.printed.parent.mkdir(parents=True, exist_ok=True)
    screen.printed.write_bytes("Which store?\r\n ❯ 1. Files\r\n   2. SQLite\r\nEnter to select · ↑/↓ to navigate".encode())
    monkeypatch.setattr(handlers, "driver_in", lambda *given: screen)
    code, answer = scratch.hook("PreToolUse", tool_name="AskUserQuestion", tool_use_id="q1",
                                tool_input={"questions": [{"question": "Which store - files or SQLite?", "options": [{"label": "Files (Recommended)"}, {"label": "SQLite"}]}]})
    asked = eventually(lambda: [(row["title"], [option["title"] for option in row["data"]["options"]]) for row in scratch.rows("question")],
                       [("Which store - files or SQLite?", ["Files", "SQLite"])])
    assert asked and code == 403 and "question 1" in answer.get("reason", ""), "the agent's own question tool is turned into a question the viewer shows, and the agent is told where its answer will come"
    scratch.hook("PreToolUse", tool_name="Bash", tool_input={"command": "ls"})
    eventually(lambda: titled(scratch.rows("agent")), ["claude-1"])
    scratch.user("POST", "/question/1/answer", {"how": "SQLite"})
    eventually(lambda: keys, [b"2", b"\r"])
    assert scratch.user("GET", "/question/1")[1]["completed"], "the answer closes the question and presses the option's number, then Enter, on the agent's screen"


def test_an_upgrade_covers_the_viewer_from_its_first_byte_and_a_hook_sent_while_the_server_restarts_is_kept_and_replayed(scratch):
    import os
    import subprocess
    from pathlib import Path

    from engine import runtime

    scratch.hook("PreToolUse", tool_name="Bash", tool_use_id="u1", tool_input={"command": "ls"})
    eventually(lambda: titled(scratch.rows("agent")), ["claude-1"])
    assert b"journal-updating" not in scratch.ask("GET", "/")[1].encode(), "a page loaded while nothing updates carries no cover"
    runtime.upgrade_mark(scratch.record.root).parent.mkdir(parents=True, exist_ok=True)
    runtime.upgrade_mark(scratch.record.root).write_text("Restarting the journal")
    page = scratch.ask("GET", "/")[1]
    summary = scratch.ask("GET", "/api/summary")[1]
    assert 'content="Restarting the journal"' in page and (summary["updating"], summary["step"]) == (True, "Restarting the journal"), \
        "a page loaded mid-update names the update in its head, and the summary says which step it is on, so the cover is up before anything is asked"
    scratch.stop()
    runtime.upgrade_mark(scratch.record.root).unlink()
    (scratch.record.root / "runtime").mkdir(exist_ok=True)
    (scratch.record.root / "runtime" / "heartbeat").write_text(f"{int(time.time())} http://127.0.0.1:{scratch.port}/\n")
    hook = Path(__file__).resolve().parents[1] / "src" / "hook.sh"
    env = {"PATH": os.environ["PATH"], "AGENT_JOURNAL_ACTIVE": "1", "JOURNAL_ENV": ENV}
    payload = json.dumps({"hook_event_name": "PostToolUse", "session_id": "claude-2", "tool_name": "Bash", "tool_use_id": "u2", "tool_input": {"command": "pwd"}})
    sent = subprocess.run(["sh", str(hook), "claude", str(scratch.record.root)], input=payload, capture_output=True, text=True, env=env, timeout=30)
    spooled = list((scratch.record.root / "runtime" / "unsent").glob("*.json"))
    assert (sent.returncode, sent.stdout, len(spooled)) == (0, "", 1), "a hook that finds no server never holds the agent and keeps its event"
    scratch.start()
    scratch.hook("PreToolUse", tool_name="Bash", tool_use_id="u3", tool_input={"command": "ls"})
    replayed = eventually(lambda: [row["title"] for row in scratch.rows("agent")], ["claude-1", "claude-2"])
    assert replayed and not list((scratch.record.root / "runtime" / "unsent").glob("*.json")), "the restarted server replays what was kept, so the agent that spoke while it was down is known"


def a_sequence_of_three_steps(scratch) -> str:
    scratch.hook("PreToolUse", tool_name="Bash", tool_input={"command": "ls"})
    eventually(lambda: titled(scratch.rows("agent")), ["claude-1"])
    made = scratch.user("POST", "/sequence", {"title": "Landing a ticket"})[1]
    for title in ("Review", "Test", "Approve the plan"):
        scratch.agent("sequence", "section", str(made["n"]), title, f"do {title}")
    return str(made["n"])


def test_a_run_another_run_interrupted_cannot_be_closed_by_hand_and_is_handed_back_at_its_step(scratch):
    n = a_sequence_of_three_steps(scratch)
    scratch.agent("sequence", "run", n, "--about", "ticket:20")
    scratch.agent("sequence", "follow", n, "--about", "ticket:20")
    scratch.agent("sequence", "next", n, "--about", "ticket:20")
    scratch.agent("sequence", "follow", n, "--about", "ticket:20")
    scratch.agent("sequence", "next", n, "--about", "ticket:20")
    scratch.agent("sequence", "follow", n, "--about", "ticket:20")
    scratch.agent("sequence", "run", n, "--about", "ticket:26")
    code, refusal = scratch.agent("sequence", "next", n, "--about", "ticket:20")
    assert code == 400 and "was handed to you first" in refusal and "ticket:26" in refusal, "the run that came later is in hand: the earlier one cannot be moved on past it"
    steps = lambda: {key.split("|", 1)[1]: run["step"] for key, run in scratch.user("GET", f"/sequence/{n}")[1]["data"]["runs"].items()}
    assert steps() == {"ticket:20": 3, "ticket:26": 1}, "and it stays at its step"
    for _ in range(3):
        scratch.agent("sequence", "follow", n, "--about", "ticket:26")
        scratch.agent("sequence", "next", n, "--about", "ticket:26")
    assert steps() == {"ticket:20": 3}, "when the later run is done the earlier one is the one left, still at its third step"
    assert scratch.agent("sequence", "follow", n, "--about", "ticket:20")[0] == 200, "and it is handed back to be taken up there"


def test_a_refused_chained_line_names_only_the_commands_that_ran_and_the_ones_that_did_not(scratch):
    n = a_sequence_of_three_steps(scratch)
    scratch.agent("sequence", "run", n, "--about", "ticket:5")
    call = lambda command, use: scratch.hook("PreToolUse", tool_name="Bash", tool_use_id=use, tool_input={"command": command})
    code, refused = call("journal todo create filed; journal work start 'other work'", "chain-1")
    reason = refused.get("reason", "")
    assert code == 403 and "take it up" in reason and "ran, so do not run them again: journal todo create filed" in reason and "did not run either: journal work start 'other work'" in reason, \
        "the step is not taken up: the filing ran, the write that waits did not, and the refusal says which is which"
    assert [row["title"] for row in scratch.rows("todo")] == ["filed"], "the filing ran once"
    code, again = call("journal todo create filed; journal work start 'other work'", "chain-1")
    assert [row["title"] for row in scratch.rows("todo")] == ["filed"] and "do not run them again: journal todo create filed" in again.get("reason", ""), \
        "the same call tried again does not file it twice"
    code, failed = call("journal message reply 99999 'on it'; journal work start 'other work'", "chain-2")
    reason = failed.get("reason", "")
    assert "do not run them again: journal message reply 99999" not in reason and "did not run either" in reason, "a command that failed is never named among those that ran"
