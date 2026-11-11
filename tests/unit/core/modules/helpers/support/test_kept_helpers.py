from types import SimpleNamespace

from engine.enums.occupant import Occupant
from core.modules.helpers.support.kept_helpers import KeptHelpers
from core.modules.helpers.support.profile_model import ProfileModel

SELECTION = ProfileModel("claude", "sonnet", "reader")
OPEN_JOBS_TABLE = "helper_jobs"


def helper(number: int, program: str = "claude", ended_at: str | None = "2026-10-31", session: str = "kept") -> SimpleNamespace:
    return SimpleNamespace(id=number + 100, number=number, program=program, program_model="sonnet" if program == "claude" else "gpt-6.1-terra", ended_at=ended_at, session=session)


class StoredRows:
    def __init__(self, helpers: list[SimpleNamespace], open_job_ids: set[int]) -> None:
        self.helpers, self.open_job_ids = tuple(helpers), open_job_ids

    def scoped_read(self, table, loader, condition, parameters, *, name):
        return self.open_job_ids if table == OPEN_JOBS_TABLE else self.helpers


def kept_helpers(helpers: list[SimpleNamespace], open_job_ids: frozenset[int] = frozenset(), full_percent: int = 0) -> KeptHelpers:
    provider = SimpleNamespace(session_matches_folder=lambda folder, session: session == "kept")
    return KeptHelpers(None, SimpleNamespace(provider=lambda program: provider), SimpleNamespace(folder=lambda agent: "folder"), StoredRows(helpers, set(open_job_ids)), None,
                       SimpleNamespace(percent=lambda program, session: full_percent), None)


def numbers(kept: KeptHelpers, occupant: Occupant) -> list[int]:
    return [agent.number for agent in kept.idle(SELECTION, occupant)]


def test_the_lowest_idle_number_comes_first_for_every_occupant():
    kept = kept_helpers([helper(5), helper(3), helper(4)])
    assert [numbers(kept, occupant) for occupant in Occupant] == [[3, 4, 5]] * 3


def test_a_running_helper_and_one_with_an_open_job_are_never_idle():
    kept = kept_helpers([helper(3, ended_at=None), helper(4), helper(5)], frozenset({104}))
    assert [numbers(kept, occupant) for occupant in Occupant] == [[5]] * 3


def test_an_each_launch_helper_is_idle_on_another_program_with_a_gone_conversation_and_a_full_context():
    kept = kept_helpers([helper(3, program="codex"), helper(4, session="gone"), helper(5)], full_percent=90)
    assert numbers(kept, Occupant.LAUNCH_ROTATION) == [3, 4, 5]


def test_a_helper_that_keeps_its_session_is_idle_only_on_the_same_program_with_a_session_that_resumes():
    kept = kept_helpers([helper(3, program="codex"), helper(4, session="gone"), helper(5)])
    assert numbers(kept, Occupant.COLD_ROTATION) == [5] and numbers(kept, Occupant.CONTINUE) == [5]


def test_a_nearly_full_session_is_not_idle_for_a_helper_that_keeps_it():
    assert numbers(kept_helpers([helper(5)], full_percent=80), Occupant.COLD_ROTATION) == []
