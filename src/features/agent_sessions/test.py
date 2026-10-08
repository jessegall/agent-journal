import os
import pytest
import subprocess
import sys
import time
from pathlib import Path

from controllers.types import Agents, Environments, Works
from engine.sessions import Sessions, allowed
from engine.gates import held
from resources.base import AGENT, USER
from resources.types import STOPPED
from tests.kit import report, tick
from tests.conftest import fresh, refused
from controllers.types import Agents, Nudges, Todos, Works
from engine.record import Record
from engine.sessions import Sessions
from features.work_tracking.next import ready
from resources.base import AGENT, SYSTEM
from tests.conftest import refused
from typing import NamedTuple


HERE = Path(__file__).resolve().parents[2]


class Lent(NamedTuple):
    root: Path
    record: Record
    sessions: Sessions


@pytest.fixture(scope="module")
def env(tmp_path_factory):
    root = tmp_path_factory.mktemp("lent") / ".journal"
    record = Record(root, "main")
    sessions = Sessions(root)
    sessions.bind("claude-1", "main")
    return Lent(root, record, sessions)


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
    from engine.seats import offline
    assert offline(record.root, "claude-1") == "session 'claude-1' is not online: session 'claude-2' took environment 't' from it (the terminal was closed)" \
        and "no agent's terminal reports it" in offline(record.root, "claude-9"), "a session that is not online says why"
    one.claim(env.n, "it was mine")
    report(record, "working", "PostToolUse", session="claude-1")
    assert gate("claude-1") == "", "claimed back: released"

    assert allowed(sessions, "claude-1", "t", "agent-7", "todo") == \
        "environment 't' is not lent to this session's subagents: journal environment grant <n> first", \
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
    import os
    from tests.kit import asked_for
    from engine.record import Record
    sessions.bind("busy", "t", pid=os.getpid(), provider="claude")
    for moved_away in ("conversation-9", "claude-7272"):
        sessions.unbind(moved_away)
    assert asked_for(Record(record.root, "t"), answering=False) == "u", "a quiet start never lands in an environment another live agent holds"
    sessions.bind("claude-8", "u", pid=os.getpid(), provider="claude")
    visitor = Environments(record, actor=AGENT, session="claude-8")
    visitor.switch(visitor.create("v").n)
    visitor.switch(0, back=True)
    assert sessions.environment("claude-8") == "u", "switching back returns a session to the environment it came from"
    sessions.unbind("claude-8")
    users = Environments(record, actor=USER)
    held_env = users.rows.by_title("t")
    assert "journal environment stop" in refused(lambda: users.vacant("t")), "a held environment says how to end its agent"
    import subprocess
    outside = subprocess.Popen(["sleep", "30"])
    sessions.bind("busy", "t", pid=outside.pid, provider="claude")
    users.stop(held_env.n)
    assert outside.wait(timeout=5) != 0, "an agent in a terminal the journal did not open is ended by its process when the user stops it"
    sessions.bind("gone-9", "u", pid=999999, provider="claude")
    assert "no agent holds" in refused(lambda: users.stop(users.rows.by_title("u").n)), "an agent that is gone holds nothing to stop"
    mine = f"claude-{os.getpid()}"
    sessions.bind("conversation-5", "t", pid=os.getpid(), provider="claude")
    sessions.bind(mine, "w", pid=os.getpid(), provider="claude")
    me = Environments(record, actor=AGENT, session="conversation-5")
    me.claim(me.create("w").n, "back where my terminal is")
    assert (sessions.environment("conversation-5"), sessions.environment(mine), sessions.read(mine).evicted) == ("w", "w", {}), \
        "an agent claiming the environment its own terminal holds keeps that terminal: it is never evicted by itself"


def test_a_subagent_writes_only_once_the_environment_is_lent_and_is_bound_by_the_same_law(env):
    root, record, sessions = env

    code, out = cli(root, "todo", "create", "a row from a subagent", agent="runner-1")
    assert (code, out) == (1, "! environment 'main' is not lent to this session's subagents: journal environment grant <n> first"), \
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
    tick(record)
    assert (todos.load(row.n).data.get("assigned"), todos.load(row.n).data.get("lapsed"),
            any("went silent" in t for t in [n.title for n in Nudges(record).all()])) == \
        ("", "runner-1", True), "a silent subagent's row is back on the list, and the dispatcher told which"


