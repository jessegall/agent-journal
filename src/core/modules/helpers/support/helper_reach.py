from engine.actor.actor import Actor
from engine.command.command import Command
from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.errors.refusal import Refusal
from engine.errors.user_approval_refusal import UserApprovalRefusal
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.agent_label import AgentLabel


HELPER_JOB_COMMAND = ("helper", "send")


class HelperReach:
    """Who may send to or stop a helper: its parent, the parent's main agent, or a person."""

    def __init__(self, agents: AgentRows, helper_types: HelperTypeBook) -> None:
        self.agents, self.helper_types = agents, helper_types

    def checked_helper(self, helper_id: int, actor: Actor, command: Command[object]) -> Agent:
        helper = self.agents.find(helper_id)
        if helper.role == AgentRole.MAIN:
            raise Refusal(f"agent {helper_id} is no helper", "journal agent cards lists the helpers")
        job_command = self.helper_types.find(helper.role).job_command
        if job_command and job_command != HELPER_JOB_COMMAND:
            raise Refusal(f"agent {helper_id} is a {self.helper_types.label(helper.role)}: it takes its work with journal {' '.join(job_command)}")
        if helper.retired_at is not None:
            raise Refusal(f"{AgentLabel.from_agent(helper).text} is retired, for good", "journal helper start starts a new one")
        if actor.type is ActorType.AGENT and not self.may_reach(helper, actor.id):
            raise UserApprovalRefusal(f"Allow this action on {AgentLabel.from_agent(helper).text}, which belongs to agent {helper.parent_id}?", command=command)
        return helper

    def new_parent(self, helper: Agent, actor: Actor) -> int | None:
        if actor.type is not ActorType.AGENT or actor.id == helper.parent_id:
            return None
        sender = self.agents.find(actor.id)
        parent = self.agents.find(helper.parent_id) if helper.parent_id is not None else None
        is_older_main = parent is None or parent.role == AgentRole.MAIN
        return sender.id if sender.role == AgentRole.MAIN and is_older_main else None

    def may_reach(self, helper: Agent, actor_id: int) -> bool:
        actor = self.agents.find(actor_id)
        return actor.id == helper.parent_id or (actor.role == AgentRole.MAIN and actor.environment_id == helper.environment_id)
