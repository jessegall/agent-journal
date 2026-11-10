from datetime import timedelta

import pytest

from engine.event.event_log import EventLog
from engine.event.touched import Touched
from engine.database.database import Database
from core.modules.docking.listeners.dock_item_leave_listener import DockItemLeaveListener
from core.modules.docking.models.dock_item import DockItem
from tests.stories.core.modules.docking.support.dock_samples import SAMPLE, TIMEOUT_SECONDS, docked, ended_task, expect_docked_state, leave_tick, running_task
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value


def test_an_item_leaves_at_its_time_on_the_tick_without_an_intervening_event(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    item = docked(story, ended_task(story, "Timed departure"))
    story.run_listeners()
    story.advance(timedelta(seconds=TIMEOUT_SECONDS - 1))
    newest_event = story.container.get(EventLog).newest_id()
    leave_tick(story)
    expect_docked_state(story, item, "docked")
    expect_value(story.container.get(EventLog).newest_id(), newest_event)
    story.advance(timedelta(seconds=1))
    leave_tick(story)
    expect_docked_state(story, item, "undocked")


def test_an_items_row_ending_schedules_its_departure(running_docked_task):
    story, task_id, item = running_docked_task
    story.expect_success(f'task close {task_id} --outcome "Done"', actor=story.agent)
    story.run_listeners()
    saved_item = story.row(DockItem, item.id)
    expect_value(saved_item.leaves_at is not None, True)
    expect_docked_state(story, item, "docked")
    story.advance(timedelta(seconds=TIMEOUT_SECONDS))
    leave_tick(story)
    expect_docked_state(story, item, "undocked")


def test_an_event_for_another_row_loads_no_dock_item(running_docked_task):
    story, _, item = running_docked_task
    story.expect_success('message send "Unrelated" --environment main', actor=story.user)
    logged = next(event for event in story.container.get(EventLog).events_after(0) if event.event == "message.create")
    listener = story.container.get(DockItemLeaveListener)
    database = story.container.get(Database)
    start = database.repeated_work.points()
    listener.handle(Touched(), logged)
    cost = database.repeated_work.points().minus(start)
    expect_value(cost.tables["dock_items"], 0)
    expect_docked_state(story, item, "docked")


@pytest.fixture
def running_docked_task(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    task_id = running_task(story, "Running")
    item = docked(story, task_id)
    story.run_listeners()
    return story, task_id, item
