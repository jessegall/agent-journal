from typing import TypedDict


class ProjectGitCommitRecord(TypedDict):
    """The JSON form of ProjectGit.commit."""

    sha: str
    subject: str
    author: str
    time: float
