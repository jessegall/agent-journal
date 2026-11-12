from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.enums.helper_role import HelperRole
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.sandbox.shell_sandbox import ShellSandbox
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.plans.commands.start_checkpoint_review.start_checkpoint_review import StartCheckpointReview
from core.modules.plans.models.checkpoint_review import CheckpointReview
from core.modules.plans.models.phase import Phase
from core.modules.plans.support.checkpoint_review_model import SONNET_PROGRAM, CheckpointReviewModel

BRIEF = "Read what phase {phase} of plan {plan} changed and compare it with the plan's brief and the phase's goal. Report what matches, what is missing and what differs."


class StartCheckpointReviewHandler(Handler[StartCheckpointReview, CheckpointReview]):
    """Starts a read-only reviewer agent for a passed checkpoint, on the program and model the setting names, and
    saves the review with the brief the reviewer is given."""

    command = StartCheckpointReview
    caller_prepares = True

    def __init__(self, queries: Queries, bus: Bus, repository: Repository, models: CheckpointReviewModel, sandbox: ShellSandbox) -> None:
        self.queries, self.bus, self.repository, self.models, self.sandbox = queries, bus, repository, models, sandbox

    def prepare(self, command: StartCheckpointReview, actor: Actor) -> None:
        self.sandbox.check()

    def handle(self, command: StartCheckpointReview, context: Context) -> CheckpointReview:
        main = MainAgentFinder.newest(self.queries)
        chosen = self.models.chosen(main.program if main is not None else SONNET_PROGRAM)
        session = f"checkpoint-review-{self.queries.query(CheckpointReview).count() + 1}"
        agent = self.bus.dispatch(StartAgent(session, chosen.program, HelperRole.REVIEWER, program_model=chosen.model, access="read-only"), context)
        phase = self.queries.query(Phase).find(command.phase_id)
        brief = BRIEF.format(phase=phase.title, plan=command.plan_id)
        return self.repository.save(CheckpointReview(creator_id=context.actor.id, plan_id=command.plan_id, phase_id=command.phase_id, reviewer_id=agent.id,
                                                     program=chosen.program, program_model=chosen.model, brief=brief), context)
