import subprocess


class HookFilesGit:
    def tracks(self, folder: str, name: str) -> bool:
        # @righteous architecture_workers_GitOnlyInWorktreeGitDetector
        return subprocess.run(["git", "-C", folder, "ls-files", "--error-unmatch", "--", name], timeout=10).returncode == 0

    def checkout(self, folder: str, branch: str) -> None:
        # @sin architecture_workers_GitOnlyInWorktreeGitDetector
        subprocess.run(["git", "-C", folder, "checkout", branch], timeout=10)
