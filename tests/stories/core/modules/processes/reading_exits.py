import re
from datetime import timedelta

import pytest

from engine.command.bus import Bus
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story import Story
from core.modules.aliases.rules.unknown_command_rule import UNCLASSIFIED_HINT
from core.modules.aliases.support.alias_nudges import COMMAND_TYPE_UNKNOWN, SAVED_COMMAND_SILENT, SAVED_COMMAND_UNKNOWN
from core.modules.processes.commands.move_process.move_process import MoveProcess
from core.modules.processes.models.enums.pressure_level import PressureLevel
from core.modules.processes.models.process import Process
from suites.coding.support.coding_nudges import FAILED_FULL_RUN
from core.modules.processes.support.process_nudges import READER_BLOCK, REDIRECTED_RUN, REQUIRED_MONITOR, SILENT_RUN_HELD, SILENT_START_REFUSED
from core.modules.processes.support.reading_notices.exit_texts import ExitTexts
from suites.coding.modules.workers.support.worker_test_limit_nudges import TEST_COUNT_UNKNOWN
from tests.stories.core.modules.processes.hang_watch import HANG_SECONDS
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, reader_worker, worker_run
from tests.stories.core.modules.processes.support.reading_scenarios import agent_number
from tests.stories.core.support.coding_fixtures import UserBuilder

EDIT = HookSamples.edit("cart.py")
JOURNAL_COMMAND = re.compile(r"journal ([a-z][a-z-]*) ([a-z][a-z-]*)")
EXIT_LINES = {
    "read the output": "journal output read {output} --summary",
    "stop the run": "journal output stop {output}",
    "draft a reader": "journal reader draft 1",
    "add a reader": 'journal reader add bundle --commands "zork-build*" --lines "done"',
    "skip with a reason": 'journal refusal skip processes.reading --reason "the bundle prints nothing to count"',
    "mark it unreadable": 'journal reader unreadable "zork-build bundle" --reason "it prints one line"',
    "say its type": 'journal command-type make "zork-build" build',
}
REFUSALS: dict[str, tuple[NudgeDeclaration, dict[str, object], str]] = {
    "silent run hold": (SILENT_RUN_HELD, {"output": 1, "seconds": 301, "processor": "0.1 seconds", "hint": ExitTexts.sentences(PressureLevel.HOLD.exits)}, "read it"),
    "reader block": (READER_BLOCK, {"output": 1, "request": 1}, "journal reader draft 1 --save"),
    "silent start refusal": (SILENT_START_REFUSED, {"name": "zork-build bundle"}, "skip once and say why"),
    "monitor block": (REQUIRED_MONITOR, {"output": 1}, "set a Monitor on its wait"),
    "unknown command": (COMMAND_TYPE_UNKNOWN, {"program": "zork-build", "hint": UNCLASSIFIED_HINT}, "say what type the command is"),
    "saved command refusal": (SAVED_COMMAND_UNKNOWN, {"category": "build"}, "save this command as an alias"),
    "alias claimed silent": (SAVED_COMMAND_SILENT, {"name": "bundle"}, "edit it to print each step"),
    "worker count stop": (TEST_COUNT_UNKNOWN, {"output": 1, "name": 1}, "journal reader draft 1 --save"),
    "failed full run": (FAILED_FULL_RUN, {}, "re-run the failed tests by name"),
    "redirected run": (REDIRECTED_RUN, {"programs": "zork-build"}, "run it without the redirect"),
}


def journal_line(line: str) -> object:
    """A shell line that runs one journal command, as the agent's hook sends it."""
    return HookSamples.shell(line, ShellPart("journal", CommandCategory.JOURNAL, line.split()[1:]))


def worker_background_run(story: Story) -> Process:
    """A run of the worker that moved to the background and printed nothing past the hang time."""
    worker = reader_worker(story)
    process = worker_run(story)
    story.container.get(Bus).run(MoveProcess(process.id), worker, environment_id=1)
    story.advance(timedelta(seconds=HANG_SECONDS + 1))
    return process


@pytest.mark.parametrize("line", EXIT_LINES.values(), ids=EXIT_LINES.keys())
def test_an_exit_passes_under_a_silent_run_hold(new_story, line):
    story = install_runner(new_story(fixture=UserBuilder))
    process = moved_run(story, "zork-build bundle", CommandCategory.BUILD)
    story.advance(timedelta(seconds=HANG_SECONDS + 1))
    story.expect_hook_refusal("s-1", EDIT, f"output {process.id} printed nothing for")
    story.expect_hook_allowed("s-1", journal_line(line.format(output=process.id)))


@pytest.mark.parametrize("line", EXIT_LINES.values(), ids=EXIT_LINES.keys())
def test_an_exit_passes_under_a_reader_block(new_story, line):
    story = new_story(fixture=ForcedReaders)
    process = worker_run(story)
    story.expect_hook_refusal("s-reader", EDIT, "reader request 1")
    story.expect_hook_allowed("s-reader", journal_line(line.format(output=process.id)))


@pytest.mark.parametrize("declaration, fields, exit_text", REFUSALS.values(), ids=REFUSALS.keys())
def test_every_hold_names_an_exit_the_agent_takes_alone_and_its_commands_exist(new_story, declaration, fields, exit_text):
    story = new_story(fixture=UserBuilder)
    text = declaration.nudge(**fields).text
    story.expect_rows(exit_text in text, detail=text)
    for subject, verb in JOURNAL_COMMAND.findall(text):
        story.expect_success(f"{subject} {verb} --help", actor=story.agent)


def test_a_peek_at_a_held_run_passes_and_leaves_the_hold_which_only_a_read_lifts(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    process = moved_run(story, "zork-build bundle", CommandCategory.BUILD)
    story.advance(timedelta(seconds=HANG_SECONDS + 1))
    story.expect_text(f"output peek {process.id} --tail 5", actor=story.agent)
    story.expect_hook_refusal("s-1", EDIT, f"output {process.id} printed nothing for")
    story.expect_text(f"output read {process.id} --tail 5", actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_two_holds_at_once_are_cleared_each_by_its_own_exit(new_story):
    story = new_story(fixture=ForcedReaders)
    worker = reader_worker(story)
    process = worker_background_run(story)
    story.expect_text("process holds", f"hold on output {process.id}", "block of reader request 1", actor=worker)
    story.expect_text(f"output read {process.id} --tail 5", actor=worker)
    story.expect_text("process holds", "block of reader request 1", actor=worker)
    story.expect_no_text("process holds", f"hold on output {process.id}", actor=worker)


def test_the_holds_of_an_agent_whose_session_ended_are_dropped(new_story):
    story = new_story(fixture=ForcedReaders)
    worker = reader_worker(story)
    process = worker_background_run(story)
    story.run(f"agent end {worker.id}", actor=worker)
    story.run_listeners()
    story.expect_no_text(f"process holds --agent {agent_number(story, worker.id)} --environment main", f"hold on output {process.id}", actor=story.agent)
