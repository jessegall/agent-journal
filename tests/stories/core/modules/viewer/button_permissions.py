import shlex

import pytest

from core.modules.tasks.models.task import Task
from core.modules.tasks.models.support.task_priority import TaskPriority
from core.testing.expect_row import expect_row
from tests.stories.core.base.chat.support.mark_faults import PATH
from tests.stories.core.modules.viewer.support.acme_buttons_module import PATH as ACME
from tests.stories.core.modules.viewer.support.changed_acme_buttons_module import PATH as CHANGED_ACME
from tests.stories.core.modules.viewer.support.wider_acme_buttons_module import PATH as WIDER_ACME
from tests.stories.core.modules.viewer.support.coding_acme_buttons_module import PATH as CODING_ACME
from tests.stories.core.modules.drivers.support.module_memberships import PATH as SUITE_MODULES
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined

CHAT = "messages.chat"
PRESS = "task edit 1"
ALLOW = "window allow button:good --type runs --reason needed --environment main"
REFUSED = "good may run task edit once you allow it"
ACME_ALLOW = "window allow button:acme.review --type runs --environment main"
ACME_PRESS = "task edit 1 --priority=high --brief=Reviewed"
ACME_REFUSED = "acme.review may run task edit once you allow it"


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(f"{PATH}:GoodModule", fixture=UserJoined))


def test_a_third_party_button_is_refused_until_the_person_allows_it(new_story):
    window = window_story(new_story)
    window.expect_window_refusal(CHAT, PRESS, REFUSED)
    window.story.expect_success(ALLOW, actor=window.story.user)
    window.expect_window_allowed(CHAT, PRESS)


def test_a_person_who_allows_a_module_buttons_allows_them_for_themselves_only(new_story):
    window = window_story(new_story)
    window.story.expect_success(ALLOW, actor=window.new_person("Bob"))
    window.expect_window_refusal(CHAT, PRESS, REFUSED)


def test_a_button_the_journal_ships_needs_no_allowance(new_story):
    window_story(new_story).expect_window_allowed(CHAT, "plan approve 1")


def test_an_agent_cannot_allow_a_module_buttons(new_story):
    window = window_story(new_story)
    window.story.expect_refusal(ALLOW, "A person was asked in the dock", actor=window.story.agent)


def test_removing_a_module_deletes_the_permission_for_its_buttons(new_story):
    window = window_story(new_story)
    window.story.expect_success(ALLOW, actor=window.story.user)
    window.expect_row_count("window_permissions", 1)
    window.module_removed("good")
    window.expect_row_count("window_permissions", 0)


def test_allowing_buttons_no_module_declares_is_refused(new_story):
    window = window_story(new_story)
    window.story.expect_refusal("window allow button:nobody --type runs --environment main", "no installed module declares the window button:nobody", actor=window.story.user)


@pytest.fixture
def declared_button(new_story):
    window = WindowStory(new_story(ACME, fixture=UserJoined))
    window.story.expect_success("task make Review --environment main")
    return window


@pytest.fixture
def allowed_button(declared_button):
    declared_button.story.expect_success(ACME_ALLOW, actor=declared_button.story.user)
    return declared_button


def test_a_declared_button_runs_with_a_choice_and_text(allowed_button):
    allowed_button.expect_window_allowed(CHAT, ACME_PRESS)
    allowed_button.story.expect_success(ACME_PRESS, actor=allowed_button.story.user)
    expect_row(allowed_button.story.row(Task, 1), brief="Reviewed", priority=TaskPriority("high"))


def test_a_declared_choice_refuses_an_unknown_value(allowed_button):
    allowed_button.expect_window_refusal(CHAT, ACME_PRESS.replace("high", "low"), "does not declare task edit")


@pytest.mark.parametrize("value", ["--title=Injected", "", "two words", "a=b=c"])
def test_a_text_field_keeps_one_whole_value(allowed_button, value):
    line = shlex.join(["task", "edit", "1", "--priority=high", f"--brief={value}"])
    allowed_button.expect_window_allowed(CHAT, line)
    allowed_button.story.expect_success(line, actor=allowed_button.story.user)
    expect_row(allowed_button.story.row(Task, 1), title="Review", brief=value)


def test_a_declared_menu_item_uses_the_same_allowance(allowed_button):
    allowed_button.expect_window_allowed(CHAT, "task edit 1 --brief=Message")


def test_a_declared_button_needs_permission_in_each_environment(allowed_button):
    allowed_button.story.expect_success("environment make staging /work/staging")
    allowed_button.expect_window_allowed(CHAT, ACME_PRESS)
    allowed_button.expect_window_refusal(CHAT, ACME_PRESS, ACME_REFUSED, environment="staging")


def test_pruning_keeps_a_declared_button_permission(allowed_button):
    allowed_button.synced()
    allowed_button.story.run_listeners()
    allowed_button.expect_row_count("window_permissions", 1)
    allowed_button.expect_window_allowed(CHAT, ACME_PRESS)


def test_an_update_that_changes_the_whole_line_asks_again(allowed_button):
    allowed_button.module_upgraded(ACME, CHANGED_ACME)
    changed_line = ACME_PRESS + " --title=Updated"
    allowed_button.expect_window_refusal(CHAT, changed_line, ACME_REFUSED)
    allowed_button.story.expect_success(ACME_ALLOW, actor=allowed_button.story.user)
    allowed_button.expect_window_allowed(CHAT, changed_line)


def test_an_update_that_adds_a_choice_asks_again(allowed_button):
    allowed_button.module_upgraded(ACME, WIDER_ACME)
    allowed_button.expect_window_refusal(CHAT, ACME_PRESS, ACME_REFUSED)
    allowed_button.story.expect_success(ACME_ALLOW, actor=allowed_button.story.user)
    allowed_button.expect_window_allowed(CHAT, ACME_PRESS.replace("high", "low"))


def test_an_allowed_button_of_an_inactive_module_is_refused(new_story):
    window = WindowStory(new_story(CODING_ACME, f"{SUITE_MODULES}:SuiteModule", fixture=UserJoined))
    window.story.expect_success("suite choose coding --environment main", actor=window.story.user)
    window.story.expect_success(ACME_ALLOW, actor=window.story.user)
    window.expect_window_allowed(CHAT, ACME_PRESS)
    window.story.expect_success("suite choose acme --environment main", actor=window.story.user)
    window.expect_window_refusal(CHAT, ACME_PRESS, "does not declare task edit")
    window.story.expect_success("suite choose coding --environment main", actor=window.story.user)
    window.expect_window_allowed(CHAT, ACME_PRESS)