def test_each_environment_gets_its_own_engine_process_and_sees_only_its_own_agents(monkeypatch):
    from engine import typist
    from tests.kit import engines
    from engine.sessions import Sessions
    record = fresh()
    sessions = Sessions(record.root)
    for session, env in (("claude-1", "main"), ("claude-2", "feature-x"), ("claude-3", "feature-x")):
        sessions.bind(session, env, provider="claude")
    monkeypatch.setattr(typist, "live", lambda root: ["claude-1", "claude-2"])
    assert engines.Children(record.root).wanted() == {"main", "feature-x"}, "one engine process per environment with a live agent"
    assert engines.Engines(record.root, "feature-x").mine() == ["claude-2"], "a process runs only its own environment's live agents"
    from engine import runtime
    from engine.stored import write_json
    write_json(runtime.session_file(record.root, "claude-1", "seat.json"), {"at": 1.0, "agent": "claude", "env": "main"})
    sessions.write("claude-1", environment="")
    assert engines.Children(record.root).wanted() == {"main", "feature-x"} and sessions.environment("claude-1") == "main", \
        "a live agent's terminal that lost its environment gets back the one it was seated in, so its engine keeps running"
    from controllers.types import Messages, Notices
    children, ended = engines.Children(record.root), []
    monkeypatch.setattr(children, "end", ended.append)
    lost = Messages(record, actor=USER).create("are you getting these?")
    children.unheard(record.env)
    assert ended == [], "a message waits its few minutes before anything is restarted"
    later = time.time() + engines.UNHEARD_AFTER + 1
    monkeypatch.setattr(engines.time, "time", lambda: later)
    children.unheard(record.env)
    children.unheard(record.env)
    assert (ended, [n.title for n in Notices(record).all()]) == ([record.env], [f"Message {lost.n} has not reached the agent"]), \
        "a message the agent never saw restarts its engine once, with a notice saying so, and is not alarmed about again"
    monkeypatch.undo()
    from providers import DRIVERS
    from runner.engine import Engine, SILENT_AFTER
    report(record, "working", "PreToolUse")
    engine = Engine(record, DRIVERS["claude"](record, "claude-1"))
    driver, pressed = engine.agent.driver, []
    senses = {"alive": lambda: True, "quiet_for": lambda: SILENT_AFTER + 1, "asking": lambda: False, "interrupt": lambda: pressed.append("ctrl-c")}
    for name, sense in senses.items():
        monkeypatch.setattr(driver, name, sense)
    monkeypatch.setattr(driver, "last_report", lambda: Agents(record, actor="system").by_session("claude-1"))
    monkeypatch.setattr(engine.agent, "state", lambda: "working")
    assert engine.probe() == "" and pressed == [], "an agent that reported moments ago is never interrupted"
    monkeypatch.setattr(engines.time, "time", lambda: later + SILENT_AFTER)
    monkeypatch.setattr(driver, "asking", lambda: True)
    assert engine.probe() == "" and pressed == [], "nor one that is asking the user something"
    monkeypatch.setattr(driver, "asking", lambda: False)
    monkeypatch.setattr(engine.agent, "state", lambda: "idle")
    assert engine.probe() == "" and pressed == [], "an idle agent is never probed, however silent"
    monkeypatch.setattr(engine.agent, "state", lambda: "working")
    assert engine.probe().startswith("silent for two minutes") and pressed == ["ctrl-c"], "a working agent silent for two minutes is probed with Ctrl-C"
    import json
    from datetime import datetime, timedelta, timezone
    transcript = record.root / "rollout.jsonl"
    transcript.write_text("")
    report(record, "working", "PreToolUse", provider="codex", transcript=str(transcript))
    ends = lambda message, ahead: json.dumps({"timestamp": (datetime.now(timezone.utc) + timedelta(seconds=ahead)).isoformat(), "type": "event_msg",
                                              "payload": {"type": "task_complete", "error": {"message": message}}}, separators=(",", ":")) + "\n"
    transcript.write_text(ends("old failure", -3600))
    assert engine.failed() == "", "an error from before the agent's last report is not this turn's"
    transcript.write_text(transcript.read_text() + ends("out of credits", 3600))
    assert engine.failed() == "the turn failed: out of credits", "a turn that ends in an error is named"
    row = Agents(record, actor="system").by_session("claude-1")
    assert (row.status, row.data["failure"]) == ("idle", "out of credits"), "the agent goes idle with the failure set"


