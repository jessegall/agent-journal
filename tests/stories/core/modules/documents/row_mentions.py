import json
from unittest.mock import patch

from engine.database.database import Database
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value


def test_a_task_a_plan_and_a_message_are_linked_once_to_what_they_name_after_the_listeners_run(new_story):
    story = new_story(fixture=UserJoined)
    target = story.new_row_id('task make "Fix the cart" --environment main')
    task = story.new_row_id(f'task make "After that" --brief "Waits on task {target}" --environment main')
    plan = story.new_row_id(f'plan make "Ship" --brief "Starts with task:{target}" --environment main')
    message = story.new_row_id(f'message send "Look at task {target} and task 999" --environment main')
    story.run_listeners()
    story.expect_text(f"link list --source task:{task}", f"mentions  task:{target}")
    story.expect_text(f"link list --source plan:{plan}", f"mentions  task:{target}")
    story.expect_text(f"link list --source message:{message}", f"mentions  task:{target}")
    story.expect_no_text(f"link list --source message:{message}", "task:999")
    story.expect_success(f'task edit {task} --title "Then that"')
    story.run_listeners()
    expect_value(story.run(f"link list --source task:{task}").output_text.count(f"mentions  task:{target}"), 1)


def test_link_titles_read_tasks_together(new_story):
    story = new_story(fixture=UserJoined)
    target = story.new_row_id('task make "Target" --environment main')
    for number in range(12):
        story.new_row_id(f'task make "Task {number}" --brief "task:{target}" --environment main')
        story.run_listeners()
    database = story.container.get(Database)
    with patch.object(database, 'rows', wraps=database.rows) as reads:
        outcome = story.run(f'link list --target task:{target} --json')
    rows = json.loads(outcome.output_text)['rows']
    story.expect_rows(len(rows) == 12, {row['source_title'] for row in rows} == {f'Task {number}' for number in range(12)})
    task_reads = [call for call in reads.call_args_list if 'FROM tasks ' in call.args[0].sql]
    expect_value(len(task_reads), 1)
