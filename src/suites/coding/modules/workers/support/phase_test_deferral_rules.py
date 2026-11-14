from dataclasses import dataclass

from engine.errors.refusal import Refusal
from core.modules.plans.models.phase import Phase
from suites.coding.modules.workers.support.own_test_command import OwnTestCommand

MAIN_AGENT_HINT = "tell the main agent with journal merger tell"


@dataclass(frozen=True)
class PhaseTestDeferralRules:
    """Says whether test paths may be left out of the own test of a checkpoint phase until the next
    checkpoint, from plain values, with one refusal for each reason: the phase has no test of its own, no
    task after it is left to wait for, the deferrals of the phase are used, its own test did not fail, a path
    did not fail, or the command would lose a word that is no path or every path."""

    limit: int

    def check(self, phase: Phase, failed_paths: tuple[str, ...] | None, paths: tuple[str, ...], waiting_task_count: int, deferred_count: int) -> OwnTestCommand:
        if not phase.checkpoint or not phase.test_command:
            raise Refusal(f"phase {phase.id} is not a checkpoint: it runs no test", MAIN_AGENT_HINT)
        if not waiting_task_count:
            raise Refusal(f"nothing after phase {phase.id} is left to wait for: the failure is real, fix it", "advise the worker to fix the failing files and commit again")
        if deferred_count >= self.limit:
            raise Refusal(f"{deferred_count} of {self.limit} deferrals are used for phase {phase.id}", MAIN_AGENT_HINT)
        if failed_paths is None:
            raise Refusal(f"the own test of phase {phase.id} did not fail: nothing to correct", "answer the worker with journal merger answer")
        passed_paths = [path for path in paths if path not in failed_paths]
        if passed_paths:
            raise Refusal(f"{', '.join(passed_paths)} did not fail in the own test of phase {phase.id}", f"the paths that failed are {', '.join(failed_paths)}")
        return OwnTestCommand.parse(phase.test_command).without(paths)
