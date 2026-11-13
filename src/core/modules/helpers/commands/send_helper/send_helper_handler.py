from engine.enums.actor_type import ActorType
from engine.provider.providers import Providers
from engine.command.context import Context
from dataclasses import replace
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from engine.driver.nudger import Nudger
from core.modules.helpers.commands.send_helper.send_helper import SendHelper
from core.modules.helpers.support.helper_job_source import HELPER_JOB_SOURCE
from core.modules.helpers.support.helper_limits import HelperLimits
from core.modules.helpers.support.helper_reach import HelperReach
from core.modules.messages.support.work_source_copy import WorkSourceCopy
from core.modules.messages.support.work_sources import WorkSources
from engine.scope.scopes import Scopes
from engine.scope.actor_scope import ActorScope
from core.modules.helpers.support.kept_helpers import KeptHelpers
from core.modules.helpers.support.occupant_rotation import OccupantRotation
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.usage.support.status_files import StatusFiles
from core.modules.agents.support.agent_label import AgentLabel

SHORT_JOB_CHARACTERS = 200
NEW_SESSION_COST = 0.0


class SendHelperHandler(Handler[SendHelper, int]):
    """A running helper reads the job as a line, added to its open job; an ended one opens a new job and resumes,
    or gets a new session first when its profile replaces the session at each launch."""

    command = SendHelper

    def __init__(self, reach: HelperReach, limits: HelperLimits, jobs: HelperJobRows, nudger: Nudger, repository: Repository, folders: AgentFolders, sources: WorkSources, scopes: Scopes, providers: Providers, kept: KeptHelpers, files: StatusFiles, occupants: OccupantRotation, profiles: ProfileFiles) -> None:
        self.reach, self.limits, self.jobs, self.nudger, self.repository, self.folders = reach, limits, jobs, nudger, repository, folders
        self.sources = sources
        self.scopes = scopes
        self.providers = providers
        self.kept, self.files, self.occupants, self.profiles = kept, files, occupants, profiles

    def handle(self, command: SendHelper, context: Context) -> int:
        helper = self.reach.checked_helper(command.helper_id, context.actor, context.command)
        last_job = self.jobs.last_job(helper.id)
        if last_job is None:
            raise Refusal(f"{AgentLabel.labelled(helper).text} has no job to go on from", "journal helper start starts a new one")
        if command.review_plan_id is not None and self.reviewed(helper, command.review_plan_id):
            raise Refusal(f"{AgentLabel.labelled(helper).text} reviewed plan {command.review_plan_id} already", self.other_reviewer_step(helper, command.review_plan_id))
        is_idle = helper.ended_at is not None and last_job.ended_at is not None
        rotating_profile = self.occupants.profile(helper) if is_idle else None
        if is_idle and rotating_profile is None:
            self.limits.checked_helper_model(helper)
        if rotating_profile is None:
            self.kept.check_program(helper)
        source_context = replace(context, environment_id=helper.environment_id)
        source = self.sources.source_copy(source_context)
        if helper.ended_at is None:
            return self.running_helper_job(helper, last_job, source, source_context, command, context)
        if last_job.ended_at is None:
            with self.scopes.opened(context.actor.id, context.environment_id, [ActorScope]):
                self.nudger.send_text(helper.id, command.job, HELPER_JOB_SOURCE, context, wakes_agent=True)
            self.repository.save(last_job.changed(brief=f"{last_job.brief}\n\n{command.job}", title=command.title.strip() or last_job.title), context)
            return helper.id
        parent_id = self.reach.new_parent(helper, context.actor) or last_job.session_agent_id
        if rotating_profile is None:
            self.check_resume(helper)
            cost_baseline = self.files.status(helper.session).cost_dollars
        else:
            self.check_place(helper)
            helper = self.occupants.rotated(helper, rotating_profile, parent_id, source_context)
            cost_baseline = NEW_SESSION_COST
        if parent_id != helper.parent_id:
            self.repository.save(helper.changed(parent_id=parent_id), context)
        next_job = last_job.next_job(helper.session, helper.program, helper.program_model, command.job, command.job[:SHORT_JOB_CHARACTERS], command.title.strip(), context.actor.id)
        self.repository.save(next_job.changed(session_agent_id=parent_id, review_plan_id=command.review_plan_id, source_message_id=source.message_id, source_version=source.version, source_unavailable=source.unavailable, started_at=context.timestamp, cost_baseline=cost_baseline, new_session=rotating_profile is not None), context)
        self.sources.use_copy(source, source_context)
        return helper.id

    def reviewed(self, helper: Agent, plan_id: int) -> bool:
        return self.jobs.has_reviewed(helper.id, plan_id)

    def other_reviewer_step(self, helper: Agent, plan_id: int) -> str:
        start = f'journal helper start {helper.profile} --plan {plan_id} --fresh "<why>" starts another reviewer'
        if not helper.profile:
            return start
        occupant = self.profiles.effective(helper.profile).occupant
        idle = [reviewer for reviewer in self.kept.idle_profile_helpers(helper.profile, occupant) if not self.reviewed(reviewer, plan_id)]
        if not idle:
            return start
        return f'journal helper send {idle[0].number} "<job>" --plan {plan_id} gives it to an idle reviewer that has not, or {start}'

    def running_helper_job(self, helper: Agent, last_job: HelperJob, source: WorkSourceCopy, source_context: Context, command: SendHelper, context: Context) -> int:
        if last_job.ended_at is None and not command.steer and context.actor.is_agent():
            raise Refusal(f"{AgentLabel.labelled(helper).text} is busy with a job", f'wait for its report, or journal helper send {helper.number} --steer "<text>" adds to that job')
        with self.scopes.opened(context.actor.id, context.environment_id, [ActorScope]):
            line = self.nudger.send_text(helper.id, command.job, HELPER_JOB_SOURCE, context, wakes_agent=True)
        if self.continues(last_job, source):
            self.repository.save(last_job.changed(brief=f"{last_job.brief}\n\n{command.job}", title=command.title.strip() or last_job.title), context)
            return helper.id
        next_job = last_job.next_job(helper.session, helper.program, helper.program_model, command.job, command.job[:SHORT_JOB_CHARACTERS], command.title.strip(), context.actor.id)
        self.repository.save(next_job.changed(review_plan_id=command.review_plan_id, source_message_id=source.message_id, source_version=source.version, source_unavailable=source.unavailable, source_line_id=line.id, cost_baseline=self.files.status(helper.session).cost_dollars), context)
        self.sources.use_copy(source, source_context)
        return helper.id

    def check_resume(self, helper: Agent) -> None:
        if not helper.profile:
            raise Refusal(f"{AgentLabel.labelled(helper).text} ran as a program subagent and cannot be resumed", "start a new helper")
        self.limits.checked_resume_session(helper)
        self.check_place(helper)

    def check_place(self, helper: Agent) -> None:
        self.limits.checked_running(helper.profile)
        if not self.folders.has_folder(helper):
            raise Refusal(f"{AgentLabel.labelled(helper).text} worked in a folder that is gone", 'start a new helper with --fresh "<why>"')

    @staticmethod
    def continues(job: HelperJob, source: WorkSourceCopy) -> bool:
        return job.ended_at is None and job.source_message_id == source.message_id and job.source_unavailable == source.unavailable
