from core.base.registry.registry import Registry
from core.base.registry.suite_windows import SuiteWindows
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.coding_fixtures import CodingEnvironment
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value, expect_value_with


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(fixture=UserJoined))


def test_the_file_feed_window_is_a_page_window_of_one_agent(new_story):
    window_story(new_story).expect_declared_window("coding.file-feed", "component", "pane", "one-agent")


def test_the_file_feed_window_reads_its_lines_with_no_allowance(new_story):
    window = window_story(new_story)
    window.expect_window_allowed("coding.file-feed", "file-edit list")
    window.expect_window_allowed("coding.file-feed", "file-edit show 1")


def test_the_file_edits_window_is_a_page_window_of_the_environment(new_story):
    window_story(new_story).expect_declared_window("coding.file-edits", "component", "pane")


def test_the_file_edits_window_reads_its_lines_with_no_allowance(new_story):
    window = window_story(new_story)
    window.expect_window_allowed("coding.file-edits", "file-edit list")
    window.expect_window_allowed("coding.file-edits", "file-edit show 1")
    window.expect_window_allowed("coding.file-edits", "agent list")


def test_the_terminal_window_is_a_page_window_of_one_agent_that_reads_its_terminal_with_no_allowance(new_story):
    window = window_story(new_story)
    window.expect_declared_window("coding.terminal", "component", "pane", "one-agent")
    window.expect_window_allowed("coding.terminal", "agent terminal 2 --after 0")


def test_the_coding_suite_gives_the_main_driver_the_plain_home_layout(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_success("suite layout main home --driver coding.main", "suite: coding", "page: home", "driver: coding.main")
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
    story.expect_success("suite layout main phone", "page: phone",
                         "shape: {'windows': ['messages.chat', 'questions.waiting', 'questions.questions', 'tasks.tasks', 'plans.plans', 'agents.agents', 'coding.file-feed'], 'active': 'messages.chat'}")


def test_the_coding_suite_offers_the_questions_windows_its_phone_shows(new_story):
    window = window_story(new_story)
    window.expect_window_allowed("questions.waiting", "wait waiting")
    window.expect_window_allowed("questions.questions", "question list")


def test_the_coding_suite_offers_output_and_keeps_internal_renderers_private(new_story):
    story = new_story(fixture=CodingEnvironment)
    names = {window.name for window in story.container.get(SuiteWindows).windows("coding")}
    expect_value_with(names, "processes.output")
    expect_absent_questions_viewer_names("questions.question", "viewer.shell", names)


def test_agent_dropdowns_declare_that_they_need_one_agent(new_story):
    window = window_story(new_story)
    for name in ("schedules.jobs", "usage.fitness", "usage.load"):
        window.expect_declared_window(name, "component", "dropdown", "one-agent")


def expect_absent_questions_viewer_names(text, text_2, names) -> None:
    actual = {text, text_2} & names
    assert not actual, actual


MENU_REMOVED = ("reviews.reviewer", "reviews.reviewers", "phone.phones", "usage.fitness", "suggestions.suggestions", "workers.models", "tunnel.tunnel", "tunler.account", "updates.updates", "templates.templates", "processes.output")
MENU_KEPT = ("drivers.hook-calls", "drivers.nudges", "sharing.shares", "triggers.triggers", "messages.attachments", "workers.points", "tasks.task-counts")


def test_the_window_menu_of_the_coding_suite_lists_only_the_kept_windows(new_story):
    registry = new_story(fixture=CodingEnvironment).container.get(Registry)
    offered = SuiteWindows(registry).windows("coding")
    menu = {window.name: window for window in offered if window.place not in ("bar", "page", "section")}
    expect_value(bool([name for name in MENU_REMOVED if name in menu]), False)
    expect_value(bool(all(name in menu for name in MENU_KEPT)), True)
    expect_value(menu["workers.points"].title, "Brief points")
    pages = {window.name for window in offered if window.place == "page"}
    expect_value({"processes.output", "templates.templates", "updates.updates", "tunnel.tunnel"} <= pages, True)
    expect_value("workers.models" not in {window.name for window in offered}, True)
    expect_value({window.name: window.title for window in offered}["settings.project-hooks"], "Hooks")
    expect_value({window.name: window.group for window in offered}["updates.updates"], "footer")
