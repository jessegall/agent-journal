from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from suites.coding.modules.workers.commands.prune_behind_checks.prune_behind_checks import PruneBehindChecks
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class BehindCheckPruning:
    """Removes, in each environment with worktrees, the closed looks at worktrees behind their base past the days
    they are kept."""

    def __call__(self, container: Container) -> None:
        for environment_id in dict.fromkeys(row.environment_id for row in container.get(WorktreeQuery).all_worktrees()):
            container.get(Bus).run(PruneBehindChecks(), Actor.core(), environment_id=environment_id)
