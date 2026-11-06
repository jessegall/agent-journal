from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent
from tests.stories.core.modules.tasks.task_waits import TwoTasks, posted


def test_a_plain_reason_tells_the_agent_how_to_make_the_block_open_itself(new_story):
    story = new_story(fixture=TwoTasks)
    story.expect_success('task block 1 --reason "Need the result"', actor=story.agent)
    story.expect_hook_allowed('s-1', posted('journal task block 1 --reason "Need the result"'), '--on', 'plain reason waits for a person')
    story.expect_absent_hook_line('s-1', posted('journal task block 1 --until-user --reason "Need the result"'), 'plain reason')
    story.expect_success('task show 1', 'state: blocked')


def test_a_task_waiting_for_a_helper_opens_when_its_report_arrives(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    task = story.new_row_id('task make "Read the report" --environment main', actor=story.agent)
    story.expect_success(f'task block {task} --on helper:{helper.id}', 'state: blocked', actor=story.agent)
    story.expect_text(f'task inspect {task} --json', f'helper {helper.id} reports')
    story.expect_success(f'agent end {helper.id}', actor=story.user)
    story.run_listeners()
    story.expect_success(f'task show {task}', 'state: open')
