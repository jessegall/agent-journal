import io
import os

from core.base.cli.shell_handoff import RUNNER_VARIABLE, UNWATCHED_LINES_SHOWN, ShellHandoff
from core.base.cli.shell_run import ShellRun


def run_line(line: str, variables: dict[str, str]) -> tuple[int, str]:
    stream = io.StringIO()
    code = ShellHandoff().run(ShellRun(line, variables, ""), stream)
    return code, stream.getvalue()


def test_a_caller_under_the_runner_gets_every_line():
    code, output_text = run_line("seq 1 100", {RUNNER_VARIABLE: "1"})
    assert code == 0
    assert len(output_text.splitlines()) == 100


def test_a_caller_with_no_runner_gets_only_the_last_lines():
    code, output_text = run_line("seq 1 1000; exit 3", {})
    assert code == 3
    assert output_text.splitlines()[-1] == "1000"
    assert len(output_text.splitlines()) == UNWATCHED_LINES_SHOWN


def test_a_caller_with_no_runner_leaves_a_long_run_going_and_is_told_where_its_output_is(monkeypatch, tmp_path):
    monkeypatch.setattr("core.base.cli.shell_handoff.UNWATCHED_LIMIT_SECONDS", 0.1)
    marker = tmp_path / "ended"
    code, output_text = run_line(f"sleep 0.3; touch {marker}", {})
    assert code == 0
    assert "moved to the background" in output_text
    assert os.path.exists(output_text.rsplit(" ", 1)[-1].strip())
