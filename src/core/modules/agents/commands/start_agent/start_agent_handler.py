from dataclasses import replace

from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from engine.enums.actor_type import ActorType
from engine.caller.process_chain import ProcessChain
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.agents.support.agent_numbers import AgentNumbers
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.single_main_agent import SingleMainAgent
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.enums.access import Access
from engine.actor.actor import Actor
from engine.sandbox.shell_sandbox import ShellSandbox


class StartAgentHandler(Handler[StartAgent, Agent]):
    """Create or resume an agent and record its process."""

    command = StartAgent
    caller_prepares = True

    def __init__(self, agents: AgentRows, repository: Repository, chain: ProcessChain, types: HelperTypeBook, sandbox: ShellSandbox, single_main: SingleMainAgent, numbers: AgentNumbers) -> None:
        self.agents, self.repository, self.chain = agents, repository, chain
        self.types = types
        self.sandbox = sandbox
        self.single_main = single_main
        self.numbers = numbers

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
        if started is not None:
            self.check_resume(started, command, context.environment_id)
            if command.pid is None:
                return self.repository.save(replace(started, ended_at=None), context)
            return self.repository.save(replace(started, ended_at=None, pid=command.pid,
                                                process_started_at=command.process_started_at or self.chain.start_timestamp(command.pid)), context)
        actor = self.repository.save(ActorRecord(type=ActorType.AGENT, name=command.session, creator_id=context.actor.id), context)
        agent = Agent(id=actor.id, parent_id=command.parent_id, creator_id=context.actor.id, access=command.access,
                      session=command.session, program=command.program, role=command.role, pid=command.pid,
                      process_started_at=command.process_started_at or self.chain.start_timestamp(command.pid),
                      program_model=command.program_model, profile=command.profile, given_name=command.given_name)
        try:
            return self.numbered(agent, context.environment_id, context)
        except Refusal:
            return self.numbered(agent, context.environment_id, context)

    def numbered(self, agent: Agent, environment_id: int, context: Context) -> Agent:
        return self.repository.save(replace(agent, number=self.numbers.next_number(environment_id, agent.role)), context)

    def check_resume(self, agent: Agent, command: StartAgent, environment_id: int) -> None:
        if agent.environment_id != environment_id:
            raise Refusal(f"session {command.session} is agent {agent.id} of environment {agent.environment_id}", "resume it in its own environment")
        if (agent.role, agent.program) != (command.role, command.program):
            raise Refusal(f"session {command.session} is agent {agent.id}, a {agent.role} agent of {agent.program}", "resume it as it started")
