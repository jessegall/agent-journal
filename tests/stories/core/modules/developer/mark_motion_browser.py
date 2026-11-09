from core.base.driver.command_category import CommandCategory
from core.modules.developer.support.mark_motion_file import MarkMotionFile
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_clicking_a_chat_mark_in_the_viewer_records_its_frames(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    story.expect_success("setting set journal.core.viewer.tour-completed true --project", actor=story.user)
    story.expect_success("setting switch journal.core.developer.tools on --project", actor=story.user)
    story.expect_success("setting set journal.core.developer.tools.mark-motion true --project", actor=story.user)
    process = start_process(story, "make build", category=CommandCategory.BUILD)
    story.run(f'output title {process.id} "make build of the cart"', actor=story.agent)
    end_run(story, process, "compiled the cart\nlinked the cart\n")
    story.run_listeners()
    with server_story(story) as server:
        expect_browser(server, "markRecording.browser.mjs", [])
    expect_count_6(story, '"frames"', 4)


def expect_count_6(story, text, expected) -> None:
    actual = story.container.get(MarkMotionFile).text().count(text)
    assert actual == expected, actual
