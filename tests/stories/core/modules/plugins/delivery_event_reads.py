import json

import pytest

from engine.change.event_log import EventLog
from engine.database.database import Database
from core.modules.tasks.models.task import Task
from engine.query.queries import Queries
from tests.stories.core.modules.plugins.support.event_stories import SECOND_JOB, SECOND_JOB_TITLE, deliveries, event_plugin_story, tasks_titled

TASK_UPDATED = "core.tasks.task.updated"
EVENT_COUNT = 100
ROW_EVENT_READ = "FROM events WHERE row_table"


@pytest.mark.story_budget(cpu_seconds=8.0, reason="it writes 100 events on one row to prove a delivery reads one")
def test_a_delivery_on_a_row_with_100_events_reads_one_event_row_and_names_the_newest(new_story):
    story = event_plugin_story(new_story, {"event": TASK_UPDATED, "commit": "see.sh"})
    story.expect_success(SECOND_JOB, actor=story.agent)
    task = tasks_titled(story, SECOND_JOB_TITLE)[0]
    for number in range(EVENT_COUNT):
        story.expect_success(f'task edit {task.id} --brief "Do it, version {number}"', actor=story.agent)
    database = story.container.get(Database)
    start = database.repeated_work.points()
    story.expect_success(f'task edit {task.id} --brief "The last version"', actor=story.agent)
    cost = database.repeated_work.points().minus(start)
    rows_read = sum(rows for statement, rows in cost.statements.items() if ROW_EVENT_READ in statement)
    newest = story.container.get(EventLog).latest_row(story.container.get(Queries).query(Task).table.name, task.id, ["task.update"])
    delivery = deliveries(story)[-1]
    story.expect_rows(rows_read == 1, newest is not None, delivery.event_id == newest.id, json.loads(delivery.data)["event_id"] == newest.id)
