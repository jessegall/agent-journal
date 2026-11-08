from core.modules.messages.messages_module import MessagesModule
from datetime import timedelta

import pytest

from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.scope.scopes import Scopes
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.registry.registry import Registry
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from core.base.refusal import Refusal
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.commands.keep_dock_item.keep_dock_item import KeepDockItem
from tests.stories.core.modules.docking.support.dock_samples import SAMPLE, TIMEOUT_SECONDS, SampleDockType, docked, docked_state, ended_task, running_task, expect_docked_state, leave_tick
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_events_window_with, expect_value_2


def test_an_environment_has_one_dock_made_with_it(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    story.run_listeners()
    expect_value_2(story, "SELECT count(*) FROM docks", 1)
    story.expect_refusal("dock make --environment main", "exists already")


def test_items_are_added_within_the_types_limit(ended_pair):
    story, first, second = ended_pair
    expect_docked_state_4(story, first, second, ("docked", "docked"))


def test_at_the_types_limit_the_oldest_ended_item_that_is_not_kept_undocks(ended_pair):
    story, first, second = ended_pair
    third = ended_task(story, "Third")
    oldest, newer = docked(story, first), docked(story, second)
    story.container.get(Bus).run(KeepDockItem(oldest.id), story.user)
    with story.repeated_work.request():
        added = docked(story, third)
    expect_docked_state_3(story, oldest, newer, added, ("docked", "undocked", "docked"))


def test_two_items_added_in_one_request_to_a_full_dock_read_the_items_of_the_chat_once(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    for title in ("First", "Second"):
        docked(story, running_task(story, title))
    third, fourth = ended_task(story, "Third"), ended_task(story, "Fourth")
    bus, database = story.container.get(Bus), story.container.get(Database)
    refused = []
    with story.repeated_work.request(), story.container.get(Scopes).command_scope((), story.agent, 1), database.transaction():
        for task in (third, fourth):
            command = AddDockItem(SampleDockType.TASK, "task", task)
            try:
                bus.dispatch(command, Context(story.agent, story.clock.timestamp(), command, environment_id=1))
            except Refusal as refusal:
                refused.append(refusal.reason)
    story.expect_rows(len(refused) == 2, detail=str(refused))


def test_with_every_item_kept_or_running_the_add_is_refused_naming_the_limit(kept_dock):
    story, item = kept_dock
    running, third = running_task(story, "Running"), ended_task(story, "Third")
    docked(story, running)
    with pytest.raises(Refusal, match="docksample.task allows at most 2 items"):
        docked(story, third)


def test_an_item_leaves_after_its_time_unless_it_was_kept(leaving_dock):
    story, leaves = leaving_dock
    stays = docked(story, ended_task(story, "Staying"))
    story.container.get(Bus).run(KeepDockItem(stays.id), story.user)
    story.advance(timedelta(seconds=TIMEOUT_SECONDS + 1))
    leave_tick(story)
    expect_docked_state_2(story, leaves, stays, ("undocked", "docked"))


def test_an_item_leaves_on_a_tick_after_a_change_in_another_environment(leaving_dock):
    story, leaves = leaving_dock
    story.expect_success("environment make other /work/other", actor=story.user)
    story.advance(timedelta(seconds=TIMEOUT_SECONDS + 1))
    story.run('task make "Tick" --environment other', actor=story.user)
    story.run_listeners()
    leave_tick(story)
    expect_docked_state(story, leaves, "undocked")


def test_a_row_is_docked_once_per_type(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    task_id = ended_task(story, "Once")
    docked(story, task_id)
    with pytest.raises(Refusal, match="task .* is docked already"):
        docked(story, task_id)


def test_a_type_no_module_declares_is_refused(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    with pytest.raises(Refusal, match="no installed module declares the dock type docksample.ghost"):
        docked(story, ended_task(story, "Ghost"), SampleDockType.UNKNOWN_TYPE)


def test_a_dock_holds_no_more_items_than_its_setting_allows(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    story.expect_success("setting make journal.core.docking.most-items 1 --environment main")
    docked(story, running_task(story, "First"))
    with pytest.raises(Refusal, match="the dock allows at most 1 items"):
        docked(story, running_task(story, "Second"))


def test_a_type_that_reads_no_such_model_is_refused(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    with pytest.raises(Refusal, match="the dock type docksample.task reads no plan"):
        story.container.get(Bus).run(AddDockItem(SampleDockType.TASK, "plan", 1), story.user, environment_id=1)


def test_an_environment_cannot_act_on_another_environments_item(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    story.run("environment make elsewhere /work/elsewhere")
    item = docked(story, ended_task(story, "Mine"))
    story.expect_refusal(f"dock keep {item.id} --environment elsewhere", "belongs to another environment's dock", actor=story.user)


def test_an_agent_undocks_an_item_a_person_kept(kept_dock):
    story, item = kept_dock
    story.expect_success(f"dock remove {item.id}", actor=story.agent)


def test_the_chat_window_reads_the_dock_and_follows_its_events(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    window = Registry.read(story.container.get(Database)).window("messages.chat")
    expect_reads_window_with(window, "dock-item main")
    expect_events_window_with(window, "dock_item.*")
    WindowStory(story).expect_window_allowed("messages.chat", "dock-item main")


def test_a_docked_document_carries_its_abstract_to_read_when_the_card_is_expanded(new_story):
    story = new_story(fixture=UserJoined)
    story.run('doc make "Cart rules" --abstract "How the cart counts money" --body "All of it"', actor=story.agent)
    story.run_listeners()
    story.expect_text("dock-item list --oldest", "Cart rules", "How the cart counts money")


def test_an_item_carries_the_title_and_the_text_of_its_row(running_cart_task):
    story, task_id = running_cart_task
    item = docked(story, task_id)
    expect_title(story, item, "Task 1")
    expect_output_with_2(story, "dock-item list", "Task 1")


def test_an_item_whose_type_gives_it_no_title_is_refused_and_says_where_to_fix_it(running_cart_task):
    story, task_id = running_cart_task
    with pytest.raises(Refusal, match="has no title"):
        docked(story, task_id, SampleDockType.UNTITLED)


def test_the_chat_window_may_run_the_buttons_of_its_docked_cards():
    chat = next(window for window in MessagesModule.windows if window.name == "messages.chat")
    expect_value_limit("dock remove", "dock keep", "dock unkeep", set(chat.runs))



@pytest.fixture
def ended_pair(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    return story, ended_task(story, "First"), ended_task(story, "Second")


@pytest.fixture
def kept_dock(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    item = docked(story, ended_task(story, "Kept"))
    story.container.get(Bus).run(KeepDockItem(item.id), story.user)
    return story, item


@pytest.fixture
def leaving_dock(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    return story, docked(story, ended_task(story, "Leaving"))


@pytest.fixture
def running_cart_task(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    return story, running_task(story, "Fix the cart")


def expect_value_limit(text, text_2, text_3, expected) -> None:
    actual = {text, text_2, text_3}
    assert actual <= expected, actual


def expect_title(story, item, expected) -> None:
    actual = story.row(type(item), item.id).title
    assert actual == expected, actual


def expect_output_with_2(story, text, expected) -> None:
    actual = story.run(text).output_text
    assert expected in actual, actual


def expect_reads_window_with(window, expected) -> None:
    actual = window.reads
    assert expected in actual, actual


def expect_docked_state_2(story, leaves, stays, expected) -> None:
    actual = (docked_state(story, leaves), docked_state(story, stays))
    assert actual == expected, actual


def expect_docked_state_3(story, oldest, newer, added, expected) -> None:
    actual = (docked_state(story, oldest), docked_state(story, newer), docked_state(story, added))
    assert actual == expected, actual


def expect_docked_state_4(story, first, second, expected) -> None:
    actual = (docked_state(story, docked(story, first)), docked_state(story, docked(story, second)))
    assert actual == expected, actual
