import time

import pytest
from controllers.types import Agents, Messages, Nudges
from engine import chat
from resources.base import AGENT, SYSTEM
from tests.conftest import fresh
from tests.kit import report


def test_a_turn_that_only_answers_a_journal_line_is_kept_out_of_the_chat_unless_it_tells_something():
    from runner.hooks import handle
    from providers import PROVIDERS
    record = fresh()
    report(record, "idle", "Stop")
    agents = Agents(record, actor=SYSTEM)
    row = agents.by_session("claude-1")
    nudges = Nudges(record, actor=SYSTEM)
    plain, kept = nudges.create("a reminder"), nudges.create("plan 3 stands still", reply_kept=True)

    def hook(event, **more):
        handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": event, "session_id": "claude-1", **more})

    def answered(text, prompt="[journal] todo 5 next", delivered=(f"nudge:{plain.n}",), failure="", writes=False):
        hook("UserPromptSubmit", prompt=prompt)
        agents.update(row.n, delivered=list(delivered), failure=failure)
        if writes:
            hook("PostToolUse", tool_name="Write", cwd=str(record.root.parent), tool_input={"file_path": "src/app.py", "content": "x"})
        chat.send(record, agents.load(row.n), text)
        found = [m for m in Messages(record).all() if m.brief == text]
        return [bool(m.data.get("acknowledgement")) for m in found]

    assert answered("Noted.") == [True], "a bare acknowledgement of a journal line is kept as a message the chat leaves out"
    assert answered("Understood; I will keep quiet on journal lines from here.") == [True], "so is any answer to a journal line that changes nothing"
    assert answered("Fixed the build and committed it.", writes=True) == [False], "a turn that changed files reports finished work"
    assert answered("That is another helper's worktree, nothing to do.") == [True], "whatever words it uses, once a new line starts the next turn"
    assert answered("Carrying on with it.", delivered=(f"nudge:{kept.n}",)) == [False], "a line whose answer must be read keeps the answer in the chat"
    assert answered("Okay, on it.", delivered=("message:7",)) == [False], "an answer to a message is never hidden"
    relayed = Messages(record, actor=AGENT).create("helper 3 reported", brief="the helper is done", peer="Zed")
    assert answered("That is the helper's earlier report.", delivered=(f"message:{relayed.n}",)) == [True], "an answer to a helper's report, which the journal pushed, is kept out like any journal line"
    thanks = Messages(record, actor="user").create("thanks a lot")
    Messages(record, actor=AGENT).react(thanks.n, "🙏")
    assert answered("That thank-you is acknowledged.", delivered=(f"message:{thanks.n}",)) == [True], \
        "a message the agent already reacted to, handed over again by a journal line, asks for nothing: the answer is kept out"
    from_peer = Messages(record, actor=AGENT).create("a broken command here", brief="a broken command here", peer="smart-farmers", from_session="uds:/tmp/b.sock")
    assert answered("On it: a hotfix is under way.", delivered=(f"message:{from_peer.n}",)) == [False], \
        "an answer to a message from another session is never kept out of the chat, even in a turn a journal line started"
    assert answered("Understood.", prompt="carry on") == [False], "a turn the person started is never hidden"
    assert answered("The suite broke on the gate.", failure="the turn failed") == [False], "a failed turn is never hidden"
    assert answered("Got it, but which branch should I use?") == [False], "a question waiting on the person is never hidden"
    hook("UserPromptSubmit", prompt="[journal] todo 5 next")
    agents.update(row.n, delivered=[f"nudge:{kept.n}"])
    for _ in range(2):
        chat.send(record, agents.load(row.n), "Carrying on with the same turn.", turn="t1")
    assert len([m for m in Messages(record).all() if m.brief == "Carrying on with the same turn."]) == 1, "a turn sent twice by two paths reaches the chat once"
    last = record.event_log.last_id()
    hook("UserPromptSubmit", prompt="[journal] todo 5 next")
    journal_line = [e.action for e in record.event_log.events(last) if e.type == "agent"]
    last = record.event_log.last_id()
    hook("UserPromptSubmit", prompt="carry on")
    person_line = [e.action for e in record.event_log.events(last) if e.type == "agent"]
    assert (journal_line, person_line) == (["heard"], ["reported"]), \
        "a prompt that is the journal's own line raises one event of its own, which no handler of an agent report takes"


