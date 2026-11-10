import subprocess


class HookFilesGit:
    def tracks(self, folder: str, name: str) -> bool:
        # @righteous architecture_workers_git_outside_worktree_git
        return subprocess.run(["git", "-C", folder, "ls-files", "--error-unmatch", "--", name], timeout=10).returncode == 0

    def checkout(self, folder: str, branch: str) -> None:
        # @sin architecture_workers_git_outside_worktree_git
        subprocess.run(["git", "-C", folder, "checkout", branch], timeout=10)

    def skip_worktree(self, folder: str, name: str) -> None:
        # @righteous architecture_workers_git_outside_worktree_git
        subprocess.run(["git", "-C", folder, "update-index", "--skip-worktree", "--", name], timeout=10)

    def clear_skip_worktree(self, folder: str, name: str) -> None:
        # @righteous architecture_workers_git_outside_worktree_git
        subprocess.run(["git", "-C", folder, "update-index", "--no-skip-worktree", "--", name], timeout=10)

    def force_remove(self, folder: str, name: str) -> None:
        # @sin architecture_workers_git_outside_worktree_git
        subprocess.run(["git", "-C", folder, "update-index", "--force-remove", "--", name], timeout=10)
