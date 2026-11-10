import shlex
import sqlite3
from pathlib import Path
from typing import cast

from engine.model.tables import Tables
from core.testing.story import Story
from suites.coding.modules.workers.models.worktree import Worktree
from tests.stories.core.modules.plugins.support.event_stories import EventWorkerStarted, event_data, event_plugin_story, script_calls
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.scanned_edits import scanned_edit
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, dispatched_worker, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import CHECKOUT_BRANCH, ENVIRONMENT_BRANCH, GitRepository

ORDER = "src/order.py"
ORDER_TEXT = "ORDER = 0\n"
CHANGED_ORDER_TEXT = "ORDER = 1\n"
FILE_EDITED = "file_edited"
WORKER_DELIVERING = "worker_delivering"
FILE_LISTENER = {"program": "see.sh", "hears": [FILE_EDITED, WORKER_DELIVERING], "holds": [{"event": WORKER_DELIVERING, "window_ms": 5000}], "reaches": {FILE_EDITED: ["workers", "helpers"]}}


def project_with_order(story: Story, folder: Path, environment_path: Path | None = None) -> GitRepository:
    repository = GitRepository.sample(folder)
    repository.checkout(ENVIRONMENT_BRANCH)
    (folder / "src").mkdir()
    repository.committed(ORDER, ORDER_TEXT, "The order")
    repository.checkout(CHECKOUT_BRANCH)
    story.expect_success(f"environment edit 1 --folder {shlex.quote(str(environment_path or folder))} --branch {ENVIRONMENT_BRANCH}")
    return repository


def checkout_story(new_story, *entries: object, project: str = "project", linked: bool = False, dispatch: str = DISPATCH, setup_repository=None, **manifest: object) -> Story:
    story = install_runner(event_plugin_story(new_story, *entries, fixture=EventWorkerStarted, **{**FILE_LISTENER, **manifest}))
    parent = story.home.folder.parent
    link = parent / "linked-project" if linked else None
    story.repository = project_with_order(story, parent / project, link)
    if link is not None:
        link.symlink_to(story.repository.folder, target_is_directory=True)
    if setup_repository is not None:
        setup_repository(story)
    story.worker = dispatched_worker(story, dispatch)
    story.worker_session = worker_session(story, story.worker)
    story.worktree = story.repository.worktree_folder(story.worker.id)
    return story


def real(path: Path) -> str:
    return str(path.resolve())


def edit_events(story: Story) -> list[dict[str, object]]:
    return [call for call in script_calls(story, "see.sh") if call["event"] == FILE_EDITED]


def edit_event(story: Story, session: str, name: str = ORDER, folder: Path | None = None, existed: bool = True) -> dict[str, object]:
    """The line the plugin was given for an edit of this name, made by this session in this folder."""
    scanned_edit(story, session, name, existed=existed, folder=folder or story.worktree)
    story.run_listeners()
    return edit_events(story)[-1]


def checkout_row(call: dict[str, object]) -> dict[str, object]:
    return cast(dict[str, object], call["checkout"])


def read_file(call: dict[str, object]) -> dict[str, object]:
    return cast(dict[str, object], event_data(call)["file"])


def delivery_changes(story: Story) -> list[dict[str, object]]:
    """The changes the plugin was given at the last hand-in."""
    calls = [call for call in script_calls(story, "see.sh") if call["event"] == WORKER_DELIVERING]
    return cast(list[dict[str, object]], event_data(calls[-1])["changes"])


def moved_worktree_row(story: Story, worker_id: int, folder: Path) -> None:
    """Writes the new folder of a worktree on its row. No command cuts a worktree beside the project, so this is the only
    way a story reaches that state."""
    table = story.container.get(Tables).table(Worktree).name
    connection = sqlite3.connect(story.home.database)
    try:
        connection.execute(f"UPDATE {table} SET folder = ? WHERE session_agent_id = ?", (str(folder), worker_id))
        connection.commit()
    finally:
        connection.close()


def removed_worktree_rows(story: Story, count: int) -> None:
    """Adds worktrees of workers long gone, each removed, as a project that has cut many of them holds."""
    table = story.container.get(Tables).table(Worktree).name
    connection = sqlite3.connect(story.home.database)
    try:
        columns = [column[1] for column in connection.execute(f"PRAGMA table_info({table})") if column[1] != "id"]
        values = {"session_agent_id": "9999", "folder": "? || n", "branch": "'gone/' || n", "removed_at": "NULL", "state": "'new'"}
        select = ", ".join(values.get(column, column) for column in columns)
        connection.execute(f"""WITH RECURSIVE counted(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM counted WHERE n < ?)
                               INSERT INTO {table} ({', '.join(columns)}) SELECT {select} FROM {table}, counted WHERE {table}.session_agent_id = (SELECT MIN(session_agent_id) FROM {table})""",
                           (count, str(story.home.folder.parent / "gone-worker-")))
        connection.execute(f"UPDATE {table} SET removed_at = created_at WHERE session_agent_id = 9999")
        connection.commit()
    finally:
        connection.close()
