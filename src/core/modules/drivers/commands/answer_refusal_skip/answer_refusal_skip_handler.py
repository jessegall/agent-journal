from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.answer_refusal_skip.answer_refusal_skip import AnswerRefusalSkip
from core.modules.drivers.commands.skip_refusal.skip_refusal_handler import SKIP_SOURCE
from core.modules.drivers.models.driver_grant import DriverGrant
from engine.enums.grant_state import GrantState
from core.modules.drivers.agent_messages.skip_approval_message import SkipApprovalMessage
from engine.driver.message_sender import MessageSender
from core.modules.drivers.support.driver_settings import SKIP_APPROVAL_SETTING
from engine.setting.setting_values import SettingValues


class AnswerRefusalSkipHandler(Handler[AnswerRefusalSkip, DriverGrant]):
    """Confirms or withdraws an agent's own held skip, once: a confirmed skip passes the refusal's next
    attempt and keeps what the agent tried beside its reason; a withdrawn one leaves the refusal in force.
    Neither can be changed afterwards. A helper's confirmed skip passes only once its parent approves it,
    while that setting is on."""

    command = AnswerRefusalSkip

    def __init__(self, queries: Queries, repository: Repository, message_sender: MessageSender, settings: SettingValues) -> None:
        self.queries, self.repository, self.message_sender, self.settings = queries, repository, message_sender, settings

    def handle(self, command: AnswerRefusalSkip, context: Context) -> DriverGrant:
        skip = self.queries.query(DriverGrant).find(command.skip_id)
        if skip.session_agent_id != context.actor.id:
            raise Refusal(f"skip {skip.id} is not yours", "answer only a skip you made")
        if skip.is_answered:
            raise Refusal(f"skip {skip.id} was answered already, and its answer is final", "make a new skip if the refusal meets you again")
        if not command.is_confirmed:
            return self.repository.update(skip, context, grant_state=GrantState.REVOKED)
        tried = command.tried.strip()
        if not tried or tried == skip.reason:
            raise Refusal("name what you tried before skipping, not the reason again", "--tried '<what you tried instead>'")
        agent = self.queries.query(Agent).find(skip.session_agent_id)
        approver_id = agent.parent_id if not agent.is_main and self.settings.flag(SKIP_APPROVAL_SETTING) else None
        confirmed = self.repository.update(skip, context, grant_state=GrantState.CONFIRMED, confirmed_at=context.timestamp, tried=tried, requires_approval=approver_id is not None)
        if approver_id is not None:
            self.message_sender.send(approver_id, SkipApprovalMessage.declared(), SKIP_SOURCE, context, agent=agent.id, refusal=skip.id)
        return confirmed
