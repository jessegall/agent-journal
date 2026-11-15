from datetime import timedelta

import pytest

from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.context_limit import COMPACTION_START, PRE_COMPACT, SESSION, LimitEnabled, typing_recorded

HELPER_SESSION = "s-helper"
CODEX_SESSION = "s-codex"


@pytest.fixture
def agent(new_story):
    story = typing_recorded(new_story(fixture=LimitEnabled))
    story.hook(SESSION, HookSamples.stop())
    return story


def started(story, session: str, program: str, role: str) -> None:
    story.expect_success(f"agent start {session} {program} {role} --parent {story.agent.id} --environment main", actor=story.user)
    story.hook(session, HookSamples.session_start().with_fields(program=program))


def test_the_model_control_is_typed_and_asks_no_waiter(agent):
    agent.wake_ask(SESSION)
    agent.expect_success(f"agent control {agent_number(agent, agent.agent.id)} model opus --environment main", actor=agent.user)
    agent.expect_rows("/model opus" in agent.typing.typed, agent.live_wake_waiters() == 1, detail=str(agent.typing.typed))


def test_a_helper_and_a_program_with_no_wake_hook_are_never_woken_by_a_waiter(agent):
    started(agent, HELPER_SESSION, "claude", "helper")
    agent.expect_no_wake(agent.wake_ask(HELPER_SESSION))
    started(agent, CODEX_SESSION, "codex", "helper")
    agent.expect_no_wake(agent.wake_ask(CODEX_SESSION, program="codex"))
    agent.expect_rows(agent.live_wake_waiters() == 0)


def test_pause_and_resume_lines_are_typed_even_when_a_waiter_lives(agent):
    agent.wake_ask(SESSION)
    number = agent_number(agent, agent.agent.id)
    agent.expect_success(f"agent pause {number}", actor=agent.user)
    agent.expect_success(f"agent resume {number}", actor=agent.user)
    agent.run_listeners()
    agent.expect_rows(len(agent.typing.typed) >= 1, agent.live_wake_waiters() == 1, detail=str(agent.typing.typed))


def test_the_compacted_wake_is_typed_and_never_given_to_a_waiter(agent):
    agent.hook(SESSION, PRE_COMPACT.with_raw({"trigger": "manual"}))
    agent.hook(SESSION, COMPACTION_START)
    agent.wake_ask(SESSION)
    agent.advance(timedelta(seconds=11))
    agent.tick(SESSION)
    agent.run_listeners()
    agent.expect_rows(any("compacted" in line for line in agent.typing.typed), agent.live_wake_waiters() == 1, detail=str(agent.typing.typed))
