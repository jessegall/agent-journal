from journal.config import Config
from journal.features.seed import Seed
from journal.repositories.environments import Environments
from journal.support.actor import Actor
from journal.support.worktree import Worktree
from journal.support.worktree_names import WorktreeNames

MAIN = "main"


class OldMainWorktree(Seed):
    """At boot, a worktree an older version made under the name main, which made every launch of main run in it, moves with its branch and kept tip to a made-up name with an environment of its own, so main always works in the project's own checkout."""

    def __init__(self, config: Config, environments: Environments) -> None:
        self.config, self.environments = config, environments

    def run(self) -> None:
        tree = Worktree(self.config.root, MAIN)
        if not tree.path.is_dir():
            return
        moved = tree.renamed(WorktreeNames(self.config.root).unused({environment.name for environment in self.environments.all()}))
        self.environments.save(self.environments.lookup(moved.name).with_(branch=moved.branch), Actor.system())
