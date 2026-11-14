from tests.stories.core.modules.helpers.support.journal_hook_lines import journal_hook_line
from tests.stories.core.modules.helpers.support.list_workers import WORKER_SESSION, worker_story

__all__ = ["worker_story"]

SETTING_LINE = ("setting", "set", "journal.core.helpers.accept-every-approval", "true")
WORKER_REFUSAL = "A worker may not run setting set: it runs the groups proof, worker, todo-item, memory and the lines message unread, message read"


def test_a_worker_runs_a_line_its_type_lists(worker_story):
    story, worker = worker_story
    story.expect_hook_allowed(WORKER_SESSION, journal_hook_line("task", "show", "1"))
    story.expect_text("task show 1", "state: started", actor=worker)


def test_a_worker_is_refused_a_line_its_type_does_not_list_and_nothing_changes(worker_story):
    story, worker = worker_story
    story.expect_hook_refusal(WORKER_SESSION, journal_hook_line(*SETTING_LINE), WORKER_REFUSAL)
    story.expect_text("setting show journal.core.helpers.accept-every-approval", "false")


def test_the_refusal_names_the_allowed_groups_and_lines_and_what_to_do(worker_story):
    story, worker = worker_story
    story.expect_hook_refusal(WORKER_SESSION, journal_hook_line("plugin", "install", "sample"), "; ask your main agent")
    story.expect_hook_refusal(WORKER_SESSION, journal_hook_line("plugin", "install", "sample"), "A worker may not run plugin install: it runs the groups proof")


def test_a_line_sent_without_the_hook_is_refused_at_the_server(worker_story):
    story, worker = worker_story
    story.expect_refusal('task edit 1 --title "Changed by a script"', "A worker may not run task edit", actor=worker)
    story.expect_no_text("task show 1", "Changed by a script")


def test_the_main_agent_runs_every_command(worker_story):
    story, worker = worker_story
    story.expect_success('task edit 1 --title "Renamed by the main agent"', actor=story.agent)
    story.expect_text("task show 1", "Renamed by the main agent")


# The scope half of story 301, a worker refused a task it cannot read, waits on plan 1111's actor scope.
def test_the_list_lets_a_worker_read_a_task_the_scope_then_judges(worker_story):
    story, worker = worker_story
    story.expect_hook_allowed(WORKER_SESSION, journal_hook_line("task", "show", "2"))
