from pathlib import Path

from tests.stories.suites.coding.modules.workers.support.git_repository import GitRepository


def checkout_of(repository: GitRepository, branch: str) -> Path:
    """A checkout of the branch beside the repository, where a story commits on it as a person would."""
    folder = repository.folder.parent / f"checkout-{branch.replace('/', '-')}"
    if not folder.exists():
        repository.git("worktree", "add", str(folder), branch)
    return folder


def committed_on(repository: GitRepository, folder: Path, name: str, text: str, message: str) -> None:
    (folder / name).parent.mkdir(parents=True, exist_ok=True)
    (folder / name).write_text(text)
    repository.git("add", name, folder=folder)
    repository.git("commit", "-m", message, folder=folder)


def own_commits(repository: GitRepository, worker_id: int, count: int) -> None:
    for number in range(count):
        committed_on(repository, repository.worktree_folder(worker_id), f"own_{number}.py", f"OWN = {number}\n", f"Own commit {number}")
