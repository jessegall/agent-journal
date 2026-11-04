from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.support.fixtures import UserJoined


def test_an_agent_that_makes_a_project_memory_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal('memory make "Use plain words" --type fact --project --environment main', "a project memory is the user's", actor=story.agent)


def test_a_main_agent_may_remove_a_project_memory_an_agent_wrote_but_not_one_the_user_wrote(new_story):
    story = new_story(fixture=UserJoined)
    agent_memory = story.new_row_id('memory make "Old habit" --type fact --project --environment main --skip-guard memories.agent-scope', actor=story.agent)
    user_memory = story.new_row_id('memory make "Plain words" --type fact --project --environment main', actor=story.user)
    story.expect_success(f'memory remove {agent_memory} --reason "out of date"', actor=story.agent)
    story.expect_refusal(f'memory remove {user_memory} --reason "out of date"', "a project memory is the user's", actor=story.agent)


def test_an_agent_that_changes_a_memory_of_another_environment_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success("environment make staging /work/staging")
    memory_id = story.new_row_id('memory make "Staging has no queue" --type fact --environment staging', actor=story.user)
    story.expect_refusal(f'memory edit {memory_id} --text "Staging has a queue"', "only in its own environment", actor=story.agent)


def test_a_helpers_memory_is_its_own_and_reaches_no_other_agent(new_story):
    story = new_story(fixture=UserJoined)
    helper = Actor(story.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)
    story.new_row_id('memory make "My worktree is clean" --type fact --environment main', actor=helper)
    story.expect_text("memory list --environment main", "My worktree is clean", actor=helper)
    story.expect_absent("memory list --environment main", "My worktree is clean", actor=story.agent)


def test_a_helper_cannot_change_a_memory_the_main_agent_shares(new_story):
    story = new_story(fixture=UserJoined)
    helper = Actor(story.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)
    memory_id = story.new_row_id('memory make "The queue is on" --type fact --environment main', actor=story.agent)
    story.expect_text("memory list --environment main", "The queue is on", actor=helper)
    story.expect_refusal(f'memory edit {memory_id} --text "The queue is off"', "the main agent's", actor=helper)


def test_a_helper_never_gets_the_main_agents_own_memory(new_story):
    story = new_story(fixture=UserJoined)
    helper = Actor(story.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)
    story.new_row_id('memory make "I keep the release for last" --type fact --own --environment main', actor=story.agent)
    story.expect_absent("memory list --environment main", "I keep the release for last", actor=helper)


def test_an_agent_that_changes_another_helper_s_own_memory_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    helper = story.new_row_id("agent start s-9 claude worker --environment main")
    memory_id = story.new_row_id('memory make "My worktree is clean" --type fact --own --environment main', actor=Actor(helper, ActorType.AGENT))
    story.expect_refusal(f'memory edit {memory_id} --text "My worktree is dirty"', "another helper's own memory", actor=story.agent)
