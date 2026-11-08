from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.helpers.commands.refresh_hourly_limits.refresh_hourly_limits import RefreshHourlyLimits
from core.modules.helpers.support.program_states import ProgramStates
from core.modules.helpers.support.usage_limits import UsageLimits


class RefreshHourlyLimitsHandler(Handler[RefreshHourlyLimits, None]):
    """Saves the baseline of each stale hourly budget as what the window holds, for the hour now."""

    command = RefreshHourlyLimits

    def __init__(self, repository: Repository, limits: UsageLimits, states: ProgramStates) -> None:
        self.repository, self.limits, self.states = repository, limits, states

    def handle(self, command: RefreshHourlyLimits, context: Context) -> None:
        current_epoch = context.timestamp.value.timestamp()
        for limit, window in self.limits.stale_hourly(command.program, self.states.windows(command.program), context.timestamp):
            self.repository.update(limit, context, baseline_percent=window.used_percent, baseline_marker=self.limits.marker(limit, window, current_epoch))
