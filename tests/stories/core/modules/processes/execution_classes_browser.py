from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED
from engine.enums.command_category import CommandCategory
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_a_person_sees_the_lines_a_new_class_would_match_before_adding_it_in_the_viewer(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    finished = start_process(story, "npm run e2e -- --headed", category=CommandCategory.TEST_RUN)
    end_run(story, finished, "passed\n")
    story.expect_text('queue-class preview --pattern "^npm run e2e"', "npm run e2e -- --headed")
    with server_story(story) as server:
        expect_browser(server, "executionClasses.browser.mjs", [])
    story.expect_text("queue-class list", "browser tests: long lane", "(your own)")
