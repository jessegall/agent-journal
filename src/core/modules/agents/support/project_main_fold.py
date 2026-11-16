from engine.database.database import Database
from engine.errors.refusal import Refusal
from engine.enums.agent_role import AgentRole
from core.modules.agents.support.environment_fold import EnvironmentFold
from core.modules.agents.support.fold_counts import FoldCounts
from core.modules.agents.support.main_fold import AGENTS_TABLE, MainFold
from core.modules.agents.support.main_row import MainRow


class ProjectMainFold:
    """Folds every main agent of every environment into the main agent of the project environment, with the
    fold machinery of the main agents of one environment: everything a folded main wrote, its messages and its
    tasks among them, becomes the survivor's. It refuses while a folded main still runs, so no live session
    loses its row."""

    def __init__(self, database: Database) -> None:
        self.database = database
        self.fold = MainFold(database)

    def planned(self, project_environment_id: int) -> EnvironmentFold | None:
        mains = [MainRow.parsed(row) for row in self.fold.rewrite.matching_rows(AGENTS_TABLE, "role", AgentRole.MAIN.value)]
        survivors = [main for main in mains if main.environment_id == project_environment_id]
        if not survivors:
            raise Refusal(f"environment {project_environment_id} has no main agent to keep", "start a main session in the project folder, then start again")
        survivor = max(survivors, key=lambda main: main.id)
        folded = tuple(main for main in mains if main.id != survivor.id)
        running = [main for main in folded if main.ended_at is None]
        if running:
            raise Refusal(f"main agent {running[0].id} still runs and would be folded into {survivor.id}", "end that main session, then start again")
        return EnvironmentFold(project_environment_id, survivor, folded) if folded else None

    def run(self, project_environment_id: int, folded_at: str) -> FoldCounts:
        fold = self.planned(project_environment_id)
        return self.fold.run((fold,) if fold is not None else (), folded_at)
