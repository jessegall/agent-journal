from datetime import timedelta

from engine.enums.command_category import CommandCategory
from core.modules.processes.support.output_folder import OutputFolder
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story

LONG_OUTPUT = "".join(f"line {number} of the run\n" for number in range(400))
LARGE_OUTPUT = "".join(f"line {number} of the run\n" for number in range(2000))


def test_an_opened_output_card_stays_inside_the_chat_in_a_short_window(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make test", category=CommandCategory.TEST_RUN)
    story.container.get(OutputFolder).write(process.id, "1.out", LONG_OUTPUT)
    story.expect_success(f"dock add processes.output process {process.id} --environment main", actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.expect_success('actor make user "Ada"')
    with server_story(story) as server:
        expect_browser(server, "outputDockFit.browser.mjs", [])


def test_a_large_output_opens_on_its_last_page_and_scrolling_up_reads_one_page_more(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make build", category=CommandCategory.BUILD)
    story.container.get(OutputFolder).write(process.id, "1.out", LARGE_OUTPUT)
    story.expect_success(f"dock add processes.output process {process.id} --environment main", actor=story.agent)
    story.expect_success('actor make user "Ada"')
    with server_story(story) as server:
        expect_browser(server, "outputPagesBrowser.browser.mjs", [])
