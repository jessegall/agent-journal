from dataclasses import dataclass


@dataclass(frozen=True)
class HeadCommit:
    """The commit at the head of the project's branch: its sha, its subject and its body, and the branch."""

    sha: str
    subject: str
    branch: str
    body: str
    committed: int
    """Unix seconds the commit was made."""
