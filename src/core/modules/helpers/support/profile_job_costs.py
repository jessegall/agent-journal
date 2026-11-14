from dataclasses import dataclass

from core.modules.helpers.support.job_cost import JobCost

COST_DECIMALS = 4


@dataclass(frozen=True)
class ProfileJobCosts:
    """The jobs of one profile, counted by whether they began a new program session or resumed one, with the
    mean cost of a job of each."""

    jobs: tuple[JobCost, ...]

    def count(self, new_session: bool) -> int:
        return len([job for job in self.jobs if job.new_session is new_session])

    def mean_cost(self, new_session: bool) -> float | None:
        reported_costs = [job.dollars for job in self.jobs if job.new_session is new_session and job.dollars is not None]
        return round(sum(reported_costs) / len(reported_costs), COST_DECIMALS) if reported_costs else None

    def line(self, new_session: bool) -> str:
        cost = self.mean_cost(new_session)
        session = "a new session" if new_session else "a resumed session"
        return f"{self.count(new_session)} jobs on {session}, {'no cost reported' if cost is None else f'${cost:.2f} a job'}"

    def json(self) -> dict[str, object]:
        return {"jobs_total": len(self.jobs), "jobs_fresh": self.count(True), "jobs_resumed": self.count(False),
                "cost_per_job_fresh": self.mean_cost(True), "cost_per_job_resumed": self.mean_cost(False)}
