from engine.enums.actor_type import ActorType
from core.base.command.context import Context
from engine.errors.refusal import Refusal
from core.modules.helpers.support.helper_grant_policy import HelperGrantPolicy
from suites.coding.modules.workers.support.merger_nudges import MERGER_PROFILE
from suites.coding.modules.workers.support.worker_test_arguments import FULL_SUITE_REFUSAL, WorkerTestArguments


class WorkerGrantPolicy(HelperGrantPolicy):
    """Adds the merger to who may grant, for a run that names its test files."""

    def check(self, alternatives: tuple[str, ...], context: Context) -> None:
        if context.actor.type is not ActorType.AGENT or not self.agents.has_profile(context.actor.id, MERGER_PROFILE):
            super().check(alternatives, context)
        elif WorkerTestArguments.is_full_suite(alternatives):
            raise Refusal(FULL_SUITE_REFUSAL, "name the test files in the grant")
