from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class ProjectWorktree:
    """A worktree git knows in the project's repository and who holds it: the main checkout, an environment, a
    worker out on it, or nobody."""

    folder: str
    branch: str | None
    is_checkout: bool
    environment: str | None
    worker_id: int | None
    agent_count: int

    def row(self) -> dict[str, object]:
        return {"id": self.folder, **asdict(self)}
