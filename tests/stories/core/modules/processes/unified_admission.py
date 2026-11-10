import json

from engine.query.queries import Queries
from engine.driver.command_category import CommandCategory
from engine.driver.tool_type import ToolType
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from core.testing.story_fixture import StoryFixture
from core.testing.hook_samples import HookSamples
from core.testing.expect_reply import expect_reply_allowed
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.modules.processes.support.reader_block_fixtures import worker_run
from tests.stories.core.support.coding_fixtures import UserBuilder


class AdmissionQueue(StoryFixture):
    """A main agent and a worker share one available run slot."""

    parent = UserBuilder

    def steps(self, story):
        story.run("agent start s-reader claude worker --environment main")
        story.run("setting set journal.core.processes.readers-forced off --environment main", actor=story.user)
        story.run("setting set journal.core.processes.run-batch-size 1 --environment main", actor=story.user)


def test_main_run_is_granted_through_run_slots_at_once_while_worker_waits(new_story):
    story = new_story(fixture=AdmissionQueue)
    first = worker_run(story, "make first")
    waiting = worker_run(story, "make waiting")
    main = start_process(story, "make main")
    processes = story.container.get(Queries).query(Process)
    folder = story.container.get(OutputFolder)
    story.expect_rows(folder.has_slot(main.id), processes.find(main.id).started_at == story.clock.timestamp(),
                      processes.find(main.id).queued_at is None, processes.find(waiting.id).queued_at == story.clock.timestamp(),
                      not folder.has_slot(waiting.id))
    end_run(story, first, "ok\n")
    story.expect_rows(folder.has_slot(waiting.id), processes.find(waiting.id).queued_at is None)


def test_main_run_is_admitted_even_when_queue_is_halted(new_story):
    story = new_story(fixture=AdmissionQueue)
    story.expect_success('queue halt "deployment"', actor=story.user)
    process = start_process(story, "make main")
    story.expect_rows(story.container.get(OutputFolder).has_slot(process.id))


def test_plain_journal_command_is_admitted_and_absent_from_queue(new_story):
    story = new_story(fixture=AdmissionQueue)
    process = start_process(story, "journal task list", limit_seconds=0)
    page = json.loads(story.run("queue list --environment 1 --json", actor=story.user).output_text)
    story.expect_rows(story.container.get(OutputFolder).has_slot(process.id), page["running"] == [])


def test_queue_foreground_wait_defaults_to_five_seconds_and_can_change(new_story):
    story = install_runner(new_story(fixture=AdmissionQueue))
    story.expect_text("setting show journal.core.processes.queue-wait-seconds --environment main", "value: 5", actor=story.user)
    story.expect_success("setting set journal.core.processes.queue-wait-seconds 2 --environment main", actor=story.user)
    reply = story.hook("s-1", HookSamples.shell("make package", ShellPart("make", CommandCategory.BUILD, ["package"])))
    story.expect_rows("JOURNAL_RUN_QUEUE_WAIT=2" in str(reply.updated_input))


def test_plain_journal_hook_never_waits_even_while_worker_queue_is_halted(new_story):
    story = install_runner(new_story(fixture=AdmissionQueue))
    story.expect_success('queue halt "maintenance"', actor=story.user)
    reply = story.hook("s-reader", HookSamples.shell("journal task list", ShellPart("journal", CommandCategory.JOURNAL, ["task", "list"], subcommand="task")))
    process = story.container.get(Queries).query(Process).newest().page(1, 1).rows[0]
    story.expect_rows("--limit 0" in str(reply.updated_input), "--queue" not in str(reply.updated_input),
                      story.container.get(OutputFolder).has_slot(process.id), process.queued_at is None)


