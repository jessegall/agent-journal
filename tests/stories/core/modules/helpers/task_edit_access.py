from core.base.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent
from tests.stories.core.modules.helpers.read_only_access import journal_line


def test_a_helper_edits_its_own_task_and_not_another_agents_task(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    actor = Actor(helper.id, ActorType.AGENT)
    helper_task_id = story.new_row_id('task make "Helper task" --environment main', actor=actor)
    main_task_id = story.new_row_id('task make "Main task" --environment main', actor=story.agent)
    story.expect_hook_allowed(helper.session, journal_line('task', 'edit', str(helper_task_id), '--title', 'Corrected'))
    story.expect_success(f'task edit {helper_task_id} --title Corrected', 'title: Corrected', actor=actor)
    story.expect_refusal(f'task edit {main_task_id} --title Changed', 'created', actor=actor)
