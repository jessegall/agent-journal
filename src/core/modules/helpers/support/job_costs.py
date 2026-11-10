from dataclasses import dataclass

from core.modules.drivers.models.helper_job import HelperJob
from core.modules.usage.support.status_files import StatusFiles
from engine.query.queries import Queries

COST_DECIMALS = 4


@dataclass(frozen=True)
class JobCost:
    """One job: whether it began a new program session, and what it cost in dollars when that is known."""

    new_session: bool
    dollars: float | None


@dataclass(frozen=True)
class ProfileJobCosts:
    """The jobs of one profile, counted by whether they began a new program session or resumed one, with the
    mean cost of a job of each."""

    jobs: tuple[JobCost, ...]

    def count(self, new_session: bool) -> int:
        return len([job for job in self.jobs if job.new_session is new_session])

    def cost_per_job(self, new_session: bool) -> float | None:
        known = [job.dollars for job in self.jobs if job.new_session is new_session and job.dollars is not None]
        return round(sum(known) / len(known), COST_DECIMALS) if known else None

    def line(self, new_session: bool) -> str:
        cost = self.cost_per_job(new_session)
        session = "a new session" if new_session else "a resumed session"
        return f"{self.count(new_session)} jobs on {session}, {'no cost reported' if cost is None else f'${cost:.2f} a job'}"

    def json(self) -> dict[str, object]:
        return {"jobs_total": len(self.jobs), "jobs_fresh": self.count(True), "jobs_resumed": self.count(False),
                "cost_per_job_fresh": self.cost_per_job(True), "cost_per_job_resumed": self.cost_per_job(False)}


class JobCosts:
    """Reads what each job of a profile cost: the cost its session reported when the next job on that session
    began, or the session's last reported cost for its last job, less the cost reported when the job began."""

    def __init__(self, queries: Queries, files: StatusFiles) -> None:
        self.queries, self.files = queries, files

    def of_profile(self, profile: str) -> ProfileJobCosts:
        jobs = tuple(self.queries.query(HelperJob).filter(profile=profile).oldest().all_rows())
        next_on_session = self.next_jobs(jobs)
        return ProfileJobCosts(tuple(JobCost(job.new_session, self.dollars(job, next_on_session.get(job.id))) for job in jobs))

    @staticmethod
    def next_jobs(jobs: tuple[HelperJob, ...]) -> dict[int, HelperJob]:
        newest: dict[tuple[int | None, str], HelperJob] = {}
        next_on_session: dict[int, HelperJob] = {}
        for job in jobs:
            earlier = newest.get((job.helper_id, job.session))
            if earlier is not None:
                next_on_session[earlier.id] = job
            newest[(job.helper_id, job.session)] = job
        return next_on_session

    def dollars(self, job: HelperJob, next_job: HelperJob | None) -> float | None:
        reported = self.files.status(job.session).cost_dollars if next_job is None else next_job.cost_baseline
        if reported is None or job.cost_baseline is None or reported < job.cost_baseline:
            return None
        return reported - job.cost_baseline
