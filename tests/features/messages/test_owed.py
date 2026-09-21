import json

import pytest

import features
from controllers.types import Agents, Messages
from engine.hooks import gate_file
from resources.base import AGENT, USER
from tests.features.kit import nudges, report
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


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


def test_a_reaction_counts_as_an_answer():
    fresh_record = fresh()
    Agents(fresh_record, actor=AGENT).by_session("claude-1")
    m2 = Messages(fresh_record, actor=USER).create("noted?")
    Messages(fresh_record, actor=AGENT).read(m2.n)
    Messages(fresh_record, actor=AGENT).react(m2.n, "👍")
    for i in range(3):
        report(fresh_record, "working", "PreToolUse")
    assert [n for n in nudges(fresh_record) if "before you write" in n] == [], "a reaction counts as an answer"
