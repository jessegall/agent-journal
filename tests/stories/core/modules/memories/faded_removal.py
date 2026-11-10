import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story
from tests.stories.core.modules.memories.fading_at_compaction import compacted
from tests.stories.core.modules.memories.support.faded_removal import expect_removed, expect_unchanged, prepare_zero_weight_fact
from tests.stories.core.modules.memories.support.round_checks import expect_round, expect_faded_mark_count
from tests.stories.core.support.coding_fixtures import BuilderStarted

pytestmark = pytest.mark.browser_job


def test_a_memory_of_any_type_faded_to_zero_is_removed(new_story):
    story = new_story(fixture=BuilderStarted)
    fact = story.new_row_id('memory make "A temporary fact" --weight 1 --environment main')
    reminder = story.new_row_id('memory make "Log each step" --weight 1 --environment main')
    compacted(story)
    expect_removed(story, fact)
    expect_removed(story, reminder)
    expect_round(story, [], [(fact, 1, 0), (reminder, 1, 0)], [])
    story.expect_success("memory faded --environment main", f"{fact}  A temporary fact")
    compacted(story)
    expect_faded_mark_count(story, 1)


def test_a_helpers_compaction_removes_only_its_own_faded_fact(new_story):
    story = new_story(fixture=BuilderStarted)
    helper = Actor(story.new_row_id("agent start s-9 codex worker --environment main"), ActorType.AGENT)
    agent_row = story.new_row_id('memory make "My temporary fact" --weight 1 --environment main', actor=helper)
    environment = story.new_row_id('memory make "Environment context" --weight 1 --environment main')
    compacted(story, "s-9")
    expect_removed(story, agent_row)
    expect_unchanged(story, [environment], 1)


def test_a_version_four_zero_weight_fact_moves_as_removed(new_story):
    story = upgraded_story(new_story, prepare=prepare_zero_weight_fact)
    expect_removed(story, 1)
    story.expect_success("memory show 1", "type: fact", "weight: 0")
