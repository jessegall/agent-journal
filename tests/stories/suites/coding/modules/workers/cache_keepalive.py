from datetime import timedelta

import pytest

from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.suites.coding.modules.workers.context_limit import typing_recorded

SESSION = "s-1"
CACHE_MINUTES = 55


@pytest.fixture
def idle_agent(new_story):
    story = typing_recorded(new_story(fixture=UserBuilder))
    story.hook(SESSION, HookSamples.stop())
    return story


def ticks_after(story, minutes: int) -> None:
    story.advance(timedelta(minutes=minutes))
    story.tick(SESSION)


@pytest.fixture
def started_agent(idle_agent):
    ticks_after(idle_agent, CACHE_MINUTES)
    return idle_agent


def test_an_agent_that_answers_the_line_is_woken_again_after_another_interval(started_agent):
    story = started_agent
    story.hook(SESSION, HookSamples.prompt(story.typing.typed[0]))
    story.hook(SESSION, HookSamples.stop())
    ticks_after(story, CACHE_MINUTES - 1)
    story.expect_rows(len(story.typing.typed) == 1, detail=str(story.typing.typed))
    ticks_after(story, 1)
    story.expect_rows(len(story.typing.typed) == 2, detail=str(story.typing.typed))


def test_an_agent_that_is_working_is_not_woken(new_story):
    story = typing_recorded(new_story(fixture=UserBuilder))
    story.hook(SESSION, HookSamples.prompt("go on"))
    story.hook(SESSION, HookSamples.edit("src/cart.py"))
    ticks_after(story, CACHE_MINUTES + 5)
    story.expect_rows(story.typing.typed == [], detail=str(story.typing.typed))
