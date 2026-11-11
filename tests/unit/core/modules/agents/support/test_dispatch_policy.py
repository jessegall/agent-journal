from contextlib import contextmanager
from dataclasses import replace

import pytest

from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_launch_guard import AgentLaunchGuard
from core.modules.agents.support.agent_stops import AgentStops
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
def test_the_default_policy_answers_as_the_launch_guard_and_the_stops_do_and_wants_no_agent_started(agent):
    policy, stops = DispatchPolicy(AgentLaunchGuard(), AgentStops()), AgentStops()
    with policy.lock(agent.session) as available:
        assert available
    assert (policy.is_wanted(agent), policy.is_final(agent), policy.takes_messages(agent)) == (False, stops.is_final(agent), stops.takes_messages(agent))


def test_a_suite_policy_gives_its_own_answers_and_keeps_the_default_for_what_it_leaves():
    policy, ended = StrictPolicy(AgentLaunchGuard(), AgentStops()), replace(SUBAGENT, ended_at=ENDED_AT)
    with policy.lock(ended.session) as available:
        assert not available
    assert (policy.is_wanted(ended), policy.is_final(ended), policy.takes_messages(ended)) == (True, False, False)
