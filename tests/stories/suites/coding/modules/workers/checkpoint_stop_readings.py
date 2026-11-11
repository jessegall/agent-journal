from engine.query.queries import Queries
from suites.coding.modules.workers.models.merger_line import MergerLine
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.stopped_with_tasks import MERGER_ON, ended, main_agent_lines, missing_program, running_worker, two_task_worker, worker_story  # noqa: F401

MARKS = "chat-mark list --environment 1"


def merger_texts(story) -> list[str]:
    return [line.text for line in story.container.get(Queries).query(MergerLine).oldest().all_rows()]


def worker_label(story) -> str:
    return f"worker:{agent_number(story, story.worker.id)}"


def test_a_resumed_worker_gets_a_card_and_one_restart_line_to_the_merger_and_none_to_the_main_agent(two_task_worker):
    story = two_task_worker
    story.expect_success(MERGER_ON, actor=story.user)
    ended(story)
    story.run_listeners()
    texts = merger_texts(story)
    story.expect_rows(len(texts) == 1, "tasks left" in story.run(MARKS).output_text, worker_label(story) not in main_agent_lines(story), detail=f"{texts} | {main_agent_lines(story)}")


def test_a_stop_by_another_agent_shows_a_card_and_sends_no_line(two_task_worker):
    story = two_task_worker
    story.expect_success(MERGER_ON, actor=story.user)
    story.expect_success(f"agent end {story.worker.id}", actor=story.agent)
    story.run_listeners()
    story.expect_rows(merger_texts(story) == [], "tasks left" in story.run(MARKS).output_text, f"{worker_label(story)} ended with" not in main_agent_lines(story), detail=str(merger_texts(story)))


def test_the_resume_limit_reaches_the_main_agent_once_and_not_the_merger(two_task_worker, monkeypatch):
    monkeypatch.setattr("suites.coding.modules.workers.support.worker_job.RESUME_LIMIT_COUNT", 0)
    story = two_task_worker
    story.expect_success(MERGER_ON, actor=story.user)
    ended(story)
    story.run_listeners()
    lines = main_agent_lines(story)
    story.expect_rows(lines.count(f"{worker_label(story)} ended with") == 1, merger_texts(story) == [], "tasks left" in story.run(MARKS).output_text, detail=lines)


def test_a_worker_whose_run_still_goes_shows_no_card_and_sends_no_line(two_task_worker):
    story = two_task_worker
    story.expect_success(MERGER_ON, actor=story.user)
    story.expect_success("worker test tests/test_cart.py", actor=story.worker)
    ended(story)
    story.run_listeners()
    story.expect_rows(merger_texts(story) == [], "tasks left" not in story.run(MARKS).output_text, detail=str(merger_texts(story)))
