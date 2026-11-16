from collections.abc import Sequence
from pathlib import Path

from engine.journal.journal_home import JournalHome
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.environments.models.environment import Environment

PROJECT_ENVIRONMENTS_REASON = "the environments of one project, a handful"
MAIN_AGENTS_REASON = "the main agents of a project's environments, one each"


class ProjectEnvironment:
    """Says which environments live in the project folder, the folder environments a main session may start in
    as agent 1, and which one of them is THE project environment: the one agent 1 works in once it exists,
    else the one whose main agent runs, else the lowest; a test environment is never one."""

    def __init__(self, queries: Queries, home: JournalHome) -> None:
        self.queries, self.home = queries, home

    def is_project_folder(self, environment: Environment) -> bool:
        return not environment.test and Path(environment.folder).resolve() == self.home.project_folder.resolve()

    def chosen(self) -> Environment | None:
        environments = [environment for environment in self.queries.query(Environment).all_environments(PROJECT_ENVIRONMENTS_REASON).oldest().every_row(PROJECT_ENVIRONMENTS_REASON)
                        if self.is_project_folder(environment)]
        mains = self.queries.query(Agent).all_environments(MAIN_AGENTS_REASON).filter(role="main").every_row(MAIN_AGENTS_REASON)
        return ProjectEnvironment.first(environments, {main.id: main for main in mains})

    @staticmethod
    def first(environments: Sequence[Environment], mains: dict[int, Agent]) -> Environment | None:
        if not environments:
            return None
        agent_one = mains.get(1)
        running = {main.environment_id for main in mains.values() if main.ended_at is None}
        for environment in environments:
            if agent_one is not None and environment.id == agent_one.environment_id:
                return environment
        return min((environment for environment in environments if environment.id in running), key=lambda environment: environment.id,
                   default=min(environments, key=lambda environment: environment.id))
