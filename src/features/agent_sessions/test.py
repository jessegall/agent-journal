import pytest
import subprocess
import sys
import time

from controllers.types import Agents, Environments, Works
from engine.sessions import Sessions, allowed
from features.base import held
from resources.base import AGENT
from tests.kit import report
from tests.conftest import fresh
from pathlib import Path
from controllers.types import Agents, Nudges, Todos, Works
from engine.record import Record
from engine.sessions import Sessions
from features.work_tracking.next import ready
from resources.base import AGENT, SYSTEM
from tests.conftest import refused


HERE = Path(__file__).resolve().parents[2]


@pytest.fixture(scope="module")
def env(tmp_path_factory):
    root = tmp_path_factory.mktemp("lent") / ".journal"
    record = Record(root, "main")
    sessions = Sessions(root)
    sessions.bind("claude-1", "main")
    return root, record, sessions


def cli(root, *argv, agent=""):
    naming = ["--agent", agent] if agent else []
    p = subprocess.run(
        [sys.executable, str(HERE / "journal.py"), "--root", str(root), "--env", "main", "--session", "claude-1",
         *naming, *argv],
        capture_output=True, text=True, timeout=30, cwd=root.parent)
    return p.returncode, (p.stdout + p.stderr).strip()


def test_a_session_evicted_from_its_environment_is_held_until_it_claims_it_back():
    record = fresh()
    sessions = Sessions(record.root)

    def gate(s):
        return held(record, s)

    Works(record, actor=AGENT).create("open, so the work gate is quiet")
    one = Environments(record, actor=AGENT, session="claude-1")
    env = one.create("t")
    one.switch(env.n)
    report(record, "working", "PostToolUse", session="claude-1")
    assert gate("claude-1") == "", "bound and working: no hold"
    Environments(record, actor=AGENT, session="claude-2").claim(env.n, "the terminal was closed")
    report(record, "working", "PostToolUse", session="claude-1")
    assert gate("claude-1") == "environment 't' was claimed by session claude-2 (the terminal was closed): switch to another, or claim it back", \
        "evicted: held, naming who, why and what to do"
    one.claim(env.n, "it was mine")
    report(record, "working", "PostToolUse", session="claude-1")
    assert gate("claude-1") == "", "claimed back: released"

    assert allowed(sessions, "claude-1", "t", "agent-7", "todo") == \
        "environment 't' is not lent to this session's subagents: journal environment <n> grant first", \
        "no grant: refused, saying how to lend"
    one.grant(env.n)
    assert allowed(sessions, "claude-1", "t", "agent-7", "todo") == "", "granted: a to-do is allowed"
    assert allowed(sessions, "claude-1", "t", "agent-7", "fact") == \
        "a subagent never writes a fact: report it, and the main conversation files it", "granted: a pin is still refused"
    assert allowed(sessions, "claude-1", "t", "", "fact") == "", "no subagent named: nothing to check"
    sessions.bind("conversation-9", record.env, pid=7272, provider="claude")
    sessions.bind("claude-7272", record.env, pid=7272, provider="claude")
    moved = Environments(record, actor=AGENT, session="conversation-9")
    moved.switch(moved.create("u").n)
    assert (sessions.environment("conversation-9"), sessions.environment("claude-7272")) == ("u", "u"), \
        "a switch moves the agent's terminal session with it, so the new environment's engine drives it"


