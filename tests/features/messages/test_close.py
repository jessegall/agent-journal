import pytest

import features
from controllers.types import Messages
from resources.base import AGENT, SYSTEM, USER
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_a_message_closes_once_every_part_is_processed_naming_what_each_became():
    record = fresh()
    left = Messages(record, actor=USER)
    agent = Messages(record, actor=AGENT)

    m = left.create("two asks", brief="fix the header\n\nlater add a csv export")
    agent.read(m.n)
    agent.process(m.n, "fix the header", "todo 1")
    assert agent.load(m.n).completed == 0.0, "a part left: the message stays open"

    agent.process(m.n, "csv export", "todo 2")
    closed = agent.load(m.n)
    assert bool(closed.completed) is True, "every paragraph covered: closed"
    assert closed.outcome == "every part became a record: todo 1, todo 2", "the outcome names what each part became"
    assert [e.actor for e in record.events() if e.type == "message" and e.action == "completed"] == [SYSTEM], "closed by the feature"

    m2 = left.create("just read me")
    agent.read(m2.n)
    assert agent.load(m2.n).completed == 0.0, "a read message stays open"

    m3 = left.create("with a quote", brief="> what the agent said\n\nyes, do that")
    agent.process(m3.n, "yes, do that", "work")
    assert bool(agent.load(m3.n).completed) is True, "a quote needs no part of its own"

    m4 = left.create("done by hand", brief="one thing")
    agent.method("processed")(m4.n, "handled")
    assert agent.load(m4.n).outcome == "handled", "an already closed message is left as it is"

    asked = left.create("can you look at this?")
    agent.reply(asked.n, "looked, all fine")
    assert (bool(agent.load(asked.n).completed), agent.load(asked.n).outcome) == (True, "answered by the agent"), \
        "the agent's reply closes the message as answered"
    nod = left.create("thanks")
    agent.react(nod.n, "👍")
    assert agent.load(nod.n).outcome == "acknowledged by the agent", "the agent's reaction closes it as acknowledged"
    theirs = left.create("the user's own follow-up")
    left.react(theirs.n, "👍")
    assert agent.load(theirs.n).completed == 0.0, "the user's own reaction closes nothing"
    mine = agent.create("the agent's own note")
    agent.react(mine.n, "👀")
    assert agent.load(mine.n).completed == 0.0, "a message the agent wrote is never closed this way"


def test_switched_off_per_environment_a_message_stays_open():
    record = fresh()
    record.set_setting("features", {"handled": False})
    m = Messages(record, actor=USER).create("one ask")
    Messages(record, actor=AGENT).process(m.n, "one ask", "todo 1")
    assert Messages(record).load(m.n).completed == 0.0, "switched off: the message stays open"


def test_a_message_the_agent_writes_closes_once_the_user_has_read_it():
    record = fresh()
    messages = Messages(record, actor=AGENT)
    mine = messages.create("Something I wanted you to know", brief="no answer needed")
    assert bool(Messages(record).load(mine.n).completed) is False, "it stays open until the user has seen it"
    Messages(record, actor=USER).read(mine.n)
    row = Messages(record).load(mine.n)
    assert (bool(row.completed), row.outcome) == (True, "read by the user"), "once read by the user it is closed, saying so"
