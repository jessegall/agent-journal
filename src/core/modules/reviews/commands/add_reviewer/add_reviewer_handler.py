from engine.actor.actor import Actor
from core.base.shell_sandbox import ShellSandbox
from engine.enums.helper_role import HelperRole
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.errors.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from core.modules.reviews.commands.add_reviewer.add_reviewer import AddReviewer
from core.modules.reviews.models.reviewer import Reviewer
from core.modules.reviews.queries.reviewer_query import ReviewerQuery
from core.modules.reviews.support.review_settings import ReviewSettings


class AddReviewerHandler(Handler[AddReviewer, Reviewer]):
    """Starts the agent session of a new reviewer and saves the reviewer under the agent's number."""

    command = AddReviewer
    caller_prepares = True

    def __init__(self, reviewers: ReviewerQuery, settings: ReviewSettings, bus: Bus, repository: Repository, sandbox: ShellSandbox) -> None:
        self.sandbox = sandbox
        self.reviewers, self.settings, self.bus, self.repository = reviewers, settings, bus, repository

    def prepare(self, command: AddReviewer, actor: Actor) -> None:
        self.sandbox.check()

    def handle(self, command: AddReviewer, context: Context) -> Reviewer:
        if context.environment_id is None:
            raise Refusal("a reviewer is added in an environment", "name one with --environment")
        program = self.settings.program()
        session = f"reviewer-{self.reviewers.in_environment(context.environment_id).count() + 1}"
        agent = self.bus.dispatch(StartAgent(session, program, HelperRole.REVIEWER, access="read-only"), context)
        return self.repository.save(Reviewer(id=agent.id, creator_id=context.actor.id, program=program,
                                             model=self.settings.model()), context)
