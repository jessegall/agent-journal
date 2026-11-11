import pytest

from core.modules.processes.models.enums.cadence_state import CadenceState
from core.modules.processes.models.support.cadence_limits import CadenceLimits
from core.modules.processes.support.cadence.run_cadence import RunCadence

LIMITS = CadenceLimits(first_output_seconds=30, stopped_writing_seconds=120, sparse_seconds=30)


def cadence(age: float, growths: tuple[float, ...] = ()) -> RunCadence:
    return RunCadence(age=age, now=age, growths=growths, limits=LIMITS)


@pytest.mark.parametrize("run, state", [
    (cadence(29), CadenceState.STREAMING),
    (cadence(30), CadenceState.NO_OUTPUT),
    (cadence(125, (50,)), CadenceState.SPARSE),
    (cadence(125, (80, 90, 100, 110, 120)), CadenceState.STREAMING),
    (cadence(200, (50, 60, 70, 80)), CadenceState.STOPPED_WRITING),
    (cadence(125, (0, 30, 60, 90, 120)), CadenceState.SPARSE),
    (cadence(125, (4, 33, 62, 91, 120)), CadenceState.STREAMING),
    (cadence(100, (10, 70)), CadenceState.STREAMING),
], ids=["young and silent", "silent at the first output limit", "one print", "printing every 10 s", "stopped writing wins over sparse",
        "30 s apart is sparse", "29 s apart is streaming", "a young run is never sparse"])
def test_the_state_of_each_run(run, state):
    assert run.state() is state


def test_a_run_that_printed_once_has_its_age_split_by_the_gaps_around_the_print():
    assert cadence(125, (50,)).average_pause() == 62.5


def test_growths_with_a_later_time_first_give_no_negative_pause():
    assert cadence(200, (100, 90)).average_pause() == 0.0
