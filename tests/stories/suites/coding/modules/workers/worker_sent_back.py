from engine.testing.examples.hook_samples import HookSamples
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.support.worker_nudges import WORKER_UNFINISHED_TASKS
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.ask_ledger import ANSWER, HELP_REQUEST_LINE, questions
from tests.stories.suites.coding.modules.workers.merger_cases import MergerCase, case  # noqa: F401
from tests.stories.suites.coding.modules.workers.stopped_with_tasks import MERGER_ON, main_agent_lines, missing_program, running_worker, two_task_worker, worker_story  # noqa: F401
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import worker_session
from tests.stories.suites.coding.modules.workers.support.work_setting_stories import set_resume_limit
from tests.stories.suites.coding.modules.workers.worker_ask import asking, asking_with_merger_running, merger_disabled_worker  # noqa: F401

GO_ON_TEXT = WORKER_UNFINISHED_TASKS.text.split(",")[0]


def worker_lines(story, worker_id: int) -> str:
    story.run_listeners()
    return story.run(f"agent-line list --agent {worker_id}").output_text


def test_a_worker_that_keeps_stopping_is_sent_back_with_its_tasks_as_often_as_its_resume_limit_and_then_named_once(two_task_worker):
    story = two_task_worker
    set_resume_limit(story.container, 2)
    story.expect_success(MERGER_ON, actor=story.user)
    session = worker_session(story, story.worker)
    for _ in range(4):
        story.run(f"agent end {story.worker.id}", actor=story.worker)
        story.run_listeners()
        story.hook(session, HookSamples.session_start())
    lines = worker_lines(story, story.worker.id)
    worker = f"worker:{agent_number(story, story.worker.id)}"
    story.expect_rows(lines.count(f"{GO_ON_TEXT}, task:1, task:2:") == 2, main_agent_lines(story).count(f"{worker} ended with") == 1, detail=f"{lines} | {main_agent_lines(story)}")


def test_a_worker_that_asked_for_help_and_stops_is_answered_and_never_told_to_go_on(case):
    story = case.story
    story.expect_success(HELP_REQUEST_LINE, actor=case.worker)
    story.expect_hook_allowed(worker_session(story, case.worker), HookSamples.stop())
    story.run(f"agent end {case.worker.id}", actor=case.worker)
    story.expect_rows(GO_ON_TEXT not in worker_lines(story, case.worker.id), detail=worker_lines(story, case.worker.id))
    story.expect_success(f'merger answer {questions(story)[0].id} "{ANSWER}"', actor=case.merger)
    story.expect_rows(ANSWER in case.worker_messages(), GO_ON_TEXT not in worker_lines(story, case.worker.id), detail=worker_lines(story, case.worker.id))


