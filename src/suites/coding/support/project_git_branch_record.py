from typing import TypedDict


class ProjectGitBranchRecord(TypedDict):
    """The JSON form of ProjectGit.branch."""

    name: str
    current: bool
    extra_commits: int
    missing_commits: int
    subject: str
    author: str
    time: float
