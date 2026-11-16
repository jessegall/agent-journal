from datetime import timedelta

import pytest

from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.context_limit import COMPACTION_START, PRE_COMPACT, SESSION, LimitEnabled, typing_recorded



@pytest.fixture
def agent(new_story):
    story = typing_recorded(new_story(fixture=LimitEnabled))
    story.hook(SESSION, HookSamples.stop())
    return story


def test_the_model_control_is_typed_into_the_stopped_agents_terminal(agent):
    agent.expect_success(f"agent control {agent_number(agent, agent.agent.id)} model opus --environment main", actor=agent.user)
    agent.expect_rows("/model opus" in agent.typing.typed, detail=str(agent.typing.typed))


def test_pause_and_resume_lines_are_typed_into_the_stopped_agents_terminal(agent):
    number = agent_number(agent, agent.agent.id)
    agent.expect_success(f"agent pause {number}", actor=agent.user)
    agent.expect_success(f"agent resume {number}", actor=agent.user)
    agent.run_listeners()
    agent.expect_rows(len(agent.typing.typed) >= 1, detail=str(agent.typing.typed))


def test_the_compacted_wake_is_typed_into_the_agents_terminal(agent):
    agent.hook(SESSION, PRE_COMPACT.with_raw({"trigger": "manual"}))
    agent.hook(SESSION, COMPACTION_START)
    agent.advance(timedelta(seconds=11))
    agent.tick(SESSION)
    agent.run_listeners()
    agent.expect_rows(any("compacted" in line for line in agent.typing.typed), detail=str(agent.typing.typed))
