from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.coding_fixtures import CodingEnvironment
from tests.stories.core.support.fixtures import UserJoined


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(fixture=UserJoined))


def test_the_coding_suite_gives_the_main_driver_the_plain_home_layout(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_success("suite layout main home --driver coding.main", "suite: coding", "page: home", "driver: coding.main")
    story.expect_success("suite layout main agent --driver coding.worker", "suite: coding", "page: agent", "driver: coding.worker")


def test_a_page_the_coding_suite_lays_out_nothing_for_is_refused(new_story):
    new_story(fixture=CodingEnvironment).expect_refusal("suite layout main settings", "no suite layout for the page settings in main")


def test_the_coding_suite_offers_version_4s_agent_page_presets_in_their_order(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_ordered_lines("suite presets main agent", "default  Default", "chat  Chat only", "terminal  Terminal", "file-edits  File edits")


def test_the_coding_suite_lays_out_a_phone_with_the_chat_first_and_the_file_feed_last(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_success("suite layout main phone", "page: phone",
                         "shape: {'windows': ['messages.chat', 'questions.waiting', 'questions.questions', 'tasks.tasks', 'plans.plans', 'agents.agents', 'coding.file-feed'], 'active': 'messages.chat'}")


def test_the_coding_suite_offers_the_questions_windows_its_phone_shows(new_story):
    window = window_story(new_story)
    window.expect_window_allowed("questions.waiting", "wait waiting")
    window.expect_window_allowed("questions.questions", "question list")
