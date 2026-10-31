from datetime import timedelta

import pytest

from core.base.command.bus import Bus
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.registry.registry import Registry
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from core.base.refusal import Refusal
from core.modules.docking.commands.add_dock_item import AddDockItem
from core.modules.docking.commands.keep_dock_item import KeepDockItem
from tests.stories.core.modules.docking.support.dock_samples import SAMPLE, TIMEOUT_SECONDS, SampleDockType, docked, docked_state, ended_task, running_task
from tests.stories.core.support.fixtures import UserJoined


def test_an_environment_has_one_dock_made_with_it(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    story.run_listeners()
    assert story.container.get(Database).rows(Statement("SELECT count(*) FROM docks"))[0][0] == 1
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
    with pytest.raises(Refusal, match="docksample.task allows at most 2 items"):
        docked(story, third)


def test_an_item_leaves_after_its_time_unless_it_was_kept(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    leaving, staying = ended_task(story, "Leaving"), ended_task(story, "Staying")
    leaves, stays = docked(story, leaving), docked(story, staying)
    story.container.get(Bus).run(KeepDockItem(stays.id), story.user)
    story.advance(timedelta(seconds=TIMEOUT_SECONDS + 1))
    story.run('task make "Tick" --environment main', actor=story.user)
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


def test_a_dock_holds_no_more_items_than_its_setting_allows(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    story.expect_success("setting make journal.core.docking.most-items 1 --environment main")
    docked(story, running_task(story, "First"))
    with pytest.raises(Refusal, match="the dock allows at most 1 items"):
        docked(story, running_task(story, "Second"))


def test_a_type_that_reads_no_such_model_is_refused(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    with pytest.raises(Refusal, match="the dock type docksample.task reads no plan"):
        story.container.get(Bus).run(AddDockItem(1, SampleDockType.TASK, "plan", 1), story.user)


def test_an_environment_cannot_act_on_another_environments_item(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    story.run("environment make elsewhere /work/elsewhere")
    item = docked(story, ended_task(story, "Mine"))
    story.expect_refusal(f"dock keep {item.id} --environment elsewhere", "belongs to another environment's dock", actor=story.user)


def test_an_agent_cannot_undock_or_unkeep_an_item_a_person_kept(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    item = docked(story, ended_task(story, "Kept"))
    story.container.get(Bus).run(KeepDockItem(item.id), story.user)
    story.expect_refusal(f"dock remove {item.id}", "stays because a person chose to keep it", actor=story.agent)
    story.expect_success(f"dock remove {item.id}", actor=story.user)


def test_the_chat_window_reads_the_dock_and_follows_its_events(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    window = Registry.read(story.container.get(Database)).window("messages.chat")
    assert "dock-item list" in window.reads and "dock_item.*" in window.events
    WindowStory(story).expect_window_allowed("messages.chat", "dock-item list")
