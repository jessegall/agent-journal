from core.modules.drivers.models.helper_job import HelperJob
from core.modules.helpers.support.job_cost import JobCost
from core.modules.helpers.support.profile_job_costs import ProfileJobCosts
from core.modules.usage.support.status_files import StatusFiles
from engine.query.queries import Queries


class JobCosts:
    """Reads what each job of a profile cost: the cost its session reported when the next job on that session
    began, or the session's last reported cost for its last job, less the cost reported when the job began."""

    def __init__(self, queries: Queries, files: StatusFiles) -> None:
        self.queries, self.files = queries, files

    def profile_costs(self, profile: str) -> ProfileJobCosts:
        jobs = tuple(self.queries.query(HelperJob).filter(profile=profile).oldest().all_rows())
        following_jobs = self.following_jobs(jobs)
        return ProfileJobCosts(tuple(JobCost(job.new_session, self.dollars(job, following_jobs.get(job.id))) for job in jobs))

    @staticmethod
    def following_jobs(jobs: tuple[HelperJob, ...]) -> dict[int, HelperJob]:
        newest: dict[tuple[int | None, str], HelperJob] = {}
        following_jobs: dict[int, HelperJob] = {}
        for job in jobs:
            previous_job = newest.get((job.helper_id, job.session))
            if previous_job is not None:
                following_jobs[previous_job.id] = job
            newest[(job.helper_id, job.session)] = job
        return following_jobs

    def dollars(self, job: HelperJob, following_job: HelperJob | None) -> float | None:
        reported = self.files.status(job.session).cost_dollars if following_job is None else following_job.cost_baseline
        if reported is None or job.cost_baseline is None or reported < job.cost_baseline:
            return None
        return reported - job.cost_baseline
