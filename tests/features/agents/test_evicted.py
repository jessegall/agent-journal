import pytest

import features
from controllers.types import Environments, Works
from engine.sessions import Sessions, allowed
from features.base import held
from resources.base import AGENT
from tests.features.kit import report
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


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
        "a subagent never writes a pin: report it, and the main conversation files it", "granted: a pin is still refused"
    assert allowed(sessions, "claude-1", "t", "", "fact") == "", "no subagent named: nothing to check"
