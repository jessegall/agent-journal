from tests.stories.builder.story_agent import StoryAgent
import json
import re
import shlex
import threading
import time

from journal.engine.clock import Clock
from journal.features.workers.jobs.auto_dispatch import AutoDispatch
from journal.features.workers.support.clock_outs_running import ClockOutsRunning
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.features.workers.support.worker_runner import WorkerRunner
from journal.models.test_turn import TestTurn
from journal.repositories.test_turns import TestTurns
from journal.repositories.scope import Scope
from journal.repositories.workers import Workers
from journal.support.actor import Actor

from journal.repositories.reviewers import Reviewers
from journal.repositories.verifiers import Verifiers
from journal.support.caller import Caller
from tests.stories.builder.step_result import StepResult


class WorkerSteps:
    """What a worker does in a story and how the agent sends one: dispatched on a task of its own, its clock-in, a proof of a point and its clock-out, each run as the worker it is, a command it only tries, which may be refused, a test turn it already holds and its end, a clock-out left running beside its next steps and its end in the journal after its command answered, a file it commits in its worktree, and the journal's own dispatch of the next tasks."""

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

    def worker_has_a_test_turn_running(self, agent: StoryAgent, ids: str) -> StepResult:
        with self.app.container.get(Scope).environment(1):
            worker = self.app.container.get(Workers).find(agent.number)
            folder = str(self.app.container.get(WorkerBranch).place(worker))
            turn = TestTurn(environment_id=1, worker=worker.id, ids=ids, command=f"./run_tests.sh {ids}", folder=folder).started(0.0)
            self.app.container.get(TestTurns).save(turn, Actor.worker(worker.id))
        return self.observed(f"the {agent.role} has a test turn running {ids}", None, None)

    def worker_test_run_ends_after(self, agent: StoryAgent, seconds: float) -> StepResult:
        threading.Timer(seconds, self.ended_turns, (agent,)).start()
        return self.observed(f"the {agent.role}'s test run ends after {seconds:g} seconds", None, None)

    def worker_test_run_ends(self, agent: StoryAgent) -> StepResult:
        self.ended_turns(agent)
        return self.observed(f"the {agent.role}'s test run ends", None, None)

    def worker_clock_out_starts(self, agent: StoryAgent, line: str) -> StepResult:
        outcomes: list = []
        thread = threading.Thread(target=lambda: outcomes.append(self.app.console().run(shlex.split(line), self.caller_of(agent))), daemon=True)
        self.clock_outs_going[agent.number] = (thread, outcomes)
        thread.start()
        running, deadline = self.app.container.get(ClockOutsRunning), time.time() + 10
        while thread.is_alive() and not running.is_running(agent.number) and time.time() < deadline:
            time.sleep(0.05)
        return self.observed(f"the {agent.role}'s clock-out starts and keeps running", None, None)

    def worker_clock_out_ends(self, agent: StoryAgent) -> StepResult:
        thread, outcomes = self.clock_outs_going.pop(agent.number)
        thread.join(30)
        return self.record_command(f"the {agent.role}'s first clock-out ends", outcomes[0])

    def worker_clock_out_ends_in_the_journal(self, agent: StoryAgent) -> StepResult:
        running, deadline = self.app.container.get(ClockOutsRunning), time.time() + 30
        while running.is_running(agent.number) and time.time() < deadline:
            time.sleep(0.05)
        assert not running.is_running(agent.number), f"the {agent.role}'s clock-out still runs in the journal"
        return self.observed(f"the {agent.role}'s clock-out ends in the journal", None, None)

    def worker_commits_a_file_in_its_worktree(self, agent: StoryAgent, path: str, text: str) -> StepResult:
        folder = next((self.app.config.home / "worktrees").glob(f"{agent.number}-*"))
        (folder / path).write_text(text)
        self.git_in(folder, "add", path)
        self.git_in(folder, "-c", "user.email=story@example.com", "-c", "user.name=Story", "commit", "-q", "-m", f"add {path}")
        return self.observed(f"the {agent.role} commits {path} in its worktree", None, None)

    def ended_turns(self, agent: StoryAgent) -> None:
        with self.app.container.get(Scope).environment(1):
            rows = self.app.container.get(TestTurns)
            for turn in [turn for turn in rows.running() if turn.worker == agent.number]:
                rows.save(turn.ended(), Actor.system())

    def agent_runs_cleanly(self, agent: StoryAgent, line: str) -> StepResult:
        result = self.agent_runs(agent, line)
        assert result.command.code == 0, f"the {agent.role}'s {line} was refused: {result.command.error or result.command.text}"
        return result

def worker_session(worker: int) -> str:
    return f"w{worker}"
