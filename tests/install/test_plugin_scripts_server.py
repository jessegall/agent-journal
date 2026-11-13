import json
import os
import select
import shlex
import sqlite3
import subprocess
import time
from pathlib import Path
from types import SimpleNamespace

from tests.stories.server.support.go_build import GoBuild
from tests.install.support import TIMEOUT_SECONDS
from tests.stories.core.modules.plugins.support.event_stories import EVENT_SCRIPTS, REFUSAL, SECOND_JOB_TITLE, TASK_CREATED, WINDOW, PluginPage, plugin_data, script_calls
from tests.stories.core.modules.plugins.support.plugin_samples import event_plugin_folder
from tests.stories.server.support.server_client import ServerStory
from engine.time.polled_wait import PolledWait

SECOND_JOB_LINE = ["task", "make", SECOND_JOB_TITLE, "--brief", "Do it", "--environment", "main"]
TASK_UPDATED = "core.tasks.task.updated"
STARTED_LIMIT_SECONDS = 30
READ_SLICE_SECONDS = 0.2
LATER_JOB_TITLE = "Later job"
MINUTE_SECONDS = 60


def run_line(journal, client: Path, *line: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run([str(client), *line], env=journal.environment(), cwd=journal.home.folder.parent, capture_output=True, text=True, timeout=TIMEOUT_SECONDS)


def expect_line(journal, client: Path, *line: str) -> str:
    completed = run_line(journal, client, *line)
    assert completed.returncode == 0, completed.stdout + completed.stderr
    return completed.stdout


def journal_line(journal, client: Path, *line: str) -> str:
    """The shell text that runs the journal with the variables of this test's journal."""
    variables = " ".join(f"{name}={shlex.quote(value)}" for name, value in journal.environment().items() if name != "PATH")
    return f"{variables} {shlex.join([str(client), *line])}"


def plugin_journal_line(journal, client: Path, *line: str) -> str:
    return f"""{journal_line(journal, client, *line)} > /dev/null\necho $? >> "$JOURNAL_PLUGIN_DATA/own-write\""""


def script_exit_codes(journal) -> list[str]:
    output_file = plugin_data(journal, "own-write")
    return output_file.read_text().split() if output_file.is_file() else []


def start_with_plugin(journal, client: Path, entry: dict[str, str], script: str, *extra_entries: dict[str, str], scripts: dict[str, str] | None = None) -> None:
    journal.start_server()
    journal.wait_healthy()
    expect_line(journal, client, "environment", "make", "main", str(journal.home.folder.parent))
    expect_line(journal, client, "task", "make", "Fix the cart", "--environment", "main")
    folder = event_plugin_folder(journal.home.folder.parent / "sources", [entry, *extra_entries], {"script.sh": script, **(scripts or {})})
    expect_line(journal, client, "plugin", "install", str(folder), "--yes")


def poll_line(pipe: Path, process: subprocess.Popen[str] | None = None, limit_seconds: float = STARTED_LIMIT_SECONDS) -> str:
    """The first line a script writes to the named pipe, read as it arrives; a command that ends first ends the wait."""
    reader = os.open(pipe, os.O_RDWR | os.O_NONBLOCK)
    deadline = time.monotonic() + limit_seconds
    try:
        while time.monotonic() < deadline:
            if select.select([reader], [], [], READ_SLICE_SECONDS)[0]:
                return os.read(reader, 4096).decode()
            assert process is None or process.poll() is None, f"the command ended before its script started: {process.communicate()}"
    finally:
        os.close(reader)
    raise AssertionError("the script never started")


def expect_process_ended(pid: int) -> None:
    assert PolledWait(STARTED_LIMIT_SECONDS, READ_SLICE_SECONDS).poll(lambda: not process_exists(pid)), f"process {pid} is still running"


def process_exists(pid: int) -> bool:
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return False
    return True


def viewer_page(journal) -> PluginPage:
    server = ServerStory(SimpleNamespace(steps=[]), journal.home.socket("server"), None)
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    return PluginPage(journal, lambda line: server.viewer_line_value(cookie, {"window": WINDOW, "line": line, "environment": "main"}))


def started_agent(journal, client: Path) -> None:
    (journal.home.folder / "bin").mkdir(exist_ok=True)
    GoBuild.built("journal-run", journal.home.folder / "bin" / "journal-run")
    details = expect_line(journal, client, "agent", "start", "s-1", "claude", "main", "--environment", "main", "--json")
    (journal.home.folder.parent / "agent-id").write_text(str(json.loads(details.splitlines()[0])["id"]))


def agent_run_line(journal, client: Path, command: str) -> str:
    """The shell text that runs a command in the checkout of the agent started_agent wrote down, once it is started."""
    line = plugin_journal_line(journal, client, "plugin", "run", "--agent", "AGENT_ID", "--", "sh", "-c", command)
    return line.replace("AGENT_ID", f'"$(cat {shlex.quote(str(journal.home.folder.parent / "agent-id"))})"')


def test_s29_a_script_that_writes_through_the_journal_does_not_wait_or_start_itself(journal, client):
    start_with_plugin(journal, client, {"event": TASK_CREATED, "listen": "script.sh"}, plugin_journal_line(journal, client, "task", "log", "1", "seen"))
    expect_line(journal, client, *SECOND_JOB_LINE)
    assert len(script_calls(journal, "script.sh")) == 1 and script_exit_codes(journal) == ["0"], (script_calls(journal, "script.sh"), script_exit_codes(journal))
    assert "seen" in expect_line(journal, client, "task", "overview", "1")
    assert expect_line(journal, client, "task", "list").count(SECOND_JOB_TITLE) == 1


def test_s29_a_script_that_writes_the_same_row_causes_no_stale_row_error(journal, client):
    start_with_plugin(journal, client, {"event": TASK_UPDATED, "listen": "script.sh"}, plugin_journal_line(journal, client, "task", "edit", "1", "--brief", "Changed by the script"))
    expect_line(journal, client, "task", "edit", "1", "--title", "A new title")
    details = expect_line(journal, client, "task", "show", "1")
    assert "A new title" in details and "Changed by the script" in details
    assert len(script_calls(journal, "script.sh")) == 1


def test_s29_when_the_change_is_then_refused_the_plugin_write_result_of_the_script_stays(journal, client):
    script = f'{plugin_journal_line(journal, client, "task", "log", "1", "seen")}\n{EVENT_SCRIPTS["refuse.sh"]}'
    start_with_plugin(journal, client, {"event": TASK_CREATED, "guard": "script.sh"}, script)
    completed = run_line(journal, client, *SECOND_JOB_LINE)
    assert completed.returncode == 1 and REFUSAL in completed.stdout + completed.stderr, completed.stdout + completed.stderr
    assert "seen" in expect_line(journal, client, "task", "overview", "1")
    assert SECOND_JOB_TITLE not in expect_line(journal, client, "task", "list")


def test_s25_a_script_that_never_ends_shows_on_the_card_and_switching_off_stops_it_and_the_command_finishes(journal, client):
    start_pipe, blocked_pipe = journal.home.folder.parent / "started", journal.home.folder.parent / "never-written"
    os.mkfifo(start_pipe)
    os.mkfifo(blocked_pipe)
    start_with_plugin(journal, client, {"event": TASK_CREATED, "guard": "script.sh"}, f"echo started > '{start_pipe}'\nread answer < '{blocked_pipe}'")
    expect_line(journal, client, "actor", "make", "user", "Ada")
    page = viewer_page(journal)
    process = subprocess.Popen([str(client), *SECOND_JOB_LINE], env=journal.environment(), cwd=journal.home.folder.parent, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    try:
        assert "started" in poll_line(start_pipe, process)
        assert any(row["form"] == "guard" and row["started_at"] for row in page.card()), page.card()
        page.disable()
        stdout, stderr = process.communicate(timeout=TIMEOUT_SECONDS)
    finally:
        if process.poll() is None:
            process.kill()
            process.communicate()
    assert process.returncode == 0, stdout + stderr
    assert expect_line(journal, client, "task", "list").count(SECOND_JOB_TITLE) == 1
    assert page.plugin()["enabled"] is False


def test_s17_a_commit_script_that_never_ends_holds_up_no_listener_and_a_server_stop_ends_it(journal, client):
    start_pipe, blocked_pipe = journal.home.folder.parent / "started", journal.home.folder.parent / "never-written"
    script_pid = journal.home.folder.parent / "script-pid"
    os.mkfifo(start_pipe)
    os.mkfifo(blocked_pipe)
    start_with_plugin(journal, client, {"event": TASK_CREATED, "commit": "script.sh"}, f"echo $$ > '{script_pid}'\necho started > '{start_pipe}'\nread answer < '{blocked_pipe}'")
    expect_line(journal, client, *SECOND_JOB_LINE)
    assert "started" in poll_line(start_pipe)
    expect_line(journal, client, "task", "make", LATER_JOB_TITLE, "--brief", "Do it", "--environment", "main")
    assert PolledWait(STARTED_LIMIT_SECONDS, READ_SLICE_SECONDS).poll(
        lambda: LATER_JOB_TITLE in expect_line(journal, client, "chat-mark", "list", "--environment", "main")), "the journal's own listeners waited on the script"
    journal.stop_with(client)
    expect_process_ended(int(script_pid.read_text()))


def test_a_commit_delivery_a_server_stop_cut_short_and_one_still_queued_run_after_the_restart(journal, client):
    started, unwritten_pipe, run_log = (journal.home.folder.parent / name for name in ("started", "never-written", "calls"))
    os.mkfifo(started)
    os.mkfifo(unwritten_pipe)
    script = f"""echo run >> '{run_log}'\nif [ "$(wc -l < '{run_log}' | tr -d ' ')" = 1 ]; then echo started > '{started}'; read answer < '{unwritten_pipe}'; fi"""
    start_with_plugin(journal, client, {"event": TASK_CREATED, "commit": "script.sh"}, script)
    expect_line(journal, client, *SECOND_JOB_LINE)
    assert "started" in poll_line(started)
    expect_line(journal, client, "task", "make", LATER_JOB_TITLE, "--brief", "Do it", "--environment", "main")
    journal.stop_with(client)
    assert run_log.read_text().split() == ["run"]
    journal.start_server()
    journal.wait_healthy()
    assert PolledWait(STARTED_LIMIT_SECONDS, READ_SLICE_SECONDS).poll(lambda: len(run_log.read_text().split()) >= 3), run_log.read_text()


def test_s58_a_journal_line_inside_plugin_run_stays_marked_as_the_plugin(journal, client):
    finish_pipe = journal.home.folder.parent / "finished"
    os.mkfifo(finish_pipe)
    inner = journal_line(journal, client, "task", "edit", "1", "--title", "Written inside the run")
    script = f'{agent_run_line(journal, client, inner)}\necho finished > \'{finish_pipe}\''
    start_with_plugin(journal, client, {"event": "core.pins.pin.created", "commit": "script.sh"}, script, {"event": TASK_UPDATED, "guard": "refuse.sh"}, scripts={"refuse.sh": EVENT_SCRIPTS["refuse.sh"]})
    started_agent(journal, client)
    expect_line(journal, client, "pin", "make", "Notes", "--link", "https://example.org/notes", "--environment", "main")
    assert "finished" in poll_line(finish_pipe)
    assert "Written inside the run" in expect_line(journal, client, "task", "show", "1")
    assert not script_calls(journal, "refuse.sh")


def test_s58_switching_the_plugin_off_stops_its_run(journal, client):
    start_pipe, blocked_pipe, run_pid = (journal.home.folder.parent / name for name in ("started", "never-written", "run-pid"))
    for pipe in (start_pipe, blocked_pipe):
        os.mkfifo(pipe)
    start_with_plugin(journal, client, {"event": "core.pins.pin.created", "commit": "script.sh"}, agent_run_line(journal, client, f"echo $$ > {run_pid}; echo started > {start_pipe}; read answer < {blocked_pipe}"))
    started_agent(journal, client)
    expect_line(journal, client, "actor", "make", "user", "Ada")
    expect_line(journal, client, "pin", "make", "Notes", "--link", "https://example.org/notes", "--environment", "main")
    assert "started" in poll_line(start_pipe)
    viewer_page(journal).disable()
    expect_process_ended(int(run_pid.read_text()))


def row_counts(journal) -> tuple[int, int]:
    connection = sqlite3.connect(journal.home.database)
    try:
        return connection.execute("SELECT count(*) FROM tasks").fetchone()[0], connection.execute("SELECT count(*) FROM events").fetchone()[0]
    finally:
        connection.close()


def test_s67_the_server_stops_while_a_guard_runs_and_nothing_is_written(journal, client):
    start_pipe, blocked_pipe = journal.home.folder.parent / "started", journal.home.folder.parent / "never-written"
    os.mkfifo(start_pipe)
    os.mkfifo(blocked_pipe)
    start_with_plugin(journal, client, {"event": TASK_CREATED, "guard": "script.sh"}, f"echo started > '{start_pipe}'\nread answer < '{blocked_pipe}'")
    initial_counts = row_counts(journal)
    process = subprocess.Popen([str(client), *SECOND_JOB_LINE], env=journal.environment(), cwd=journal.home.folder.parent, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    try:
        assert "started" in poll_line(start_pipe, process)
        journal.stop_with(client)
        stdout, stderr = process.communicate(timeout=TIMEOUT_SECONDS)
    finally:
        if process.poll() is None:
            process.kill()
            process.communicate()
    assert process.returncode != 0 and "the server stopped before plugin events answered" in stdout + stderr, stdout + stderr
    assert row_counts(journal) == initial_counts


def test_s76_the_caller_goes_away_while_a_guard_runs_and_nothing_is_written(journal, client):
    start_pipe, blocked_pipe = journal.home.folder.parent / "started", journal.home.folder.parent / "never-written"
    os.mkfifo(start_pipe)
    os.mkfifo(blocked_pipe)
    start_with_plugin(journal, client, {"event": TASK_CREATED, "guard": "script.sh"}, f"echo started > '{start_pipe}'\nread answer < '{blocked_pipe}'")
    expect_line(journal, client, "actor", "make", "user", "Ada")
    page = viewer_page(journal)
    initial_counts = row_counts(journal)
    process = subprocess.Popen([str(client), *SECOND_JOB_LINE], env=journal.environment(), cwd=journal.home.folder.parent, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    assert "started" in poll_line(start_pipe, process)
    process.kill()
    process.communicate()
    assert PolledWait(2 * MINUTE_SECONDS, READ_SLICE_SECONDS).poll(lambda: not (page.card() and any(row["started_at"] for row in page.card()))), "the script outlived its caller"
    assert row_counts(journal)[0] == initial_counts[0]
