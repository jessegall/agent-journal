from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.query.queries import Queries
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.chat.models.enums.chat_mark_state import ChatMarkState
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.stories.suites.coding.modules.workers.test_queue import ended, recording_launch


def test_a_second_test_round_of_the_same_task_gets_its_own_mark(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    story.expect_success('task edit 1 --brief "- Cart\n- Tax"', actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --model sonnet 1", actor=story.agent), ActorType.AGENT)
    repository.changed(worker.id, "cart.py", "TOTAL = 2\n")
    story.expect_success('proof make 1 --task 1 "cart.py:1" --test "pytest tests/cart.py"', actor=worker)
    story.expect_success('proof make 2 --task 1 "tax.py:1, read by hand"', actor=worker)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.run_listeners()
    ended(story, started[0], 0)
    first = story.container.get(Queries).query(ChatMark).filter(key="worker-tests:1:1").first()
    story.expect_rows(first is not None, first.state is ChatMarkState.ENDED)

    story.expect_success(f'worker send --wait {worker.id} "Add the tax test"', actor=story.agent)
    repository.changed(worker.id, "tax.py", "TAX = 1\n")
    story.expect_success('proof make 2 --task 1 "tax.py:1" --test "pytest tests/tax.py"', actor=worker)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.run_listeners()

    marks = list(story.container.get(Queries).query(ChatMark).filter(type="workers.tests").oldest().all_rows())
    story.expect_rows(len(marks) == 2)
    story.expect_rows(marks[0].key == first.key, marks[1].key != first.key, marks[1].state is ChatMarkState.SHOWN)
    ended(story, started[1], 0)
    second = story.row(ChatMark, marks[1].id)
    story.expect_rows(second.state is ChatMarkState.ENDED, second.variant == "passed")
    database = story.container.get(Database)
    story.expect_rows(not database.rows(Statement("SELECT * FROM listener_skips WHERE listener = 'workers.test-mark'")))
    story.expect_rows(not database.rows(Statement("SELECT * FROM journal_exceptions")))
