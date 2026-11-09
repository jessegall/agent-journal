from core.base.database.database import Database
from core.base.driver.command_category import CommandCategory
from core.base.registry.registry import Registry
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import BuilderStarted

BACKGROUND_FLAG = "--background"


def journal_line(*arguments):
    return HookSamples.shell(f"journal {' '.join(arguments)}", ShellPart("journal", CommandCategory.JOURNAL, list(arguments), subcommand=arguments[0]))


def test_the_registry_holds_only_the_commands_that_declare_the_background(new_story):
    story = new_story(fixture=BuilderStarted)
    lines = Registry.read(story.container.get(Database)).background_lines
    story.expect_rows("worker dispatch" in lines, "task list" not in lines, detail=str(lines))


def test_a_worker_dispatch_goes_to_the_background_at_once(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    answer = str(story.hook("s-1", journal_line("worker", "dispatch", "1", "--model", "sonnet")).updated_input)
    story.expect_rows(BACKGROUND_FLAG in answer, detail=answer)
