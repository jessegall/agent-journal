from core.base.agent_role import AgentRole
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.commands.start_agent import StartAgent
from core.modules.reviews.commands.add_reviewer import AddReviewer
from core.modules.reviews.models.reviewer import Reviewer
from core.modules.reviews.queries.reviewer_query import ReviewerQuery
from core.modules.reviews.support.review_settings import ReviewSettings


class AddReviewerHandler(Handler[AddReviewer, Reviewer]):
    """Starts the agent session of a new reviewer and saves the reviewer under the agent's number."""

    command = AddReviewer

    def __init__(self, reviewers: ReviewerQuery, settings: ReviewSettings, bus: Bus, repository: Repository) -> None:
        self.reviewers, self.settings, self.bus, self.repository = reviewers, settings, bus, repository

    def handle(self, command: AddReviewer, context: Context) -> Reviewer:
        if context.environment_id is None:
            raise Refusal("a reviewer is added in an environment", "name one with --environment")
        program = self.settings.program(context.environment_id)
        session = f"reviewer-{self.reviewers.environment(context.environment_id).count() + 1}"
        agent = self.bus.dispatch(StartAgent(session, program, AgentRole.REVIEWER), context)
        return self.repository.save(Reviewer(id=agent.id, environment_id=agent.environment_id, creator_id=context.actor.id, program=program,
                                             model=self.settings.model(agent.environment_id)), context)
