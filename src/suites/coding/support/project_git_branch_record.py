from typing import TypedDict


class ProjectGitBranchRecord(TypedDict):
    """The JSON form of ProjectGit.branch."""

    name: object
    current: object
    extra_commits: object
    missing_commits: object
    subject: object
    author: object
    time: object
