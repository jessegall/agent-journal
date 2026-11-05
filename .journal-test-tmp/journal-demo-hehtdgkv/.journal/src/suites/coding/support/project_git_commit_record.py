from typing import TypedDict


class ProjectGitCommitRecord(TypedDict):
    """The JSON form of ProjectGit.commit."""

    sha: object
    subject: object
    author: object
    time: object
