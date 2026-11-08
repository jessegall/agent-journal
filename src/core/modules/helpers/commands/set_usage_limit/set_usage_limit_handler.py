from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.helpers.commands.set_usage_limit.set_usage_limit import SetUsageLimit
from core.modules.helpers.models.enums.usage_limit_mode import UsageLimitMode
from core.modules.helpers.models.usage_limit import UsageLimit
from core.modules.helpers.support.program_states import ProgramStates
from core.modules.helpers.support.usage_limits import UsageLimits


class SetUsageLimitHandler(Handler[SetUsageLimit, UsageLimit]):
    """Saves a new limit, or changes the one the program has for that window and mode, taking the baseline of a budget from the window as it is now."""

    command = SetUsageLimit

    def __init__(self, repository: Repository, limits: UsageLimits, states: ProgramStates) -> None:
        self.repository, self.limits, self.states = repository, limits, states

    def handle(self, command: SetUsageLimit, context: Context) -> UsageLimit:
        windows = self.states.windows(command.program)
        now = context.timestamp.value.timestamp()
        fresh = UsageLimit(program=command.program, creator_id=context.actor.id, window=command.window, mode=command.mode, percent=command.percent)
        window = self.limits.window_of(fresh, windows)
        baseline = (window.used_percent, self.limits.marker(fresh, window, now)) if window is not None and command.mode is UsageLimitMode.BUDGET else (0.0, 0.0)
        existing = next((row for row in self.limits.of(command.program) if (row.window, row.mode) == (command.window, command.mode)), None)
        if existing is None:
            return self.repository.save(fresh.changed(baseline_percent=baseline[0], baseline_marker=baseline[1]), context)
        return self.repository.update(existing, context, percent=command.percent, baseline_percent=baseline[0], baseline_marker=baseline[1])
