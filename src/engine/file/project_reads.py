from pathlib import Path


class ProjectReads:
    """The project folders a sandboxed shell line may read, and the folders outside its checkout it may write, as declared by modules."""

    def folders(self, project_root: Path) -> tuple[Path, ...]:
        return ()

    def writable_folders(self) -> tuple[Path, ...]:
        return ()
