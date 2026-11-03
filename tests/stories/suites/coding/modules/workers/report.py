from core.base.actor import Actor
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import delivered_worker, dispatched_worker, repository_environment, worker_session

REPORT = "The cart total now adds the tax once; the tests pass."


def stop_saying(text: str):
    stop = HookSamples.stop()
    return stop.with_raw({**stop.body["raw"], "last_assistant_message": text})


def test_what_a_worker_says_as_it_stops_with_every_task_handed_in_is_its_report_in_the_chat_and_to_its_main_agent(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    story.expect_hook_allowed(worker_session(story, worker), stop_saying(REPORT))
    story.expect_text("message feed --json", REPORT, f'"worker_id": {worker.id}')
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"worker:{worker.id} reported in message:")
    story.expect_absent(f"agent-line list --agent {story.agent.id}", REPORT)


def test_a_worker_that_stops_with_no_words_leaves_no_report(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    story.expect_hook_allowed(worker_session(story, worker), stop_saying(" "))
    story.expect_text("message feed", "nothing found")


def test_a_worker_refused_its_stop_leaves_no_report(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker: Actor = dispatched_worker(story)
    story.expect_hook_refusal(worker_session(story, worker), stop_saying(REPORT), "journal worker deliver, or say why with journal wait stuck")
    story.expect_text("message feed", "nothing found")
