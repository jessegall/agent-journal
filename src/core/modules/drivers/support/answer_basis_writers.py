from engine.query.conditions.among import Among
from engine.time.timestamp import Timestamp
from engine.command.context import Context
from engine.database.database import Database
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_stack import AgentStack
from core.modules.drivers.models.driver_version import DriverVersion
from core.modules.drivers.models.program_version import ProgramVersion
from core.modules.environments.models.environment import Environment

CHILD_AGENTS_REASON = "the running agents one level of a tree started, a handful each, a few levels deep"
MOVED_STACKS_REASON = "the stacks of the agents one write moves: one agent, or a running tree of a few"
ENVIRONMENTS_REASON = "the environments of one project, a handful"


class AnswerBasisWriters:
    """Moves the numbers an agent's answer basis is read from (doc 1310 section 6.5) in the write that changed
    what an agent may do, so a step that read rows since changed cannot save: the agent's stack version, the
    driver epoch of every environment and a program's epoch."""

    def __init__(self, queries: Queries, repository: Repository, database: Database, scopes: Scopes) -> None:
        self.queries, self.repository, self.database, self.scopes = queries, repository, database, scopes
        # the agents moved in the current write: writes take turns, and one move a write is enough, since a step that
        # read before the write sees a new version whatever else the write does
        self.moved_write, self.moved_agents = 0, set[int]()

    def bump_agent(self, agent_id: int, context: Context) -> None:
        self.bump_agents([agent_id], context)

    def bump_agents(self, agent_ids: list[int], context: Context) -> None:
        if self.moved_write != self.database.write_number:
            self.moved_write, self.moved_agents = self.database.write_number, set[int]()
        unmoved = [agent_id for agent_id in agent_ids if agent_id not in self.moved_agents]
        if not unmoved:
            return
        self.moved_agents.update(unmoved)
        stacks = {row.session_agent_id: row for row in self.queries.query(AgentStack).matching(Among("session_agent_id", unmoved)).every_row(MOVED_STACKS_REASON)}
        for agent_id in unmoved:
            row = stacks.get(agent_id)
            if row is None:
                self.repository.save(AgentStack(session_agent_id=agent_id, permission_changes=1), context)
                continue
            self.repository.save_change(row, row.changed(permission_changes=row.permission_changes + 1), context)

    # a pause or a resume reaches every running agent below the one it names, read a level at a time; an ended
    # agent answers no hook until it starts again, and its start reads its view anew
    def bump_agent_tree(self, agent: Agent, context: Context) -> None:
        tree, level = [agent.id], [agent.id]
        while level:
            level = [child.id for child in self.queries.query(Agent).filter(ended_at=None, retired_at=None).matching(Among("parent_id", level)).every_row(CHILD_AGENTS_REASON)]
            tree.extend(level)
        self.bump_agents(tree, context)

    def bump_environment(self, environment_id: int, context: Context) -> None:
        self.bumped_epoch(environment_id, context, None)

    def bumped_epoch(self, environment_id: int, context: Context, started_at: Timestamp | None) -> None:
        with self.scopes.command_scope((), context.actor, environment_id):
            epoch = self.queries.query(DriverVersion).first()
            if epoch is None:
                self.repository.save(DriverVersion(epoch=1, started_at=started_at), context)
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
        epoch = self.queries.query(ProgramVersion).filter(program=program).first()
        if epoch is None:
            self.repository.save(ProgramVersion(program=program, epoch=1), context)
            return
        self.repository.save_change(epoch, epoch.changed(epoch=epoch.epoch + 1), context)
