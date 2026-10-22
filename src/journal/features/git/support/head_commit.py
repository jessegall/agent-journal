from dataclasses import dataclass

FORMAT = "%H%n%ct%n%D%n%s%n%B"
BRANCH_PREFIX = "HEAD -> "


@dataclass(frozen=True)
class HeadCommit:
    """The commit at the head of the project's branch: its sha, its subject and its body, and the branch."""

    sha: str
    subject: str
    branch: str
    body: str
    committed: int

    @classmethod
    def parsed(cls, log: str) -> "HeadCommit":
        sha, committed, refs, subject, *body = log.strip().split("\n")
        return cls(sha, subject, cls.branch_name(refs), "\n".join(body), int(committed))

    @staticmethod
    def branch_name(refs: str) -> str:
        branches = [ref for ref in refs.split(", ") if ref.startswith(BRANCH_PREFIX)]
        return branches[0].removeprefix(BRANCH_PREFIX) if branches else "HEAD"
