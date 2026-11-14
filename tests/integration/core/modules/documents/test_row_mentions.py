import json
from unittest.mock import patch

from engine.database.database import Database
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value




def test_link_titles_read_tasks_together(played):
    story = played(UserJoined)
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
