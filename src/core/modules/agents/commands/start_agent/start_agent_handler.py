from dataclasses import replace

from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from core.base.actor_type import ActorType
from core.base.caller.process_chain import ProcessChain
from core.base.timestamp import Timestamp
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.agents.support.agent_rows import AgentRows
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.agent_type_book import AgentTypeBook
from core.base.access import Access
from core.base.actor import Actor
from core.base.shell_sandbox import ShellSandbox


class StartAgentHandler(Handler[StartAgent, Agent]):
    """Makes the actor of a new session, then its agent row with the actor's id, in one transaction, or
    reopens the ended row of a resumed session so the agent keeps its number and its tasks; a pid given
    without its start time gets the start the process table reads for it."""

    command = StartAgent

    def __init__(self, agents: AgentRows, repository: Repository, chain: ProcessChain, types: AgentTypeBook, sandbox: ShellSandbox) -> None:
        self.agents, self.repository, self.chain = agents, repository, chain
        self.types = types
        self.sandbox = sandbox

    def prepare(self, command: StartAgent, actor: Actor) -> None:
        if self.types.find(command.role).access is Access.READ:
            self.sandbox.check()

    def handle(self, command: StartAgent, context: Context) -> Agent:
        if context.environment_id is None:
            raise Refusal("an agent starts in an environment", "name one with --environment")
        self.types.find(command.role)
        started = self.agents.session(command.session)
        if started is not None and started.ended_at is None:
            raise Refusal(f"session {command.session} has started already", "journal agent list shows the agents")
        if started is not None:
            self.check_resume(started, command, context.environment_id)
            return self.repository.save(replace(started, ended_at=None, pid=command.pid,
                                                process_started_at=command.process_started_at or self.process_start(command.pid)), context)
        actor = self.repository.save(ActorRecord(type=ActorType.AGENT, name=command.session, creator_id=context.actor.id), context)
        agent = Agent(id=actor.id, environment_id=context.environment_id, parent_id=command.parent_id, creator_id=context.actor.id, access=command.access,
                      session=command.session, program=command.program, role=command.role, pid=command.pid,
                      process_started_at=command.process_started_at or self.process_start(command.pid),
                      program_model=command.program_model, profile=command.profile, given_name=command.given_name)
        return self.repository.save(agent, context)

    def check_resume(self, agent: Agent, command: StartAgent, environment_id: int) -> None:
        if agent.environment_id != environment_id:
            raise Refusal(f"session {command.session} is agent {agent.id} of environment {agent.environment_id}", "resume it in its own environment")
        if (agent.role, agent.program) != (command.role, command.program):
            raise Refusal(f"session {command.session} is agent {agent.id}, a {agent.role} agent of {agent.program}", "resume it as it started")

    def process_start(self, pid: int | None) -> Timestamp | None:
        steps = self.chain.steps(pid) if pid else []
        return steps[0].started_at if steps else None
