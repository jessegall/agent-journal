from pathlib import Path

from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.runner_line import READ_FOLDERS_VARIABLE, RunnerLine
from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart

CONTRACT_FILE = Path("tests/snapshots/plugin_event_contract.json")


def plugin_program_line(plugin, *text_parts):
    program = f"/project/.journal/plugins/{plugin}/bin/judge"
    return HookSamples.shell(" ".join((program, *text_parts)), ShellPart(program, CommandCategory.CHECK, list(text_parts)))


def test_s79_the_runner_line_gives_read_folders_in_a_variable_and_no_flag():
    run = ForegroundRun(30, False, read_folders=tuple([Path("/project/.rules")]))
    line = RunnerLine.build(Path("/bin/journal-run"), 1, "", run, "true", "s-1")
    assert f'{READ_FOLDERS_VARIABLE}=/project/.rules' in line
    assert '--read-folder' not in line
