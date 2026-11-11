from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.enums.checkpoint_reach_source import CheckpointReachSource


def test_only_a_merged_reach_opens_phases():
    assert [source.opens_phases() for source in CheckpointReachSource] == [True, False, False]


def test_an_early_reach_keeps_is_early():
    reach = CheckpointReach.started_early(1, 2, 3, (4, 5))
    assert (reach.source, reach.is_early) == (CheckpointReachSource.EARLY, True)


def test_a_worker_reach_is_no_early_reach():
    reach = CheckpointReach.started_worker(1, 2, 3, (4,))
    assert (reach.source, reach.is_early) == (CheckpointReachSource.WORKER, False)
