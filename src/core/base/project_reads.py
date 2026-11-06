from pathlib import Path


class ProjectReads:
    """The folders of the project a sandboxed worker's shell line may read; none until a module declares them."""

    def folders(self, project_root: Path) -> tuple[Path, ...]:
        return ()
