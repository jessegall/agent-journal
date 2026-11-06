from core.base.provider.providers import Providers
from core.base.command.context import Context
from dataclasses import replace
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
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
from core.base.scope.scopes import Scopes
from core.base.scope.actor_scope import ActorScope

SHORT_JOB_CHARACTERS = 200


class SendHelperHandler(Handler[SendHelper, int]):
    """A running helper reads the job as a line, added to its open job; an ended one opens a new job and resumes."""

    command = SendHelper

    def __init__(self, reach: HelperReach, limits: HelperLimits, jobs: HelperJobRows, nudger: Nudger, repository: Repository, folders: AgentFolders, sources: WorkSources, scopes: Scopes, providers: Providers) -> None:
        self.reach, self.limits, self.jobs, self.nudger, self.repository, self.folders = reach, limits, jobs, nudger, repository, folders
        self.sources = sources
        self.scopes = scopes
        self.providers = providers

    def handle(self, command: SendHelper, context: Context) -> int:
        helper = self.reach.checked_helper(command.helper_id, context.actor)
        last_job = self.jobs.helper_jobs(helper.id)[-1]
        source_context = replace(context, environment_id=helper.environment_id)
        source = self.sources.source_copy(source_context)
        if helper.ended_at is None:
            with self.scopes.opened(context.actor.id, context.environment_id, [ActorScope]):
                line = self.nudger.send_text(helper.id, command.job, HELPER_JOB_SOURCE, context, wakes_agent=True)
            if self.continues(last_job, source):
                self.repository.save(last_job.changed(brief=f"{last_job.brief}\n\n{command.job}"), context)
                return helper.id
            next_job = last_job.next_job(helper.session, command.job, command.job[:SHORT_JOB_CHARACTERS], context.actor.id)
            self.repository.save(next_job.changed(source_message_id=source.message_id, source_version=source.version, source_unavailable=source.unavailable, source_line_id=line.id), context)
            self.sources.use_copy(source, source_context)
            return helper.id
        self.check_resume(helper)
        next_job = last_job.next_job(helper.session, command.job, command.job[:SHORT_JOB_CHARACTERS], context.actor.id)
        self.repository.save(next_job.changed(source_message_id=source.message_id, source_version=source.version, source_unavailable=source.unavailable, started_at=context.timestamp), context)
        self.sources.use_copy(source, source_context)
        return helper.id

    @staticmethod
    def continues(job: HelperJob, source: WorkSourceCopy) -> bool:
        return job.ended_at is None and job.source_message_id == source.message_id and job.source_unavailable == source.unavailable

    def check_resume(self, helper: Agent) -> None:
        if not helper.profile:
            raise Refusal(f"helper {helper.id} ran as a program subagent and cannot be resumed", "start a new helper")
        self.limits.checked_running(helper.profile)
        if not self.folders.has_folder(helper):
            raise Refusal(f"helper {helper.id} worked in a folder that is gone", "start a new helper with --fresh")
        if not self.providers.provider(helper.program).session_resumes_here(self.folders.folder(helper), helper.session):
            raise Refusal(f"helper {helper.id}'s session is gone: journal agent retire {helper.id} --reason \"session gone\"", "start a new helper")
