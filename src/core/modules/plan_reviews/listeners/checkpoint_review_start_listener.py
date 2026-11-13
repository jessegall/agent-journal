from engine.command.bus import Bus
from engine.command.context import Context
from engine.event.moved import Moved
from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from engine.setting.setting_values import SettingValues
from core.modules.plan_reviews.commands.start_checkpoint_review.start_checkpoint_review import StartCheckpointReview
from core.modules.plan_reviews.support.plan_review_settings import QUICK_REVIEW_SETTING
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.lifecycles.checkpoint_lifecycle import CheckpointLifecycle
from core.modules.plans.support.plan_main_agents import PlanMainAgents


class CheckpointReviewStartListener(SaveListener[Moved[CheckpointReach]]):
    """When the quick review is on, a reach whose tests passed and that opens phases starts the reviewer of its
    checkpoint, on the model the review-model setting names, reporting to the newest main agent."""

    name = "plan_reviews.checkpoint-review-start"
    moves = tuple([CheckpointLifecycle.passed])
    disabled_scopes = [ActorScope]

    def __init__(self, bus: Bus, main_agents: PlanMainAgents, settings: SettingValues) -> None:
        self.bus, self.main_agents, self.settings = bus, main_agents, settings

    def handle(self, event: Moved[CheckpointReach], context: Context) -> None:
        reach = event.row
        reporter = self.main_agents.newest()
        if reach.source.opens_phases() and self.settings.flag(QUICK_REVIEW_SETTING) and reporter is not None:
            self.bus.dispatch(StartCheckpointReview(reach.plan_id, reach.phase_id, reporter.id), context)
