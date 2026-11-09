from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DELIVERY, delivered_worker, dispatched_worker, repository_environment

SHORTFALL = "the rounding has no test"
PROOF_SHORT = f'proof short 1 "{SHORTFALL}"'


def test_a_short_proof_moves_the_task_back_to_started_and_tells_the_worker_what_is_missing(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    story.expect_success(PROOF_SHORT, "state: short", f"shortfall: {SHORTFALL}", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {worker.id}")
    story.expect_text(f"agent-line list --agent {worker.id}", "proof:1 of task:1 is short: read it, fix it, then deliver")
    story.expect_absent(f"agent-line list --agent {worker.id}", SHORTFALL)
    story.expect_text("proof show 1", SHORTFALL)


def test_a_short_proof_shown_again_and_delivered_is_checked(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    story.expect_success(PROOF_SHORT, "state: short", actor=story.agent)
    repository.changed(worker.id, "cart_test.py", "def test_the_total_rounds_to_cents(): pass\n")
    story.expect_success('proof make 1 --task 1 "cart.py:1, and cart_test.py:1 for the rounding"', "state: shown", actor=worker)
    story.expect_success(DELIVERY, actor=worker)
    story.expect_success(lines.TASK_DETAILS, "state: testing")
    story.expect_success("proof check 1", "state: checked", actor=story.agent)


def test_a_worker_edits_an_unchecked_proof_and_cannot_edit_it_after_check(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    proof = story.new_row_id('proof make 1 --task 1 "first evidence"', actor=worker)
    story.expect_success(f'proof edit {proof} --task 1 "corrected evidence" --test "python tests/cart.py"', actor=worker)
    story.expect_success(f'proof show {proof}', 'text: corrected evidence', 'test_command: pytest tests/cart.py', actor=worker)
    story.expect_refusal(f'proof edit {proof} --task 1 "piped" --test "python | tail"', 'without a pipe, a redirect or a reading flag', actor=worker)
    story.expect_refusal(f'proof edit {proof} --task 1 "redirected" --test "python > out"', 'without a pipe, a redirect or a reading flag', actor=worker)
    story.expect_success(f'proof check {proof}', actor=story.agent)
    story.expect_refusal(f'proof edit {proof} --task 1 "too late"', 'checked already', actor=worker)


def test_a_proof_must_name_the_workers_current_task(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_refusal('proof make 1 "evidence" --task 99', 'current task is 1', actor=worker)
    story.expect_success('proof make 1 "evidence" --task 1', 'task_id: 1', actor=worker)


def test_a_short_proof_is_replaced_with_the_command_its_refusal_names(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    story.expect_success('proof short 1 "wrong task"', 'state: short', actor=story.agent)
    story.expect_refusal('proof short 1 "again"', "journal proof revise 1", actor=story.agent)
    story.expect_success('proof revise 1 "cart.py:1, the right task" --test "python tests/cart.py"', 'state: shown', 'text: cart.py:1, the right task', 'test_command: pytest tests/cart.py', actor=worker)


def test_a_proof_is_returned_and_a_job_sent_while_the_delivered_workers_task_is_started_again(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    story.expect_success("task retest 1", "state: started", actor=story.agent)
    story.expect_success('proof short 1 "wrong task"', 'state: short', actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, 'state: started')
    story.expect_success(f'worker send --wait {worker.id} "Go on with it"', actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, 'state: started')
