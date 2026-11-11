from tests.stories.core.support.agent_labels import agent_number
import json
import shlex
from dataclasses import dataclass, replace
from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.command_category import CommandCategory
from engine.driver.hook_reply import HookReply
from engine.enums.tool_type import ToolType
from engine.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.processes.models.process import Process
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.expectations.line_outcome import LineOutcome
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story import Story
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.core.support.plan_steps import ready_plan
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, dispatched_worker, repository_environment, repository_folder, story_repository, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import GitRepository
from tests.stories.suites.coding.modules.workers.test_queue import ended, recording_launch

PLAN_DISPATCH = "worker dispatch --test-command python=pytest --model sonnet --plan 1"
PHASE_DISPATCH = "worker dispatch --test-command python=pytest --model sonnet --plan 1 --phase 1"
EXTERNAL_DISPATCH = "worker dispatch --test-command python=pytest --model sonnet 1 2"
TEST_LINE = "pytest tests/cart.py"
SECOND_TEST_LINE = "pytest tests/totals.py"
TEST_ALIAS = "cart-test"


def planned_story(new_story, approve: bool = True, build_test: str = ""):
    """Plan 1 with phase Build holding the open tasks 1 (Fix the cart), 2 and 3, and phase Ship holding task 4.
    With a test of its own, phase Build is a checkpoint: only a checkpoint phase has one."""
    story = new_story(fixture=OpenTaskOrchestrator)
    UserJoined().steps(story)
    repository_environment(story)
    story.run('plan make "Rebuild the cart" --environment main')
    test_flag = f' --checkpoint --test "{build_test}"' if build_test else ""
    story.expect_success(f'phase make --plan 1 "Build"{test_flag}')
    story.run('phase make --plan 1 "Ship"')
    story.run("phase place 1 --phase 1")
    for title, phase in (("Tax", 1), ("Totals", 1), ("Release", 2)):
        task_id = story.new_row_id(f'task make "{title}" --environment main')
        story.run(f"phase place {task_id} --phase {phase}")
    if approve:
        approve_plan(story)
    return story


def approve_plan(story: Story) -> None:
    ready_plan(story, actor=story.user)
    story.run("plan approve 1 --environment main", actor=story.user)


def file_line(line: str) -> str:
    return " && ".join(f"journal worker test python {' '.join(shlex.split(text)[1:])}" for text in line.split(" && "))


def file_test_part(line: str) -> ShellPart:
    return ShellPart("journal", CommandCategory.JOURNAL, ["worker", "test", "python", *shlex.split(line)[1:]])


def file_proof_line(line: str) -> str:
    return f"python {line.removeprefix('pytest ')}" if line.startswith("pytest ") else line


def shell_test_part(line: str) -> ShellPart:
    program, *arguments = shlex.split(line)
    return ShellPart(program, CommandCategory.TEST_RUN, arguments)


