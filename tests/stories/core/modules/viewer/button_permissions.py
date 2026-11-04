from tests.stories.core.base.chat.support.mark_faults import PATH
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined

CHAT = "messages.chat"
PRESS = "task edit 1"
ALLOW = "window allow button:good --type runs --environment main"
REFUSED = "good may run task edit once you allow it"


def window_story(new_story, module: str = "GoodModule") -> WindowStory:
    return WindowStory(new_story(f"{PATH}:{module}", fixture=UserJoined))


def test_a_third_party_button_is_refused_until_the_person_allows_it(new_story):
    window = window_story(new_story)
    window.expect_window_refusal(CHAT, PRESS, REFUSED)
    window.story.expect_success(ALLOW, actor=window.story.user)
    window.expect_window_allowed(CHAT, PRESS)


def test_a_person_who_allows_a_module_buttons_allows_them_for_themselves_only(new_story):
    window = window_story(new_story)
    window.story.expect_success(ALLOW, actor=window.new_person("Bob"))
    window.expect_window_refusal(CHAT, PRESS, REFUSED)


def test_a_third_party_button_never_runs_a_line_that_gives_rights(new_story):
    window = window_story(new_story, "GrantingButtonModule")
    window.expect_window_refusal(CHAT, "window trust 1", "good may never run window trust")


def test_a_button_the_journal_ships_needs_no_allowance(new_story):
    window_story(new_story).expect_window_allowed(CHAT, "plan approve 1")


def test_an_agent_cannot_allow_a_module_buttons(new_story):
    window = window_story(new_story)
    window.story.expect_refusal(ALLOW, "only the person a window permission is for may give it", actor=window.story.agent)


def test_removing_a_module_deletes_the_permission_for_its_buttons(new_story):
    window = window_story(new_story)
    window.story.expect_success(ALLOW, actor=window.story.user)
    window.expect_row_count("window_permissions", 1)
    window.module_removed("good")
    window.expect_row_count("window_permissions", 0)


def test_allowing_buttons_no_module_declares_is_refused(new_story):
    window = window_story(new_story)
    window.story.expect_refusal("window allow button:nobody --type runs --environment main", "no installed module declares the window button:nobody", actor=window.story.user)
