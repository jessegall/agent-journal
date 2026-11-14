from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.judge_refusal_skip.judge_refusal_skip import JudgeRefusalSkip
from core.modules.drivers.commands.skip_refusal.skip_refusal_handler import SKIP_SOURCE
from core.modules.drivers.models.refusal_skip import RefusalSkip
from core.modules.drivers.support.access_nudges import SKIP_APPROVED, SKIP_DECLINED
from engine.driver.nudger import Nudger
from core.modules.agents.support.agent_label import AgentLabel


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
        if agent.is_foreign_helper(context.actor):
            raise Refusal(f"skip {skip.id} is for {AgentLabel.labelled(self.queries.query(Agent).find(agent.parent_id)).text} to answer", "only the agent's parent or a user answers it")
        if command.is_approved:
            answered = self.repository.update(skip, context, needs_approval=False, approved_at=context.timestamp)
            self.nudger.send(agent.id, SKIP_APPROVED, SKIP_SOURCE, context, refusal=skip.id)
            return answered
        answered = self.repository.update(skip, context, needs_approval=False, cancelled_at=context.timestamp)
        self.nudger.send(agent.id, SKIP_DECLINED, SKIP_SOURCE, context, refusal=skip.id)
        return answered
