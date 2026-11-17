from engine.query.queries import Queries
from core.modules.environments.models.environment import Environment
from core.modules.agents.support.project_environment import ProjectEnvironment
from engine.database.actor_table import ActorTable
from dataclasses import replace

from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.caller.process_chain import ProcessChain
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.agents.support.agent_dispatcher import AgentDispatcher
from core.modules.agents.support.program_process import ProgramProcess
from core.modules.agents.support.agent_sessions import AgentSessions
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.commands.support.single_main_agent import SingleMainAgent
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.enums.access import Access
from engine.actor.actor import Actor
from engine.sandbox.shell_sandbox import ShellSandbox
from core.modules.agents.support.agent_label import AgentLabel


class StartAgentHandler(Handler[StartAgent, Agent]):
    """Makes an agent's row or opens it again for a session; the dispatcher writes the opening and the process
    of a row that exists, and a new row is made with the process it starts in."""

    command = StartAgent
    caller_prepares = True

    def __init__(self, agents: AgentRows, repository: Repository, chain: ProcessChain, types: HelperTypeBook, sandbox: ShellSandbox, single_main: SingleMainAgent, sessions: AgentSessions, dispatcher: AgentDispatcher,
                 actors: ActorTable, project: ProjectEnvironment, queries: Queries) -> None:
        self.agents, self.repository, self.chain, self.dispatcher = agents, repository, chain, dispatcher
        self.actors, self.project, self.queries = actors, project, queries
        self.types = types
        self.sandbox = sandbox
        self.single_main = single_main
        self.sessions = sessions

    def prepare(self, command: StartAgent, actor: Actor) -> None:
        if self.types.find(command.role).access is Access.READ:
            self.sandbox.check()

    def handle(self, command: StartAgent, context: Context) -> Agent:
        agent = self.opened(command, context)
        self.single_main.end(agent, context)
        return agent

    def opened(self, command: StartAgent, context: Context) -> Agent:
        if context.environment_id is None:
            raise Refusal("an agent starts in an environment", "name one with --environment")
        self.types.find(command.role)
        started = self.agents.session(command.session)
        if started is not None and started.ended_at is None:
            raise Refusal(f"session {command.session} has started already", "journal agent list shows the agents")
        main = self.main_row(context.environment_id) if command.is_main_session else None
        if started is not None and not self.is_older_main_row(started, main):
            self.check_resume(started, command, context.environment_id)
            self.sessions.reopened(started.id, context)
            if command.pid is None:
                return self.dispatcher.open_row(started, context)
            return self.dispatcher.record_process(started, self.process(command), context)
        if main is not None:
            return self.on_main_row(main, command, context)
        actor = self.repository.save(ActorRecord(id=self.actors.main_agent_actor_id() if command.role == AgentRole.MAIN else self.actors.next_agent_actor_id(), type=ActorType.AGENT, name=command.session, creator_id=context.actor.id), context)
        agent = Agent(id=actor.id, actor_id=actor.id, parent_id=command.parent_id, creator_id=context.actor.id, access=command.access,
                      session=command.session, program=command.program, role=command.role, pid=command.pid,
                      process_started_at=command.process_started_at or self.chain.start_timestamp(command.pid),
                      program_model=command.program_model, profile=command.profile, given_name=command.given_name,
                      announced_at=context.timestamp if command.is_announced else None)
        created = self.repository.save(agent, context)
        self.sessions.started(created, context)
        return created

    def main_row(self, environment_id: int) -> Agent | None:
        environment = self.queries.query(Environment).find(environment_id)
        project = self.project.chosen() if self.project.is_project_folder(environment) else None
        return self.agents.numbered_main(environment_id if project is None else project.id)

    @staticmethod
    def is_older_main_row(started: Agent, main: Agent | None) -> bool:
        return main is not None and started.is_main and started.id != main.id

    def on_main_row(self, main: Agent, command: StartAgent, context: Context) -> Agent:
        stopped = main if main.ended_at is not None else self.single_main.ended_session(main, context)
        # the launch runs under the main row's own number, so the terminal key of an earlier launch goes
        session_row = replace(stopped, session=command.session, program=command.program, program_model=command.program_model, launch_agent_id=None, launch_name=None)
        agent = self.dispatcher.record_process(session_row, self.process(command), context)
        self.sessions.started(agent, context)
        return agent

    def process(self, command: StartAgent) -> ProgramProcess:
        return ProgramProcess(command.pid, command.process_started_at or self.chain.start_timestamp(command.pid))

    def check_resume(self, agent: Agent, command: StartAgent, environment_id: int) -> None:
        if agent.environment_id != environment_id:
            raise Refusal(f"session {command.session} is {AgentLabel.labelled(agent).text} of environment {agent.environment_id}", "resume it in its own environment")
        if (agent.role, agent.program) != (command.role, command.program):
            raise Refusal(f"session {command.session} is {AgentLabel.labelled(agent).text}, a {agent.role} agent of {agent.program}", "resume it as it started")
