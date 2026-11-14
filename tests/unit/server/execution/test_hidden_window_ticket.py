from engine.enums.execution_priority import ExecutionPriority
from engine.enums.window_priority import WindowPriority
from engine.journal.journal_home import JournalHome
from engine.time.clock import Clock
from server.execution.execution_priorities import ExecutionPriorities
from server.execution.session_starters import SessionStarters


def priorities(tmp_path) -> ExecutionPriorities:
    return ExecutionPriorities(SessionStarters(JournalHome(tmp_path)))


def test_hidden_window_poll_is_background(tmp_path):
    ticket = priorities(tmp_path).viewer_ticket("GET /api/data", WindowPriority.FIRST, Clock().timestamp(), is_hidden=True)
    assert (ticket.first_priority, ticket.priority) == (ExecutionPriority.BACKGROUND, ExecutionPriority.BACKGROUND)


def test_visible_first_window_is_immediate(tmp_path):
    assert priorities(tmp_path).viewer_ticket("GET /api/data", WindowPriority.FIRST, Clock().timestamp()).priority is ExecutionPriority.IMMEDIATE


def test_missing_field_counts_as_visible(tmp_path):
    assert priorities(tmp_path).viewer_ticket("GET /api/data", WindowPriority.NORMAL, Clock().timestamp()).priority is ExecutionPriority.NORMAL
