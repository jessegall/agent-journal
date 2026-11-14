from datetime import datetime, timezone

from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_fold_plan import MainFoldPlan

ENDED = Timestamp(datetime(2026, 11, 1, tzinfo=timezone.utc))


def main(row_id: int, environment_id: int = 5, number: int = 0, ended: bool = True, role: str = "main") -> Agent:
    return Agent(id=row_id, environment_id=environment_id, number=number, creator_id=1, session=f"s-{row_id}", program="claude", role=role,
                 ended_at=ENDED if ended else None)


def test_the_running_main_row_survives_over_the_one_numbered_1():
    fold = MainFoldPlan.folds([main(894, number=1), main(78, number=33, ended=False), main(30, number=12)])[0]
    assert (fold.survivor.id, sorted(agent.id for agent in fold.folded)) == (78, [30, 894])


def test_with_none_running_the_one_numbered_1_survives():
    fold = MainFoldPlan.folds([main(894, number=1), main(900, number=40)])[0]
    assert (fold.survivor.id, [agent.id for agent in fold.folded]) == (894, [900])


def test_with_none_running_and_none_numbered_1_the_newest_survives():
    fold = MainFoldPlan.folds([main(10, number=3), main(20, number=4)])[0]
    assert fold.survivor.id == 20


def test_an_environment_with_one_main_row_folds_nothing_and_helpers_are_left_alone():
    assert MainFoldPlan.folds([main(1, number=1), main(2, number=2, role="helper"), main(3, environment_id=6, number=1)]) == ()


def test_each_environment_folds_on_its_own():
    folds = MainFoldPlan.folds([main(1, number=1), main(2, number=2), main(3, environment_id=6, number=1), main(4, environment_id=6, number=5)])
    assert [(fold.environment_id, fold.survivor.id) for fold in folds] == [(5, 1), (6, 3)]
