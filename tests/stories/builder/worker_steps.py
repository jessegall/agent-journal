from tests.stories.builder.story_agent import StoryAgent
import json
import re
import shlex

from journal.engine.clock import Clock
from journal.features.workers.jobs.auto_dispatch import AutoDispatch
from journal.features.workers.support.worker_runner import WorkerRunner
from journal.repositories.scope import Scope
from journal.repositories.workers import Workers
from journal.support.actor import Actor

from journal.repositories.reviewers import Reviewers
from journal.repositories.verifiers import Verifiers
from journal.support.caller import Caller
from tests.stories.builder.step_result import StepResult


class WorkerSteps:
    """What a worker does in a story and how the agent sends one: dispatched on a task of its own, its clock-in, a proof of a point and its clock-out, each run as the worker it is, a command it only tries, which may be refused, and the journal's own dispatch of the next tasks."""

    def agent_dispatches_worker(self, agent: StoryAgent, name: str, task: int) -> int:
        self.agent_runs(agent, f"worker dispatch '{name}' --task {task} --changes 'the files of its task' --profile journal-medior --model sonnet --tests 'Scoped tests'")
        return self.created_number("worker")

    def agent_dispatches_worktree_worker(self, agent: StoryAgent, name: str, task: int) -> int:
        self.agent_runs(agent, f"worker dispatch '{name}' --task {task} --changes 'the files of its task' --profile journal-medior --model sonnet --tests 'Scoped tests' --worktree --no-libraries")
        self.last_step.expect_command_passed()
        return self.created_number("worker")

    def agent_dispatches_worker_on_plan(self, agent: StoryAgent, name: str, plan: int) -> int:
        self.agent_runs(agent, f"worker dispatch '{name}' --plan {plan} --changes 'the files of its tasks' --profile journal-medior --model sonnet --tests 'Scoped tests'")
        self.last_step.expect_command_passed()
        return self.newest("workers")

    def journal_dispatches_the_next_tasks(self) -> StepResult:
        self.app.container.get(AutoDispatch).tick(self.app.container.get(Clock).held_at)
        self.app.runtime().deferred.drain()
        return self.observed("the journal dispatches the next tasks", None, None)

    def agent_clocks_in(self, agent: StoryAgent) -> StepResult:
        return self.agent_runs_cleanly(agent, "clock-in")

    def agent_proves(self, agent: StoryAgent, point: int, proof: str) -> StepResult:
        return self.agent_runs_cleanly(agent, f"proof {point} '{proof}'")

    def agent_clocks_out(self, agent: StoryAgent, report: str) -> StepResult:
        return self.agent_runs_cleanly(agent, f"clock-out '{report}'")

    def worker_proves_its_point_again(self, agent: StoryAgent, point: int, proof: str) -> StepResult:
        self.agent_resumes_the_session(agent)
        self.agent_clocks_in(agent)
        self.agent_proves(agent, point, proof)
        self.agent_clocks_out(agent, f"point {point} again: {proof}")
        return self.worker_run_ends_with_its_session(agent, proof)

    def worker_run_ends_with_its_session(self, agent: StoryAgent, report: str) -> StepResult:
        self.agent_has_written(agent, report)
        return self.worker_run_ends_printing(agent, json.dumps({"result": report, "session_id": self.session_of(agent)}))

    def worker_run_ends_printing(self, agent: StoryAgent, printed: str) -> StepResult:
        runner = self.app.container.get(WorkerRunner)
        with self.app.container.get(Scope).environment(1):
            worker = self.app.container.get(Workers).find(agent.number)
            output, _ = runner.outputs(worker)
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_text(printed)
            runner.finish(worker, 0, Actor.system())
        return self.observed(f"the {agent.role}'s run ends", None, None)

    def agent_runs_cleanly(self, agent: StoryAgent, line: str) -> StepResult:
        result = self.agent_runs(agent, line)
        assert result.command.code == 0, f"the {agent.role}'s {line} was refused: {result.command.error or result.command.text}"
        return result

def worker_session(worker: int) -> str:
    return f"w{worker}"
