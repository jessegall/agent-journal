import shlex
from pathlib import Path

from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.runner_line import RunnerLine


def tokens(run: ForegroundRun) -> list[str]:
    return shlex.split(RunnerLine.build(Path("/bin/journal-run"), 7, run, "npm test | tail -5", "session"))


def test_each_test_or_build_goes_to_the_runner_by_its_own_flag():
    line = tokens(ForegroundRun(15, False, stripped=("npm test", "make 'a b'")))
    assert [line[index + 1] for index, token in enumerate(line) if token == "--stripped"] == ["npm test", "make 'a b'"]


def test_a_line_with_no_test_or_build_has_no_stripped_flag():
    assert "--stripped" not in tokens(ForegroundRun(15, False))


def test_the_output_limit_goes_to_the_runner_in_bytes():
    line = tokens(ForegroundRun(15, False, most_output_bytes=1024))
    assert line[line.index("--most-output") + 1] == "1024"


def test_a_journal_line_has_no_output_limit():
    assert "--most-output" not in tokens(ForegroundRun(0, False))


def test_the_line_stays_as_the_agent_wrote_it():
    assert tokens(ForegroundRun(15, False, stripped=tuple(["npm test"])))[-1] == "npm test | tail -5"
