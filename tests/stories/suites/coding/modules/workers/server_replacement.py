import subprocess
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.query.queries import Queries
from core.modules.processes.ticks.run_end_recovery import RunEndRecovery
from core.modules.processes.ticks.run_slot_grant import RunSlotGrant
from suites.coding.modules.workers.models.proof import Proof
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.server.support.server_client import server_story, started_server
from tests.stories.server.support.file_changes import FileChanges
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, repository_environment

RUNNER_SOURCE = Path(__file__).resolve().parents[6] / "tools" / "journal-run"
WAIT_SECONDS = 40


def installed_runner(story) -> None:
    binary = story.home.folder.resolve() / "bin" / "journal-run"
    binary.parent.mkdir(parents=True, exist_ok=True)
    built = subprocess.run(["go", "-C", str(RUNNER_SOURCE), "build", "-o", str(binary), "."], capture_output=True, text=True)
    assert built.returncode == 0, built.stdout + built.stderr


def proof_state(story) -> str:
    return str(story.container.get(Queries).query(Proof).find(1).state)


def run_report(story) -> str:
    process_id = story.container.get(Queries).query(Proof).find(1).process_id
    folder = story.home.folder.resolve() / "processes" / str(process_id)
    files = {path.name: path.read_text(errors="replace")[:200] for path in sorted(folder.iterdir()) if path.is_file()} if folder.is_dir() else {}
    return f"{story.run(f'process show {process_id}', actor=story.agent).output_text}\n{files}"


def pending_item(story, ticks, wanted: str) -> None:
    deadline = time.monotonic() + WAIT_SECONDS
    process_id = story.container.get(Queries).query(Proof).find(1).process_id
    folder = story.home.folder.resolve() / "processes" / str(process_id)
    with FileChanges(folder) as changes:
        while proof_state(story) != wanted:
            assert time.monotonic() < deadline, f"the proof is {proof_state(story)}, not {wanted}\n{run_report(story)}"
            story.advance(timedelta(seconds=3))
            for tick in ticks:
                tick(story.container)
            story.run_listeners()
            if proof_state(story) != wanted:
                assert changes.wait(max(0, deadline - time.monotonic())), run_report(story)


def test_a_queued_proof_is_started_by_the_new_server_and_counts(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    installed_runner(story)
    story.advance(datetime.now(timezone.utc) - story.clock.timestamp().value)
    monkeypatch.setenv("JOURNAL_HOME", str(story.home.folder.resolve()))
    repository = repository_environment(story)
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1", actor=story.agent), ActorType.AGENT)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(f'worker send --wait {worker.id} "go on" --test-command "probe=python3 -c"', actor=story.agent)
    story.expect_success('proof make 1 --task 1 "cart.py:1, the cart story" --test "probe pass tests/cart.py"', actor=worker)
    story.expect_success("setting set journal.suites.coding.workers.merger-on false --project", actor=story.user)
    with server_story(story):
        story.expect_success("worker deliver --wait --differences none", actor=worker)
        story.run_listeners()
        story.expect_text("proof show 1", "state: running", actor=story.agent)
    with started_server(story.home):
        pending_item(story, (RunSlotGrant(), RunEndRecovery()), "checked")
    story.expect_text("proof show 1", "state: checked", actor=story.agent)
    story.expect_text(f"process show {story.container.get(Queries).query(Proof).find(1).process_id}", "state: finished", "exit_code: 0", actor=story.agent)
