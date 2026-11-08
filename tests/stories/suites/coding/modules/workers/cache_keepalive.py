from datetime import timedelta

import pytest

from core.modules.helpers.support.helper_settings import COLD_SESSION_MINUTES
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.suites.coding.modules.workers.context_limit import typing_recorded

SESSION = "s-1"
CACHE_MINUTES = 55


@pytest.fixture
def idle_agent(new_story):
    story = typing_recorded(new_story(fixture=BuilderWithUser))
    story.hook(SESSION, HookSamples.stop())
    return story


def ticks_after(story, minutes: int) -> None:
    story.advance(timedelta(minutes=minutes))
    story.tick(SESSION)


def test_an_idle_main_agent_is_woken_when_its_cache_has_lasted_the_interval_and_not_before(idle_agent):
    story = idle_agent
    ticks_after(story, CACHE_MINUTES - 1)
    story.expect_rows(story.typing.typed == [], detail=str(story.typing.typed))
    ticks_after(story, 1)
    story.expect_rows(len(story.typing.typed) == 1 and "prompt cache" in story.typing.typed[0], detail=str(story.typing.typed))


@pytest.fixture
def woken_agent(idle_agent):
    ticks_after(idle_agent, CACHE_MINUTES)
    return idle_agent


def test_a_woken_agent_is_not_woken_again_at_once(woken_agent):
    story = woken_agent
    ticks_after(story, 1)
    story.expect_rows(len(story.typing.typed) == 1, detail=str(story.typing.typed))


def test_an_agent_that_answers_the_line_is_woken_again_after_another_interval(woken_agent):
    story = woken_agent
    story.hook(SESSION, HookSamples.prompt(story.typing.typed[0]))
    story.hook(SESSION, HookSamples.stop())
    ticks_after(story, CACHE_MINUTES - 1)
    story.expect_rows(len(story.typing.typed) == 1, detail=str(story.typing.typed))
    ticks_after(story, 1)
    story.expect_rows(len(story.typing.typed) == 2, detail=str(story.typing.typed))


def test_an_agent_that_is_working_is_not_woken(new_story):
    story = typing_recorded(new_story(fixture=BuilderWithUser))
    story.hook(SESSION, HookSamples.prompt("go on"))
    story.hook(SESSION, HookSamples.edit("src/cart.py"))
    ticks_after(story, CACHE_MINUTES + 5)
    story.expect_rows(story.typing.typed == [], detail=str(story.typing.typed))


def test_with_the_interval_at_zero_no_agent_is_woken(idle_agent):
    story = idle_agent
    story.expect_success(f"setting set {COLD_SESSION_MINUTES} 0 --project", actor=story.user)
    ticks_after(story, CACHE_MINUTES + 5)
    story.expect_rows(story.typing.typed == [], detail=str(story.typing.typed))
