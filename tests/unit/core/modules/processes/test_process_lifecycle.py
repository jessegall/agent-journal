from core.base.driver.command_category import CommandCategory
from core.modules.processes.models.enums.output_state import OutputState
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.lifecycles.output_lifecycle import OutputLifecycle
from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle
from core.modules.processes.models.lifecycles.watch_lifecycle import WatchLifecycle
from core.modules.processes.models.enums.watch_state import WatchState

ENDINGS = (ProcessLifecycle.finish, ProcessLifecycle.fail, ProcessLifecycle.stop, ProcessLifecycle.lose)


def test_a_process_starts_running_and_moves_to_the_background_only_from_running():
    assert ProcessLifecycle.initial == [ProcessState.RUNNING]
    assert tuple(ProcessLifecycle.background.sources) == (ProcessState.RUNNING,) and ProcessLifecycle.background.target == ProcessState.BACKGROUND


def test_a_running_or_background_process_ends_in_one_of_four_states_and_an_ended_one_goes_no_further():
    for move in ENDINGS:
        assert set(move.sources) == {ProcessState.RUNNING, ProcessState.BACKGROUND}
    assert {move.target for move in ENDINGS} == {ProcessState.FINISHED, ProcessState.FAILED, ProcessState.STOPPED, ProcessState.LOST}
    assert all(not ProcessLifecycle.outgoing_moves(state) for state in (ProcessState.FINISHED, ProcessState.FAILED, ProcessState.STOPPED, ProcessState.LOST))


def test_an_output_is_kept_then_pruned_once_and_a_watch_is_open_then_ended_once():
    assert OutputLifecycle.initial == [OutputState.KEPT] and not OutputLifecycle.outgoing_moves(OutputState.PRUNED)
    assert WatchLifecycle.initial == [WatchState.OPEN] and not WatchLifecycle.outgoing_moves(WatchState.ENDED)


def test_the_command_category_the_process_keeps_is_the_runners_own():
    assert CommandCategory.UNKNOWN in CommandCategory
