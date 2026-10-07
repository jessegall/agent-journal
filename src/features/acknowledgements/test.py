from controllers.types import Agents, Messages, Nudges
from engine import chat
from resources.base import SYSTEM
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
    assert answered("Understood.", prompt="carry on") == [False], "a turn the person started is never hidden"
    assert answered("The suite broke on the gate.", failure="the turn failed") == [False], "a failed turn is never hidden"
    assert answered("Got it, but which branch should I use?") == [False], "a question waiting on the person is never hidden"


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
