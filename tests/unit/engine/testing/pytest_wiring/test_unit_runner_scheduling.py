from engine.testing.pytest_wiring.unit_runner_scheduling import UnitRunnerScheduling

COLLECTION = ["tests/unit/test_a.py::test_one", "tests/stories/plans.py::test_plan", "tests/unit/test_b.py::test_two", "tests/stories/tasks.py::test_task",
              "tests/stories/tasks.py::test_close", "tests/stories/tasks.py::test_block", "tests/stories/tasks.py::test_start"]


class FakeRunner:
    """A runner that keeps the test numbers it was sent."""

    def __init__(self) -> None:
        self.sent: list[int] = []
        self.shutting_down = False

    def send_runtest_some(self, indices: list[int]) -> None:
        self.sent.extend(indices)

    def send_steal(self, indices: list[int]) -> None:
        pass

    def shutdown(self) -> None:
        self.shutting_down = True


def scheduled(collection: list[str], runner_count: int) -> list[FakeRunner]:
    scheduling = UnitRunnerScheduling.__new__(UnitRunnerScheduling)
    scheduling.numnodes, scheduling.node2collection, scheduling.node2pending = runner_count, {}, {}
    scheduling.pending, scheduling.collection, scheduling.steal_requested_from_node = [], None, None
    scheduling.log, scheduling.config = lambda *words: None, None
    runners = [FakeRunner() for _ in range(runner_count)]
    for runner in runners:
        scheduling.add_node(runner)
        scheduling.add_node_collection(runner, collection)
    scheduling.schedule()
    return runners


def names(runner: FakeRunner, collection: list[str]) -> list[str]:
    return [collection[index] for index in runner.sent]


def test_the_scheduler_sends_unit_node_ids_to_one_runner():
    runners = scheduled(COLLECTION, 3)
    units = [[name for name in names(runner, COLLECTION) if name.startswith("tests/unit/")] for runner in runners]
    assert units[0] == ["tests/unit/test_a.py::test_one", "tests/unit/test_b.py::test_two"] and units[1:] == [[], []]


def test_a_story_node_id_may_go_to_any_runner():
    runners = scheduled(COLLECTION, 3)
    stories = {name for runner in runners[1:] for name in names(runner, COLLECTION)}
    assert stories == {name for name in COLLECTION if name.startswith("tests/stories/")}


def test_a_run_with_no_unit_tests_behaves_as_worksteal():
    story_names = [name for name in COLLECTION if name.startswith("tests/stories/")]
    runners = scheduled(story_names, 2)
    assert sorted(index for runner in runners for index in runner.sent) == list(range(len(story_names))) and all(runner.sent for runner in runners)
