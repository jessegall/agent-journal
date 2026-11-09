from core.base.agent_role import AgentRole
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.answer_refusal_skip.answer_refusal_skip import AnswerRefusalSkip
from core.modules.drivers.commands.skip_refusal.skip_refusal_handler import SKIP_SOURCE
from core.modules.drivers.models.refusal_skip import RefusalSkip
from core.modules.drivers.support.access_nudges import SKIP_NEEDS_APPROVAL
from core.modules.drivers.support.nudger import Nudger
from core.modules.helpers.support.helper_settings import SKIPS_NEED_APPROVAL
from core.modules.settings.bindings.support.setting_values import SettingValues


class AnswerRefusalSkipHandler(Handler[AnswerRefusalSkip, RefusalSkip]):
    """Confirms or withdraws an agent's own held skip, once: a confirmed skip passes the refusal's next
    attempt and keeps what the agent tried beside its reason; a withdrawn one leaves the refusal in force.
    Neither can be changed afterwards. A helper's confirmed skip passes only once its parent approves it,
    while that setting is on."""

    command = AnswerRefusalSkip

    def __init__(self, queries: Queries, repository: Repository, nudger: Nudger, settings: SettingValues) -> None:
        self.queries, self.repository, self.nudger, self.settings = queries, repository, nudger, settings

    def handle(self, command: AnswerRefusalSkip, context: Context) -> RefusalSkip:
        skip = self.queries.query(RefusalSkip).find(command.skip_id)
        if skip.session_agent_id != context.actor.id:
            raise Refusal(f"skip {skip.id} is not yours", "answer only a skip you made")
        if skip.is_answered:
            raise Refusal(f"skip {skip.id} was answered already, and its answer is final", "make a new skip if the refusal meets you again")
        if not command.is_confirmed:
            return self.repository.update(skip, context, cancelled_at=context.timestamp)
        tried = command.tried.strip()
        if not tried or tried == skip.reason:
            raise Refusal("name what you tried before skipping, not the reason again", "--tried '<what you tried instead>'")
        agent = self.queries.query(Agent).find(skip.session_agent_id)
        waits = agent.role != AgentRole.MAIN and agent.parent_id is not None and self.settings.flag(SKIPS_NEED_APPROVAL)
        confirmed = self.repository.update(skip, context, confirmed_at=context.timestamp, tried=tried, needs_approval=waits)
        if waits:
            self.nudger.send(agent.parent_id, SKIP_NEEDS_APPROVAL, SKIP_SOURCE, context, agent=agent.id, refusal=skip.id)
        return confirmed
