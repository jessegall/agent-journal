from suites.coding.support.project_git_branch_record import ProjectGitBranchRecord
from suites.coding.support.project_git_commit_record import ProjectGitCommitRecord
from suites.coding.support.project_git_pull_record import ProjectGitPullRecord
import shutil
from pathlib import Path

from engine.enums.process_kind import ProcessKind
from engine.errors.run_time_limit_error import RunTimeLimitError
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.scope.scopes import Scopes
from core.modules.environments.models.environment import Environment
from suites.coding.support.git_pull_rows import GitPullRows
from suites.coding.support.git_rows import GitRows

BASE_BRANCHES = ("development", "main", "master")
COMMAND_LIMIT_SECONDS = 15
MERGE_REQUEST_ROW_COUNT = 30
FAILED_CHECKS = ("FAILURE", "ERROR", "TIMED_OUT", "CANCELLED", "ACTION_REQUIRED", "STARTUP_FAILURE")
RUNNING_CHECKS = ("PENDING", "QUEUED", "IN_PROGRESS", "WAITING", "EXPECTED", "")
MERGE_REQUEST_FIELDS = '[.number, .isDraft, .reviewDecision, ([.statusCheckRollup[] | (.conclusion // .state // .status // "")] | join(",")), .headRefName, .author.login, .url, .title] | @tsv'


class ProjectGit:
    """Reads an environment's repository and writes nothing: its branches with the commits each has beyond the
    base branch and those it lacks, the recent commits of the current branch, and the open pull requests when
    the gh program is there."""

    def __init__(self, queries: Queries, scopes: Scopes, executor: ProcessExecutor) -> None:
        self.queries, self.scopes, self.executor = queries, scopes, executor

    def output(self, *command: str) -> str | None:
        environment_id = self.scopes.environment_id
        if environment_id is None:
            raise Refusal("a repository is read in one environment", "run this from an environment")
        folder = Path(self.queries.query(Environment).find(environment_id).folder)
        try:
            finished = self.executor.execute(ExecutionRequest(command, folder, ProcessKind.QUICK, COMMAND_LIMIT_SECONDS))
        except (OSError, RunTimeLimitError):
            return None
        return finished.stdout if finished.succeeded else None

    def git_output(self, *arguments: str) -> str:
        text = self.output("git", *arguments)
        if text is None:
            raise Refusal(f"git {arguments[0]} could not read this repository")
        return text

    def base(self) -> str | None:
        return next((name for name in BASE_BRANCHES if self.output("git", "rev-parse", "--verify", "--quiet", name) is not None), None)

    def branches(self, skip: int, limit: int) -> GitRows:
        listed = self.git_output("for-each-ref", "refs/heads", "--sort=-committerdate", "--format=%(refname:short)%09%(committerdate:unix)%09%(authorname)%09%(subject)").splitlines()
        current = self.git_output("rev-parse", "--abbrev-ref", "HEAD").strip()
        base = self.base()
        return GitRows([self.branch(line, current, base) for line in listed[skip:skip + limit]], skip + limit >= len(listed))

    def branch(self, line: str, current: str, base: str | None) -> ProjectGitBranchRecord:
        name, time, author, subject = line.split("\t", 3)
        missing, extra = self.git_output("rev-list", "--left-right", "--count", f"{base}...{name}").split() if base is not None and name != base else ("0", "0")
        return {"name": name, "current": name == current, "extra_commits": int(extra), "missing_commits": int(missing), "subject": subject, "author": author, "time": float(time)}

    def commits(self, skip: int, limit: int) -> GitRows:
        listed = self.git_output("log", f"--skip={skip}", f"-n{limit + 1}", "--format=%H%x09%an%x09%at%x09%s").splitlines()
        return GitRows([self.commit(line) for line in listed[:limit]], len(listed) <= limit)

    @staticmethod
    def commit(line: str) -> ProjectGitCommitRecord:
        sha, author, time, subject = line.split("\t", 3)
        return {"sha": sha, "subject": subject, "author": author, "time": float(time)}

    def pulls(self) -> GitPullRows:
        if shutil.which("gh") is None:
            return GitPullRows(False, ())
        listed = self.output("gh", "pr", "list", "--state", "open", "--limit", str(MERGE_REQUEST_ROW_COUNT), "--json", "number,title,headRefName,author,isDraft,reviewDecision,statusCheckRollup,url", "--jq", f".[] | {MERGE_REQUEST_FIELDS}")
        return GitPullRows(False, ()) if listed is None else GitPullRows(True, tuple(self.pull(line) for line in listed.splitlines()))

    @staticmethod
    def pull(line: str) -> ProjectGitPullRecord:
        number, draft, review, checks, branch, author, url, title = line.split("\t", 7)
        states = [state.upper() for state in checks.split(",")] if checks else []
        failed = sum(1 for state in states if state in FAILED_CHECKS)
        running = sum(1 for state in states if state in RUNNING_CHECKS)
        return {"number": int(number), "title": title, "branch": branch, "author": author, "draft": draft == "true", "review": review, "checks_passed": len(states) - failed - running,
                "checks_failed": failed, "checks_running": running, "url": url}
