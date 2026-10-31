from datetime import timedelta

import pytest

from core.base.command.bus import Bus
from core.base.refusal import Refusal
from core.modules.docking.commands.keep_dock_item import KeepDockItem
from tests.stories.core.modules.docking.support.dock_samples import SAMPLE, TIMEOUT_SECONDS, SampleDockType, docked, docked_state, ended_task, running_task
from tests.stories.core.support.fixtures import UserJoined


def test_an_environment_has_one_dock_made_with_it(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    story.run_listeners()
    story.expect_text("dock list", "1  1")
    story.expect_refusal("dock make --environment main", "exists already")


def test_items_are_added_within_the_types_limit(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    first, second = ended_task(story, "First"), ended_task(story, "Second")
    assert (docked_state(story, docked(story, first)), docked_state(story, docked(story, second))) == ("docked", "docked")


def test_at_the_types_limit_the_oldest_ended_item_that_is_not_kept_undocks(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    first, second, third = ended_task(story, "First"), ended_task(story, "Second"), ended_task(story, "Third")
    oldest, newer = docked(story, first), docked(story, second)
    story.container.get(Bus).run(KeepDockItem(oldest.id), story.user)
    added = docked(story, third)
    assert (docked_state(story, oldest), docked_state(story, newer), docked_state(story, added)) == ("docked", "undocked", "docked")


def test_with_every_item_kept_or_running_the_add_is_refused_naming_the_limit(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    kept, running, third = ended_task(story, "Kept"), running_task(story, "Running"), ended_task(story, "Third")
    story.container.get(Bus).run(KeepDockItem(docked(story, kept).id), story.user)
    docked(story, running)
    with pytest.raises(Refusal, match="docksample.task holds at most 2 items"):
        docked(story, third)


def test_an_item_leaves_after_its_time_unless_it_was_kept(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    leaving, staying = ended_task(story, "Leaving"), ended_task(story, "Staying")
    leaves, stays = docked(story, leaving), docked(story, staying)
    story.container.get(Bus).run(KeepDockItem(stays.id), story.user)
    story.run_listeners()
    story.advance(timedelta(seconds=TIMEOUT_SECONDS + 1))
    story.run_listeners()
    assert (docked_state(story, leaves), docked_state(story, stays)) == ("undocked", "docked")


def test_a_row_is_docked_once_per_type(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    task_id = ended_task(story, "Once")
    docked(story, task_id)
    with pytest.raises(Refusal, match="task .* is docked already"):
        docked(story, task_id)


def test_a_type_no_module_declares_is_refused(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    with pytest.raises(Refusal, match="no installed module declares the dock type docksample.ghost"):
        docked(story, ended_task(story, "Ghost"), SampleDockType.GHOST)
