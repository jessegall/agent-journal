import json

from controllers.types import Agents, Messages, Nudges, Works
from engine.hooks import gate_file, handle
from features.base import held
from providers import PROVIDERS
from resources.base import AGENT, USER
from tests.conftest import fresh
from tests.kit import nudges, report


def test_a_read_message_is_named_back_until_the_agent_answers_it():
    record = fresh()
    Agents(record, actor=AGENT).by_session("claude-1")
    m = Messages(record, actor=USER).create("how is it going?")
    Messages(record, actor=AGENT).read(m.n)

    def holds():
        f = gate_file(record.root, record.env, "claude-1")
        return json.loads(f.read_text()) if f.is_file() else {}

    def said():
        return [n for n in nudges(record) if "before you write" in n]

    assert said() == [], "before the next tool use nothing is said"
    report(record, "working", "PreToolUse")
    assert said() == ["answer message 1 before you write anything"], \
        "the first tool use after reading names the message and says to answer it"
    assert holds().get("status", "") == "", "nothing is refused over it: it tells, it does not hold"
    for i in range(5):
        report(record, "working", "PreToolUse")
    assert len(said()) == 3, "said three times in all and then it lets the agent be"
    Messages(record, actor=AGENT).reply(m.n, "halfway: the build is green, wiring the last route")
    report(record, "working", "PreToolUse")
    assert holds().get("status", "") == "", "a reply settles it and lifts the hold"


def test_unread_messages_are_nudged_with_growing_urgency_until_the_inbox_is_read():
    record = fresh()

    def gate():
        f = gate_file(record.root, record.env, "claude-1")
        return json.loads(f.read_text()).get("messages.unread", "") if f.is_file() else ""

    Works(record, actor=AGENT).create("something open")

    def inbox():
        return [n for n in nudges(record) if "inbox" in n]

    def use(n):
        report(record, "working", "PreToolUse", uses=n)

    use(1)
    assert inbox() == [], "nothing unread: nothing said"
    Messages(record, actor=USER).create("look at the header")
    use(2)
    assert inbox() == ["there are new messages in your inbox"], \
        "the first tool use after a message arrives: told at once, without numbers"
    use(3)
    use(4)
    assert len(inbox()) == 1, "then every third use"
    use(5)
    assert len(inbox()) == 2, "the third: told again"
    for n in range(6, 15):
        use(n)
    assert (len(inbox()), gate()) == (5, ""), "fifteen uses in: five nudges, still no hold"
    use(15)
    use(16)
    use(17)
    assert gate() == "your inbox is unread: journal message unread, then journal message read <n> for each, before any other write", \
        "the sixth nudge: the gate holds until the inbox is read"
    Messages(record, actor=AGENT).read(1)
    use(18)
    assert (gate(), len(inbox())) == ("", 6), "read: released, and nothing more is said"
    Messages(record, actor=USER).create("another")
    use(19)
    assert (len(inbox()), gate()) == (7, ""), "a new message: told at once again, the count starting over"

    patient = fresh()
    patient.set_setting("messages", {"unread.patience": 0})
    Works(patient, actor=AGENT).create("open")
    Messages(patient, actor=USER).create("hi")
    report(patient, "working", "PreToolUse", uses=3)
    report(patient, "working", "PreToolUse", uses=6)
    assert (held(patient, "claude-1") != "") is True, "patience is a setting"

    assert all(n.data.get("private") for n in Nudges(record).all() if "inbox" in n.title) is True, \
        "the inbox nudge is private"
    assert all(n.data.get("session") == "claude-1" for n in Nudges(record).all() if "inbox" in n.title) is True, \
        "the inbox nudge is meant for its own session, and the engine speaks it"
    provider = PROVIDERS["claude"]()
    assert handle(provider, record.root, record.env, {"hook_event_name": "PostToolUse", "session_id": "claude-1", "tool_name": "Read"}) == {}, \
        "the hook only reports; it hands nothing back"


def test_a_private_nudge_reaches_the_session_it_names_whichever_name_it_uses():
    from types import SimpleNamespace
    from engine.engine import Engine
    from providers import DRIVERS
    record = fresh()
    engine = Engine(record, DRIVERS["claude"](record, "claude-99"))
    engine.agent.driver.last_report = lambda: SimpleNamespace(title="claude-1")
    since = record.last_event()
    Nudges(record).create("for this session", session="claude-1", private=True)
    Nudges(record).create("for another", session="claude-2", private=True)
    heard = {e.data.get("title") or e.n: engine.elsewhere(e) for e in record.events(since)}
    assert list(heard.values()) == [False, True], "the terminal is claude-99 but the session is claude-1: its own nudge is spoken"
