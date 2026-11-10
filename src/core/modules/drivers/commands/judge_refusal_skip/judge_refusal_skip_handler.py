from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.judge_refusal_skip.judge_refusal_skip import JudgeRefusalSkip
from core.modules.drivers.commands.skip_refusal.skip_refusal_handler import SKIP_SOURCE
from core.modules.drivers.models.refusal_skip import RefusalSkip
from core.modules.drivers.support.access_nudges import SKIP_APPROVED, SKIP_DECLINED
from core.modules.drivers.support.nudger import Nudger


class JudgeRefusalSkipHandler(Handler[JudgeRefusalSkip, RefusalSkip]):
    """Answers a helper's confirmed skip that waits for approval: an approved one passes the refusal once, a
    declined one leaves the refusal in force, and the agent that made it is told. Only its parent or a
    person answers."""

    command = JudgeRefusalSkip

    def __init__(self, queries: Queries, repository: Repository, nudger: Nudger) -> None:
        self.queries, self.repository, self.nudger = queries, repository, nudger

    def handle(self, command: JudgeRefusalSkip, context: Context) -> RefusalSkip:
        skip = self.queries.query(RefusalSkip).find(command.skip_id)
        if not skip.needs_approval:
            raise Refusal(f"skip {skip.id} waits for no approval", "journal refusal show prints its state")
        agent = self.queries.query(Agent).find(skip.session_agent_id)
        if agent.is_child_of_another_agent(context.actor):
            raise Refusal(f"skip {skip.id} is for agent {agent.parent_id} to answer", "only the agent's parent or a person answers it")
        if command.is_approved:
            answered = self.repository.update(skip, context, needs_approval=False, approved_at=context.timestamp)
            self.nudger.send(agent.id, SKIP_APPROVED, SKIP_SOURCE, context, refusal=skip.id)
            return answered
        answered = self.repository.update(skip, context, needs_approval=False, cancelled_at=context.timestamp)
        self.nudger.send(agent.id, SKIP_DECLINED, SKIP_SOURCE, context, refusal=skip.id)
        return answered
