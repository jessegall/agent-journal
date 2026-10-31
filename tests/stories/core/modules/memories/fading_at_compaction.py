from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted, BuilderWithOpenTask

FACT_COMMAND = 'memory make "The cart total is in cents" --type fact --environment main'
COMPACTION = HookSamples.sample("compact")


def compacted(story, session: str = "s-1") -> None:
    story.hook(session, COMPACTION)
    story.run_listeners()


def test_a_main_agent_s_compaction_fades_its_environment_s_facts_and_not_the_project_s(new_story):
    story = new_story(fixture=BuilderStarted)
    fact_id = story.new_row_id(FACT_COMMAND, actor=story.agent)
    project_id = story.new_row_id('memory make "Use plain words" --type fact --project')
    compacted(story)
    story.expect_success(f"memory show {fact_id}", "weight: 4")
    story.expect_success(f"memory show {project_id}", "weight: 5")


def test_a_main_agent_s_compaction_leaves_a_helper_s_own_facts(new_story):
    story = new_story(fixture=BuilderStarted)
    helper = Actor(story.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)
    own_id = story.new_row_id('memory make "My worktree is clean" --type fact --own --environment main', actor=helper)
    compacted(story)
    story.expect_success(f"memory show {own_id}", "weight: 5")


def test_a_fact_at_1_fades_to_0_and_is_listed_as_faded(new_story):
    story = new_story(fixture=BuilderStarted)
    fact_id = story.new_row_id('memory make "The cart total is in cents" --type fact --weight 1 --environment main', actor=story.agent)
    compacted(story)
    story.expect_success(f"memory show {fact_id}", "weight: 0")
    story.expect_success("memory faded --environment main", f"{fact_id}  fact  The cart total is in cents")


def test_a_rule_and_a_reminder_never_fade(new_story):
    story = new_story(fixture=BuilderStarted)
    reminder_id = story.new_row_id('memory make "Log after each step" --type reminder --environment main', actor=story.agent)
    compacted(story)
    story.expect_success(f"memory show {reminder_id}", "weight: 5")


def test_a_compaction_during_a_wait_still_fades(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    fact_id = story.new_row_id(FACT_COMMAND, actor=story.agent)
    story.run("wait on 'the review' --target tasks:1", actor=story.agent)
    compacted(story)
    story.expect_success(f"memory show {fact_id}", "weight: 4")
