from typing import TypedDict


class ProjectGitPullRecord(TypedDict):
    """The JSON form of ProjectGit.pull."""

    number: int
    title: str
    branch: str
    author: str
    draft: bool
    review: str
    checks_passed: int
    checks_failed: int
    checks_running: int
    url: str
