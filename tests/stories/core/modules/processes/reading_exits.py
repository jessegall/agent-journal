import re
from datetime import timedelta

import pytest

from engine.command.bus import Bus
from engine.driver.message_template import MessageTemplate
from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story import Story
from core.modules.aliases.policies.unknown_command_policy import UNCLASSIFIED_HINT
from core.modules.aliases.agent_messages.command_type_unknown_message import CommandTypeUnknownMessage
from core.modules.aliases.agent_messages.saved_command_silent_message import SavedCommandSilentMessage
from core.modules.aliases.agent_messages.saved_command_unknown_message import SavedCommandUnknownMessage
from core.modules.processes.commands.move_process.move_process import MoveProcess
from core.modules.processes.models.enums.pressure_level import PressureLevel
from core.modules.processes.models.process import Process
from suites.coding.agent_messages.failed_full_run_message import FailedFullRunMessage
from core.modules.processes.agent_messages.reader_block_message import ReaderBlockMessage
from core.modules.processes.agent_messages.redirected_run_message import RedirectedRunMessage
from core.modules.processes.agent_messages.required_monitor_message import RequiredMonitorMessage
from core.modules.processes.agent_messages.silent_run_blocked_message import SilentRunBlockedMessage
from core.modules.processes.agent_messages.silent_start_refusal_message import SilentStartRefusalMessage
from core.modules.processes.support.reading_notices.exit_texts import ExitTexts
from tests.integration.core.modules.processes.test_hang_watch import HANG_SECONDS
from suites.coding.modules.workers.agent_messages.worker_test_count_unknown_message import WorkerTestCountUnknownMessage
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, reader_worker, worker_run
from tests.stories.core.modules.processes.support.reading_scenarios import agent_number
from tests.stories.core.support.coding_fixtures import UserBuilder
from core.modules.processes.agent_messages.reader_block_message import ReaderBlockMessage
from engine.testing.expectations.expected_message import expected_agent_message

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
REFUSALS: dict[str, tuple[MessageTemplate, dict[str, object], str]] = {
    "silent run hold": (SilentRunBlockedMessage.declared(), {"output": 1, "seconds": 301, "processor": "0.1 seconds", "hint": ExitTexts.sentences(PressureLevel.FREEZE.exits)}, "read it"),
    "reader block": (ReaderBlockMessage.declared(), {"output": 1, "request": 1}, "journal reader draft 1 --save"),
    "silent start refusal": (SilentStartRefusalMessage.declared(), {"name": "zork-build bundle"}, "skip once and say why"),
    "monitor block": (RequiredMonitorMessage.declared(), {"output": 1}, "set a Monitor on its wait"),
    "unknown command": (CommandTypeUnknownMessage.declared(), {"program": "zork-build", "hint": UNCLASSIFIED_HINT}, "say what type the command is"),
    "saved command refusal": (SavedCommandUnknownMessage.declared(), {"category": "build"}, "Save this command as an alias"),
    "alias claimed silent": (SavedCommandSilentMessage.declared(), {"name": "bundle"}, "make it print each step"),
    "worker count stop": (WorkerTestCountUnknownMessage.declared(), {"output": 1, "name": 1}, "journal reader draft 1 --save"),
    "failed full run": (FailedFullRunMessage.declared(), {}, "rerun the failed tests by name"),
    "redirected run": (RedirectedRunMessage.declared(), {"programs": "zork-build"}, "run it without the redirect"),
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
    story.expect_hook_refusal("s-1", EDIT, f"Output {process.id} printed nothing for")
    story.expect_hook_allowed("s-1", journal_line(line.format(output=process.id)))


@pytest.mark.parametrize("line", EXIT_LINES.values(), ids=EXIT_LINES.keys())
def test_an_exit_passes_under_a_reader_block(new_story, line):
    story = new_story(fixture=ForcedReaders)
    process = worker_run(story)
    story.expect_hook_refusal("s-reader", EDIT, expected_agent_message(ReaderBlockMessage.declared()))
    story.expect_hook_allowed("s-reader", journal_line(line.format(output=process.id)))


@pytest.mark.parametrize("declaration, fields, exit_text", REFUSALS.values(), ids=REFUSALS.keys())
def test_every_hold_names_an_exit_the_agent_takes_alone_and_its_commands_exist(new_story, declaration, fields, exit_text):
    story = new_story(fixture=UserBuilder)
    text = declaration.agent_message(**fields).text
    story.expect_rows(exit_text in text, detail=text)
    for subject, command_word in JOURNAL_COMMAND.findall(text):
        story.expect_success(f"{subject} {command_word} --help", actor=story.agent)


def test_a_peek_at_a_held_run_passes_and_leaves_the_hold_which_only_a_read_lifts(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    process = moved_run(story, "zork-build bundle", CommandCategory.BUILD)
    story.advance(timedelta(seconds=HANG_SECONDS + 1))
    story.expect_text(f"output peek {process.id} --tail 5", actor=story.agent)
    story.expect_hook_refusal("s-1", EDIT, f"Output {process.id} printed nothing for")
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
    story.end_session(worker)
    story.run_listeners()
    story.expect_no_text(f"process holds --agent {agent_number(story, worker.id)} --environment main", f"hold on output {process.id}", actor=story.agent)