def test_a_subagent_writes_only_once_the_environment_is_lent_and_is_bound_by_the_same_law(env):
    root, record, sessions = env

    code, out = cli(root, "todo", "create", "a row from a subagent", agent="runner-1")
    assert (code, out) == (1, "! environment 'main' is not lent to this session's subagents: journal environment <n> grant first"), \
        "without a grant a subagent's write is refused, and told what the dispatcher must do"
    code, out = cli(root, "todo", "all", agent="runner-1")
    assert code == 0, "its reads are never refused"

    sessions.grant("claude-1", "main")
    code, out = cli(root, "todo", "create", "a row from a subagent", agent="runner-1")
    todos = Todos(record, actor=SYSTEM)
    assert (code, todos.load(1).data.get("agent")) == (0, "runner-1"), "with the grant the row is written, carrying the agent's mark"
    agents = Agents(record, actor=SYSTEM)
    runner = agents.by_session("runner-1")
    assert runner.data.get("active", 0) > 0, "the agent row exists from the first write, stamped active"

    code, out = cli(root, "fact", "create", "a fact from a subagent", agent="runner-1")
    assert (code, out) == (1, "! a subagent never writes a fact: report it, and the main conversation files it"), \
        "a pin is not a subagent's to write"
    code, out = cli(root, "rule", "create", "a ruling from a subagent", agent="runner-1")
    assert code == 1, "nor a rule"

    Agents(record, actor=SYSTEM).by_session("claude-1")
    row = todos.create("a row for the runner")
    Todos(record, actor=AGENT).assign(row.n, to="runner-1")
    assert todos.load(row.n).data.get("assigned") == "runner-1", "assigned to one agent"
    assert refused(lambda: Works(record, actor=AGENT).create("taking it", todo=row.n)) == \
        f"todo {row.n} is assigned to runner-1; nobody else may take it", "another cannot start it"
    assert (row.n in [t.n for t in ready(record)]) is False, "auto mode skips an assigned row"
    code, out = cli(root, "work", "start", "the runner takes it", "--set", f"todo={row.n}", agent="runner-1")
    assert code == 0, "the agent it is assigned to may"

    code, out = cli(root, "todo", "report", str(row.n), "built and green", agent="runner-1")
    assert (code, todos.load(row.n).data.get("reported", {}).get("how")) == (0, "built and green"), \
        "report is the subagent's word"
    nudges = [n.title for n in Nudges(record).all()]
    assert (f"agent runner-1 reports todo {row.n} done" in nudges) is True, "the dispatcher is nudged with the report"
    assert todos.load(row.n).completed == 0.0, "the row is not closed by the report"
    assert refused(lambda: Todos(record, actor=AGENT).report(row.n, "x")) == \
        "report is a subagent's word — the dispatcher closes a row with done", "report without --agent is refused"

    record.set_setting("agent_sessions", {"lapse": 0})
    agents.update(agents.by_session("runner-1").n, active=time.time() - 120)
    report(record, "idle", "Stop")
    assert (todos.load(row.n).data.get("assigned"), todos.load(row.n).data.get("lapsed"),
            any("went silent" in t for t in [n.title for n in Nudges(record).all()])) == \
        ("", "runner-1", True), "a silent subagent's row is back on the list, and the dispatcher told which"


def test_each_environment_gets_its_own_engine_process_and_sees_only_its_own_agents(monkeypatch):
    from engine import engines, typist
    from engine.sessions import Sessions
    record = fresh()
    sessions = Sessions(record.root)
    for session, env in (("claude-1", "main"), ("claude-2", "feature-x"), ("claude-3", "feature-x")):
        sessions.bind(session, env, provider="claude")
    monkeypatch.setattr(typist, "live", lambda root: ["claude-1", "claude-2"])
    assert engines.Children(record.root).wanted() == {"main", "feature-x"}, "one engine process per environment with a live agent"
    assert engines.Engines(record.root, "feature-x").mine() == ["claude-2"], "a process runs only its own environment's live agents"


def test_the_start_question_never_offers_a_busy_environment_on_enter():
    import os
    from commands.queries import asked_for
    from controllers.types import Environments
    from engine.sessions import Sessions
    from resources.base import SYSTEM
    record = fresh()
    Environments(record, actor=SYSTEM).create(record.env)
    Sessions(record.root).bind("codex-x", record.env, pid=os.getpid(), provider="codex")
    answers = iter(["", "side", "1", "1"])
    ask = lambda _="": next(answers)
    assert asked_for(record, ask=ask, answering=True) == "side", "Enter takes a free choice, here a new environment"
    assert asked_for(record, ask=ask, answering=True) == record.env, "a busy one picked on purpose is taken over"
    assert Sessions(record.root).holder(record.env) == "", "and the agent there is moved off"


def test_stop_in_the_viewer_tells_the_agent_to_stop_that_task_in_its_providers_words():
    from controllers.types import Agents, Nudges
    record = fresh()
    report(record, "working", "PreToolUse", provider="claude")
    agents = Agents(record, actor="user")
    agent = agents.by_session("claude-1")
    agents.stop_task(agent.n, "b7wu1410l", description="Poll production")
    told = [n for n in Nudges(record).all() if n.title == "the user asked to stop Poll production"]
    assert [n.brief for n in told] == ["run TaskStop with task_id b7wu1410l now; then carry on with the work"], "once, in Claude's words"


def test_a_compaction_is_recorded_once_on_the_agent():
    record = fresh()
    report(record, "working", "PreToolUse")
    report(record, "compacting", "PreCompact")
    report(record, "compacting", "PreCompact")
    agent = Agents(record, actor="system").by_session("claude-1")
    assert len(agent.data.get("compactions") or []) == 1, "one compaction, one mark for the chat"


def test_a_subagent_dispatched_and_returned_is_an_event_on_the_agent_heard_once():
    from types import SimpleNamespace
    from engine.seat import Seat
    record = fresh()
    row = Agents(record, actor=AGENT).create("s-1", subagent_rows=[{"id": "old", "task": "earlier", "type": "Explore", "model": "haiku", "ended": 5.0}])
    seat = SimpleNamespace(record=record, subagents_ended=None)
    last = Agents(record, actor=AGENT).load(row.n)
    running = {"id": "t1", "task": "audit the hooks", "type": "auditor", "model": "sonnet", "ended": 0.0}
    for subagents in ([last.data["subagent_rows"][0], running], [last.data["subagent_rows"][0], running], [last.data["subagent_rows"][0], {**running, "ended": 9.0, "status": "completed"}]):
        Seat.subagents_moved(seat, last, subagents)
    heard = [(e.action, e.data.get("task"), e.data.get("kind"), e.data.get("model")) for e in record.events() if e.type == "agent" and e.action in ("dispatched", "returned")]
    assert heard == [("dispatched", "audit the hooks", "auditor", "sonnet"), ("returned", "audit the hooks", "auditor", "sonnet")], heard


