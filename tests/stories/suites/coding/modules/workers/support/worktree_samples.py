from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH, GitRepository


def commit_in_worktree(repository: GitRepository, worker_id: int, name: str) -> str:
    repository.changed(worker_id, name, "TOTAL = 9\n")
    repository.git("add", "-A", folder=repository.worktree_folder(worker_id))
    repository.git("commit", "-m", "Work in progress", folder=repository.worktree_folder(worker_id))
    return repository.tip(repository.worker_branch(worker_id))


def orphan_worktree(repository: GitRepository, worker_id: int) -> str:
    branch = repository.worker_branch(worker_id)
    repository.git("worktree", "add", "-b", branch, str(repository.worktree_folder(worker_id)), ENVIRONMENT_BRANCH)
    return commit_in_worktree(repository, worker_id, "cart.py")
