from concurrent.futures import ThreadPoolExecutor
from threading import Event, Lock

from core.modules.developer.support.developer_settings import HOOK_DURATIONS_SETTING, HOOK_REQUEST_LOG_SETTING, TOOLS_SETTING
from core.modules.documents.support.work_context_reader import WorkContextReader
from core.modules.processes.support.request_log import RequestLog
from core.modules.processes.support.request_log_entry import RequestLogEntry
from core.modules.tasks.models.task_read import TaskRead
from engine.enums.process_type import ProcessType
from engine.environment.environment_names import EnvironmentNames
from engine.file.file_access import FileAccess
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from server.hook.hook_database import INSTANT_CAPACITY
from tests.integration.support.integration_server import integration_server

WORKERS_COUNT = 6
EVERY_ROW_REASON = "the test counts every task read it made"


def test_a_viewer_line_keeps_a_request_row_in_the_environment_it_runs_in(journal):
    journal.make_user()
    with integration_server(journal) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        server.expect_viewer_line(cookie, {"window": "viewer.shell", "line": ["task", "list"], "environment": "main"}, 200, '"code": 0')
    main_id = journal.container.get(EnvironmentNames).environment_id("main")
    logged = [RequestLogEntry.parsed(line) for line in FileAccess.read(RequestLog(journal.home, FileAccess()).lines.path).splitlines() if line]
    viewer_rows = [entry for entry in logged if entry.process_type is ProcessType.JOURNAL and entry.line.startswith("journal task list")]
    assert len(viewer_rows) == 1 and viewer_rows[0].environment_id == main_id and viewer_rows[0].agent_id is None, logged


def test_six_worker_overviews_leave_hook_and_viewer_writes_free(journal, monkeypatch):
    journal.make_user()
    for line in (f"setting switch {TOOLS_SETTING} on --project", f"setting set {HOOK_REQUEST_LOG_SETTING} true --project", f"setting set {HOOK_DURATIONS_SETTING} true --project"):
        assert journal.run(line).code == 0, line
    for number in range(1, WORKERS_COUNT + 1):
        assert journal.run(f"agent start worker-{number} claude worker --environment main").code == 0
        assert journal.run(f'task make "Task {number}" --brief "A task to read" --environment main').code == 0
    original = WorkContextReader.overview
    entered, release, worker_ids_lock = Event(), Event(), Lock()
    worker_ids = []

    def delayed_context(reader, task, caller):
        with worker_ids_lock:
            worker_ids.append(caller.actor.id)
            if len(worker_ids) == WORKERS_COUNT:
                entered.set()
        if not release.wait(8):
            raise TimeoutError("the context read was not released")
        return original(reader, task, caller)

    monkeypatch.setattr(WorkContextReader, "overview", delayed_context)
    with integration_server(journal, listener_thread_started=False, instant_capacity=INSTANT_CAPACITY) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        with ThreadPoolExecutor(max_workers=WORKERS_COUNT) as pool:
            futures = [pool.submit(server.run_as, f"task overview {number}", f"worker-{number}") for number in range(1, WORKERS_COUNT + 1)]
            try:
                assert entered.wait(5), "six context reads did not enter independently"
                reply = server.request("POST", "/hook", HookSamples.edit("cart.py").body)
                assert reply.status == 200 and "unchecked" not in reply.text and "database is locked" not in reply.text, reply
                server.viewer_line_value(cookie, {"window": "tasks.tasks", "environment": "main", "line": ["task", "list"]})
                assert server.context.request_trace.counts["dropped"] == 0
            finally:
                release.set()
            answers = [future.result() for future in futures]
    assert all(answer.exit_code == 0 for answer in answers), answers
    assert len(list(journal.container.get(Queries).query(TaskRead).every_row(EVERY_ROW_REASON))) == WORKERS_COUNT
