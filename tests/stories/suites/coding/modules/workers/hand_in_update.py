import os

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.query.queries import Queries
from core.modules.processes.support.run_queue_halt import RunQueueHalt
from install.update.run_drain import RunDrain
from suites.coding.modules.workers.models.proof import Proof
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, repository_environment
from tests.stories.suites.coding.modules.workers.test_queue import PROOF, recording_launch


@pytest.fixture
def running_delivery(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    recording_launch(monkeypatch)
    repository = repository_environment(story)
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1", actor=story.agent), ActorType.AGENT)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(PROOF, actor=worker)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.run_listeners()
    process_id = story.container.get(Queries).query(Proof).find(1).process_id
    folder = story.home.folder / "processes" / str(process_id)
    (folder / "pid").write_text(str(os.getpid()))
    (folder / "1.started").write_text("")
    return story, process_id, folder


def test_a_hand_in_test_that_runs_is_a_run_a_waiting_update_waits_for(running_delivery):
    story, process_id, _ = running_delivery
    story.home.run_lock.write_text(str(os.getpid()))
    story.expect_rows(process_id in RunDrain(story.home).running_folders(), RunQueueHalt(story.home).halt_type == "update",
                      RunQueueHalt(story.home).running_run_ids() == tuple([process_id]))


def test_a_hand_in_test_that_has_ended_no_longer_holds_an_update(running_delivery):
    story, process_id, folder = running_delivery
    story.home.run_lock.write_text(str(os.getpid()))
    (folder / "end").write_text("0")
    story.expect_rows(process_id not in RunDrain(story.home).running_folders())
