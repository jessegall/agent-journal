from datetime import timedelta
from itertools import count

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from core.base.driver.tool_type import ToolType
from core.base.guard.guard_refusal import GuardRefusal
from core.base.refusal import Refusal
from core.base.refusal_log import RefusalLog
from core.modules.processes.commands.start_process.start_process import PartSpec, StartProcess
from core.modules.processes.models.process import Process
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent
from tests.stories.core.support.coding_fixtures import BuilderWithUser

RULE = "processes.failed-full-run"
GUARD = "tasks.dependencies-closed"
SKIP = f'refusal skip {RULE} --reason "the failure is fixed" --environment main'
GUARD_SKIP = f'refusal skip {GUARD} --reason "it does not apply" --environment main'
REFUSED = "your last full test run failed"
FIRINGS = count(1)


def full_line():
    return HookSamples.shell("pytest", ShellPart("pytest", CommandCategory.TEST_RUN, [], is_full_test_run=True)).with_fields(firing=f"full-{next(FIRINGS)}")


class FailedFullRun(StoryFixture):
    """A main agent whose last full test run failed."""

    parent = BuilderWithUser

    def steps(self, story: Story) -> None:
        part = PartSpec("pytest", "pytest", False, CommandCategory.TEST_RUN)
        command = StartProcess(story.agent.id, None, "pytest", "/work/main", "zsh", CommandCategory.TEST_RUN, 30, [part], is_full_test_run=True)
        end_run(story, story.container.get(Bus).run(command, story.agent, environment_id=1), "1 failed\n", exit_code=1)
        story.advance(timedelta(seconds=1))


def failed_run_story(new_story):
    return install_runner(new_story(fixture=FailedFullRun))


def guard_skips(story, actor, number: int) -> None:
    for _ in range(number):
        story.container.get(RefusalLog).record(actor, "task start", GuardRefusal(GUARD, Refusal("it waits on a task"), ""))
        story.advance(timedelta(seconds=1))
        story.expect_success(GUARD_SKIP, actor=actor)
        story.advance(timedelta(seconds=1))


def test_a_full_run_after_a_failed_one_is_refused_and_says_how_to_pass_it(new_story):
    story = failed_run_story(new_story)
    story.expect_hook_refusal("s-1", full_line(), REFUSED)
    story.expect_hook_refusal("s-1", full_line(), f"journal refusal skip {RULE}")


def test_a_named_run_that_passes_lifts_the_refusal(new_story):
    story = failed_run_story(new_story)
    part = PartSpec("pytest tests/cart.py", "pytest", False, CommandCategory.TEST_RUN)
    command = StartProcess(story.agent.id, None, "pytest tests/cart.py", "/work/main", "zsh", CommandCategory.TEST_RUN, 30, [part])
    end_run(story, story.container.get(Bus).run(command, story.agent, environment_id=1), "1 passed\n")
    story.expect_hook_allowed("s-1", full_line())


def test_a_skip_passes_the_refusal_once_keeps_its_reason_and_a_retry_of_the_same_refused_line_is_not_obeying(new_story):
    story = failed_run_story(new_story)
    story.expect_hook_refusal("s-1", full_line(), REFUSED)
    story.advance(timedelta(seconds=1))
    story.expect_success(SKIP, actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.expect_hook_allowed("s-1", full_line())
    story.expect_text("refusal-skip show 1", "reason: the failure is fixed", f"name: {RULE}", "used_at: 20", actor=story.user)
    end_run(story, story.row(Process, 2), "1 failed\n", exit_code=1)
    story.advance(timedelta(seconds=1))
    story.expect_hook_refusal("s-1", full_line(), REFUSED)
    story.advance(timedelta(seconds=1))
    story.expect_hook_refusal("s-1", full_line(), REFUSED)
    story.advance(timedelta(seconds=1))
    story.expect_success(SKIP, actor=story.agent)
    story.expect_success("refusal-skip show 2", "streak: 2", actor=story.user)


def test_a_skip_with_no_refusal_before_it_is_refused(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_refusal(SKIP, "has not refused you since your last skip", actor=story.agent)


def test_a_skip_with_no_reason_is_refused(new_story):
    story = new_story(fixture=FailedFullRun)
    story.expect_refusal(f'refusal skip {RULE} --reason " " --environment main', "say why", actor=story.agent)


def test_a_safety_refusal_has_no_skip(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    story.expect_hook_refusal(helper.session, HookSamples.tool_use("Edit", ToolType.EDIT, [], None), "reads and searches only")
    story.advance(timedelta(seconds=1))
    story.expect_refusal('refusal skip drivers.access --reason "I must" --environment main', "safety refusal", actor=Actor(helper.id, ActorType.AGENT))


def test_a_main_agent_at_five_skips_loses_the_skip_and_the_person_is_told_and_gives_it_back(new_story):
    story = new_story(fixture=BuilderWithUser)
    guard_skips(story, story.agent, 5)
    story.expect_text("message list --environment main", "skipped 5 refusals in a row", actor=story.user)
    story.expect_refusal(GUARD_SKIP, "lost the skip", actor=story.agent)
    story.expect_refusal(f"refusal restore {story.agent.id} --environment main", "only a person", actor=story.agent)
    story.expect_success(f"refusal restore {story.agent.id} --environment main", actor=story.user)
    guard_skips(story, story.agent, 1)


def test_a_worker_at_five_skips_is_raised_to_its_main_agent_not_the_person(new_story):
    story = new_story(fixture=BuilderWithUser)
    worker = Actor(story.new_row_id(f"agent start s-worker claude worker --parent {story.agent.id} --environment main"), ActorType.AGENT)
    guard_skips(story, worker, 5)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"agent:{worker.id} skipped 5 refusals in a row")
    story.expect_absent("message list --environment main", "skipped 5", actor=story.user)
