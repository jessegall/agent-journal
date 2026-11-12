from collections.abc import Sequence

from engine.command.context import Context
from engine.enums.actor_type import ActorType
from engine.enums.model_tier import ModelTier
from engine.errors.refusal import Refusal
from engine.guard.errors.guard_refusal import GuardRefusal
from engine.provider.providers import Providers
from engine.setting.setting_values import SettingValues
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.support.worker_settings import STRONGEST_MODEL_LEAST_COMPLEXITY

MODEL_FITS_COMPLEXITY_GUARD = "workers.model-fits-complexity"


class ModelComplexityPolicy:
    """Refuses an agent that sends easy tasks, alone and not as a plan or a phase, to a worker on the strongest
    model, so a cheaper model does the work it fits (message 118737). The agent may skip it with a reason."""

    def __init__(self, providers: Providers, settings: SettingValues) -> None:
        self.providers, self.settings = providers, settings

    def check(self, program: str, model: str, tasks: Sequence[Task], context: Context) -> None:
        if context.actor.type is not ActorType.AGENT or MODEL_FITS_COMPLEXITY_GUARD in context.skipped_guards:
            return
        if not tasks or not self.is_strongest(program, model):
            return
        least = self.settings.number(STRONGEST_MODEL_LEAST_COMPLEXITY)
        if any(task.complexity is None or task.complexity >= least for task in tasks):
            return
        scores = ", ".join(f"task {task.id} complexity {task.complexity}" for task in tasks)
        refusal = Refusal(f"{model} is the strongest model, and {scores} is below {least}: a general model fits it",
                          "send it to a worker on a general model")
        raise GuardRefusal(MODEL_FITS_COMPLEXITY_GUARD, refusal, f"--skip-guard {MODEL_FITS_COMPLEXITY_GUARD} --skip-reason '<why>'")

    def is_strongest(self, program: str, model: str) -> bool:
        return any(row.name == model and row.tier is ModelTier.STRONGEST for row in self.providers.provider(program).models)
