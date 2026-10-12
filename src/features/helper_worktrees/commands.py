from engine.worktree import WorkspaceFolders
from framework.parts import Command, Context
from providers import workspace_folders


class Cut(Command):
    name = "cut"

    def run(self, context: Context, worktrees, name: str, helper: str = "", packages: bool = False) -> str:
        """packages: the job changes the project's dependencies, so the worktree installs its own; otherwise it links the project's installed ones."""
        return worktrees.make(name, self.folders(), helper, packages)

    def folders(self) -> WorkspaceFolders:
        """Where each provider keeps its own files: provider knowledge, read here so the controller never names a provider."""
        return workspace_folders()
