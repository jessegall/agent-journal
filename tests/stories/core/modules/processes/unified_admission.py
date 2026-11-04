import json

from core.base.query.queries import Queries
from core.base.driver.command_category import CommandCategory
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from core.testing.story_fixture import StoryFixture
from core.testing.hook_samples import HookSamples
from core.testing.expect_reply import expect_reply_allowed
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.modules.processes.support.reader_block_fixtures import worker_run
from tests.stories.core.support.coding_fixtures import BuilderWithUser


class AdmissionQueue(StoryFixture):
    """A main agent and a worker share one available run slot."""

    parent = BuilderWithUser

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
    page = json.loads(story.run("queue list --environment-id 1 --json", actor=story.user).output_text)
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
    reply = story.hook("s-1", HookSamples.shell("journal cart-build", ShellPart("journal", CommandCategory.BUILD, ["cart-build"], subcommand="cart-build")))
    expect_reply_allowed(reply)
    process = story.container.get(Queries).query(Process).newest().page(1, 1).rows[0]
    story.expect_rows("--queue" in str(reply.updated_input), "--limit 15" in str(reply.updated_input),
                      process.is_queue_run, story.container.get(OutputFolder).has_slot(process.id))
