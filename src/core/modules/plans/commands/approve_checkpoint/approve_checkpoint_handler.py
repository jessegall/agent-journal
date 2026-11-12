from engine.command.context import Context
from engine.command.handler import Handler
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from core.modules.plans.commands.approve_checkpoint.approve_checkpoint import ApproveCheckpoint
from core.modules.plans.listeners.checkpoint_pass_listener import PASS_SOURCE
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_checkpoints import PlanCheckpoints
from core.modules.plans.support.plan_main_agents import PlanMainAgents
from core.modules.plans.support.plan_nudges import CHECKPOINT_FINISHED


class ApproveCheckpointHandler(Handler[ApproveCheckpoint, int]):
    """A person approves a checkpoint whose tests passed and that waited for the person: its pass is saved, the
    main agent is told, and the plan goes on."""

    command = ApproveCheckpoint

    def __init__(self, queries: Queries, checkpoints: PlanCheckpoints, main_agents: PlanMainAgents) -> None:
        self.queries, self.checkpoints, self.main_agents = queries, checkpoints, main_agents

    def handle(self, command: ApproveCheckpoint, context: Context) -> int:
        if context.actor.type is not ActorType.USER:
            raise Refusal("only a person approves a checkpoint, on the plan card", "ask the person to approve it")
        if not self.checkpoints.approve(command.plan_id, command.phase_id, context):
            raise Refusal(f"checkpoint phase {command.phase_id} of plan {command.plan_id} waits for no approval", f"journal plan progress {command.plan_id} shows its checkpoints")
        self.main_agents.send(self.queries.query(Plan).find(command.plan_id), CHECKPOINT_FINISHED, PASS_SOURCE, context, phase=self.queries.query(Phase).find(command.phase_id).title)
        self.checkpoints.record(command.plan_id, context)
        return command.phase_id
