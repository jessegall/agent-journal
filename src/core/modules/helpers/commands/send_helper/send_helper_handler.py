from engine.enums.actor_type import ActorType
from core.base.provider.providers import Providers
from engine.command.context import Context
from dataclasses import replace
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from core.modules.drivers.support.nudger import Nudger
from core.modules.helpers.commands.send_helper.send_helper import SendHelper
from core.modules.helpers.support.helper_job_source import HELPER_JOB_SOURCE
from core.modules.helpers.support.helper_limits import HelperLimits
from core.modules.helpers.support.helper_reach import HelperReach
from core.modules.messages.support.work_source_copy import WorkSourceCopy
from core.modules.messages.support.work_sources import WorkSources
from engine.scope.scopes import Scopes
from engine.scope.actor_scope import ActorScope
from core.modules.helpers.support.kept_helpers import KeptHelpers
from core.modules.usage.support.status_files import StatusFiles

SHORT_JOB_CHARACTERS = 200


class SendHelperHandler(Handler[SendHelper, int]):
    """A running helper reads the job as a line, added to its open job; an ended one opens a new job and resumes."""

    command = SendHelper

    def __init__(self, reach: HelperReach, limits: HelperLimits, jobs: HelperJobRows, nudger: Nudger, repository: Repository, folders: AgentFolders, sources: WorkSources, scopes: Scopes, providers: Providers, kept: KeptHelpers, files: StatusFiles) -> None:
        self.reach, self.limits, self.jobs, self.nudger, self.repository, self.folders = reach, limits, jobs, nudger, repository, folders
        self.sources = sources
        self.scopes = scopes
        self.providers = providers
        self.kept, self.files = kept, files

    def handle(self, command: SendHelper, context: Context) -> int:
        helper = self.reach.checked_helper(command.helper_id, context.actor, context.command)
        jobs = self.jobs.helper_jobs(helper.id)
        if not jobs:
            raise Refusal(f"helper {helper.id} has no job to go on from", "journal helper start starts a new one")
        last_job = jobs[-1]
        if command.review_plan_id is not None and any(job.review_plan_id == command.review_plan_id for job in jobs):
            raise Refusal(f"helper {helper.id} reviewed plan {command.review_plan_id} already", "an independent review needs another helper: journal helper start")
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
        self.check_resume(helper)
        parent_id = self.reach.new_parent(helper, context.actor) or last_job.session_agent_id
        if parent_id != helper.parent_id:
            self.repository.save(helper.changed(parent_id=parent_id), context)
        next_job = last_job.next_job(helper.session, command.job, command.job[:SHORT_JOB_CHARACTERS], command.title.strip(), context.actor.id)
        self.repository.save(next_job.changed(session_agent_id=parent_id, review_plan_id=command.review_plan_id, source_message_id=source.message_id, source_version=source.version, source_unavailable=source.unavailable, started_at=context.timestamp, cost_baseline=self.files.status(helper.session).cost_dollars), context)
        self.sources.use_copy(source, source_context)
        return helper.id

    def running_helper_job(self, helper: Agent, last_job: HelperJob, source: WorkSourceCopy, source_context: Context, command: SendHelper, context: Context) -> int:
        if last_job.ended_at is None and not command.steer and context.actor.type is ActorType.AGENT:
            raise Refusal(f"helper {helper.id} is busy with a job", f'wait for its report, or journal helper send {helper.id} --steer "<text>" adds to that job')
        with self.scopes.opened(context.actor.id, context.environment_id, [ActorScope]):
            line = self.nudger.send_text(helper.id, command.job, HELPER_JOB_SOURCE, context, wakes_agent=True)
        if self.continues(last_job, source):
            self.repository.save(last_job.changed(brief=f"{last_job.brief}\n\n{command.job}", title=command.title.strip() or last_job.title), context)
            return helper.id
        next_job = last_job.next_job(helper.session, command.job, command.job[:SHORT_JOB_CHARACTERS], command.title.strip(), context.actor.id)
        self.repository.save(next_job.changed(review_plan_id=command.review_plan_id, source_message_id=source.message_id, source_version=source.version, source_unavailable=source.unavailable, source_line_id=line.id, cost_baseline=self.files.status(helper.session).cost_dollars), context)
        self.sources.use_copy(source, source_context)
        return helper.id

    def check_resume(self, helper: Agent) -> None:
        if not helper.profile:
            raise Refusal(f"helper {helper.id} ran as a program subagent and cannot be resumed", "start a new helper")
        self.limits.checked_resume_session(helper)
        self.limits.checked_running(helper.profile)
        if not self.folders.has_folder(helper):
            raise Refusal(f"helper {helper.id} worked in a folder that is gone", 'start a new helper with --fresh "<why>"')
        if not self.providers.provider(helper.program).session_matches_folder(self.folders.folder(helper), helper.session):
            raise Refusal(f"helper {helper.id} has no conversation to resume and starts a new session on its next launch: journal agent retire {helper.id} --reason \"no conversation\"", "start a new helper")

    @staticmethod
    def continues(job: HelperJob, source: WorkSourceCopy) -> bool:
        return job.ended_at is None and job.source_message_id == source.message_id and job.source_unavailable == source.unavailable