def test_saved_journal_command_enters_queue_as_its_real_command(new_story):
    story = install_runner(new_story(fixture=AdmissionQueue))
    story.expect_success('alias add cart-build "make package" --category build --agents', actor=story.agent)
    reply = story.hook("s-1", HookSamples.shell("journal cart-build", ShellPart("journal", CommandCategory.JOURNAL, ["cart-build"], subcommand="cart-build")))
    expect_reply_allowed(reply)
    process = story.container.get(Queries).query(Process).newest().page(1, 1).rows[0]
    story.expect_rows("--queue" in str(reply.updated_input), "--limit 15" in str(reply.updated_input),
                      process.is_queue_run, story.container.get(OutputFolder).has_slot(process.id))


def test_reads_and_journal_commands_in_one_line_never_queue(new_story):
    story = install_runner(new_story(fixture=AdmissionQueue))
    output = start_process(story, "make sample", category=CommandCategory.BUILD)
    end_run(story, output, "sample\n")
    line = f"rg cart src; journal output read {output.id} --summary"
    parts = [ShellPart("rg", CommandCategory.SEARCH, ["cart", "src"]).prepared("rg cart src"),
             ShellPart("journal", CommandCategory.JOURNAL, ["output", "read", str(output.id), "--summary"], subcommand="output").prepared(f"journal output read {output.id} --summary")]
    parts[0]["joined_by"] = ";"
    reply = story.hook("s-1", HookSamples.tool_use("Bash", ToolType.SHELL, [], None,
                       shell={"line": line, "parts": parts, "redirects": [], "is_journal_only": False, "parse_error": ""}))
    expect_reply_allowed(reply)
    process = story.container.get(Queries).query(Process).newest().page(1, 1).rows[0]
    story.expect_rows("--queue" not in str(reply.updated_input), not process.is_queue_run)


def test_a_mixed_read_and_build_line_never_queues(new_story):
    story = install_runner(new_story(fixture=AdmissionQueue))
    reply = story.hook("s-1", HookSamples.shell("rg cart src && make package",
                       ShellPart("rg", CommandCategory.SEARCH, ["cart", "src"]),
                       ShellPart("make", CommandCategory.BUILD, ["package"])))
    expect_reply_allowed(reply)
    story.expect_rows("--queue" not in str(reply.updated_input))


def test_a_line_of_tests_and_builds_queues_as_a_whole(new_story):
    story = install_runner(new_story(fixture=AdmissionQueue))
    reply = story.hook("s-1", HookSamples.shell("pytest tests/cart.py && make package",
                       ShellPart("pytest", CommandCategory.TEST_RUN, ["tests/cart.py"]),
                       ShellPart("make", CommandCategory.BUILD, ["package"])))
    expect_reply_allowed(reply)
    process = story.container.get(Queries).query(Process).newest().page(1, 1).rows[0]
    story.expect_rows("--queue" in str(reply.updated_input), process.is_queue_run)


def test_a_saved_build_keeps_the_read_before_it_out_of_the_queue(new_story):
    story = install_runner(new_story(fixture=AdmissionQueue))
    story.expect_success('alias add cart-package "make package" --category build --agents', actor=story.agent)
    reply = story.hook("s-1", HookSamples.shell("rg cart src && journal cart-package",
                       ShellPart("rg", CommandCategory.SEARCH, ["cart", "src"]),
                       ShellPart("journal", CommandCategory.JOURNAL, ["cart-package"], subcommand="cart-package")))
    expect_reply_allowed(reply)
    process = story.container.get(Queries).query(Process).newest().page(1, 1).rows[0]
    story.expect_rows("--queue" not in str(reply.updated_input), not process.is_queue_run)


def test_stopping_a_waiting_run_clears_its_queue_timestamp(new_story):
    story = new_story(fixture=AdmissionQueue)
    worker_run(story, "make active")
    waiting = worker_run(story, "make waiting")
    story.expect_success(f"output stop {waiting.id}", actor=story.user)
    process = story.container.get(Queries).query(Process).find(waiting.id)
    story.expect_rows(process.queued_at is None)
