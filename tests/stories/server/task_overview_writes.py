from concurrent.futures import ThreadPoolExecutor
from threading import Event, Lock

from engine.query.queries import Queries
from core.modules.documents.support.work_context_reader import WorkContextReader
from core.modules.tasks.models.task_read import TaskRead
from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.developer.support.hook_recording_fixture import HookRecordingEnabled
from tests.stories.server.support.server_client import request_answer, server_story

WORKERS_COUNT = 6


class SixTaskWorkers(StoryFixture):
    parent = HookRecordingEnabled

    def steps(self, story):
        for number in range(1, WORKERS_COUNT + 1):
            story.run(f'agent start worker-{number} claude worker --environment main')
            story.run(f'task make "Task {number}" --environment main', actor=story.agent)


def test_six_worker_overviews_leave_hook_and_viewer_writes_free(new_story, monkeypatch):
    story = new_story(fixture=SixTaskWorkers)
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
    with server_story(story, listener_thread_started=False) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        with ThreadPoolExecutor(max_workers=WORKERS_COUNT) as pool:
            futures = [pool.submit(server.run_as, f"task overview {number}", f"worker-{number}") for number in range(1, WORKERS_COUNT + 1)]
            try:
                story.expect_rows(entered.wait(5), detail="six context reads did not enter independently")
                reply = request_answer(server.socket_path, "POST", "/hook", HookSamples.edit("cart.py").body)
                story.expect_rows(reply.status == 200, "unchecked" not in reply.text, "database is locked" not in reply.text)
                server.viewer_line_value(cookie, {"window": "tasks.tasks", "environment": "main", "line": ["task", "list"]})
                story.expect_rows(server.context.request_log.counts["dropped"] == 0)
            finally:
                release.set()
            answers = [future.result() for future in futures]
        story.expect_rows(all(answer.exit_code == 0 for answer in answers), detail=str(answers))
        rows = tuple(story.container.get(Queries).query(TaskRead).all_rows())
        story.expect_rows(len(rows) == WORKERS_COUNT)
