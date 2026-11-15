from engine.scope.actor_scope import ActorScope
from core.modules.drivers.agent_messages.agent_resumed_message import AgentResumedMessage
from dataclasses import replace

from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.command.errors.user_approval_refusal import UserApprovalRefusal
from engine.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.resume_agent.resume_agent import ResumeAgent
from core.modules.drivers.listeners.typed_line_listener import RESUME_SOURCE
from engine.driver.message_sender import MessageSender
from core.modules.agents.support.agent_label import AgentLabel



class ResumeAgentHandler(Handler[ResumeAgent, Agent]):
    """Clears a paused agent's pause and leaves the line that it may carry on, which a listener types once
    this is committed."""

    command = ResumeAgent
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository, message_sender: MessageSender) -> None:
        self.queries, self.repository, self.message_sender = queries, repository, message_sender

    def handle(self, command: ResumeAgent, context: Context) -> Agent:
        agent = self.queries.query(Agent).find(command.agent_id)
        if agent.paused_at is None:
            raise Refusal(f"{AgentLabel.labelled(agent).text} is not paused")
        if context.approval_id is None and (context.actor.id == agent.id or self.queries.query(Agent).filter(id=context.actor.id, parent_id=agent.id).exists()):
            raise UserApprovalRefusal(f"Resume the paused {AgentLabel.labelled(agent).text}?", command=command)
        resumed = self.repository.save(replace(agent, paused_at=None), context)
        self.message_sender.send(agent.id, AgentResumedMessage.declared(), RESUME_SOURCE, context)
        return resumed
