import json

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.query.queries import Queries
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from tests.stories.core.modules.processes.support.process_samples import end_run
from tests.stories.core.modules.processes.support.reader_block_fixtures import worker_run
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, repository_environment
from tests.stories.suites.coding.modules.workers.test_queue import PROOF, recording_launch


def test_a_proof_test_waits_in_the_queue_until_the_run_holding_the_spot_ends(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    recording_launch(monkeypatch)
    story.expect_success("setting set journal.core.processes.run-batch-size 1 --environment main", actor=story.user)
    story.run("agent start s-reader claude worker --environment main")
    holder = worker_run(story, "make holder")
    repository = repository_environment(story)
    worker = Actor(story.new_row_id("worker dispatch --model sonnet 1", actor=story.agent), ActorType.AGENT)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(PROOF, actor=worker)

    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.run_listeners()

    processes, folder = story.container.get(Queries).query(Process), story.container.get(OutputFolder)
    waiting = processes.filter(session_agent_id=worker.id).page(1, 1).rows[0]
    story.expect_rows(folder.has_slot(holder.id), waiting.queued_at == story.clock.timestamp(), not folder.has_slot(waiting.id))
    queue = json.loads(story.run("queue list --environment 1 --json", actor=story.user).output_text)
    story.expect_rows([row["output_id"] for row in queue["waiting"]] == [waiting.id], queue["waiting"][0]["line"] == "pytest tests/cart.py")

    end_run(story, holder, "ok\n")

    story.expect_rows(folder.has_slot(waiting.id), processes.find(waiting.id).queued_at is None)
