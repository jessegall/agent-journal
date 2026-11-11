from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted, OpenTaskBuilder

FACT_COMMAND = 'memory make "The cart total is in cents" --environment main'
COMPACTION = HookSamples.sample("compact")
SESSION_AFTER_COMPACTION = HookSamples.session_start().with_raw({"source": "compact"})


def compaction_started(story, session: str = "s-1") -> None:
    story.hook(session, COMPACTION)
    story.run_listeners()


def compacted(story, session: str = "s-1") -> None:
    compaction_started(story, session)
    story.hook(session, SESSION_AFTER_COMPACTION)
    story.run_listeners()


def test_a_main_agent_s_compaction_fades_its_environment_s_memories_of_every_type(new_story):
    story = new_story(fixture=BuilderStarted)
    fact_id = story.new_row_id(FACT_COMMAND, actor=story.agent)
    reminder_id = story.new_row_id('memory make "Log each step" --environment main', actor=story.agent)
    compacted(story)
    story.expect_success(f"memory show {fact_id}", "weight: 4")
    story.expect_success(f"memory show {reminder_id}", "weight: 4")


def test_a_main_agent_s_compaction_leaves_a_helper_s_own_facts(new_story):
    story = new_story(fixture=BuilderStarted)
    helper = Actor(story.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)
    agent_row_id = story.new_row_id('memory make "My worktree is clean" --environment main', actor=helper)
    compacted(story)
    story.expect_success(f"memory show {agent_row_id}", "weight: 5")


def test_a_fact_at_1_fades_to_0_and_is_listed_as_faded(new_story):
    story = new_story(fixture=BuilderStarted)
    fact_id = story.new_row_id('memory make "The cart total is in cents" --weight 1 --environment main', actor=story.agent)
    compacted(story)
    story.expect_success(f"memory show {fact_id}", "weight: 0")
    story.expect_success("memory faded --environment main", f"{fact_id}  The cart total is in cents")
    story.expect_success(f"memory restore {fact_id}", actor=story.agent)
    story.expect_no_text("memory faded --environment main", "The cart total is in cents")


def test_a_compaction_during_a_wait_still_fades(new_story):
    story = new_story(fixture=OpenTaskBuilder)
    fact_id = story.new_row_id(FACT_COMMAND, actor=story.agent)
    story.run("wait on 'the review' --target tasks:1", actor=story.agent)
    compacted(story)
    story.expect_success(f"memory show {fact_id}", "weight: 4")


def test_a_compaction_fades_once_and_only_when_it_has_ended_before_the_agent_lists_its_memories(new_story):
    story = new_story(fixture=BuilderStarted)
    fact_id = story.new_row_id('memory make "The receipt is printed last" --weight 3 --environment main', actor=story.agent)
    compaction_started(story)
    compaction_started(story)
    story.expect_success(f"memory show {fact_id}", "weight: 3")
    story.hook("s-1", SESSION_AFTER_COMPACTION)
    story.expect_text("memory list --environment main", "The receipt is printed last  2", actor=story.agent)
    story.hook("s-1", SESSION_AFTER_COMPACTION)
    story.run_listeners()
    story.expect_success(f"memory show {fact_id}", "weight: 2")
