import pytest

import features
from controllers.types import Messages, Facts, Todos
from resources.base import AGENT, USER
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_what_is_filed_while_a_message_is_in_hand_is_linked_to_it_until_it_closes():
    record = fresh()
    messages = Messages(record, actor=USER)
    todos = Todos(record, actor=AGENT)

    m = messages.create("please park the widget work and pin the port")
    loose = todos.create("a row with no message behind it")
    assert messages.load(m.n).refs == [], "a message the agent has not read is not in its hands"

    Messages(record, actor=AGENT).read(m.n)
    todo = todos.create("the widget work")
    pin = Facts(record, actor=AGENT).create("the port is 8422")
    assert messages.load(m.n).refs == [todo.ref, pin.ref], \
        "a to-do and a pin filed while the message is in hand are linked to it, by the feature"
    assert (loose.n in [int(r.split(":")[1]) for r in messages.load(m.n).refs if r.startswith("todo:")]) is False, \
        "the loose row from before stays unlinked"

    Todos(record, actor=USER).create("the user's own row")
    Messages(record, actor=AGENT).reply(m.n, "on it")
    assert len(messages.load(m.n).refs) == 2, "a row the user files, and the agent's reply, are not linked as what it became"

    assert bool(messages.load(m.n).completed) is True, "the agent's reply closed the message"
    later = todos.create("after the message was closed")
    assert (later.ref in messages.load(m.n).refs) is False, "a closed message takes nothing more"
