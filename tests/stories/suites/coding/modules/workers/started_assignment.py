from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment


def test_a_worker_with_an_open_and_a_started_assignment_makes_proofs_for_the_started_one(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    urgent = story.new_row_id('task make "Urgent fix" --brief "Fix it" --environment main', actor=story.agent)
    story.expect_success(f"task assign {urgent} --to {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_success("task release 1 --reason \"urgent work first\"", actor=story.agent)
    story.expect_success(f"task start {urgent}", actor=worker)
    story.expect_text("worker status", f"Current task: {urgent} (started)", actor=worker)
    story.expect_success(f'proof make 1 --task {urgent} "fix.py:1, the fix"', actor=worker)
    story.expect_text(f"proof list --task {urgent}", "the fix", actor=story.agent)
