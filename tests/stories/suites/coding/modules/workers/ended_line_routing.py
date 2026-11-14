from tests.stories.core.support.agent_labels import agent_number
from suites.coding.modules.workers.models.merger_line import MergerLine
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.report import MergerOffOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment

STOPPED = "stopped with task:1 left"


def stopped_worker(story):
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success(f"agent end {worker.id}", actor=worker)
    return worker


def test_with_the_merger_on_the_stop_line_of_a_worker_goes_to_the_merger_and_not_to_the_main_agent(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    worker = stopped_worker(story)
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", "workers.ended-worker")
    lines = story.story_rows(MergerLine)
    story.expect_rows(any(f"worker:{agent_number(story, worker.id)} {STOPPED}" in line.text for line in lines))


def test_with_the_merger_off_the_main_agent_hears_the_stop_line_of_a_worker(new_story):
    story = new_story(fixture=MergerOffOrchestrator)
    worker = stopped_worker(story)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"worker:{agent_number(story, worker.id)} {STOPPED}")
