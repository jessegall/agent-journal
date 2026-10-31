from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.support.fixtures import UserJoined


def test_an_agent_that_makes_a_project_memory_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal('memory make "Use plain words" --type fact --project --environment main', "a project memory is the user's", actor=story.agent)


def test_an_agent_that_changes_a_memory_of_another_environment_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success("environment make staging /work/staging")
    memory_id = story.new_row_id('memory make "Staging has no queue" --type fact --environment staging', actor=story.user)
    story.expect_refusal(f'memory edit {memory_id} --text "Staging has a queue"', "only in its own environment", actor=story.agent)


def test_an_agent_that_changes_another_helper_s_own_memory_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    helper = story.new_row_id("agent start s-9 claude worker --environment main")
    memory_id = story.new_row_id('memory make "My worktree is clean" --type fact --own --environment main', actor=Actor(helper, ActorType.AGENT))
    story.expect_refusal(f'memory edit {memory_id} --text "My worktree is dirty"', "another helper's own memory", actor=story.agent)
