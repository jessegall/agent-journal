from core.modules.approvals.support.approval_nudges import APPROVAL_DECIDED
from core.modules.tasks.support.task_nudges import TASK_REOPENED
from core.modules.waits.support.wait_nudges import WAIT_ENDED
from engine.testing.expectations.expected_nudge import expected_nudge
from datetime import timedelta

from engine.command.bus import Bus
from core.modules.processes.commands.end_process.end_process import EndProcess
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.processes.support.process_samples import start_process
from tests.stories.core.modules.tasks.task_waits import kept_typing
from tests.stories.core.modules.approvals.approvals import CHANGE_SETTING
from tests.stories.core.support.coding_fixtures import BuilderStarted, UserBuilder

IDLE_SECONDS = 31


def stopped_waiting(story, target):
    """The agent makes a wait on `target`, then stops, and sends no hook after that: the terminal is where a line for it is typed."""
    entered = kept_typing(story)
    story.expect_success(f"wait on 'the target' --target {target}", actor=story.agent)
    story.hook("s-1", HookSamples.stop().with_fields(accepts_lines=False))
    story.advance(timedelta(seconds=IDLE_SECONDS))
    return entered


def test_an_agent_stopped_on_a_wait_on_a_task_is_woken_when_the_task_ends(new_story):
    story = new_story(fixture=BuilderStarted, environment="main")
    task = story.new_row_id('task make "Waited on"', actor=story.agent)
    entered = stopped_waiting(story, f"tasks:{task}")
    story.expect_rows(entered == [])
    story.expect_success(f'task cancel {task} --reason "no longer needed"', actor=story.agent)
    story.run_listeners()
    expect_entered(story, entered, expected_nudge(WAIT_ENDED, wait=1))


def test_an_agent_stopped_on_a_wait_on_an_output_is_woken_when_the_output_ends(new_story):
    story = new_story(fixture=BuilderStarted)
    process = start_process(story, "make test")
    entered = stopped_waiting(story, f"output:{process.id}")
    story.expect_rows(entered == [])
    story.container.get(Bus).run(EndProcess(process.id, 0, 40, 3), story.agent, environment_id=1)
    story.run_listeners()
    expect_entered(story, entered, expected_nudge(WAIT_ENDED, wait=1))


def test_an_agent_stopped_while_a_person_decides_its_approval_is_woken_by_the_decision(new_story):
    story = new_story(fixture=UserBuilder)
    entered = kept_typing(story)
    story.expect_refusal(CHANGE_SETTING, "A user was asked in the dock", actor=story.agent)
    story.hook("s-1", HookSamples.stop().with_fields(accepts_lines=False))
    story.advance(timedelta(seconds=IDLE_SECONDS))
    story.expect_rows(entered == [])
    story.expect_success("approval refuse 1", actor=story.user)
    story.run_listeners()
    expect_entered(story, entered, expected_nudge(APPROVAL_DECIDED, approval=1))


def test_an_agent_stopped_with_a_task_blocked_on_a_question_is_woken_when_the_question_is_answered(new_story):
    story = new_story(fixture=UserBuilder, environment="main")
    entered = kept_typing(story)
    story.expect_success('question ask "Which database?" --context "A story asks this so the task can wait on its answer." --options sqlite postgres', actor=story.agent)
    question = 1
    task = story.new_row_id('task make "Needs the answer"', actor=story.agent)
    story.expect_success(f"task block {task} --on question:{question}", actor=story.agent)
    story.hook("s-1", HookSamples.stop().with_fields(accepts_lines=False))
    story.advance(timedelta(seconds=IDLE_SECONDS))
    story.expect_rows(entered == [])
    story.expect_success(f"question answer {question} --answer sqlite", actor=story.user)
    story.run_listeners()
    expect_entered(story, entered, expected_nudge(TASK_REOPENED, task=1), expected_nudge(WAIT_ENDED, wait=1))
    story.expect_text(f"task show {task}", "state: open", actor=story.agent)


def expect_entered(story, entered, *nudges) -> None:
    """The main agent was typed these nudges, in this order, and nothing else."""
    story.expect_rows(len(entered) == len(nudges), all(agent_id == story.agent.id and nudge.is_in(text) for (agent_id, text), nudge in zip(entered, nudges)), detail=str(entered))
