from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.coding_fixtures import CodingEnvironment
from tests.stories.core.support.fixtures import UserJoined


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(fixture=UserJoined))


def test_the_file_feed_window_is_a_page_window_of_one_agent(new_story):
    window_story(new_story).expect_declared_window("coding.file-feed", "component", "agent")


def test_the_file_feed_window_reads_its_lines_with_no_allowance(new_story):
    window = window_story(new_story)
    window.expect_window_allowed("coding.file-feed", "file-edit list")
    window.expect_window_allowed("coding.file-feed", "file-edit show 1")


def test_the_file_edits_window_is_a_page_window_of_the_environment(new_story):
    window_story(new_story).expect_declared_window("coding.file-edits", "component", "environment")


def test_the_file_edits_window_reads_its_lines_with_no_allowance(new_story):
    window = window_story(new_story)
    window.expect_window_allowed("coding.file-edits", "file-edit list")
    window.expect_window_allowed("coding.file-edits", "file-edit show 1")
    window.expect_window_allowed("coding.file-edits", "agent list")


def test_the_terminal_window_is_a_page_window_of_one_agent_that_reads_its_terminal_with_no_allowance(new_story):
    window = window_story(new_story)
    window.expect_declared_window("coding.terminal", "component", "agent")
    window.expect_window_allowed("coding.terminal", "agent terminal 2 --after 0")


def test_the_coding_suite_gives_the_orchestrator_its_own_home_layout_and_every_other_driver_the_plain_one(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_success("suite layout main home --driver coding.orchestrator", "suite: coding", "page: home", "driver: coding.orchestrator")
    story.expect_success("suite layout main home --driver coding.builder", "suite: coding", "page: home", "driver: coding.builder")
    story.expect_success("suite layout main agent --driver coding.worker", "suite: coding", "page: agent", "driver: coding.worker")


def test_a_page_the_coding_suite_lays_out_nothing_for_is_refused(new_story):
    new_story(fixture=CodingEnvironment).expect_refusal("suite layout main settings", "no suite layout for the page settings in main")


def test_the_coding_suite_offers_version_4s_home_presets_in_their_order(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_ordered_lines("suite presets main home", "default  Default", "developer  Developer", "chat  Chat only", "terminal  Terminal",
                               "review  Review", "monitor  Monitor", "inbox  Inbox", "agents  Agents")


def test_the_coding_suite_offers_version_4s_agent_page_presets_in_their_order(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_ordered_lines("suite presets main agent", "default  Default", "chat  Chat only", "terminal  Terminal", "file-edits  File edits")


def test_the_coding_suite_lays_out_a_phone_with_the_chat_first_and_the_file_feed_last(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_success("suite layout main phone", "page: phone", '"messages.chat", "questions.waiting", "questions.questions", "tasks.tasks", "plans.plans", "agents.agents", "coding.file-feed"')


def test_the_coding_suite_offers_the_questions_windows_its_phone_shows(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_success("suite show main", "questions.waiting", "questions.questions")
