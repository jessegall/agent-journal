from core.modules.settings.support.context_share import ContextShare
from core.base.helper_role import HelperRole
from core.base.database.kept_rows import KeptRows
from core.base.provider.providers import Providers
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import AGENTS_TABLE, Agent
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.helpers.support.program_states import ProgramStates
from core.modules.helpers.support.program_state import ProgramState

FULL_SESSION_PERCENT = 80


class KeptHelpers:
    """Reads the idle helpers of a profile that can take a new job: not retired, process ended, no open job, on
    the program and model asked for, with a session that resumes in its folder and is not nearly full. The
    newest comes first."""

    def __init__(self, queries: Queries, providers: Providers, folders: AgentFolders, kept_rows: KeptRows, states: ProgramStates, share: ContextShare) -> None:
        self.queries, self.providers, self.folders, self.kept_rows = queries, providers, folders, kept_rows
        self.states, self.share = states, share

    def with_open_jobs(self, profile: str) -> set[int | None]:
        return self.kept_rows.scoped_read("helper_jobs", lambda: {job.helper_id for job in self.queries.query(HelperJob).filter(profile=profile).matching(IsNull("ended_at")).all_rows()},
                                   "profile = ? AND ended_at IS NULL", [profile], name="helpers.with_open_jobs")

    def kept(self, profile: str) -> tuple[Agent, ...]:
        return self.kept_rows.scoped_read(AGENTS_TABLE, lambda: self.query_kept(profile), "role = ? AND profile = ? AND retired_at IS NULL", [HelperRole.HELPER, profile], name="helpers.kept")

    def query_kept(self, profile: str) -> tuple[Agent, ...]:
        return tuple(self.queries.query(Agent).filter(role=HelperRole.HELPER, profile=profile).matching(IsNull("retired_at")).newest().all_rows())

    def idle(self, profile: str, program: str, model: str) -> tuple[Agent, ...]:
        kept = self.kept(profile)
        open_jobs = self.with_open_jobs(profile)
        return tuple(helper for helper in kept if self.is_available(helper, open_jobs, program, model))

    def is_available(self, helper: Agent, open_jobs: set[int | None], program: str, model: str) -> bool:
        if helper.ended_at is None or helper.id in open_jobs or (program and helper.program != program) or (model and helper.program_model != model):
            return False
        provider = self.providers.provider(helper.program)
        if not provider.session_matches_folder(self.folders.folder(helper), helper.session):
            return False
        return (self.share.percent(helper.program, helper.session) or 0) < FULL_SESSION_PERCENT

    def idle_refusal(self, helpers: tuple[Agent, ...]) -> Refusal:
        additional_helpers = f" (also {', '.join(str(helper.id) for helper in helpers[1:3])})" if helpers[1:] else ""
        state = self.program_state(helpers[0])
        waiting = f"; {state.wait_line}" if not state.is_ready else ""
        return Refusal(f'helper {helpers[0].id} is idle: journal helper send {helpers[0].id} "<job>"{additional_helpers}{waiting}', 'or --fresh "<why>"')

    def program_state(self, helper: Agent) -> ProgramState:
        return self.states.outage_state(helper.program)

    def check_program(self, helper: Agent) -> None:
        state = self.program_state(helper)
        if not state.is_ready:
            raise Refusal(f"helper {helper.id} waits on {helper.program}: {state.wait_line}", f"journal helper send {helper.id} after it is back")
