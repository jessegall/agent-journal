from datetime import timedelta

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import delivered_worker, dispatched_worker, repository_environment, worker_session

REPORT = "The cart total now adds the tax once; the tests pass."


def stop_with_text(text: str):
    stop = HookSamples.stop()
    return stop.with_raw({**stop.body["raw"], "last_assistant_message": text})


class OrchestratorWithMergerOff(StoryFixture):
    """The orchestrator's task 1 is open and the main agent hears its workers itself."""

    parent = OrchestratorWithOpenTask

    def steps(self, story: Story) -> None:
        story.expect_success("setting set journal.suites.coding.workers.merger-on false --project", actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_rows(not story.container.get(SettingValues).flag(MERGER_ENABLED))


def test_what_a_worker_says_as_it_stops_with_every_task_handed_in_is_its_report_to_its_main_agent_and_not_in_the_chat(new_story):
    story = new_story(fixture=OrchestratorWithMergerOff)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    story.expect_hook_allowed(worker_session(story, worker), stop_with_text(REPORT))
    story.expect_absent("message feed --json", REPORT)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"agent:{worker.id} reports in message:1")
    story.expect_text("message read 1", REPORT, actor=story.agent)


def test_a_worker_that_stops_with_no_words_leaves_no_report(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    story.expect_hook_allowed(worker_session(story, worker), stop_with_text(" "))
    story.expect_text("message feed", "nothing found")


def test_a_worker_refused_its_stop_leaves_no_report(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker: Actor = dispatched_worker(story)
    story.expect_hook_refusal(worker_session(story, worker), stop_with_text(REPORT), "go on, then hand in")
    story.expect_text("message feed", "nothing found")


def test_a_workers_message_reaches_the_agent_that_sent_it_as_a_line(new_story):
    story = new_story(fixture=OrchestratorWithMergerOff)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success('worker report "The cart needs a tax rate"', actor=worker)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"agent:{worker.id} reports in message:1")
    story.expect_text("message read 1", "The cart needs a tax rate", actor=story.agent)
    story.expect_text("task show 1", "state: started", f"holder_id: {worker.id}")


def test_the_dispatch_refusal_names_the_command_that_tells_the_main_agent(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success('task make "Add the tax" --brief "Add the tax rate" --environment main', actor=story.agent)
    story.expect_refusal("worker dispatch --model sonnet 2", "journal worker report", actor=worker)


def test_a_main_agent_cannot_send_a_workers_report(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.expect_refusal('worker report "The cart needs a tax rate"', "only a worker reports to its main agent", actor=story.agent)


def test_a_workers_report_stays_out_of_the_chat_and_the_main_agent_reads_it(new_story):
    story = new_story(fixture=OrchestratorWithMergerOff)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success('worker report "The cart needs a tax rate"', actor=worker)
    story.expect_absent("message feed --environment 1", "The cart needs a tax rate", actor=story.user)
    story.expect_text("message show 1", "The cart needs a tax rate", actor=story.agent)


def test_a_worker_report_does_not_answer_a_users_message(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success('message send "Fix the cart" --environment main', actor=story.user)
    story.advance(timedelta(seconds=1))
    read = HookSamples.shell("journal message read 1", ShellPart("journal", CommandCategory.JOURNAL, ["message", "read", "1"], subcommand="message")).with_fields(event="post_tool_use")
    story.hook("s-1", read)
    view = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, []))
    story.expect_hook_allowed("s-1", view, "answer message 1 before you go on")
    story.advance(timedelta(seconds=301))
    story.expect_success('worker report "The work is ready"', actor=worker)
    story.hook("s-1", HookSamples.prompt("Continue"))
    story.expect_hook_allowed("s-1", view, "answer message 1 before you go on")