def test_a_line_delivered_mid_turn_keeps_the_message_the_turn_answers():
    from types import SimpleNamespace
    from agents.actors import Agent
    from resources.base import Event
    record = fresh()
    report(record, "working", "UserPromptSubmit")
    agents = Agents(record, actor=SYSTEM)
    row = agents.by_session("claude-1")
    actor = Agent(record, SimpleNamespace(last_report=lambda: SimpleNamespace(title=row.title)))
    actor.delivered([Event(1, 0.0, "message", 7, "created", SYSTEM)])
    actor.delivered([Event(2, 0.0, "nudge", 3, "created", SYSTEM)])
    assert agents.load(row.n).delivered == ["message:7", "nudge:3"], "a nudge delivered while the turn runs keeps the message it answers"
    agents.update(row.n, status="compacting")
    actor.delivered([Event(4, 0.0, "nudge", 5, "created", SYSTEM)])
    assert agents.load(row.n).delivered == ["message:7", "nudge:3", "nudge:5"], "and so does one delivered while the turn compacts"
    agents.update(row.n, status="idle")
    actor.delivered([Event(3, 0.0, "nudge", 4, "created", SYSTEM)])
    assert agents.load(row.n).delivered == ["nudge:4"], "a new turn starts with only what it was handed"
    Agent(record, SimpleNamespace(last_report=lambda: None)).delivered([Event(5, 0.0, "nudge", 6, "created", SYSTEM)])
    assert agents.load(row.n).delivered == ["nudge:4"], "with no agent reporting, nothing is put on any agent"
    from controllers.types import Todos
    todos = Todos(record, actor=SYSTEM)
    [todos.create(title) for title in ("one", "two", "three")]
    held, later, last = [e for e in record.event_log.events() if e.type == "todo" and e.action == "created"][-3:]
    reading = Agent(record, SimpleNamespace())
    reading.pending = [held]
    reading.notified(later)
    reading.notified(last)
    reloaded = Agent(record, SimpleNamespace())
    assert (reloaded.delivered_until(), reloaded.sent) == (held.id - 1, {later.id, last.id}), \
        "a worker that reloads while one line is still held reads on from before that line and takes none of the lines already delivered after it"
    reading.pending = []
    reading.notified(held)
    assert (Agent(record, SimpleNamespace()).delivered_until(), Agent(record, SimpleNamespace()).sent) == (last.id, set()), "once nothing is held the cursor moves on and nothing is remembered"
    import threading
    from resources.base import PROJECT
    appended, begun = [], threading.Event()
    env_append, project_append = record.event_log.append, record.event_log.project.append

    def slowly(event):
        begun.set()
        time.sleep(0.3)
        appended.append(event.id)
        env_append(event)

    def promptly(event):
        appended.append(event.id)
        project_append(event)
    with pytest.MonkeyPatch.context() as slow:
        slow.setattr(record.event_log, "append", slowly)
        slow.setattr(record.event_log.project, "append", promptly)
        writer = threading.Thread(target=lambda: record.emit("todo", 1, "created", SYSTEM))
        writer.start()
        begun.wait(5)
        record.emit("ticket", 1, "updated", SYSTEM, scope=PROJECT)
        writer.join(5)
    assert appended == sorted(appended), "an event written in the project's log never lands before one with a smaller number written in an environment's, so no reader's cursor passes a message still on its way"


def test_a_hook_that_finds_the_status_as_it_was_leaves_the_agent_row_unwritten_for_a_second():
    from controllers.agents import PENDING, write_pending_rows
    record = fresh()
    agents = Agents(record, actor=SYSTEM)
    report(record, "working", "PreToolUse")
    n = agents.by_session("claude-1").n
    path = agents.rows.path(n)
    written = path.stat().st_mtime_ns
    report(record, "working", "PostToolUse")
    assert path.stat().st_mtime_ns == written, "a second hook with the same status writes nothing"
    assert agents.load(n).data["event"] == "PostToolUse", "and what it reported is read at once"
    report(record, "idle", "Stop")
    assert (path.stat().st_mtime_ns > written, agents.rows.peek(n).data["status"]) == (True, "idle"), "a status change is written at once"
    report(record, "idle", "Notification")
    PENDING.of(record, n).written -= 5
    write_pending_rows()
    assert (PENDING.of(record, n), agents.rows.peek(n).data["event"]) == (None, "Notification"), "the server's loop writes what a second held back"
