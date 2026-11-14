import pytest

from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.helper_reuse import HelperReuse
from core.modules.helpers.support.job_costs import JobCosts
from core.modules.helpers.support.kept_helpers import KeptHelpers
from engine.query.queries import Queries
from tests.integration.support.seeded_rows import limit_reads, seeded
from tests.stories.core.support.seeds.large_read_seeds import SEEDED_PROFILE, EndedChildHelperSeed, FinishedHelperJobSeed
from tests.stories.core.support.seeds.project_seeds import AgentActorSeed

"""Book 3 of doc 1255: the helper reads that grew past the read limit give the same answer on a few rows and read at
most 51 rows in a statement on many."""

MANY_JOBS = 1200
HELPER_NUMBER = -5000


# the main agent and one ended helper of it, seeded as a row since starting a helper needs the read-only sandbox
@pytest.fixture
def parent_and_helper(journal) -> tuple[int, Agent]:
    parent_id = journal.new_row_id("agent start s-1 claude main --environment main")
    actor_id = seeded(journal, AgentActorSeed, 1)[0]
    seeded(journal, EndedChildHelperSeed, 1, id=actor_id, number=HELPER_NUMBER, parent_id=parent_id, profile=SEEDED_PROFILE, session="seeded-helper-session")
    return parent_id, journal.container.get(Queries).query(Agent).find(actor_id)


def test_helper_start_finds_a_known_job_among_1200_jobs_reading_at_most_51_rows_per_statement(journal, parent_and_helper):
    parent_id, helper = parent_and_helper
    seeded(journal, FinishedHelperJobSeed, MANY_JOBS, session_agent_id=parent_id, helper_id=helper.id)
    limit_reads(journal)
    known = journal.container.get(HelperReuse).known_job(parent_id, SEEDED_PROFILE, "Read src/seeded/file_3.py again")
    assert known is not None and known.instruction == "Read src/seeded/file_3.py"


def test_helper_start_still_reuses_a_helper_whose_finished_job_mentions_the_same_path(journal, parent_and_helper):
    parent_id, helper = parent_and_helper
    seeded(journal, FinishedHelperJobSeed, 3, session_agent_id=parent_id, helper_id=helper.id)
    known = journal.container.get(HelperReuse).known_job(parent_id, SEEDED_PROFILE, "Look at src/seeded/file_1.py")
    assert known is not None and known.helper_id == helper.id


def test_helper_send_asks_for_an_open_job_of_one_helper_and_reads_one_row(journal, parent_and_helper):
    parent_id, helper = parent_and_helper
    seeded(journal, FinishedHelperJobSeed, MANY_JOBS, session_agent_id=parent_id, helper_id=helper.id)
    limit_reads(journal)
    kept = journal.container.get(KeptHelpers)
    assert not kept.has_open_job(helper)
    seeded(journal, FinishedHelperJobSeed, 1, session_agent_id=parent_id, helper_id=helper.id, ended_at=None, tool_key="open-job")
    assert kept.has_open_job(helper)


def test_job_costs_use_the_newest_fifty_finished_jobs_and_give_the_same_estimate_on_few_jobs(journal, parent_and_helper):
    parent_id, helper = parent_and_helper
    seeded(journal, FinishedHelperJobSeed, 3, session_agent_id=parent_id, helper_id=helper.id)
    few = journal.container.get(JobCosts).profile_costs(SEEDED_PROFILE)
    # the costs read jobs by profile alone, so the many jobs may sit under another agent of the same profile
    seeded(journal, FinishedHelperJobSeed, MANY_JOBS, session_agent_id=helper.id, helper_id=helper.id)
    limit_reads(journal)
    many = journal.container.get(JobCosts).profile_costs(SEEDED_PROFILE)
    # on a few jobs the newest fifty are every job, so the estimate is the one the whole read gave; on many it uses fifty
    assert (few.count(True), many.count(True)) == (3, 50)