def test_a_report_filed_after_a_subagent_ended_is_linked_to_it():
    from controllers.types import Reports
    from features import load
    load()
    record = fresh()
    agents = Agents(record)
    row = agents.by_session("claude-main")
    now = time.time()
    agents.update(row.n, at=now, status="working", subagent_rows=[
        {"id": "use-old", "task": "an old audit", "ended": now - 7200},
        {"id": "use-1", "task": "audit the disk", "ended": now - 60},
        {"id": "use-2", "task": "still running", "ended": 0.0},
    ])
    made = Reports(record, actor=AGENT).create("what the audit found")
    assert agents.load(row.n).data.get("subagent_reports") == {"use-1": made.n}, "the report goes with the subagent that ended last, not one still running or long gone"


def test_a_conversation_the_journal_never_saw_can_fill_the_chat_from_its_transcript(tmp_path, monkeypatch):
    import json
    from commands.queries import asked_history
    from controllers.types import Messages
    from engine.sessions import Sessions
    from providers import PROVIDERS
    from resources.base import AGENT, USER
    record = fresh()
    transcript = tmp_path / "conv-7.jsonl"
    rows = [{"type": "user", "timestamp": "2026-09-20T10:00:00Z", "message": {"content": "please fix the login"}},
            {"type": "assistant", "timestamp": "2026-09-20T10:01:00Z", "message": {"content": [{"type": "text", "text": "Fixed: the token expired early."}]}}]
    transcript.write_text("".join(json.dumps(row) + "\n" for row in rows))
    monkeypatch.setattr(PROVIDERS["claude"], "conversation_file", lambda self, conversation: transcript if conversation == "conv-7" else None)
    asked_history(record, "claude", "conv-7", ask=lambda _: "1", answering=True)
    asked_history(record, "claude", "conv-7", ask=lambda _: "1", answering=True)
    brought = [(m.brief, m.seen[0], bool(m.completed)) for m in Messages(record, actor=USER)._every()]
    assert brought == [("please fix the login", USER, True), ("Fixed: the token expired early.", AGENT, True)], \
        "what the user and the agent wrote reaches the chat once, as theirs and already dealt with"
    assert Sessions(record.root).environment("conv-7") == record.env, "the conversation now belongs to the environment, so it is not asked again"


def test_a_background_subagent_stops_running_when_its_completion_arrives(tmp_path):
    import json
    from providers.claude import Claude
    dispatched = {"type": "assistant", "timestamp": "2026-09-23T00:00:00Z", "message": {"content": [
        {"type": "tool_use", "id": "a1", "name": "Agent", "input": {"description": "review", "prompt": "p", "subagent_type": "reviewer"}}]}}
    launched = {"type": "user", "timestamp": "2026-09-23T00:00:01Z", "message": {"content": [
        {"type": "tool_result", "tool_use_id": "a1", "content": "Async agent launched successfully. agentId: x1"}]}}
    import os
    import time
    from datetime import datetime, timezone
    stamp = lambda at: datetime.fromtimestamp(at, timezone.utc).isoformat()
    now = time.time()
    completed = lambda at: {"type": "queue-operation", "operation": "enqueue", "timestamp": stamp(at),
                            "content": "<task-notification><tool-use-id>a1</tool-use-id><status>completed</status></task-notification>"}
    transcript = tmp_path / "s.jsonl"
    folder = transcript.with_suffix("").joinpath("subagents")
    folder.mkdir(parents=True)
    (folder / "agent-x1.meta.json").write_text(json.dumps({"toolUseId": "a1"}))
    session = folder / "agent-x1.jsonl"
    session.write_text("{}\n")
    os.utime(session, (now - 20, now - 20))
    transcript.write_text("\n".join(json.dumps(row) for row in (dispatched, launched)) + "\n")
    assert Claude().crew(transcript)["subagent_rows"][0]["running"], "a launched subagent still writing runs"
    with transcript.open("a") as f:
        f.write(json.dumps(completed(now - 10)) + "\n")
    assert not Claude().crew(transcript)["subagent_rows"][0]["running"], "its completion ends it, though its transcript was written just before"
    os.utime(session, (now, now))
    assert Claude().crew(transcript)["subagent_rows"][0]["running"], "resumed by a message, it writes again and runs again"
    with transcript.open("a") as f:
        f.write(json.dumps(completed(now + 1)) + "\n")
    assert not Claude().crew(transcript)["subagent_rows"][0]["running"], "and its next completion ends it again"
