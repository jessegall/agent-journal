from engine.driver.program_lockdown import ProgramLockdown
from core.modules.settings.bindings.support.context_share import ContextShare
from engine.enums.helper_role import HelperRole
from engine.enums.occupant import Occupant
from engine.database.kept_rows import KeptRows
from engine.provider.providers import Providers
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.query.query import Query
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.helpers.support.profile_model import ProfileModel
from core.modules.helpers.support.program_states import ProgramStates
from core.modules.helpers.support.program_state import ProgramState
from core.modules.agents.support.agent_label import AgentLabel

KEPT_HELPERS_REASON = "every kept helper of a profile is checked for an idle one"

FULL_SESSION_PERCENT = 80


class KeptHelpers:
    """Reads the idle helpers of a profile that can take a new job: not retired, process ended, no open
    job, on the program and model asked for, with a session that resumes in its folder and is not
    nearly full. A helper whose profile replaces its session at each launch is idle on any program,
    model and session, because its next launch picks its own. The lowest number comes first."""

    def __init__(self, queries: Queries, providers: Providers, folders: AgentFolders, kept_rows: KeptRows, states: ProgramStates, share: ContextShare, lockdown: ProgramLockdown) -> None:
        self.lockdown = lockdown
        self.queries, self.providers, self.folders, self.kept_rows = queries, providers, folders, kept_rows
        self.states, self.share = states, share

    # The helpers of a profile with an open job, at most the 50 newest: more than any run limit.
    def with_open_jobs(self, profile: str) -> set[int]:
        jobs = self.open_jobs().where(profile=profile).where_not_null("helper_id").newest()
        return self.kept_rows.read(jobs, lambda: set(jobs.pluck("helper_id", int)), name="helpers.with_open_jobs")

    def has_open_job(self, helper: Agent) -> bool:
        return self.open_jobs().where(helper_id=helper.id).exists()

    def open_jobs(self) -> Query[HelperJob]:
        return self.queries.query(HelperJob).where_null("ended_at")

    def kept(self, profile: str) -> tuple[Agent, ...]:
        helpers = self.queries.query(Agent).filter(role=HelperRole.HELPER, profile=profile).matching(IsNull("retired_at")).newest()
        return self.kept_rows.read(helpers, lambda: tuple(helpers.every_row(KEPT_HELPERS_REASON)), name="helpers.kept")

    def idle(self, selection: ProfileModel, occupant: Occupant) -> tuple[Agent, ...]:
        stopped = [helper for helper in self.stopped(selection.profile) if not selection.model or helper.program_model == selection.model]
        idle_helpers = stopped if occupant.may_change_program else [helper for helper in stopped if self.resumes(helper, selection.program, selection.model)]
        return tuple(sorted(idle_helpers, key=lambda helper: helper.number))

    def idle_profile_helpers(self, profile: str, occupant: Occupant) -> tuple[Agent, ...]:
        stopped = self.stopped(profile)
        idle_helpers = stopped if occupant.may_change_program else [helper for helper in stopped if self.resumes(helper, helper.program, helper.program_model)]
        return tuple(sorted(idle_helpers, key=lambda helper: helper.number))

    def stopped(self, profile: str) -> list[Agent]:
        return [helper for helper in self.kept(profile) if helper.ended_at is not None and not self.has_open_job(helper)]

    def resumes(self, helper: Agent, program: str, model: str) -> bool:
        if (program and helper.program != program) or (model and helper.program_model != model):
            return False
        provider = self.providers.provider(helper.program)
        if not provider.session_matches_folder(self.folders.folder(helper), helper.session):
            return False
        return (self.share.agent_percent(helper) or 0) < FULL_SESSION_PERCENT

    def idle_refusal(self, helpers: tuple[Agent, ...]) -> Refusal:
        additional_helpers = f" (also {', '.join(str(helper.number) for helper in helpers[1:3])})" if helpers[1:] else ""
        state = self.program_state(helpers[0])
        waiting = f"; {state.wait_line}" if not state.is_ready else ""
        return Refusal(f'helper {helpers[0].number} is idle: journal helper send {helpers[0].number} "<job>"{additional_helpers}{waiting}', 'or --fresh "<why>"')

    def program_state(self, helper: Agent) -> ProgramState:
        return self.states.outage_state(helper.program)

    def check_program(self, helper: Agent) -> None:
        lockdown = self.lockdown.lockdown(helper.program)
        if lockdown.is_active:
            raise lockdown.start_refusal("helper")
        state = self.program_state(helper)
        if not state.is_ready:
            raise Refusal(f"{AgentLabel.labelled(helper).text} waits on {helper.program}: {state.wait_line}", f"journal helper send {helper.number} after it is back")
