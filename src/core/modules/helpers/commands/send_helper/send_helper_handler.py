from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.drivers.queries.helper_job_query import HelperJobQuery
from core.modules.drivers.support.nudger import Nudger
from core.modules.helpers.commands.send_helper.send_helper import SendHelper
from core.modules.helpers.support.helper_job_source import HELPER_JOB_SOURCE
from core.modules.helpers.support.helper_limits import HelperLimits
from core.modules.helpers.support.helper_reach import HelperReach

SHORT_JOB_CHARACTERS = 200


class SendHelperHandler(Handler[SendHelper, None]):
    """A running helper reads the job as a line, added to its open job; an ended one opens a new job and resumes."""

    command = SendHelper

    def __init__(self, reach: HelperReach, limits: HelperLimits, jobs: HelperJobQuery, nudger: Nudger, repository: Repository, folders: AgentFolders) -> None:
        self.reach, self.limits, self.jobs, self.nudger, self.repository, self.folders = reach, limits, jobs, nudger, repository, folders

    def handle(self, command: SendHelper, context: Context) -> None:
        helper = self.reach.checked_helper(command.helper_id, context)
        last_job = self.jobs.helper_jobs(helper.id)[-1]
        if helper.ended_at is None:
            self.nudger.send_text(helper.id, command.job, HELPER_JOB_SOURCE, context, wakes_agent=True)
            self.repository.save(last_job.changed(brief=f"{last_job.brief}\n\n{command.job}"), context)
            return
        self.check_resume(helper)
        self.repository.save(last_job.next_job(helper.session, command.job, command.job[:SHORT_JOB_CHARACTERS], context.actor.id), context)

    def check_resume(self, helper: Agent) -> None:
        self.limits.checked_slot(helper.environment_id)
        if not self.folders.keeps_folder(helper):
            raise Refusal(f"helper {helper.id} worked in a folder that is gone", "start a new helper with --fresh")
