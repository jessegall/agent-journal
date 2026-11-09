from datetime import datetime, timezone
from pathlib import Path

from core.base.clock import Clock
from core.base.database.kept_rows import KeptRows
from core.base.provider.hook_trust import HookTrust
from core.base.provider.providers import Providers
from core.base.provider.unknown_program_error import UnknownProgramError
from core.base.query.queries import Queries
from core.base.scope.environment_scope import EnvironmentScope
from core.base.scope.scopes import Scopes
from engine.errors.refusal import Refusal
from core.base.timestamp import Timestamp
from core.modules.agents.queries.agent_query import AgentQuery
from core.modules.helpers.models.provider_outage import ProviderOutage
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.helpers.support.helper_settings import PROGRAM_WINDOW_PERCENT
from core.modules.helpers.support.program_state import ProgramState
from core.modules.helpers.support.program_readiness import ProgramReadiness
from core.modules.helpers.support.usage_limits import UsageLimits
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.usage.support.status_files import StatusFiles
from core.modules.usage.support.plan_window import PlanWindow


LIMIT_PERCENT = 100


class ProgramStates:
    """Reads program readiness; account windows apply across its open sessions in every environment."""

    def __init__(self, providers: Providers, programs: HelperPrograms, queries: Queries,
                 settings: SettingValues, statuses: StatusFiles, clock: Clock, agents: AgentQuery, scopes: Scopes, kept_rows: KeptRows, limits: UsageLimits) -> None:
        self.limits = limits
        self.providers, self.programs, self.queries = providers, programs, queries
        self.settings, self.statuses, self.clock = settings, statuses, clock
        self.agents, self.scopes = agents, scopes
        self.kept_rows = kept_rows

    def state(self, program: str, folder: Path) -> ProgramState:
        try:
            provider = self.providers.provider(program)
        except UnknownProgramError:
            return ProgramState.unavailable(f"{program} has no installed provider module")
        try:
            self.programs.installed(program)
        except Refusal as refusal:
            return ProgramState.unavailable(refusal.text)
        if provider.hook_trust(folder) is not HookTrust.READY:
            return ProgramState.unavailable(f"{program} has not trusted the journal hooks in {folder}")
        return self.allowance_state(program)

    def allowance_state(self, program: str) -> ProgramState:
        outage = self.outage_state(program)
        if not outage.is_ready:
            return outage
        window = self.window_reaching(program, self.settings.number(PROGRAM_WINDOW_PERCENT) or LIMIT_PERCENT)
        if window is None:
            custom_limit = self.custom_limit_reset_timestamp(program)
            return ProgramState.ready() if custom_limit is None else ProgramState.unavailable(f"a usage limit set for {program} is reached", custom_limit)
        return ProgramState.unavailable(window.line, Timestamp(datetime.fromtimestamp(window.reset_epoch_seconds, timezone.utc)))

    def limit_reset_timestamp(self, program: str) -> Timestamp | None:
        window = self.window_reaching(program, LIMIT_PERCENT)
        plan_end = None if window is None else Timestamp(datetime.fromtimestamp(window.reset_epoch_seconds, timezone.utc))
        ends = [end for end in (plan_end, self.custom_limit_reset_timestamp(program)) if end is not None]
        return max(ends, key=lambda end: end.value) if ends else None

    def custom_limit_reset_timestamp(self, program: str) -> Timestamp | None:
        return self.limits.reached_limit_ends(program, self.windows(program), self.clock.timestamp())

    def window_reaching(self, program: str, percent: float) -> PlanWindow | None:
        checked_at = self.clock.timestamp().value.timestamp()
        blocked = [window for window in self.windows(program) if window.used_percent >= percent and window.reset_epoch_seconds > checked_at]
        return max(blocked, key=lambda row: row.reset_epoch_seconds) if blocked else None

    def windows(self, program: str) -> tuple[PlanWindow, ...]:
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            agents = self.kept_rows.scoped_read("agents", lambda: tuple(self.agents.running().filter(program=program).all_rows()),
                                               "ended_at IS NULL AND program = ?", [program], name="helpers.program_sessions")
        return self.statuses.newest_status([agent.session for agent in agents], self.clock.timestamp()).windows

    def outage_state(self, program: str) -> ProgramState:
        try:
            self.providers.provider(program)
        except UnknownProgramError:
            return ProgramState.unavailable(f"{program} has no installed provider module")
        checked_at = self.clock.timestamp()
        outages = self.kept_rows.read("provider_outages", lambda: tuple(self.queries.query(ProviderOutage).filter(program=program).descending("ends_at").all_rows()),
                                     "program = ?", [program], name="helpers.program_outages")
        outage = next((row for row in outages if row.ends_at > checked_at), None)
        if outage is None:
            return ProgramState.ready()
        return ProgramState.unavailable(outage.reason, outage.ends_at)

    def ready_programs(self, folder: Path) -> tuple[str, ...]:
        return self.readiness(folder).ready_programs

    def readiness(self, folder: Path) -> ProgramReadiness:
        return ProgramReadiness({provider.name: self.state(provider.name, folder) for provider in self.providers.all()})

    def earliest_line(self, folder: Path) -> str:
        return self.readiness(folder).earliest_line
