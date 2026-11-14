import os
import shlex
from pathlib import Path

from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.runner_line import MOST_OUTPUT_VARIABLE, READ_FLAGS_VARIABLE, READ_FOLDERS_VARIABLE, RunnerLine


def built(run: ForegroundRun) -> list[str]:
    return shlex.split(RunnerLine.build(Path("/bin/journal-run"), 7, run, "npm test", "session"))


def variable(tokens: list[str], name: str) -> str | None:
    return next((token.split("=", 1)[1] for token in tokens if token.startswith(f"{name}=")), None)


def test_the_read_flags_of_a_saved_command_go_to_the_runner_by_position():
    assert variable(built(ForegroundRun(15, False, read_flags=("1:tail:5", "3:cut:10-20"))), READ_FLAGS_VARIABLE) == "1:tail:5,3:cut:10-20"


def test_a_line_with_no_saved_command_has_no_read_flags():
    assert variable(built(ForegroundRun(15, False)), READ_FLAGS_VARIABLE) is None


def test_the_output_limit_goes_to_the_runner_in_bytes():
    assert variable(built(ForegroundRun(15, False, most_output_bytes=1024)), MOST_OUTPUT_VARIABLE) == "1024"


def test_the_read_folders_go_to_the_runner_in_one_variable_never_as_a_flag():
    tokens = built(ForegroundRun(15, False, read_folders=(Path("/project/.rules"), Path("/project/with space"))))
    assert variable(tokens, READ_FOLDERS_VARIABLE) == f"/project/.rules{os.pathsep}/project/with space"
    assert not [token for token in tokens if token.startswith("--read")]


def test_no_read_folders_send_no_variable():
    assert variable(built(ForegroundRun(15, False)), READ_FOLDERS_VARIABLE) is None


def test_no_limit_given_sends_no_variable():
    assert variable(built(ForegroundRun(0, False)), MOST_OUTPUT_VARIABLE) is None


def test_no_flag_reaches_an_older_runner():
    assert "--most-output" not in built(ForegroundRun(15, False, most_output_bytes=1024))


def test_the_line_stays_as_the_agent_wrote_it():
    assert built(ForegroundRun(15, False))[-1] == "npm test"


