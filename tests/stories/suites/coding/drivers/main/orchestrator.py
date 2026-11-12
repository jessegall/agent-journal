from tests.stories.core.support.agent_labels import agent_number
from engine.actor.actor import Actor
from engine.enums.command_category import CommandCategory
from engine.enums.actor_type import ActorType
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.core.support.plan_steps import ready_plan
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment

READ_MESSAGE_HOOK = HookSamples.shell("journal message read 1", ShellPart("journal", CommandCategory.JOURNAL, ["message", "read", "1"], subcommand="message")).with_fields(event="post_tool_use")


def test_a_main_agent_that_writes_no_code_starts_no_task_of_its_own(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.run("setting set journal.suites.coding.main-writes-code off --environment main")
    story.expect_refusal(lines.TASK_START, "refused by coding.main-starts-no-task-without-code: task 1 goes to a worker", actor=story.agent)


def test_the_agent_starts_its_task_again_once_it_may_write_code(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.run("setting set journal.suites.coding.main-writes-code off --environment main")
    story.run("setting set journal.suites.coding.main-writes-code on --environment main")
    story.expect_success(lines.TASK_START, "state: started", f"holder_id: {story.agent.id}", actor=story.agent)


def test_a_main_agent_with_auto_off_with_nothing_open_stops(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.run(lines.TASK_CANCEL)
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_a_main_agent_that_keeps_going_at_the_worker_limit_takes_the_open_task_itself(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.run("setting make journal.suites.coding.workers.worker-run-limit 0")
    story.expect_hook_refusal("s-1", HookSamples.stop(), "is yours now")


def test_tasks_a_running_worker_has_queued_let_the_main_agent_stop(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    story.run("worker dispatch --test-command python=pytest 1 2 --model sonnet", actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_an_open_task_no_worker_has_holds_the_main_agent_at_stop(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    story.run('task make "Third job" --brief "Do the third job" --environment main', actor=story.agent)
    story.run("worker dispatch --test-command python=pytest 1 2 --model sonnet", actor=story.agent)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "open tasks wait for a worker: 3")


def test_tasks_a_released_worker_gave_back_hold_the_main_agent_at_stop(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    worker = dispatched_worker(story, "worker dispatch --test-command python=pytest 1 2 --model sonnet")
    story.expect_success(f'worker release {agent_number(story, worker.id)} "wrong job"', actor=story.agent)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "open tasks wait for a worker: 1, 2")


class ReadyPlanTaskOrchestrator(StoryFixture):
    """A main agent with Auto off, a user and one open task in a ready plan."""

    parent = OpenTaskOrchestrator

    def steps(self, story) -> None:
        story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
        story.run(lines.TASK_CANCEL)
        story.run('plan make "The rebuild" --environment main', actor=story.agent)
        story.run('phase make --plan 1 "First" --goal "it works"', actor=story.agent)
        story.run('task make "Planned job" --brief "Do the planned job" --phase 1 --environment main', actor=story.agent)
        ready_plan(story, actor=story.agent)

    def expect(self, story) -> None:
        story.expect_success("plan show 1", "state: ready")


def test_a_task_of_a_ready_plan_lets_the_main_agent_stop(new_story):
    story = new_story(fixture=ReadyPlanTaskOrchestrator)
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_a_task_of_a_plan_under_review_lets_the_main_agent_stop(new_story):
    story = new_story(fixture=ReadyPlanTaskOrchestrator)
    story.expect_success('template make "Read it" --brief "Say what is wrong" --applies-to plan --purpose critique', actor=story.user)
    story.expect_success('template send 1 --on=plan:1 --set=agents=2 --set=size="a normal read" --environment main', actor=story.user)
    story.expect_success("plan show 1", "state: reviewing")
    story.hook("s-1", READ_MESSAGE_HOOK)
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_an_undelegated_task_of_an_approved_plan_holds_the_main_agent_at_stop(new_story):
    story = new_story(fixture=ReadyPlanTaskOrchestrator)
    story.expect_success("plan approve 1 --environment main", "state: approved", actor=story.user)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "plan:1 is approved and a worker place is free")


def test_a_loose_open_task_holds_the_main_agent_at_stop_beside_a_ready_plan(new_story):
    story = new_story(fixture=ReadyPlanTaskOrchestrator)
    story.run('task make "Loose job" --brief "Do the loose job" --environment main', actor=story.agent)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "open tasks wait for a worker: 3")


def test_tasks_queued_with_a_worker_whose_row_ended_but_whose_worktree_is_open_let_the_main_agent_stop(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    worker = dispatched_worker(story, "worker dispatch --test-command python=pytest 1 2 --model sonnet")
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.expect_text("worker-worktree list", f"worker-{worker.id}")
    story.expect_hook_allowed("s-1", HookSamples.stop())
