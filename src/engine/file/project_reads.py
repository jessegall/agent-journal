from pathlib import Path


class ProjectReads:
    """The project folders a sandboxed shell line may read, as declared by modules."""

    def folders(self, project_root: Path) -> tuple[Path, ...]:
        return ()
