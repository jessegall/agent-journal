from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import SubagentStarted

RULE_LINE = "1 project rules hold"
SHARED_LINE = "1 memories of the main agent"
SHARED_MEMORY = "The cart total is in cents"
OWN_MEMORY = "My worktree is clean"


def test_a_worker_and_a_subagent_start_with_the_rules_and_what_the_main_agent_shares(new_story):
    story = new_story(fixture=SubagentStarted)
    story.expect_success('rule make "Name things plainly"')
    story.expect_success(f'memory make "{SHARED_MEMORY}" --type fact --environment main', actor=story.agent)
    story.new_row_id("agent start s-9 claude worker --environment main")
    story.expect_hook_allowed("s-9", HookSamples.session_start(), RULE_LINE, SHARED_LINE)
    story.expect_hook_allowed("s-1", HookSamples.session_start().with_fields(subagent="sub-2"), RULE_LINE, SHARED_LINE)


def test_what_a_worker_keeps_reaches_neither_the_main_agent_nor_a_second_worker(new_story):
    story = new_story(fixture=SubagentStarted)
    story.expect_success(f'memory make "{SHARED_MEMORY}" --type fact --environment main', actor=story.agent)
    worker = Actor(story.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)
    second_worker = Actor(story.new_row_id("agent start s-10 claude worker --environment main"), ActorType.AGENT)
    story.expect_success(f'memory make "{OWN_MEMORY}" --type fact --environment main', actor=worker)
    story.expect_text("memory list --environment main", SHARED_MEMORY, actor=worker)
    story.expect_text("memory list --environment main", OWN_MEMORY, actor=worker)
    story.expect_absent("memory list --environment main", OWN_MEMORY, actor=story.agent)
    story.expect_absent("memory list --environment main", OWN_MEMORY, actor=second_worker)
    story.expect_absent("memory list --environment main", OWN_MEMORY, actor=story.subagent)