@dataclass(frozen=True)
class StoryWorker:
    """A worker dispatched in a story, its repository and the test processes it started."""

    story: Story
    repository: GitRepository
    worker: Actor
    session: str
    started: list[int]
    initial_line_count: int

    def run_line(self, line: str, *parts: ShellPart) -> HookReply:
        return self.story.hook(self.session, HookSamples.shell(line, *parts))

    def run_test(self, line: str = TEST_LINE) -> HookReply:
        return self.run_line(file_line(line), *(file_test_part(text) for text in line.split(" && ")))

    def save_test_alias(self, line: str = TEST_LINE) -> None:
        self.story.expect_success(f'alias edit {TEST_ALIAS} --line "{line}"', actor=self.story.agent)
        self.story.run_listeners()

    def run_test_with_saved_commands_known(self, line: str = TEST_LINE) -> HookReply:
        shell = {"line": line, "parts": [shell_test_part(line).prepared(line)], "redirects": [], "is_journal_only": False, "parse_error": "", "saved_commands_known": True}
        return self.story.hook(self.session, HookSamples.tool_use("Bash", ToolType.SHELL, [], None, shell=shell))

    def run_saved_test(self, line: str = TEST_LINE, read_flag: str = "tail:20") -> HookReply:
        part = shell_test_part(line).prepared(line)
        part.update(saved_command=TEST_ALIAS, read_flag=read_flag)
        shell = {"line": line, "parts": [part], "aliases": [TEST_ALIAS], "redirects": [], "is_journal_only": False, "parse_error": "", "saved_commands_known": True}
        return self.story.hook(self.session, HookSamples.tool_use("Bash", ToolType.SHELL, [], None, shell=shell))

    def current_task(self) -> int:
        return json.loads(self.story.run("worker status --json", actor=self.worker).output_text)["current_task"]["id"]

    def edit_prove(self, test_line: str = "", point: int = 1) -> None:
        outcome = self.prove(test_line, point)
        assert outcome.code == 0, outcome.output_text

    def prove(self, test_line: str = "", point: int = 1) -> LineOutcome:
        self.repository.changed(self.worker.id, "cart.py", CART_CHANGE)
        self.repository.changed(self.worker.id, f"task_{self.current_task()}.txt", "done\n")
        test_flag = f' --test "{file_proof_line(test_line)}"' if test_line else ""
        return self.story.run(f'proof make {point} --task {self.current_task()} "cart.py:1, the cart total"{test_flag}', actor=self.worker)

    def prove_commit(self, test_line: str = "") -> LineOutcome:
        self.prove(test_line)
        return self.story.run("worker commit --wait --differences none", actor=self.worker)

    def end_test(self, process_id: int, code: int = 0) -> None:
        ended(self.story, process_id, code)

    def end_all_tests(self) -> None:
        ended_count = 0
        while ended_count < len(self.started):
            self.end_test(self.started[ended_count])
            ended_count += 1

    def end_tests(self, *codes: int) -> None:
        for process_id, code in zip(self.started, codes):
            self.end_test(process_id, code)

    def status(self) -> str:
        return self.story.run("worker status", actor=self.worker).output_text

    def status_line(self) -> str:
        return self.status().splitlines()[0]

    def status_json(self) -> dict[str, object]:
        return json.loads(self.story.run("worker status --json", actor=self.worker).output_text)

    def stop(self) -> HookReply:
        return self.story.hook(self.session, HookSamples.stop())

    def program_ended(self) -> None:
        self.story.advance(timedelta(minutes=5))
        self.story.run(f"agent edit {agent_number(self.story, self.worker.id)} --pid 700 --process-started-at 2026-10-31T09:00:00+00:00")
        self.story.use_processes()
        self.story.tick("s-1")

    def worktree_task(self) -> int:
        rows = json.loads(self.story.run("worker-worktree list --json", actor=self.story.agent).output_text)["rows"]
        return next(row["task_id"] for row in rows if row["session_agent_id"] == self.worker.id)

    def started_processes(self) -> tuple[Process, ...]:
        return tuple(self.story.row(Process, process_id) for process_id in self.started)

    def added_worker(self, dispatch: str) -> "StoryWorker":
        worker = dispatched_worker(self.story, dispatch)
        return replace(self, worker=worker, session=worker_session(self.story, worker))

    def main_agent_lines(self) -> tuple[str, ...]:
        return agent_lines(self.story, self.story.agent)[self.initial_line_count:]

    def worker_lines(self) -> tuple[str, ...]:
        return agent_lines(self.story, self.worker)



def agent_lines(story: Story, agent: Actor) -> tuple[str, ...]:
    story.run_listeners()
    lines = story.container.get(Queries).query(AgentLine).filter(session_agent_id=agent.id).all_rows()
    return tuple(line.text for line in lines)


def dispatched_story_worker(story: Story, dispatch: str, monkeypatch) -> StoryWorker:
    install_runner(story)
    started = recording_launch(monkeypatch)
    worker = dispatched_worker(story, dispatch)
    repository = story_repository(story)
    return StoryWorker(story, repository, worker, worker_session(story, worker), started, len(agent_lines(story, story.agent)))


def start_planned_worker(new_story, monkeypatch, dispatch: str = PLAN_DISPATCH, build_test: str = "") -> StoryWorker:
    return dispatched_story_worker(planned_story(new_story, build_test=build_test), dispatch, monkeypatch)


def unplanned_worker(new_story, monkeypatch) -> StoryWorker:
    """A worker holding task 1 with task 2 queued, neither of them in a plan."""
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.run('task make "Tax" --brief "The tax"', actor=story.agent)
    return dispatched_story_worker(story, EXTERNAL_DISPATCH, monkeypatch)


def unplanned_group_worker(new_story, monkeypatch) -> StoryWorker:
    """A worker holding task 1 with tasks 2 and 3 queued, none of them in a plan."""
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    for title in ("Tax", "Totals"):
        story.run(f'task make "{title}" --brief "The {title.lower()}"', actor=story.agent)
    return dispatched_story_worker(story, "worker dispatch --test-command python=pytest --model sonnet 1 2 3", monkeypatch)
