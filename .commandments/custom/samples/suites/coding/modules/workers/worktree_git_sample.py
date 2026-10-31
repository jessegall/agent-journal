import subprocess

LIMIT_SECONDS = 60


class WorktreeGit:
    def tip(self, folder: str, branch: str) -> str:
        # @righteous architecture_workers_GitCallHasTimeLimitDetector
        return subprocess.run(["git", "-C", folder, "rev-parse", branch], capture_output=True, text=True, timeout=LIMIT_SECONDS, check=False).stdout

    def status(self, folder: str) -> str:
        # @sin architecture_workers_GitCallHasTimeLimitDetector
        return subprocess.run(["git", "-C", folder, "status"], capture_output=True, text=True, check=False).stdout

    def rebase(self, folder: str, base_branch: str) -> None:
        # @righteous architecture_workers_MergeIntoBaseBranchOnlyDetector
        self.git(folder, "rebase", base_branch)
        # @sin architecture_workers_MergeIntoBaseBranchOnlyDetector
        self.git(folder, "rebase", "HEAD")
        # @sin architecture_workers_MergeIntoBaseBranchOnlyDetector
        self.git(folder, "merge", "--no-ff", "main")
        # @righteous architecture_workers_MergeIntoBaseBranchOnlyDetector
        self.git(folder, "rebase", "--abort")

    def head(self, folder: str) -> str:
        # @righteous architecture_workers_NoCheckoutHeadReadDetector
        return self.git(folder, "symbolic-ref", "--short", "HEAD")

    def branch(self, folder: str) -> str:
        # @sin architecture_workers_NoCheckoutHeadReadDetector
        return self.git(folder, "rev-parse", "--abbrev-ref", "HEAD")

    def moved(self, folder: str, branch: str) -> str:
        # @sin architecture_workers_NoCheckoutHeadReadDetector
        return self.git(folder, "checkout", branch)

    def git(self, folder: str, *arguments: str) -> str:
        return subprocess.run(["git", "-C", folder, *arguments], capture_output=True, text=True, timeout=LIMIT_SECONDS, check=False).stdout
