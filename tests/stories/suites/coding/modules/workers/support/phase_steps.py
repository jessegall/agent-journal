import json
import shlex
from dataclasses import dataclass

from core.base.actor import Actor
from core.base.driver.command_category import CommandCategory
from core.base.driver.hook_reply import HookReply
from core.base.driver.tool_type import ToolType
from core.base.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.testing.story import Story
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.core.support.plan_steps import ready_plan
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, dispatched_worker, repository_environment, repository_folder, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import GitRepository
from tests.stories.suites.coding.modules.workers.test_queue import ended, recording_launch

PLAN_DISPATCH = "worker dispatch --model sonnet --plan 1"
TEST_LINE = "pytest tests/cart.py"
TEST_ALIAS = "cart-test"


def planned_story(new_story, approve: bool = True):
    """Plan 1 with phase Build holding the open tasks 1 (Fix the cart), 2 and 3, and phase Ship holding task 4."""
    story = new_story(fixture=OrchestratorWithOpenTask)
    UserJoined().steps(story)
    repository_environment(story)
    story.run('plan make "Rebuild the cart" --environment main')
    story.run('phase make --plan 1 "Build"')
    story.run('phase make --plan 1 "Ship"')
    story.run("phase place 1 --phase 1")
    for title, phase in (("Tax", 1), ("Totals", 1), ("Release", 2)):
        task_id = story.new_row_id(f'task make "{title}" --environment main')
        story.run(f"phase place {task_id} --phase {phase}")
    if approve:
        ready_plan(story, actor=story.user)
        story.run("plan approve 1 --environment main", actor=story.user)
    return story


def asking_main(line: str, why: str) -> str:
    return f'{line} --ask-main "{why}"'


def shell_test_part(line: str) -> ShellPart:
    program, *arguments = shlex.split(line)
    return ShellPart(program, CommandCategory.TEST_RUN, arguments)


@dataclass(frozen=True)
class WorkerOnPlan:
    """A worker dispatched on the whole of plan 1, its repository and the test processes it started."""

    story: Story
    repository: GitRepository
    worker: Actor
    session: str
    started: list[int]
    lines_before_work: int

    def run_test(self, line: str = TEST_LINE) -> HookReply:
        return self.story.hook(self.session, HookSamples.shell(line, shell_test_part(line)))

    def save_test_alias(self, line: str = TEST_LINE) -> None:
        self.story.expect_success(f'alias add {TEST_ALIAS} "{line}" --category "test run"', actor=self.story.agent)
        self.story.run_listeners()

    def run_saved_test(self, line: str = TEST_LINE) -> HookReply:
        part = shell_test_part(line).prepared(line)
        part.update(saved_command=TEST_ALIAS, read_flag="tail:20")
        shell = {"line": line, "parts": [part], "aliases": [TEST_ALIAS], "redirects": [], "is_journal_only": False, "parse_error": ""}
        return self.story.hook(self.session, HookSamples.tool_use("Bash", ToolType.SHELL, [], None, shell=shell))

    def current_task(self) -> int:
        return json.loads(self.story.run("worker status --json", actor=self.worker).output_text)["current_task"]["id"]

    def change_and_prove(self, test_line: str = "", point: int = 1) -> None:
        self.repository.changed(self.worker.id, "cart.py", CART_CHANGE)
        test_flag = f' --test "{test_line}"' if test_line else ""
        proof = f'proof make {point} --task {self.current_task()} "cart.py:1, the cart total"{test_flag}'
        self.story.expect_success(proof, f"point: {point}", actor=self.worker)

    def end_test(self, process_id: int, code: int = 0) -> None:
        ended(self.story, process_id, code)

    def main_agent_lines(self) -> tuple[str, ...]:
        return lines_of_main_agent(self.story)[self.lines_before_work:]


def lines_of_main_agent(story: Story) -> tuple[str, ...]:
    story.run_listeners()
    lines = story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id).all_rows()
    return tuple(line.text for line in lines)


def worker_on_plan(new_story, monkeypatch) -> WorkerOnPlan:
    story = install_runner(planned_story(new_story))
    started = recording_launch(monkeypatch)
    worker = dispatched_worker(story, PLAN_DISPATCH)
    repository = GitRepository(repository_folder(story))
    return WorkerOnPlan(story, repository, worker, worker_session(story, worker), started, len(lines_of_main_agent(story)))
