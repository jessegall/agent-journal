import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.helpers.start_helper import started
from tests.stories.core.support.coding_fixtures import UserBuilder


@pytest.fixture
def story(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success('task make "Existing" --tag networking --tag linux --confirm --complexity 2 --environment main', actor=story.user)
    return story


def test_a_task_with_only_tags_asks_for_complexity(story):
    outcome = story.run('task make "Fix networking" --tag networking --environment main', actor=story.agent)
    story.expect_rows("task 2 needs complexity" in outcome.output_text, "journal task edit" not in outcome.output_text,
                      "journal task tag" not in outcome.output_text)


def test_a_task_with_only_a_score_asks_for_tags(story):
    outcome = story.run('task make "Fix networking" --complexity 3 --environment main', actor=story.agent)
    story.expect_rows("task 2 needs tags" in outcome.output_text, "journal task tag" not in outcome.output_text,
                      "journal task edit" not in outcome.output_text)


def test_a_complete_task_has_no_reminder(story):
    outcome = story.run('task make "Fix networking" --tag networking --complexity 3 --environment main', actor=story.agent)
    story.expect_rows("needs tags" not in outcome.output_text, "needs complexity" not in outcome.output_text)


def test_a_read_only_helper_is_told_to_ask_the_main_agent(story):
    helper_id, _ = started(story, 'helper start journal-planner --brief "Review tasks" --environment main')
    helper = Actor(helper_id, ActorType.AGENT)
    outcome = story.run('task make "Review networking" --environment main', actor=helper)
    story.expect_rows(outcome.code == 0, "needs tags and complexity" in outcome.output_text,
                      "ask the main agent to set them" in outcome.output_text,
                      "journal task tag" not in outcome.output_text, "journal task edit" not in outcome.output_text)
    story.expect_success('task make "Review linux" --tag linux --complexity 2 --environment main', actor=helper)
