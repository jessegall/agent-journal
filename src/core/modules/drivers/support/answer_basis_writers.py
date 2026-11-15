from engine.time.timestamp import Timestamp
from engine.command.context import Context
from engine.database.database import Database
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_stack import AgentStack
from core.modules.drivers.models.driver_epoch import DriverEpoch
from core.modules.drivers.models.program_epoch import ProgramEpoch
from core.modules.environments.models.environment import Environment

CHILD_AGENTS_REASON = "the agents one agent started, a few levels deep"
ENVIRONMENTS_REASON = "the environments of one project, a handful"


class AnswerBasisWriters:
    """Moves the numbers an agent's answer basis is read from (doc 1310 section 6.5) in the write that changed
    what an agent may do, so a step that read the old rows cannot save: the agent's stack version, the
    driver epoch of every environment and a program's epoch."""

    def __init__(self, queries: Queries, repository: Repository, database: Database, scopes: Scopes) -> None:
        self.queries, self.repository, self.database, self.scopes = queries, repository, database, scopes
        # the agents moved in the current write: writes take turns, and one move a write is enough, since a step that
        # read before the write sees a new version whatever else the write does
        self.moved_write, self.moved_agents = 0, set[int]()

    def bump_agent(self, agent_id: int, context: Context) -> None:
        if self.moved_write != self.database.write_number:
            self.moved_write, self.moved_agents = self.database.write_number, set[int]()
        if agent_id in self.moved_agents:
            return
        self.moved_agents.add(agent_id)
        row = self.queries.query(AgentStack).filter(session_agent_id=agent_id).first()
        if row is None:
            self.repository.save(AgentStack(session_agent_id=agent_id, permission_changes=1), context)
            return
        self.repository.save_change(row, row.changed(permission_changes=row.permission_changes + 1), context)

    # a pause or a resume reaches every agent below the one it names, in its environment
    def bump_agent_tree(self, agent: Agent, context: Context) -> None:
        self.bump_agent(agent.id, context)
        for child in self.queries.query(Agent).filter(parent_id=agent.id).every_row(CHILD_AGENTS_REASON):
            self.bump_agent_tree(child, context)

    def bump_environment(self, environment_id: int, context: Context) -> None:
        self.bumped_epoch(environment_id, context, None)

    def bumped_epoch(self, environment_id: int, context: Context, started_at: Timestamp | None) -> None:
        with self.scopes.command_scope((), context.actor, environment_id):
            epoch = self.queries.query(DriverEpoch).first()
            if epoch is None:
                self.repository.save(DriverEpoch(epoch=1, started_at=started_at), context)
                return
            self.repository.save_change(epoch, epoch.changed(epoch=epoch.epoch + 1, started_at=started_at or epoch.started_at), context)

    # a project-wide driving setting reaches every environment
    def bump_environments(self, context: Context) -> None:
        for environment in self.queries.query(Environment).every_row(ENVIRONMENTS_REASON):
            self.bump_environment(environment.id, context)

    # a server boot reaches every environment and records when the journal started
    def record_journal_start(self, context: Context) -> None:
        for environment in self.queries.query(Environment).every_row(ENVIRONMENTS_REASON):
            self.bumped_epoch(environment.id, context, context.timestamp)

    def bump_program(self, program: str, context: Context) -> None:
        epoch = self.queries.query(ProgramEpoch).filter(program=program).first()
        if epoch is None:
            self.repository.save(ProgramEpoch(program=program, epoch=1), context)
            return
        self.repository.save_change(epoch, epoch.changed(epoch=epoch.epoch + 1), context)
