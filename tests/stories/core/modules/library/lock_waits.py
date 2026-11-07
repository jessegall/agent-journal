import itertools
import json
import shlex
import shutil
import statistics
import threading
import time
from collections.abc import Callable
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import pytest

from core.base.command.context import Context
from core.base.container import Container
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.ticker.tick_handler import TickHandler
from core.base.ticker.tick_interval import TickInterval
from core.modules.documents.models.doc import Doc
from core.modules.documents.support.doc_library_share import DocLibraryShare
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.ticks.library_sync_tick import LibrarySyncTick
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.testing.story import Story
from server.ticker import Ticker
from tests.stories.core.modules.library.support.copy_stories import connected, doc_fields, shared_server
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.server.support.server_client import request_answer, running_server
from tests.stories.server.support.shared_server_binary import SharedServerBinary

__all__ = ["private_folder", "shared_server"]

pytestmark = [pytest.mark.skipif(shutil.which("go") is None, reason="the shared server needs go to build"), pytest.mark.usefixtures("private_folder")]

COPIES = 300
AGENTS = 8
BASELINE_SECONDS = 6
LOADED_SECONDS = 15
CHANGES_PER_SECOND = 20
REPORT = Path("/tmp/library-lock-waits.json")
LONGEST_WAIT_SECONDS = 5


class CountingTick(LibrarySyncTick):
    """The sync tick with a count of its rounds and of the rounds that changed a row."""

    def __init__(self, seconds: Callable[[], float]) -> None:
        super().__init__(seconds)
        self.rounds, self.changing_rounds = 0, 0

    def run_round(self, container: Container) -> bool:
        has_changed = super().run_round(container)
        self.rounds, self.changing_rounds = self.rounds + 1, self.changing_rounds + int(has_changed)
        return has_changed


def bulk_copies(story: Story, server: SharedServerBinary, token: str) -> list[int]:
    share, repository = story.container.get(DocLibraryShare), story.container.get(Repository)
    saving = Context(story.user, story.clock.timestamp(), ReadMessage(1))
    item_ids = []
    for number in range(COPIES):
        item_ids.append(int(str(server.send(token, "POST", "/items/doc", {"fields": doc_fields(f"Copy {number}", "Tag first.")})[1]["id"])))
    for number, item_id in enumerate(item_ids):
        row = repository.save(Doc(creator_id=story.user.id, title=f"Copy {number}", abstract=f"About Copy {number}", body="Tag first."), saving)
        repository.save(LibraryCopy(creator_id=story.user.id, share="doc", item_id=item_id, row_id=row.id, base_version=1, base_digest=share.digest(row)), saving)
    assert story.container.get(Queries).query(LibraryCopy).count() == COPIES
    return item_ids


def timed_edit(socket_path: Path, row_id: int, number: int) -> tuple[float, bool]:
    started = time.monotonic()
    answer = request_answer(socket_path, "POST", "/cli", {"argv": shlex.split(f'doc edit {row_id} --body "Edit {number}"'), "folder": "/"})
    return time.monotonic() - started, answer.exit_code == 0


def agents_edit(socket_path: Path, rows: list[int], seconds: float) -> list[tuple[float, bool]]:
    deadline = time.monotonic() + seconds

    def one_agent(row_id: int) -> list[tuple[float, bool]]:
        timings = []
        for number in itertools.count():
            if time.monotonic() >= deadline:
                return timings
            timings.append(timed_edit(socket_path, row_id, number))
        return timings

    with ThreadPoolExecutor(len(rows)) as pool:
        return [timing for agent_timings in pool.map(one_agent, rows) for timing in agent_timings]


def figures(results: list[tuple[float, bool]]) -> dict[str, float]:
    waits = sorted(seconds for seconds, _ in results)
    return {"writes": len(waits), "failed": sum(1 for _, worked in results if not worked), "mean_seconds": round(statistics.mean(waits), 3),
            "p95_seconds": round(waits[int(len(waits) * 0.95) - 1], 3), "max_seconds": round(waits[-1], 3)}


def test_agents_edit_while_the_sync_tick_runs_on_its_own_thread_with_bulk_copies(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    item_ids = bulk_copies(story, server, tokens.admin)
    agent_rows = list(range(COPIES - AGENTS + 1, COPIES + 1))
    with running_server(story.home) as (_, socket_path, context):
        baseline = figures(agents_edit(socket_path, agent_rows, BASELINE_SECONDS))
        tick = CountingTick(itertools.count(0, 10).__next__)
        ticker = Ticker(story.home, [TickHandler(TickInterval(seconds=10), tick, "library sync")], context.listener_thread.wake, seconds=itertools.count(0, 10).__next__)
        stopped = threading.Event()
        changed_on_server = []

        def tick_often() -> None:
            while not stopped.is_set():
                ticker.tick()
                stopped.wait(0.05)

        def library_changes() -> None:
            for number in itertools.count():
                if stopped.is_set():
                    return
                for item_id in item_ids[:COPIES - AGENTS][number * CHANGES_PER_SECOND % (COPIES - AGENTS):][:CHANGES_PER_SECOND]:
                    code = server.send(tokens.admin, "GET", f"/items/doc/{item_id}")[1]
                    server.send(tokens.admin, "PUT", f"/items/doc/{item_id}", {"fields": doc_fields(f"Copy {item_id}", f"Changed {number}")}, {"If-Match": f'"{code["version"]}"'})
                    changed_on_server.append(item_id)
                stopped.wait(1)

        threads = [threading.Thread(target=tick_often, daemon=True), threading.Thread(target=library_changes, daemon=True)]
        for thread in threads:
            thread.start()
        loaded = figures(agents_edit(socket_path, agent_rows, LOADED_SECONDS))
        stopped.set()
        for thread in threads:
            thread.join(10)
        ticker.join(30)
    REPORT.write_text(json.dumps({"copies": COPIES, "agents": AGENTS, "baseline": baseline, "while_the_tick_syncs": loaded, "tick_rounds": tick.rounds, "rounds_that_changed_rows": tick.changing_rounds,
                                  "items_changed_on_the_server": len(changed_on_server)}, indent=2))
    print("LOCK WAITS", REPORT.read_text())
    story.expect_rows(baseline["failed"] == 0, loaded["failed"] == 0, loaded["max_seconds"] < LONGEST_WAIT_SECONDS)
