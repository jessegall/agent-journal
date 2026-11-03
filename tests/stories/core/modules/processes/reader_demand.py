from core.base.driver.command_category import CommandCategory
from core.modules.processes.queries.process_query import ProcessQuery
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_an_alias_counts_as_the_line_it_names_and_its_reader_reads_it(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('alias add viewer-test "npx vitest run {args}"', actor=story.agent)
    story.hook("s-1", HookSamples.shell("journal viewer-test cart", ShellPart("journal", CommandCategory.TEST_RUN, ["viewer-test", "cart"])))
    process = story.container.get(ProcessQuery).find(1)
    end_run(story, process, "runner noise\n Tests  12 passed (12)\n")
    story.expect_text("output read 1 --summary", "summary: 12 passed", actor=story.agent)
    story.expect_absent("output read 1 --summary", "runner noise", actor=story.agent)
    story.expect_text("process-part show 1", "command: npx vitest run cart", actor=story.agent)


def test_an_alias_that_names_its_own_reader_reads_with_that_reader(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add viewer --commands "unrelated*" --lines "viewer result"', actor=story.agent)
    story.run('alias add viewer-test "npx vitest run {args}" --reader viewer', actor=story.agent)
    story.hook("s-1", HookSamples.shell("journal viewer-test cart", ShellPart("journal", CommandCategory.TEST_RUN, ["viewer-test", "cart"])))
    process = story.container.get(ProcessQuery).find(1)
    end_run(story, process, "viewer result: done\n Tests  12 passed (12)\n")
    story.expect_text("output read 1 --summary", "viewer result: done", actor=story.agent)
    story.expect_absent("output read 1 --summary", "Tests  12 passed", actor=story.agent)
