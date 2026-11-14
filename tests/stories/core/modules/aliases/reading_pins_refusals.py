from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders
from tests.stories.core.support.coding_fixtures import BuilderStarted

PYTHON_SCRIPT = HookSamples.shell("python3 tools/deploy.py staging", ShellPart("python3", CommandCategory.PROCESS, ["tools/deploy.py", "staging"]), has_saved_commands=True)
UNKNOWN_RUN = HookSamples.shell("scripts/dev go test ./cli/judge/", ShellPart("scripts/dev", CommandCategory.UNKNOWN, ["go", "test", "./cli/judge/"]), has_saved_commands=True)


def test_a_workers_command_of_unknown_type_is_refused_by_its_driver_and_not_asked_to_be_classified(new_story):
    story = new_story(fixture=ForcedReaders)
    story.expect_hook_refusal("s-reader", UNKNOWN_RUN, "a worker here runs no unknown command")
    story.expect_hook_refusal("s-reader", PYTHON_SCRIPT, "a worker here runs no process command")
    story.expect_success("refusal list", actor=story.agent)


def test_a_python_script_is_a_process_and_runs_without_being_classified(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_allowed("s-1", PYTHON_SCRIPT)
