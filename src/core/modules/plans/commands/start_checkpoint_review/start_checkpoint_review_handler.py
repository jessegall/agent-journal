from engine.actor.actor import Actor
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.sandbox.shell_sandbox import ShellSandbox
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.reviewer_start import ReviewerStart
from core.modules.plans.commands.start_checkpoint_review.start_checkpoint_review import StartCheckpointReview
from core.modules.plans.models.checkpoint_review import CheckpointReview
from core.modules.plans.models.phase import Phase
from core.modules.plans.support.checkpoint_review_model import CheckpointReviewModel

BRIEF = "Read what phase {phase} of plan {plan} changed and compare it with the plan's brief and the phase's goal. Report what matches, what is missing and what differs."


class StartCheckpointReviewHandler(Handler[StartCheckpointReview, CheckpointReview]):
    """Starts a read-only reviewer for a passed checkpoint, on the program and model the setting names, hands it the
    brief of the review and saves the review; the reviewer's report is saved on it when the reviewer ends."""

    command = StartCheckpointReview
    caller_prepares = True

    def __init__(self, queries: Queries, start: ReviewerStart, repository: Repository, models: CheckpointReviewModel, sandbox: ShellSandbox) -> None:
        self.queries, self.start, self.repository, self.models, self.sandbox = queries, start, repository, models, sandbox

    def prepare(self, command: StartCheckpointReview, actor: Actor) -> None:
        self.sandbox.check()

    def handle(self, command: StartCheckpointReview, context: Context) -> CheckpointReview:
        main = self.queries.query(Agent).find(command.main_id)
        chosen = self.models.chosen(main.program)
        phase = self.queries.query(Phase).find(command.phase_id)
        brief = BRIEF.format(phase=phase.title, plan=command.plan_id)
        reviewer = self.start.started(chosen.program, chosen.model, main, context)
        self.start.launched(reviewer, main, brief, context)
        return self.repository.save(CheckpointReview(creator_id=context.actor.id, plan_id=command.plan_id, phase_id=command.phase_id, reviewer_id=reviewer.id,
                                                     program=chosen.program, program_model=chosen.model, brief=brief), context)
