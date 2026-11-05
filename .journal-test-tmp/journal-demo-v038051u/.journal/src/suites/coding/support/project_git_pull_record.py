from typing import TypedDict


class ProjectGitPullRecord(TypedDict):
    """The JSON form of ProjectGit.pull."""

    number: object
    title: object
    branch: object
    author: object
    draft: object
    review: object
    checks_passed: object
    checks_failed: object
    checks_running: object
    url: object
