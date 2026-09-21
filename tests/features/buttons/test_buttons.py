import pytest

import features
from controllers.types import Messages
from features.buttons.feature import MOST, shaped
from resources.base import AGENT
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_a_button_names_a_type_and_action_and_what_would_not_run_is_dropped():
    record = fresh()
    rows = Messages(record, actor=AGENT)

    start = {"label": "Okay, start", "type": "plan", "n": 3, "action": "activate"}
    assert shaped(record, [start]) == [start], "a button on a row is kept as it was written"
    assert shaped(record, [{"label": "New to-do", "type": "todo", "action": "add", "body": {"title": "one"}}]) == \
        [{"label": "New to-do", "type": "todo", "action": "add", "body": {"title": "one"}}], "a type-level button needs no row"
    assert shaped(record, [{"label": "Done", "type": "todo", "n": 1, "action": "done"}]) == \
        [{"label": "Done", "type": "todo", "action": "done", "n": 1}], "a word the type renames is an action too"

    assert shaped(record, [{"label": "Go", "type": "nonsense", "n": 1, "action": "all"}]) == [], "a type nobody has is dropped"
    assert shaped(record, [{"label": "Go", "type": "plan", "n": 1, "action": "detonate"}]) == [], \
        "an action the type does not have is dropped"
    assert shaped(record, [{"label": "  ", "type": "plan", "n": 1, "action": "activate"}]) == [], "a button with no label is dropped"
    assert (shaped(record, "go"), shaped(record, [7])) == ([], []), "what is not a list of objects is nothing"
    assert len(shaped(record, [start] * (MOST + 3))) == MOST, "no more than five are kept"
    assert shaped(record, [{**start, "again": True}]) == [{**start, "again": True}], "a button may say it can be pressed again"

    made = rows.create("Ready when you are", buttons=[start, {"label": "Go", "type": "plan", "n": 1, "action": "detonate"}])
    assert rows.load(made.n).data["buttons"] == [start], "the message keeps the button that runs and drops the one that does not"
    plain = rows.create("Nothing to press")
    assert ("buttons" in rows.load(plain.n).data) is False, "a message with no buttons is left alone"
    later = rows.create("buttons put on afterwards")
    rows.update(later.n, buttons=[{"label": "Go", "type": "plan", "n": 1, "action": "detonate"}, start])
    assert rows.load(later.n).data["buttons"] == [start], "buttons added after the message was written are cleaned the same way"
