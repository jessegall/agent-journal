from engine.query.conditions.among import Among
from engine.time.timestamp import Timestamp
from engine.command.context import Context
from engine.database.database import Database
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_stack import AgentStack
from core.modules.drivers.support.read_versions_rows import ReadVersionsRows
from core.modules.drivers.models.driver_version import DriverVersion
from core.modules.drivers.models.program_version import ProgramVersion
from core.modules.environments.models.environment import Environment

CHILD_AGENTS_REASON = "the running agents one level of a tree started, a handful each, a few levels deep"
MOVED_STACKS_REASON = "the stacks of the agents one write moves: one agent, or a running tree of a few"
ENVIRONMENTS_REASON = "the environments of one project, a handful"


class ReadVersionsWriters:
    """Moves the numbers an agent's answer basis is read from (doc 1310 section 6.5) in the write that changed
    what an agent may do, so a step that read rows since changed cannot save: the agent's stack version, the
    driver version of every environment and a program's version."""

    def __init__(self, queries: Queries, repository: Repository, database: Database, scopes: Scopes, stacks: ReadVersionsRows) -> None:
        self.queries, self.repository, self.database, self.scopes, self.stacks = queries, repository, database, scopes, stacks
        # the agents moved in the current write: writes take turns, and one move a write is enough, since a step that
        # read before the write sees a new version whatever else the write does
        self.moved_write, self.moved_agents = 0, set[int]()

    def bump_agent(self, agent_id: int, context: Context) -> None:
        self.bump_agents([agent_id], context)

    def bump_agents(self, agent_ids: list[int], context: Context) -> None:
        unmoved = [agent_id for agent_id in agent_ids if agent_id not in self.write_moved_agents()]
        if not unmoved:
            return
        self.moved_agents.update(unmoved)
        stacks = self.current_stacks(unmoved)
        for agent_id in unmoved:
            row = stacks.get(agent_id)
            moved = row.changed(permission_changes=row.permission_changes + 1) if row is not None else AgentStack(session_agent_id=agent_id, permission_changes=1)
            self.stacks.remember(self.repository.save_change(row, moved, context))

    def note_saved_stack(self, agent_id: int) -> None:
        self.write_moved_agents().add(agent_id)

    def write_moved_agents(self) -> set[int]:
        if self.moved_write != self.database.write_number:
            self.moved_write, self.moved_agents = self.database.write_number, set[int]()
        return self.moved_agents

    def current_stacks(self, agent_ids: list[int]) -> dict[int, AgentStack]:
        if len(agent_ids) == 1:
            row = self.stacks.current_stack(agent_ids[0])
            return {agent_ids[0]: row} if row is not None else {}
        return {row.session_agent_id: row for row in self.queries.query(AgentStack).matching(Among("session_agent_id", agent_ids)).every_row(MOVED_STACKS_REASON)}

    # a pause or a resume reaches every running agent below the one it names, read a level at a time; an ended
    # agent answers no hook until it starts again, and its start reads its view anew
    def bump_agent_tree(self, agent: Agent, context: Context) -> None:
        tree, level = [agent.id], [agent.id]
        while level:
            level = [child.id for child in self.queries.query(Agent).filter(ended_at=None, retired_at=None).matching(Among("parent_id", level)).every_row(CHILD_AGENTS_REASON)]
            tree.extend(level)
        self.bump_agents(tree, context)

    def bump_environment(self, environment_id: int, context: Context) -> None:
        self.bumped_version(environment_id, context, None)

    def bumped_version(self, environment_id: int, context: Context, started_at: Timestamp | None) -> None:
        with self.scopes.command_scope((), context.actor, environment_id):
            version_row = self.queries.query(DriverVersion).first()
            if version_row is None:
                self.repository.save(DriverVersion(change_count=1, started_at=started_at), context)
                return
            self.repository.save_change(version_row, version_row.changed(change_count=version_row.change_count + 1, started_at=started_at or version_row.started_at), context)

    # a project-wide driving setting reaches every environment
    def bump_environments(self, context: Context) -> None:
        for environment in self.queries.query(Environment).every_row(ENVIRONMENTS_REASON):
            self.bump_environment(environment.id, context)

    # a server boot reaches every environment and records when the journal started
    def record_journal_start(self, context: Context) -> None:
        for environment in self.queries.query(Environment).every_row(ENVIRONMENTS_REASON):
            self.bumped_version(environment.id, context, context.timestamp)

    def bump_program(self, program: str, context: Context) -> None:
        version_row = self.queries.query(ProgramVersion).filter(program=program).first()
        if version_row is None:
            self.repository.save(ProgramVersion(program=program, change_count=1), context)
            return
        self.repository.save_change(version_row, version_row.changed(change_count=version_row.change_count + 1), context)
