from engine.testing.runs.run_durations import RunDurations


def test_a_test_adds_up_its_setup_call_and_teardown_seconds():
    durations = RunDurations()
    for seconds in (0.5, 1.0, 0.25):
        durations.add("tests/unit/a/test_one.py::test_one", seconds)
    assert durations.seconds == {"tests/unit/a/test_one.py::test_one": 1.75}


def test_the_slowest_lines_are_the_longest_tests_first_up_to_the_count():
    durations = RunDurations({"tests/a.py::test_fast": 0.1, "tests/a.py::test_slow": 9.0, "tests/b.py::test_middle": 2.0})
    lines = durations.slowest_lines(2)
    assert [line.split()[1] for line in lines] == ["tests/a.py::test_slow", "tests/b.py::test_middle"]


def test_the_folder_lines_total_the_tests_of_each_folder_largest_first():
    durations = RunDurations({"tests/unit/x/test_a.py::test_one": 1.0, "tests/unit/x/test_b.py::test_two": 2.0, "tests/unit/y/test_c.py::test_three": 2.5})
    assert [line.split() for line in durations.folder_lines()] == [["3.00", "tests/unit/x"], ["2.50", "tests/unit/y"]]


def test_durations_written_to_a_file_read_back(tmp_path):
    file = tmp_path / "durations.json"
    RunDurations({"tests/a.py::test_one": 1.5}).write(file)
    assert RunDurations.read(file).seconds == {"tests/a.py::test_one": 1.5}


def test_reading_a_missing_file_gives_no_durations(tmp_path):
    assert RunDurations.read(tmp_path / "none.json").seconds == {}