def test_the_start_question_never_offers_a_busy_environment_on_enter():
    import os
    from tests.kit import asked_for
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

    def closed(_=""):
        raise EOFError
    assert asked_for(record, ask=closed, answering=True) == record.env, "input that ends before an answer keeps the environment it started in"


def test_stop_in_the_viewer_tells_the_agent_to_stop_that_task_in_its_providers_words():
    from controllers.types import Agents, Nudges
    record = fresh()
    report(record, "working", "PreToolUse", provider="claude")
    agents = Agents(record, actor="user")
    agent = agents.by_session("claude-1")
    agents.stop_task(agent.n, "b7wu1410l", description="Poll production")
    told = [n for n in Nudges(record).all() if n.title == "the user asked to stop Poll production"]
    assert [n.brief for n in told] == ["run TaskStop with task_id b7wu1410l now; then carry on with the work"], "once, in Claude's words"
    agents.stamp(agent.n, status="stopped")
    agents.stop_task(agent.n, "b8old", description="An old poll")
    assert not [n for n in Nudges(record).all() if "An old poll" in n.title], "an agent whose session has stopped is never asked to stop a task, so no later session hears of it"


def test_a_compaction_is_recorded_once_on_the_agent():
    record = fresh()
    report(record, "working", "PreToolUse")
    report(record, "compacting", "PreCompact")
    report(record, "compacting", "PreCompact")
    agent = Agents(record, actor="system").by_session("claude-1")
    assert len(agent.data.get("compactions") or []) == 1, "one compaction, one mark for the chat"
    agents = Agents(record, actor="system")
    from migrations.m0026_stopping_description import run as describe
    from migrations.m0058_marks_without_a_label import run as mend
    agents.stamp(agent.n, stopping={"what": "Poll production", "task": "b7"}, cards=[{"label": "kept"}, {"text": "no label"}])
    assert describe(record.root) == [agent.ref], "an agent whose stopping task still has the old key is rewritten"
    assert agents.load(agent.n).data["stopping"] == {"task": "b7", "description": "Poll production"}, "the old key becomes description"
    assert describe(record.root) == [], "a stopping task already described is left alone"
    assert mend(record.root) == [f"t agent {agent.n}: 1 marks without a label"], "a chat mark without a label is dropped"
    assert agents.load(agent.n).data["cards"] == [{"label": "kept"}], "the labelled marks stay"
    record.set_setting("agent_sessions", {"quiet": 1})
    record.set_setting("triggers", {"agent_sessions.liveness": {"every": 0, "unit": "minutes"}})
    report(record, "working", "PreToolUse", session="claude-2")
    held = agents.by_session("claude-2")
    for row in (agent, held):
        agents.stamp(row.n, at=time.time() - 3600)
    Sessions(record.root).write("claude-1", pid=0, last_heard=0)
    Sessions(record.root).write("claude-2", pid=os.getpid())
    tick(record)
    assert (agents.load(agent.n).status, agents.load(held.n).status) == (STOPPED, "working"), \
        "an agent silent past the quiet setting is marked stopped, unless its session is still alive"
    from features.agent_sessions.handlers import stop_ended
    gone = agents.by_session("claude-3")
    agents.stamp(gone.n, status="working", at=time.time(), running={"command": "sleep 99", "tool": "Bash", "at": time.time() - 99}, stopping={"task": "b1", "at": 1})
    assert ("claude-3" in stop_ended(record.root), agents.load(held.n).status) == (True, "working"), "an upgrade stops the rows of sessions that ended, and only those"
    stopped = agents.load(gone.n)
    assert (stopped.status, stopped.data.get("running"), stopped.data.get("stopping")) == (STOPPED, {}, {}), \
        "and drops the command and the stop request they left, so no later session is told of them"


