import io
import os

from core.base.cli.shell_handoff import RUNNER_VARIABLE, UNWATCHED_LINES_SHOWN, ShellHandoff
from core.base.cli.shell_run import ShellRun


def run_line(line: str) -> tuple[int, str]:
    stream = io.StringIO()
    code = ShellHandoff().run(ShellRun(line, {}, ""), stream)
    return code, stream.getvalue()


def test_under_the_runner_every_line_is_printed(monkeypatch):
    monkeypatch.setenv(RUNNER_VARIABLE, "1")
    code, printed = run_line("seq 1 100")
    assert code == 0
    assert len(printed.splitlines()) == 100


def test_with_no_runner_only_the_last_lines_are_printed(monkeypatch):
    monkeypatch.delenv(RUNNER_VARIABLE, raising=False)
    code, printed = run_line("seq 1 1000; exit 3")
    assert code == 3
    assert printed.splitlines()[-1] == "1000"
    assert len(printed.splitlines()) == UNWATCHED_LINES_SHOWN


def test_with_no_runner_a_long_run_goes_on_by_itself_and_says_where_its_output_is(monkeypatch, tmp_path):
    monkeypatch.delenv(RUNNER_VARIABLE, raising=False)
    monkeypatch.setattr("core.base.cli.shell_handoff.UNWATCHED_LIMIT_SECONDS", 0.1)
    marker = tmp_path / "ended"
    code, printed = run_line(f"sleep 0.3; touch {marker}")
    assert code == 0
    assert "moved to the background" in printed
    assert os.path.exists(printed.rsplit(" ", 1)[-1].strip())
