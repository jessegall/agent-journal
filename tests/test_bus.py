import pytest
from engine import bus
from resources.base import ACTIONS, Event
from resources.types import TYPES


def event(type_, action, n=1):
    return Event(id=n, at=0.0, type=type_, n=n, action=action, actor="user")


def test_listeners_on_everything_on_a_type_and_on_a_type_action_pair_hear_what_they_asked_for():
    heard = []
    bus.clear()
    off_all = bus.on(bus.ANY, lambda e, r: heard.append(("*", e.ref, e.action)))
    bus.on("todo", lambda e, r: heard.append(("todo", e.ref, e.action)))
    bus.on("deleted", lambda e, r: heard.append(("deleted", e.ref, e.action)))
    bus.on("plan.created", lambda e, r: heard.append(("plan.created", e.ref, e.action)))

    bus.emit(event("todo", "created"))
    assert heard == [("*", "todo:1", "created"), ("todo", "todo:1", "created")], \
        "a listener on everything and one on the type hear a to-do created"
    heard.clear()

    bus.emit(event("plan", "deleted", 3))
    assert heard == [("*", "plan:3", "deleted"), ("deleted", "plan:3", "deleted")], \
        "the action listener and the exact type.action listener are distinct hooks"
    heard.clear()

    bus.emit(event("plan", "created", 4))
    assert heard == [("*", "plan:4", "created"), ("plan.created", "plan:4", "created")], "type.action hears only that pair"
    heard.clear()

    off_all()
    bus.emit(event("doc", "updated", 5))
    assert heard == [], "a listener taken off hears nothing more"


@pytest.mark.parametrize("type_", TYPES)
def test_every_action_reaches_the_listener_on_the_type_in_order(type_):
    bus.clear()
    heard = []
    off = bus.on(type_, lambda e, r: heard.append((e.ref, e.action)))
    for action in ACTIONS:
        bus.emit(event(type_, action))
    assert heard == [(f"{type_}:1", a) for a in ACTIONS]
    off()


def test_cleared_nothing_listens_nothing_breaks():
    bus.clear()
    heard = []
    bus.emit(event("todo", "created"))
    assert heard == []
