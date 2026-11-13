from tests.unit.support.declared_merge_builds import declared_merge_builds
from tests.unit.support.plain_executor import plain_executor
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.unit.suites.coding.modules.workers.test_worktree_git_own_files import BASE_BRANCH, SampleRepository

FIRST_BRANCH = "workers/first"
SECOND_BRANCH = "workers/second"


def repository_with_commit(tmp_path, subject: str) -> SampleRepository:
    repository = SampleRepository(tmp_path / "repository")
    repository.folder.mkdir()
    repository.git("init", "--initial-branch", BASE_BRANCH)
    repository.committed("cart.py", "TOTAL = 0\n", "The cart")
    repository.git("checkout", "-b", FIRST_BRANCH)
    repository.committed("tax.py", "TAX = 1\n", subject)
    repository.git("checkout", BASE_BRANCH)
    return repository


def prior_branch(repository: SampleRepository, *task_ids: int) -> str | None:
    worktree = Worktree(session_agent_id=1, task_id=task_ids[0], creator_id=1, folder=str(repository.folder), branch=SECOND_BRANCH, base_branch=BASE_BRANCH,
                        base_commit=repository.tip(BASE_BRANCH))
    return WorktreeGit(None, plain_executor(), declared_merge_builds()).earlier_branch(str(repository.folder), worktree, task_ids)


def test_the_search_finds_the_branch_of_a_commit_of_several_tasks_for_each_task_of_its_subject(tmp_path):
    repository = repository_with_commit(tmp_path, "tasks 12, 15: Fix the cart")
    assert prior_branch(repository, 12) == FIRST_BRANCH
    assert prior_branch(repository, 15) == FIRST_BRANCH
    assert prior_branch(repository, 3, 15) == FIRST_BRANCH


def test_the_search_finds_no_branch_for_a_task_whose_digits_are_part_of_a_task_of_the_subject(tmp_path):
    repository = repository_with_commit(tmp_path, "tasks 12, 15: Fix the cart")
    assert prior_branch(repository, 1) is None
    assert prior_branch(repository, 2) is None
    assert prior_branch(repository, 5) is None


def test_the_search_finds_the_branch_of_a_commit_of_one_task_as_before(tmp_path):
    repository = repository_with_commit(tmp_path, "task 12: Fix the cart")
    assert prior_branch(repository, 12) == FIRST_BRANCH
    assert prior_branch(repository, 1) is None
