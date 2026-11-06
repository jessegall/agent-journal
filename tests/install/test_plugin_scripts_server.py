import os
import select
import subprocess
import time
from pathlib import Path
from types import SimpleNamespace

from tests.install.support import TIMEOUT_SECONDS
from tests.stories.core.modules.plugins.support.event_stories import EVENT_SCRIPTS, REFUSAL, SECOND_JOB_TITLE, TASK_CREATED, WINDOW, PluginPage, plugin_data, script_calls
from tests.stories.core.modules.plugins.support.plugin_samples import event_plugin_folder
from tests.stories.server.support.server_client import ServerStory

SECOND_JOB_LINE = ["task", "make", SECOND_JOB_TITLE, "--brief", "Do it", "--environment", "main"]
TASK_UPDATED = "core.tasks.task.updated"
STARTED_LIMIT_SECONDS = 30
READ_SLICE_SECONDS = 0.2


def run_line(journal, client: Path, *line: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run([str(client), *line], env=journal.environment(), cwd=journal.home.folder.parent, capture_output=True, text=True, timeout=TIMEOUT_SECONDS)


def expect_line(journal, client: Path, *line: str) -> str:
    finished = run_line(journal, client, *line)
    assert finished.returncode == 0, finished.stdout + finished.stderr
    return finished.stdout


def own_journal_line(journal, client: Path, *line: str) -> str:
    """The shell text of a script that runs the journal itself, and adds its exit code to the file own-write."""
    words = " ".join(f"'{word}'" for word in line)
    variables = " ".join(f"{name}='{value}'" for name, value in journal.environment().items() if name != "PATH")
    return f"""{variables} '{client}' {words} > /dev/null\necho $? >> "$JOURNAL_PLUGIN_DATA/own-write\""""


def own_write(journal) -> list[str]:
    written = plugin_data(journal, "own-write")
    return written.read_text().split() if written.is_file() else []


def start_with_plugin(journal, client: Path, entry: dict[str, str], script: str) -> None:
    journal.start_server()
    journal.wait_healthy()
    expect_line(journal, client, "environment", "make", "main", str(journal.home.folder.parent))
    expect_line(journal, client, "task", "make", "Fix the cart", "--environment", "main")
    folder = event_plugin_folder(journal.home.folder.parent / "sources", [entry], {"script.sh": script})
    expect_line(journal, client, "plugin", "install", str(folder), "--yes")


def wait_for_line(pipe: Path, running: subprocess.Popen[str]) -> str:
    """The first line a script writes to the named pipe, read as it arrives; a command that ends first ends the wait."""
    reader = os.open(pipe, os.O_RDWR | os.O_NONBLOCK)
    deadline = time.monotonic() + STARTED_LIMIT_SECONDS
    try:
        while time.monotonic() < deadline:
            if select.select([reader], [], [], READ_SLICE_SECONDS)[0]:
                return os.read(reader, 4096).decode()
            assert running.poll() is None, f"the command ended before its script started: {running.communicate()}"
    finally:
        os.close(reader)
    raise AssertionError("the script never started")


def test_s29_a_script_that_writes_through_the_journal_does_not_wait_or_start_itself(journal, client):
    start_with_plugin(journal, client, {"event": TASK_CREATED, "listen": "script.sh"}, own_journal_line(journal, client, "task", "log", "1", "seen"))
    expect_line(journal, client, *SECOND_JOB_LINE)
    assert len(script_calls(journal, "script.sh")) == 1 and own_write(journal) == ["0"], (script_calls(journal, "script.sh"), own_write(journal))
    assert "seen" in expect_line(journal, client, "task", "inspect", "1")
    assert expect_line(journal, client, "task", "list").count(SECOND_JOB_TITLE) == 1


def test_s29_a_script_that_writes_the_same_row_causes_no_stale_row_error(journal, client):
    start_with_plugin(journal, client, {"event": TASK_UPDATED, "listen": "script.sh"}, own_journal_line(journal, client, "task", "edit", "1", "--brief", "Changed by the script"))
    expect_line(journal, client, "task", "edit", "1", "--title", "A new title")
    details = expect_line(journal, client, "task", "show", "1")
    assert "A new title" in details and "Changed by the script" in details, details
    assert len(script_calls(journal, "script.sh")) == 1


def test_s29_when_the_change_is_then_refused_the_own_write_of_the_script_stays(journal, client):
    script = f'{own_journal_line(journal, client, "task", "log", "1", "seen")}\n{EVENT_SCRIPTS["refuse.sh"]}'
    start_with_plugin(journal, client, {"event": TASK_CREATED, "guard": "script.sh"}, script)
    finished = run_line(journal, client, *SECOND_JOB_LINE)
    assert finished.returncode == 1 and REFUSAL in finished.stdout + finished.stderr, finished.stdout + finished.stderr
    assert "seen" in expect_line(journal, client, "task", "inspect", "1")
    assert SECOND_JOB_TITLE not in expect_line(journal, client, "task", "list")


def test_s25_a_script_that_never_ends_shows_on_the_card_and_switching_off_stops_it_and_the_command_finishes(journal, client):
    started, never_written = journal.home.folder.parent / "started", journal.home.folder.parent / "never-written"
    os.mkfifo(started)
    os.mkfifo(never_written)
    start_with_plugin(journal, client, {"event": TASK_CREATED, "guard": "script.sh"}, f"echo started > '{started}'\nread answer < '{never_written}'")
    expect_line(journal, client, "actor", "make", "user", "Ada")
    server = ServerStory(SimpleNamespace(steps=[]), journal.home.socket("server"), None)
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    page = PluginPage(journal, lambda line: server.viewer_line_value(cookie, {"window": WINDOW, "line": line, "environment": "main"}))
    running =subprocess.Popen([str(client), *SECOND_JOB_LINE], env=journal.environment(), cwd=journal.home.folder.parent, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    try:
        assert "started" in wait_for_line(started, running)
        assert any(row["form"] == "guard" and row["running_since"] for row in page.card()), page.card()
        page.switch_off()
        stdout, stderr = running.communicate(timeout=TIMEOUT_SECONDS)
    finally:
        if running.poll() is None:
            running.kill()
            running.communicate()
    assert running.returncode == 0, stdout + stderr
    assert expect_line(journal, client, "task", "list").count(SECOND_JOB_TITLE) == 1
    assert page.plugin()["enabled"] is False
