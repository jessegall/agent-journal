import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story
from tests.stories.core.modules.memories.fading_at_compaction import compacted
from tests.stories.core.modules.memories.support.faded_removal import expect_removed, expect_unchanged, repair_zero_weights, prepare_zero_weight_fact
from tests.stories.core.modules.memories.support.round_checks import expect_round, expect_faded_mark_count
from tests.stories.core.support.coding_fixtures import BuilderStarted

pytestmark = pytest.mark.browser_job


def test_a_fact_faded_to_zero_is_removed_and_rules_and_other_scopes_stay_unchanged(new_story):
    story = new_story(fixture=BuilderStarted)
    fact = story.new_row_id('memory make "A temporary fact" --type fact --weight 1 --environment main')
    rule = story.new_row_id('memory make "Use plain names" --type rule --weight 1 --environment main')
    reminder = story.new_row_id('memory make "Log each step" --type reminder --weight 1 --environment main')
    project = story.new_row_id('memory make "Shared context" --type fact --weight 1 --project')
    compacted(story)
    expect_removed(story, fact)
    expect_unchanged(story, [rule, reminder, project], 1)
    expect_round(story, [], [(fact, 1, 0)], [rule, reminder, project])
    story.expect_success("memory faded --environment main", f"{fact}  fact  A temporary fact")
    compacted(story)
    expect_faded_mark_count(story, 1)


def test_a_helpers_compaction_removes_only_its_own_faded_fact(new_story):
    story = new_story(fixture=BuilderStarted)
    helper = Actor(story.new_row_id("agent start s-9 codex worker --environment main"), ActorType.AGENT)
    own = story.new_row_id('memory make "My temporary fact" --type fact --weight 1 --own --environment main', actor=helper)
    environment = story.new_row_id('memory make "Environment context" --type fact --weight 1 --environment main')
    rule = story.new_row_id('memory make "Use clear words" --type rule --weight 1 --own --environment main', actor=helper)
    compacted(story, "s-9")
    expect_removed(story, own)
    expect_unchanged(story, [environment, rule], 1)


def test_an_upgrade_removes_existing_zero_weight_facts_once_and_keeps_rules(new_story):
    story = new_story(fixture=BuilderStarted)
    repair_zero_weights(story)


def test_a_version_four_zero_weight_fact_moves_as_removed(new_story):
    story = upgraded_story(new_story, prepare=prepare_zero_weight_fact)
    expect_removed(story, 1)
    story.expect_success("memory show 1", "type: fact", "weight: 0")
