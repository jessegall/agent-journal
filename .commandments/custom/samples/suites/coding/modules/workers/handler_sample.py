import subprocess

LIMIT_SECONDS = 60


class DeliverHandler:
    def __init__(self, git) -> None:
        self.git = git

    def handle(self, folder: str) -> None:
        # @sin architecture_workers_git_outside_worktree_git
        subprocess.run(["git", "-C", folder, "add", "-A"], timeout=LIMIT_SECONDS, check=False)
        # @righteous architecture_workers_git_outside_worktree_git
        subprocess.run(["cp", "-cR", folder, folder + ".copy"], timeout=LIMIT_SECONDS, check=False)
        # @righteous architecture_workers_git_outside_worktree_git
        self.git.commit(folder)