def test_a_subagent_dispatched_and_returned_is_an_event_on_the_agent_heard_once():
    from agents.seat import SeatReport
    record = fresh()
    row = Agents(record, actor=AGENT).create("s-1", subagent_rows=[{"id": "old", "task": "earlier", "type": "Explore", "model": "haiku", "ended": 5.0}])
    seat = SeatReport(record, agent=None)
    last = Agents(record, actor=AGENT).load(row.n)
    running = {"id": "t1", "task": "audit the hooks", "type": "auditor", "model": "sonnet", "ended": 0.0}
    for subagents in ([last.data["subagent_rows"][0], running], [last.data["subagent_rows"][0], running], [last.data["subagent_rows"][0], {**running, "ended": 9.0, "status": "completed"}]):
        seat.subagents_moved(last, subagents)
    heard = [(e.action, e.data.get("task"), e.data.get("kind"), e.data.get("model")) for e in record.event_log.events() if e.type == "agent" and e.action in ("dispatched", "returned")]
    assert heard == [("dispatched", "audit the hooks", "auditor", "sonnet"), ("returned", "audit the hooks", "auditor", "sonnet")], heard
    import json
    from providers.claude import Claude
    transcript = record.root / "main.jsonl"
    rows = [{"type": "assistant", "uuid": "a", "message": {"role": "assistant", "content": [
                {"type": "tool_use", "id": "fg", "name": "Agent", "input": {"description": "Ada: review", "subagent_type": "reviewer", "model": "sonnet"}},
                {"type": "tool_use", "id": "bg", "name": "Agent", "input": {"description": "Rex: research", "subagent_type": "Explore", "model": "haiku", "run_in_background": True}}]}},
            {"type": "user", "uuid": "b", "message": {"role": "user", "content": [{"type": "tool_result", "tool_use_id": "fg", "content": "One finding"},
                                                                                   {"type": "tool_result", "tool_use_id": "bg", "content": "Async agent launched"}]}}]
    for agent, use in (("fg1", "fg"), ("bg1", "bg")):
        folder = transcript.with_suffix("") / "subagents"
        folder.mkdir(parents=True, exist_ok=True)
        (folder / f"agent-{agent}.meta.json").write_text(json.dumps({"toolUseId": use}))
        (folder / f"agent-{agent}.jsonl").write_text("{}\n")
    answered = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() + 2))
    transcript.write_text("".join(json.dumps({**row, "timestamp": answered}) + "\n" for row in rows))
    crew = {sub["task"]: sub["running"] for sub in Claude().crew(transcript)["subagent_rows"]}
    assert crew == {"Ada: review": False, "Rex: research": True}, "a subagent that returned its answer is done; one sent to the background works on until it goes quiet"

    from providers.codex import Codex
    parent, child = "01a0fe58-a59b-7910-b452-68b6adf88ce9", "01a0fe67-b6bf-7260-8a22-b2b6bf0f549f"
    day = record.root / "codex" / "2026" / "10" / "02"
    day.mkdir(parents=True)
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    lines = lambda *rows: "".join(json.dumps({"timestamp": now, **row}) + "\n" for row in rows)
    main = day / f"rollout-2026-10-02T22-40-17-{parent}.jsonl"
    main.write_text(lines({"type": "session_meta", "payload": {"id": parent}},
                          {"type": "response_item", "payload": {"type": "function_call", "namespace": "collaboration", "name": "spawn_agent", "call_id": "c1",
                                                                "arguments": json.dumps({"task_name": "iris_auth", "agent_type": "plan-reviewer", "model": "gpt-6-sol"})}},
                          {"type": "response_item", "payload": {"type": "function_call_output", "call_id": "c1", "output": json.dumps({"task_name": "/root/iris_auth"})}},
                          {"type": "response_item", "payload": {"type": "function_call", "namespace": "collaboration", "name": "spawn_agent", "call_id": "c2",
                                                                "arguments": json.dumps({"task_name": "bea_draw", "agent_type": "designer", "model": "gpt-6-sol"})}},
                          {"type": "response_item", "payload": {"type": "function_call_output", "call_id": "c2", "output": "8 helpers and subagents are kept for reuse"}}))
    (day / f"rollout-2026-10-02T22-56-45-{child}.jsonl").write_text(lines(
        {"type": "session_meta", "payload": {"id": child, "source": {"subagent": {"thread_spawn": {"parent_thread_id": parent, "agent_path": "/root/iris_auth"}}}}},
        {"type": "event_msg", "payload": {"type": "task_started"}}))
    spawned, refused_spawn = Codex().crew(main)["subagent_rows"]
    assert (refused_spawn["status"], refused_spawn["running"]) == ("refused", False), "a spawn Codex was refused is recorded as refused, never as running"
    assert (spawned["task"], spawned["type"], spawned["session"], spawned["running"]) == ("iris_auth", "plan-reviewer", child, True), \
        "a subagent Codex spawns directly is found by its path, so the viewer's agent list can show it"


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
    from tests.kit import asked_history
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
    asked_history(record, "claude", "conv-7", ask=lambda _: "2", answering=True)
    assert Messages(record, actor=USER).rows.every() == [], "No starts from here and brings nothing in"
    asked_history(record, "claude", "conv-7", ask=lambda _: "1", answering=True)
    asked_history(record, "claude", "conv-7", ask=lambda _: "1", answering=True)
    brought = [(m.brief, m.seen[0], bool(m.completed)) for m in Messages(record, actor=USER).rows.every()]
    assert brought == [("please fix the login", USER, True), ("Fixed: the token expired early.", AGENT, True)], \
        "what the user and the agent wrote reaches the chat once, as theirs and already dealt with"
    assert Sessions(record.root).environment("conv-7") == record.env, "the conversation now belongs to the environment, so it is not asked again"


