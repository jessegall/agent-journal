from engine.database.database import Database
from engine.enums.command_category import CommandCategory
from engine.registry.registry import Registry
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import BuilderStarted

BACKGROUND_FLAG = "--background"


def journal_line(*arguments):
    return HookSamples.shell(f"journal {' '.join(arguments)}", ShellPart("journal", CommandCategory.JOURNAL, list(arguments), subcommand=arguments[0]))


def test_the_registry_holds_only_the_commands_that_declare_the_background(played):
    story = played(BuilderStarted)
    lines = Registry.read(story.container.get(Database)).background_lines
    story.expect_rows("worker dispatch" in lines, "task list" not in lines, detail=str(lines))


def test_a_worker_dispatch_goes_to_the_background_at_once(played):
    story = install_runner(played(BuilderStarted))
    answer = str(story.hook("s-1", journal_line("worker", "dispatch", "1", "--model", "sonnet")).updated_input)
    story.expect_rows(BACKGROUND_FLAG in answer, detail=answer)
    story.expect_rows(BACKGROUND_FLAG not in str(story.hook("s-1", journal_line("task", "list")).updated_input))
