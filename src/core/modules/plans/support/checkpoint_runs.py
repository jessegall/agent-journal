from engine.command.bus import Bus
from engine.command.context import Context
from engine.repository.repository import Repository
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.lifecycles.checkpoint_lifecycle import CheckpointLifecycle
from core.modules.plans.models.phase import Phase
from core.modules.tasks.commands.make_task_log.make_task_log import MakeTaskLog

UNTESTED_LINE = "checkpoint phase {phase} had no test to run"


class CheckpointRuns:
    """Starts the run of a reached checkpoint. The core has no test to run: the reach says so in the log of the
    last task of its window and passes at once. A suite that runs tests binds its own runs in place of
    these, and may add lines of its own to what a plan shows about its phases; the core has none."""

    def __init__(self, repository: Repository, bus: Bus) -> None:
        self.repository, self.bus = repository, bus

    def notes(self, phases: tuple[Phase, ...]) -> tuple[str, ...]:
        return ()

    def start(self, reach: CheckpointReach, context: Context) -> None:
        self.bus.dispatch(MakeTaskLog(reach.tasks()[-1], UNTESTED_LINE.format(phase=reach.phase_id)), context)
        self.repository.save_change(reach, reach.moved(CheckpointLifecycle.passed), context)
