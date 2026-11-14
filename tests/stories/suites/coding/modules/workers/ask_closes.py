from core.modules.messages.models.message import Message
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.enums.ask_outcome import AskOutcome
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.ask_ledger import ANSWER, questions
from tests.stories.suites.coding.modules.workers.gone_workers import missing_program, running_worker, worker_story  # noqa: F401
from tests.stories.suites.coding.modules.workers.worker_ask import merger_disabled_worker  # noqa: F401

__all__ = ["merger_disabled_worker", "missing_program", "running_worker", "worker_story"]


def test_a_text_send_to_a_worker_with_nothing_assigned_files_no_task_and_wakes_it_with_the_text(running_worker):
    story = running_worker
    story.expect_success(f'worker release {agent_number(story, story.worker.id)} "not needed" --abandon "the story drops the work"', actor=story.agent)
    tasks = len(story.story_rows(Task))
    story.expect_success(f'worker send --wait {agent_number(story, story.worker.id)} "Look at the tax rounding"', actor=story.agent)
    story.expect_rows(len(story.story_rows(Task)) == tasks, detail=str([task.title for task in story.story_rows(Task)]))
    sent = [(str(message.type), message.recipient, message.text) for message in story.story_rows(Message)]
    story.expect_rows(("peer", f"worker {story.worker.id}", "Look at the tax rounding") in sent, detail=str(sent))


def test_a_question_that_went_to_the_main_agent_is_answered_once_the_main_agent_sends_its_answer(merger_disabled_worker):
    merger_disabled_worker.post_question()
    story = merger_disabled_worker.story
    story.expect_rows(questions(story)[0].outcome is AskOutcome.FORWARDED)
    story.expect_success(f'worker send --wait {agent_number(story, merger_disabled_worker.worker.id)} "{ANSWER}"', actor=story.agent)
    story.run_listeners()
    story.expect_rows(questions(story)[0].outcome is AskOutcome.ANSWERED, detail=str([(message.type, message.recipient, message.creator_id) for message in story.story_rows(Message)]))
