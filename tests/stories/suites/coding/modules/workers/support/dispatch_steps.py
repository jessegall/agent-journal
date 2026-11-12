from tests.stories.core.modules.agents.support.numbered_agents import FIRST_STORY_NUMBER
import json
from core.modules.agents.models.agent import Agent
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.core.support.agent_labels import agent_number
import shlex
from pathlib import Path

from engine.actor.actor import Actor
from engine.container.container import UNBUILT_MODULES, needed_values
from engine.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine
from engine.enums.actor_type import ActorType
from engine.testing.stories.story import Story
from tests.stories.core.support import story_lines as lines
from suites.coding.modules.workers.support.worker_folder_runs import WorkerFolderRuns
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH, GitRepository
from tests.stories.suites.coding.modules.workers.support.memory_git.git_choice import REAL_GIT
from tests.stories.suites.coding.modules.workers.support.memory_git.memory_repository import MemoryRepository
from tests.stories.suites.coding.modules.workers.support.memory_git.memory_worktree_git import MemoryWorktreeGit
from engine.process.process_executor import ProcessExecutor

DISPATCH = "worker dispatch --test-command python=pytest --model sonnet 1"
CART_CHANGE = "TOTAL = 1\n"
FIRST_PROOF = 'proof make 1 --task 1 "cart.py:1, the cart total story"'


SAVED_TEST_COMMAND = 'alias add cart-test "pytest tests/" --category "test run"'


def repository_folder(story: Story) -> Path:
    return story.home.folder.parent / "project"


def repository_environment(story: Story, branch: str = ENVIRONMENT_BRANCH, real_git: bool = False) -> GitRepository:
    repository = GitRepository.sample(repository_folder(story)) if real_git or REAL_GIT.get() else memory_repository(story)
    branch_flag = f" --branch {branch}" if branch else ""
    story.expect_success(f"environment edit 1 --folder {shlex.quote(str(repository.folder))}{branch_flag}", f"folder: {repository.folder}")
    story.expect_success(SAVED_TEST_COMMAND)
    return repository


def memory_repository(story: Story) -> MemoryRepository:
    repository = MemoryRepository.sample(repository_folder(story))
    story.bind(WorktreeGit, MemoryWorktreeGit(story.container.get(WorkerFolderRuns), story.container.get(ProcessExecutor), repository.history))
    checked: dict[type, bool] = {}
    for class_type in [key for key, instance in story.container.instances.items() if uses_git(type(instance), checked)]:
        del story.container.instances[class_type]
    return repository


def uses_git(class_type: type, checked: dict[type, bool]) -> bool:
    if class_type not in checked:
        checked[class_type] = False
        needed = [] if class_type.__module__.partition(".")[0] in UNBUILT_MODULES else [hint for _, hint in needed_values(class_type)]
        checked[class_type] = any(hint is WorktreeGit or (isinstance(hint, type) and uses_git(hint, checked)) for hint in needed)
    return checked[class_type]


def story_repository(story: Story) -> GitRepository:
    git = story.container.get(WorktreeGit)
    return MemoryRepository(repository_folder(story), git.history) if isinstance(git, MemoryWorktreeGit) else GitRepository(repository_folder(story))


def dispatched_worker(story: Story, line: str = DISPATCH) -> Actor:
    return Actor(story.new_row_id(line, actor=story.agent), ActorType.AGENT)


def delivered_worker(story: Story, repository: GitRepository, line: str = DISPATCH) -> Actor:
    worker = dispatched_worker(story, line)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, "point: 1", actor=worker)
    story.expect_success(COMMIT, actor=worker)
    return worker


def checked_worker(story: Story, repository: GitRepository, line: str = DISPATCH) -> Actor:
    worker = delivered_worker(story, repository, line)
    story.expect_success("proof check 1", "state: checked", actor=story.agent)
    story.expect_success(f"worker logs {agent_number(story, worker.id)}", actor=story.agent)
    return worker


def worker_session(story: Story, worker: Actor) -> str:
    details = story.run(f"agent show {agent_number(story, worker.id)}").output_text.splitlines()
    return next(line for line in details if line.startswith("session: ")).removeprefix("session: ")


def merged_worker_lines(story: Story, worker: Actor) -> list[AgentLine]:
    lines = story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id).all_rows()
    return [line for line in lines if line.text == f"worker:{agent_number(story, worker.id)} was merged"]


def expect_clean_environment(story: Story, repository: GitRepository) -> None:
    story.expect_success("worker-worktree list", "nothing found")
    workers = json.loads(story.run("agent list --role worker --limit 100 --json").output_text)["rows"]
    story.expect_rows([worker for worker in workers if worker["number"] >= FIRST_STORY_NUMBER] == [], story.story_rows(Agent, role="worker") == ())
    story.expect_success(lines.TASK_DETAILS, "state: open")
    repository.expect_no_worktree()