def test_a_background_subagent_stops_running_when_its_completion_arrives(tmp_path, monkeypatch):
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

    from engine import runtime
    from engine.sessions import alive as process_alive
    record = fresh()
    sessions = Sessions(record.root)
    assert (process_alive("not a pid"), process_alive(None), process_alive(0), process_alive(-3), process_alive(os.getpid()), process_alive(2 ** 22 + 9)) == \
        (False, False, False, False, True, False), "only a number that names a running process is alive"
    sessions.write("claude-1", environment="old")
    runtime.set_env(record.root, "old")
    sessions.rebind("old", "renamed")
    assert (sessions.read("claude-1").environment, runtime.env(record.root)) == ("renamed", "renamed"), "renaming an environment moves its sessions and the one the journal opens on"
    sessions.rebind("renamed", "third")
    assert runtime.renamed(record.root, "old") == "third", "a name renamed twice is followed to the name it has now"
    Environments(record, actor=SYSTEM).create("old")
    assert runtime.renamed(record.root, "old") == "old", "a new environment that takes an old name is no longer followed away"
    sessions.rebind("third", "renamed")
    assert sessions.grant("claude-1", "renamed") == ["renamed"] and sessions.grant("claude-1", "renamed", on=False) == [], "a lent environment is taken back"
    assert process_alive(1), "a process another user owns is alive, though it cannot be signalled"
    from engine.sessions import agent_pid, held_builds
    builds = runtime.builds(record.root)
    builds.mkdir(parents=True, exist_ok=True)
    for name, build in (("notes", ""), (str(2 ** 22 + 9), "old.pyz"), (str(os.getpid()), "mine.pyz")):
        (builds / name).write_text(build)
    assert (held_builds(record.root), [p.name for p in builds.iterdir()]) == ({"mine.pyz"}, [str(os.getpid())]), \
        "a build is held only by a live process, and every other marker is cleared"
    monkeypatch.setattr("engine.sessions.run", lambda *args, **kwargs: "4242 -zsh\n")
    assert agent_pid(77) == 4242, "a chain of shells is climbed only so far"
    sessions.write("claude-2", environment="spare", provider="claude", since=1.0)
    assert sessions.choose("claude-3", "claude", "main", set()) == "spare", "a new session takes the environment an ended one left behind"
    sessions.write("claude-3", environment="own", provider="claude", pid=os.getpid())
    assert sessions.choose("claude-3", "claude", "main", set()) == "own", "a session goes back to its own environment while nobody else holds it"
