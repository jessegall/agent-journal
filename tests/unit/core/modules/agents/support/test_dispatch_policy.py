from contextlib import contextmanager
from dataclasses import replace

import pytest

from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.agent_session_state import AgentSessionState
from core.modules.agents.support.dispatch_policy import DispatchPolicy
from engine.time.timestamp import Timestamp

ENDED_AT = Timestamp.parsed("2026-10-31T09:00:00+00:00")
MAIN = Agent(id=40, creator_id=1, session="s-1", program="claude", role="main", number=1)
HELPER = Agent(id=41, creator_id=1, session="s-2", program="claude", role="helper", number=2, profile="journal-researcher")
SUBAGENT = Agent(id=42, creator_id=1, session="s-3", program="claude", role="helper", number=3)
AGENTS = [MAIN, replace(MAIN, ended_at=ENDED_AT), HELPER, replace(HELPER, ended_at=ENDED_AT), replace(HELPER, ended_at=ENDED_AT, retired_at=ENDED_AT),
          SUBAGENT, replace(SUBAGENT, ended_at=ENDED_AT)]


class StrictPolicy(DispatchPolicy):
    """A made-up suite policy: every agent should run, none is gone for good, and no session may start now."""

    @contextmanager
    def lock(self, session: str):
        yield False

    def is_wanted(self, agent: Agent) -> bool:
        return True

    def is_final(self, agent: Agent) -> bool:
        return False


@pytest.mark.parametrize("agent", AGENTS)
def test_the_default_policy_lets_a_session_start_wants_no_agent_started_and_calls_an_ended_agent_final(agent):
    policy, is_ended = DispatchPolicy(), agent.ended_at is not None
    with policy.lock(agent.session) as available:
        assert available
    assert policy.prepare(agent) is AgentSessionState.READY
    assert (policy.is_wanted(agent), policy.is_final(agent), policy.takes_messages(agent)) == (False, is_ended, not is_ended or agent.is_kept_helper)


def test_a_suite_policy_gives_its_own_answers_and_keeps_the_default_for_what_it_leaves():
    policy, ended = StrictPolicy(), replace(SUBAGENT, ended_at=ENDED_AT)
    with policy.lock(ended.session) as available:
        assert not available
    assert (policy.is_wanted(ended), policy.is_final(ended), policy.takes_messages(ended)) == (True, False, False)
