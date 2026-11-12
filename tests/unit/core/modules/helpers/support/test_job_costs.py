from types import SimpleNamespace

from core.modules.helpers.support.job_costs import JobCosts

REPORTED = {"s-1": 1.5, "s-2": 2.5, "s-3": None}


def job(row_id: int, session: str, new_session: bool, cost_baseline: float | None, helper_id: int = 7, ended_at: str | None = "2026-11-12"):
    return SimpleNamespace(id=row_id, helper_id=helper_id, session=session, new_session=new_session, cost_baseline=cost_baseline, ended_at=ended_at)


class JobQuery:
    def __init__(self, jobs, limit: int = 50) -> None:
        self.jobs, self.most = jobs, limit

    def query(self, model):
        return self

    def where(self, **fields):
        return self

    def where_null(self, column):
        return JobQuery([row for row in self.jobs if getattr(row, column) is None], self.most)

    def where_not_null(self, column):
        return JobQuery([row for row in self.jobs if getattr(row, column) is not None], self.most)

    def newest(self):
        return JobQuery(sorted(self.jobs, key=lambda row: -row.id), self.most)

    def take(self, rows):
        return list(self.jobs[:min(rows, self.most)])


def costs(*jobs, limit: int = 50):
    files = SimpleNamespace(status=lambda session: SimpleNamespace(cost_dollars=REPORTED[session]))
    return JobCosts(JobQuery(list(jobs), limit), files).profile_costs("steady")


def test_a_job_costs_what_its_session_reported_when_the_next_job_on_it_began_and_the_last_what_the_session_reported_last():
    counted = costs(job(1, "s-1", True, 0.0), job(2, "s-1", False, 1.0), job(3, "s-2", True, 0.0), job(4, "s-2", False, 2.0))
    assert counted.json() == {"jobs_total": 4, "jobs_fresh": 2, "jobs_resumed": 2, "cost_per_job_fresh": 1.5, "cost_per_job_resumed": 0.5}
    assert (counted.line(True), counted.line(False)) == ("2 jobs on a new session, $1.50 a job", "2 jobs on a resumed session, $0.50 a job")


def test_a_job_with_no_reported_cost_is_counted_and_left_out_of_the_mean():
    counted = costs(job(1, "s-3", True, 0.0), job(2, "s-1", True, None, helper_id=8))
    assert counted.json() == {"jobs_total": 2, "jobs_fresh": 2, "jobs_resumed": 0, "cost_per_job_fresh": None, "cost_per_job_resumed": None}
    assert counted.line(False) == "0 jobs on a resumed session, no cost reported"


def test_a_cost_reported_below_the_cost_at_the_jobs_start_is_not_counted():
    assert costs(job(1, "s-1", False, 2.0)).mean_cost(False) is None


def test_an_open_job_is_counted_and_is_the_following_job_of_the_finished_one_before_it_on_its_session():
    counted = costs(job(1, "s-1", True, 0.0), job(2, "s-1", False, 1.0, ended_at=None))
    assert counted.json() == {"jobs_total": 2, "jobs_fresh": 1, "jobs_resumed": 1, "cost_per_job_fresh": 1.0, "cost_per_job_resumed": 0.5}


def test_the_estimate_uses_the_newest_finished_jobs_put_back_oldest_first():
    counted = costs(job(1, "s-2", True, 0.0), job(2, "s-1", True, 0.0), job(3, "s-1", False, 1.0), limit=2)
    assert counted.json() == {"jobs_total": 2, "jobs_fresh": 1, "jobs_resumed": 1, "cost_per_job_fresh": 1.0, "cost_per_job_resumed": 0.5}
