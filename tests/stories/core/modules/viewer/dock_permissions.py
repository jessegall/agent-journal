from tests.stories.core.base.chat.support.mark_faults import PATH
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined

DOCK = "good.note"
READ = "task list"
ALLOW = "window allow good.note --type reads --environment main"
REFUSED = "good.note may run task list once you allow it"


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(f"{PATH}:GoodModule", fixture=UserJoined))


def test_a_third_party_dock_reads_only_once_the_person_allows_it(new_story):
    window = window_story(new_story)
    window.expect_window_refusal(DOCK, READ, REFUSED)
    window.story.expect_success(ALLOW, actor=window.story.user)
    window.expect_window_allowed(DOCK, READ)


def test_a_person_who_allows_a_dock_allows_it_for_themselves_only(new_story):
    window = window_story(new_story)
    window.story.expect_success(ALLOW, actor=window.new_person("Bob"))
    window.expect_window_refusal(DOCK, READ, REFUSED)


def test_a_dock_the_journal_ships_reads_with_no_allowance(new_story):
    window_story(new_story).expect_window_allowed("plans.draft", "plan inspect 1")
