import shlex

from suites.coding.modules.workers.support.checkpoint_test_parts import CheckpointTestParts

COMMAND = ".venv/bin/python -m pytest tests/unit/a.py tests/stories -q"


def listing(counts: dict[str, int]) -> str:
    return "".join(f"{file}::test_{number}\n" for file, count in counts.items() for number in range(count))


def part_test_count(part: str, counts: dict[str, int]) -> int:
    arguments = shlex.split(part)
    return sum(1 for argument in arguments if "::" in argument) + sum(count for file, count in counts.items() if file in arguments)


def test_sixty_tests_run_as_three_parts_of_at_most_twenty_five():
    counts = {"tests/unit/a.py": 20, "tests/stories/b.py": 20, "tests/stories/c.py": 20}
    parts = CheckpointTestParts(COMMAND, listing(counts), 25).commands()
    assert len(parts) == 3 and all(part_test_count(part, counts) <= 25 for part in parts)
    assert all(part.startswith(".venv/bin/python -m pytest -q ") for part in parts)


def test_a_file_over_the_limit_is_split_by_its_test_names():
    counts = {"tests/stories/b.py": 30}
    parts = CheckpointTestParts(COMMAND, listing(counts), 25).commands()
    assert [part_test_count(part, counts) for part in parts] == [25, 5]


def test_a_command_within_the_limit_or_without_a_limit_runs_whole():
    counts = {"tests/unit/a.py": 30}
    assert CheckpointTestParts(COMMAND, listing({"tests/unit/a.py": 10}), 25).commands() == [COMMAND]
    assert CheckpointTestParts(COMMAND, listing(counts), 0).commands() == [COMMAND]
