import shlex
from pathlib import Path

from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.runner_line import MOST_OUTPUT_VARIABLE, STRIPPED_VARIABLE, RunnerLine


def built(run: ForegroundRun) -> list[str]:
    return shlex.split(RunnerLine.build(Path("/bin/journal-run"), 7, run, "npm test | tail -5", "session"))


def variable(tokens: list[str], name: str) -> str | None:
    return next((token.split("=", 1)[1] for token in tokens if token.startswith(f"{name}=")), None)


def test_each_test_or_build_goes_to_the_runner_on_its_own_line_of_the_variable():
    tokens = built(ForegroundRun(15, False, stripped=("npm test", "make 'a b'")))
    assert variable(tokens, STRIPPED_VARIABLE) == "npm test\nmake 'a b'"


def test_a_line_with_no_test_or_build_has_no_stripped_variable():
    assert variable(built(ForegroundRun(15, False)), STRIPPED_VARIABLE) is None


def test_the_output_limit_goes_to_the_runner_in_bytes():
    assert variable(built(ForegroundRun(15, False, most_output_bytes=1024)), MOST_OUTPUT_VARIABLE) == "1024"


def test_a_journal_line_has_no_output_limit():
    assert variable(built(ForegroundRun(0, False)), MOST_OUTPUT_VARIABLE) is None


def test_no_flag_reaches_an_older_runner():
    tokens = built(ForegroundRun(15, False, stripped=tuple(["npm test"]), most_output_bytes=1024))
    assert "--stripped" not in tokens and "--most-output" not in tokens


def test_the_line_stays_as_the_agent_wrote_it():
    assert built(ForegroundRun(15, False, stripped=tuple(["npm test"])))[-1] == "npm test | tail -5"
