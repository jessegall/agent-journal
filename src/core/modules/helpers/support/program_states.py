from datetime import datetime, timezone
from pathlib import Path

from core.base.clock import Clock
from core.base.provider.hook_trust import HookTrust
from core.base.provider.providers import Providers
from core.base.provider.unknown_program_error import UnknownProgramError
from core.base.query.queries import Queries
from core.base.scope.environment_scope import EnvironmentScope
from core.base.scope.scopes import Scopes
from core.base.refusal import Refusal
from core.base.timestamp import Timestamp
from core.modules.agents.queries.agent_query import AgentQuery
from core.modules.helpers.models.provider_outage import ProviderOutage
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.helpers.support.helper_settings import PROGRAM_WINDOW_PERCENT
from core.modules.helpers.support.program_state import ProgramState
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.usage.support.status_files import StatusFiles


class ProgramStates:
    """Reads program readiness; account windows apply across its open sessions in every environment."""

    def __init__(self, providers: Providers, programs: HelperPrograms, queries: Queries,
                 settings: SettingValues, statuses: StatusFiles, clock: Clock, agents: AgentQuery, scopes: Scopes) -> None:
        self.providers, self.programs, self.queries = providers, programs, queries
        self.settings, self.statuses, self.clock = settings, statuses, clock
        self.agents, self.scopes = agents, scopes

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
        checked_at = self.clock.timestamp()
        threshold = self.settings.number(PROGRAM_WINDOW_PERCENT)
        if threshold == 0:
            return ProgramState.ready()
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            agents = self.agents.running().filter(program=program).all_rows()
        status = self.statuses.newest_status([agent.session for agent in agents], checked_at)
        blocked = [window for window in status.windows
                   if window.used_percent >= threshold and window.reset_epoch_seconds > checked_at.value.timestamp()]
        if not blocked:
            return ProgramState.ready()
        window = max(blocked, key=lambda row: row.reset_epoch_seconds)
        return ProgramState.unavailable(window.line, Timestamp(datetime.fromtimestamp(window.reset_epoch_seconds, timezone.utc)))

    def outage_state(self, program: str) -> ProgramState:
        try:
            self.providers.provider(program)
        except UnknownProgramError:
            return ProgramState.unavailable(f"{program} has no installed provider module")
        checked_at = self.clock.timestamp()
        outages = self.queries.query(ProviderOutage).filter(program=program).descending("ends_at").all_rows()
        outage = next((row for row in outages if row.ends_at > checked_at), None)
        if outage is None:
            return ProgramState.ready()
        return ProgramState.unavailable(outage.reason, outage.ends_at)

    def ready_programs(self, folder: Path) -> tuple[str, ...]:
        return tuple(provider.name for provider in self.providers.all() if self.state(provider.name, folder).is_ready)

    def earliest_line(self, folder: Path) -> str:
        states = [self.state(provider.name, folder) for provider in self.providers.all()]
        timed = [state for state in states if state.ends_at is not None]
        if timed:
            earliest = min(timed, key=lambda state: state.ends_at)
            return f"{earliest.line}, until {earliest.ends_at.text}"
        return "; ".join(state.line for state in states)
