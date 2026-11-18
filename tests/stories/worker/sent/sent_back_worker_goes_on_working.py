from journal.engine.states.void import Void
from journal.features.workers.states.working_task import WorkingTask
from journal.features.workers.workers_options import BUILDER_MODE
from journal.models.task_state import TaskState
from journal.models.worker_state import WorkerState
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import story
from tests.stories.fixtures.worker.worker_delivered import WorkerDelivered


@story(WorkerDelivered, mode=BUILDER_MODE, subject=AgentRole.WORKER)
def test_a_worker_sent_back_after_its_clock_out_runs_a_shell_command_at_once(story):
    story.worker_run_ends_with_its_session(story.agents.subject, "the parser is done")
    result = story.agent_runs(story.agents.main, f"worker check {story.agents.subject} 1 --short 'name the test'")
    result.expect_command_passed()
    story.expect_worker(story.agents.workers.first(), state=WorkerState.DISPATCHED)
    story.expect_task(story.tasks.briefed, state=TaskState.STARTED)
    story.agent_resumes_the_session(story.agents.subject)
    result = story.agent_runs_in_the_shell(story.agents.subject, "docker ps")
    result.expect_allowed()
    story.expect_worker(story.agents.workers.first(), state=WorkerState.DISPATCHED)
    story.expect_task(story.tasks.briefed, state=TaskState.STARTED)
    story.expect_stack(story.agents.subject, Void, WorkingTask)


@story(WorkerDelivered, mode=BUILDER_MODE, subject=AgentRole.WORKER)
def test_a_worker_sent_a_job_on_the_task_it_started_runs_a_shell_command_at_once(story):
    story.worker_run_ends_with_its_session(story.agents.subject, "the parser is done")
    result = story.agent_runs(story.agents.main, f"worker send {story.agents.subject} 'add a test for the empty grammar'")
    result.expect_command_passed()
    story.agent_resumes_the_session(story.agents.subject)
    result = story.agent_runs_in_the_shell(story.agents.subject, "docker ps")
    result.expect_allowed()
    story.expect_stack(story.agents.subject, Void, WorkingTask)

