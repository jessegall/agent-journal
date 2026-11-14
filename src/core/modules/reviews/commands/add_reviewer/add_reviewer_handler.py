from engine.actor.actor import Actor
from engine.sandbox.shell_sandbox import ShellSandbox
from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.drivers.support.reviewer_start import ReviewerStart
from core.modules.reviews.commands.add_reviewer.add_reviewer import AddReviewer
from core.modules.reviews.models.reviewer import Reviewer
from core.modules.reviews.support.review_settings import ReviewSettings


class AddReviewerHandler(Handler[AddReviewer, Reviewer]):
    """Starts the agent session of a new reviewer and saves the reviewer under the agent's number."""

    command = AddReviewer
    caller_prepares = True

    def __init__(self, settings: ReviewSettings, start: ReviewerStart, repository: Repository, sandbox: ShellSandbox) -> None:
        self.sandbox = sandbox
        self.settings, self.start, self.repository = settings, start, repository

    def prepare(self, command: AddReviewer, actor: Actor) -> None:
        self.sandbox.check()

    def handle(self, command: AddReviewer, context: Context) -> Reviewer:
        if context.environment_id is None:
            raise Refusal("a reviewer is added in an environment", "name one with --environment")
        agent = self.start.started(self.settings.program(), self.settings.model(), None, context)
        return self.repository.save(Reviewer(id=agent.id, creator_id=context.actor.id, program=agent.program, model=agent.program_model), context)
