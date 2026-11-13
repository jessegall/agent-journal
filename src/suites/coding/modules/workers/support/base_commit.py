from dataclasses import dataclass

NAME_SEPARATOR = "\0"


@dataclass(frozen=True)
class BaseCommit:
    """One first-parent commit of the base branch a worktree is behind: its short id, its subject and the files it
    changed, a merge commit's files against its first parent."""

    short_id: str
    subject: str
    files: tuple[str, ...]

    @classmethod
    def parsed(cls, short_id: str, subject: str, names: str) -> "BaseCommit":
        listed = names.replace("\n", NAME_SEPARATOR).split(NAME_SEPARATOR)
        return cls(short_id, subject, tuple(name for name in listed if name.strip()))
