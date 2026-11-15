from types import SimpleNamespace

from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.record.question import Question
from engine.enums.work_stop import WorkStop
from suites.coding.modules.workers.states.merge_job_states import MergeJobStates

MERGER = AgentReference(9, 1, 1, "merger")


def stacked_state(running_merge: object):
    jobs = SimpleNamespace(open_job=lambda agent_id: SimpleNamespace(id=4))
    merges = [SimpleNamespace(creator_id=MERGER.agent_id, worker_id=running_merge.worker_id)] if running_merge is not None else []
    queries = SimpleNamespace(query=lambda model: SimpleNamespace(filter=lambda **fields: SimpleNamespace(matching=lambda condition: SimpleNamespace(every_row=lambda reason: merges))))
    [required_state] = MergeJobStates(jobs, queries).states([MERGER], Question.none())[MERGER.agent_id]
    return required_state.state


def test_a_merger_with_a_merge_running_may_not_stop_and_names_the_worker():
    state = stacked_state(SimpleNamespace(worker_id=12))
    assert state.work_remains and "worker 12" in state.stop_reason.text and state.stop_answer(WorkStop.MERGE_CONTRACT).refusal_reasons()


def test_a_merger_whose_merges_ended_hands_its_job_in_at_the_stop():
    state = stacked_state(None)
    assert not state.work_remains and not state.stop_answer(WorkStop.MERGE_CONTRACT).refusal_reasons()
