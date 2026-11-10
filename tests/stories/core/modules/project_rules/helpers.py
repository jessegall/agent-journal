from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderHelper
from tests.stories.support.story_checks import expect_value_with, expect_value_without

RULE_LINE = "1 project rules hold"
SHARED_MEMORY = "The cart total is in cents"
WORKTREE_MEMORY = "My worktree is clean"


class SharedMemoryKept(StoryFixture):
    parent = BuilderHelper

    def steps(self, story):
        story.expect_success(f'memory make "{SHARED_MEMORY}" --environment main', actor=story.agent)


def test_a_worker_and_a_helper_start_with_the_rules_and_none_of_the_main_agents_memories(new_story):
    story = new_story(fixture=SharedMemoryKept)
    story.expect_success('rule make "Name things plainly"')
    story.new_row_id("agent start s-9 claude worker --environment main")
    worker_lines = story.hook("s-9", HookSamples.session_start()).lines
    story.new_row_id(f"agent start sub-2 claude helper --parent {story.agent.id} --environment main")
    subagent_lines = story.hook("sub-2", HookSamples.session_start()).lines
    expect_value_with(" ".join(worker_lines), RULE_LINE)
    expect_value_with(" ".join(subagent_lines), RULE_LINE)
    expect_value_without(" ".join(worker_lines), SHARED_MEMORY)
    expect_value_without(" ".join(subagent_lines), SHARED_MEMORY)


def test_a_worker_that_starts_again_is_told_only_of_the_memories_it_made_itself(new_story):
    story = new_story(fixture=SharedMemoryKept)
    worker = Actor(story.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)
    story.hook("s-9", HookSamples.session_start())
    story.expect_success(f'memory make "{WORKTREE_MEMORY}" --environment main', actor=worker)
    story.expect_hook_allowed("s-9", HookSamples.session_start().with_raw({"source": "compact"}), "1 memories to read")


def test_a_main_agents_memory_never_reaches_a_worker_by_its_keyword(new_story):
    story = new_story(fixture=SharedMemoryKept)
    story.expect_success("memory-keyword make 1 cart", actor=story.agent)
    story.new_row_id("agent start s-9 claude worker --environment main")
    story.hook("s-9", HookSamples.session_start())
    story.expect_absent_hook_line("s-9", HookSamples.prompt("look at the cart"), "memory:1")


def test_a_workers_compaction_fades_only_what_it_made_itself(new_story):
    story = new_story(fixture=SharedMemoryKept)
    worker = Actor(story.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)
    agent_row_id = story.new_row_id(f'memory make "{WORKTREE_MEMORY}" --environment main', actor=worker)
    story.hook("s-9", HookSamples.sample("compact"))
    story.run_listeners()
    story.expect_success("memory show 1", "weight: 5")
    story.expect_success(f"memory show {agent_row_id}", "weight: 4")


def test_what_a_worker_keeps_reaches_neither_the_main_agent_nor_a_second_worker(new_story):
    story = new_story(fixture=SharedMemoryKept)
    worker = Actor(story.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)
    second_worker = Actor(story.new_row_id("agent start s-10 claude worker --environment main"), ActorType.AGENT)
    story.expect_success(f'memory make "{WORKTREE_MEMORY}" --environment main', actor=worker)
    story.expect_absent("memory list --environment main", SHARED_MEMORY, actor=worker)
    story.expect_text("memory list --environment main", WORKTREE_MEMORY, actor=worker)
    story.expect_absent("memory list --environment main", WORKTREE_MEMORY, actor=story.agent)
    story.expect_absent("memory list --environment main", WORKTREE_MEMORY, actor=second_worker)
    story.expect_absent("memory list --environment main", WORKTREE_MEMORY, actor=story.helper)
