import shlex
from pathlib import Path

from core.base.actor import Actor
from core.base.container import UNBUILT_MODULES, needed_values
from core.base.actor_type import ActorType
from core.testing.story import Story
from tests.stories.core.support import story_lines as lines
from suites.coding.modules.workers.support.worker_folder_runs import WorkerFolderRuns
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH, GitRepository
from tests.stories.suites.coding.modules.workers.support.memory_git.git_choice import REAL_GIT
from tests.stories.suites.coding.modules.workers.support.memory_git.memory_repository import MemoryRepository
from tests.stories.suites.coding.modules.workers.support.memory_git.memory_worktree_git import MemoryWorktreeGit

DISPATCH = "worker dispatch --model sonnet 1"
CART_CHANGE = "TOTAL = 1\n"
FIRST_PROOF = 'proof make 1 --task 1 "cart.py:1, the cart total story"'
DELIVERY = "worker deliver --wait --differences none"


def repository_folder(story: Story) -> Path:
    return story.home.folder.parent / "project"


def repository_environment(story: Story, branch: str = ENVIRONMENT_BRANCH, real_git: bool = False) -> GitRepository:
    """The environment's repository: kept in memory, with no git program, unless the story is about git and asks for real git."""
    repository = GitRepository.sample(repository_folder(story)) if real_git or REAL_GIT.get() else memory_repository(story)
    branch_flag = f" --branch {branch}" if branch else ""
    story.expect_success(f"environment edit 1 --folder {shlex.quote(str(repository.folder))}{branch_flag}", f"folder: {repository.folder}")
    return repository


def memory_repository(story: Story) -> MemoryRepository:
    repository = MemoryRepository.sample(repository_folder(story))
    story.bind(WorktreeGit, MemoryWorktreeGit(story.container.get(WorkerFolderRuns), repository.history))
    known: dict[type, bool] = {}
    for class_type in [key for key, held in story.container.instances.items() if uses_git(type(held), known)]:
        del story.container.instances[class_type]
    return repository


def uses_git(class_type: type, known: dict[type, bool]) -> bool:
    """Whether an object of the class, or one it is built from, holds a WorktreeGit."""
    if class_type not in known:
        known[class_type] = False
        needed = [] if class_type.__module__.partition(".")[0] in UNBUILT_MODULES else [hint for _, hint in needed_values(class_type)]
        known[class_type] = any(hint is WorktreeGit or (isinstance(hint, type) and uses_git(hint, known)) for hint in needed)
    return known[class_type]


def story_repository(story: Story) -> GitRepository:
    """The repository an earlier step of the story made, in memory or with real git."""
    git = story.container.get(WorktreeGit)
    return MemoryRepository(repository_folder(story), git.history) if isinstance(git, MemoryWorktreeGit) else GitRepository(repository_folder(story))


def dispatched_worker(story: Story, line: str = DISPATCH) -> Actor:
    return Actor(story.new_row_id(line, actor=story.agent), ActorType.AGENT)


def delivered_worker(story: Story, repository: GitRepository, line: str = DISPATCH) -> Actor:
    worker = dispatched_worker(story, line)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, "point: 1", actor=worker)
    story.expect_success(DELIVERY, actor=worker)
    return worker


def checked_worker(story: Story, repository: GitRepository, line: str = DISPATCH) -> Actor:
    worker = delivered_worker(story, repository, line)
    story.expect_success("proof check 1", "state: checked", actor=story.agent)
    story.expect_success(f"worker logs {worker.id}", actor=story.agent)
    return worker


def worker_session(story: Story, worker: Actor) -> str:
    details = story.run(f"agent show {worker.id}").output_text.splitlines()
    return next(line for line in details if line.startswith("session: ")).removeprefix("session: ")


def expect_clean_environment(story: Story, repository: GitRepository) -> None:
    story.expect_success("worker-worktree list", "nothing found")
    story.expect_success("agent list --role worker", "nothing found")
    story.expect_success(lines.TASK_DETAILS, "state: open")
    repository.expect_no_worktree()
