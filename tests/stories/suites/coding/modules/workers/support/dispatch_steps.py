import shlex

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.story import Story
from tests.stories.core.support import story_lines as lines
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH, GitRepository

DISPATCH = "worker dispatch 1"
CART_CHANGE = "TOTAL = 1\n"
FIRST_PROOF = 'proof make 1 "cart.py:1, the cart total story"'
DELIVERY = "worker deliver"


def repository_environment(story: Story, branch: str = ENVIRONMENT_BRANCH) -> GitRepository:
    repository = GitRepository.sample(story.home.folder.parent / "project")
    branch_flag = f" --branch {branch}" if branch else ""
    story.expect_success(f"environment edit 1 --folder {shlex.quote(str(repository.folder))}{branch_flag}", f"folder: {repository.folder}")
    return repository


def dispatched_worker(story: Story, line: str = DISPATCH) -> Actor:
    return Actor(story.new_row_id(line, actor=story.agent), ActorType.AGENT)


def delivered_worker(story: Story, repository: GitRepository) -> Actor:
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, "point: 1", actor=worker)
    story.expect_success(DELIVERY, actor=worker)
    return worker


def checked_worker(story: Story, repository: GitRepository) -> Actor:
    worker = delivered_worker(story, repository)
    story.expect_success("proof check 1", "state: checked", actor=story.agent)
    return worker


def worker_session(story: Story, worker: Actor) -> str:
    details = story.run(f"agent show {worker.id}").output_text.splitlines()
    return next(line for line in details if line.startswith("session: ")).removeprefix("session: ")


def expect_clean_environment(story: Story, repository: GitRepository) -> None:
    story.expect_success("worker-worktree list", "nothing found")
    story.expect_success("agent list --role worker", "nothing found")
    story.expect_success(lines.TASK_DETAILS, "state: open")
    repository.expect_no_worktree()
