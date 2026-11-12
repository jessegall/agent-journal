from engine.command.bus import Bus
from engine.command.context import Context
from engine.event.moved import Moved
from engine.listener.rows.event_rows import EventRows
from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from engine.setting.setting_values import SettingValues
from core.modules.plans.commands.start_checkpoint_review.start_checkpoint_review import StartCheckpointReview
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.lifecycles.checkpoint_lifecycle import CheckpointLifecycle
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_main_agents import PlanMainAgents
from core.modules.plans.support.plan_settings import QUICK_REVIEW_SETTING
from core.modules.plans.support.plan_nudges import CHECKPOINT_AWAITS_APPROVAL, CHECKPOINT_FINISHED
from core.modules.plans.support.plan_checkpoints import PlanCheckpoints
from core.modules.tasks.commands.make_task_log.make_task_log import MakeTaskLog

PASS_LINE = "tests passed at checkpoint phase {phase}"
PASS_SOURCE = "plans.checkpoint-passed"


class CheckpointPassListener(SaveListener[Moved[CheckpointReach]]):
    """A reach whose tests passed opens the phases after its checkpoint: the pass is saved with it,
    each task of the run gets a log line, the main agent is told once for the checkpoint, and tasks
    completed in the window since the run started get a run of their own. An early run opens no
    phase and tells nobody. When the setting to wait for the user is on, the pass is not saved and
    the main agent is told that a user must approve. When the quick review is on, the reviewer of
    the checkpoint is started on the model the review-model setting names."""

    name = "plans.checkpoint-pass"
    moves = tuple([CheckpointLifecycle.passed])
    disabled_scopes = [ActorScope]

    def __init__(self, bus: Bus, checkpoints: PlanCheckpoints, main_agents: PlanMainAgents, rows: EventRows, settings: SettingValues) -> None:
        self.bus, self.checkpoints, self.main_agents, self.rows, self.settings = bus, checkpoints, main_agents, rows, settings

    def handle(self, event: Moved[CheckpointReach], context: Context) -> None:
        reach = event.row
        if reach.source.opens_phases():
            opened = self.checkpoints.save_pass(reach.plan_id, reach.phase_id, context)
            waits = reach.phase_id in self.checkpoints.waiting_phase_ids(reach.plan_id)
            phase = self.rows.required(Phase, reach.phase_id)
            if opened or waits:
                self.main_agents.send(self.rows.required(Plan, reach.plan_id), CHECKPOINT_FINISHED if opened else CHECKPOINT_AWAITS_APPROVAL, PASS_SOURCE, context, phase=phase.title)
            reporter = self.main_agents.newest()
            if self.settings.flag(QUICK_REVIEW_SETTING) and reporter is not None:
                self.bus.dispatch(StartCheckpointReview(reach.plan_id, reach.phase_id, reporter.id), context)
        for task_id in reach.tasks():
            self.bus.dispatch(MakeTaskLog(task_id, PASS_LINE.format(phase=reach.phase_id)), context)
        self.checkpoints.record(reach.plan_id, context)
