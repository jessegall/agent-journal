from collections.abc import Sequence

from core.base.module.module import Module
from core.base.upgrade.version_four_move import VersionFourMove


class MoveCheck:
    """Checks the moves from version 4 the modules declare before a sync writes anything: each move states a
    name and the tables it reads, no version 4 table is claimed twice, and the modules whose ids a move looks
    up are installed and among its module's dependencies."""

    def problems(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        claimed = [table for module in modules for move in module.moves for table in (*move.reads, *move.drops)]
        problems = [f"two moves claim the version 4 table {table}" for table in sorted({table for table in claimed if claimed.count(table) > 1})]
        installed = {module.name for module in modules}
        for module in modules:
            for move in module.moves:
                problems += self.move_problems(module, move, installed)
        return tuple(problems)

    def move_problems(self, module: type[Module], move: type[VersionFourMove], installed: set[str]) -> list[str]:
        problems = [f"the move {move.__name__} of {module.name} states no name or no tables it reads"] if not getattr(move, "name", "") or not move.reads else []
        problems += [f"the move of {module.name} reads ids of {source}, which is not installed" for source in move.id_modules if source not in installed]
        problems += [f"the move of {module.name} reads ids of {source}, and {module.name} does not depend on it" for source in move.id_modules
                     if source in installed and source not in module.dependencies]
        return problems
