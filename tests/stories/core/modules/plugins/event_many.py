from tests.stories.core.support.agent_labels import agent_number
from engine.command.bus import Bus
from tests.stories.core.modules.plugins.support.event_modules import NOTE_CREATED, NOTES, EventNote, ManyNotes
from tests.stories.core.modules.plugins.support.event_stories import (
    NOTES_PIN_TITLE, REFUSAL, SECOND_JOB, server_commands, SECOND_JOB_TITLE, TASK_CREATED, EventWorkerStarted, answer_with_commands, deliveries, event_page, event_plugin_story, install_event_plugin, pins_titled,
    script_calls, tasks_titled)
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

NOTE_COUNT = 30
ROUND_LIMIT = 20
WORKTREE_MERGE = "suites.coding.workers.worker_worktree.merge"
SECOND_PIN_TITLE = "More notes"
SECOND_PIN_LINE = f'pin make "{SECOND_PIN_TITLE}" --link https://example.org/more --environment main'


def test_s33_a_command_on_thirty_rows_stops_asking_after_twenty_rounds_and_still_commits(new_story):
    story = event_plugin_story(new_story, {"event": NOTE_CREATED, "guard": "see.sh"}, modules=[NOTES])
    story.expect_success(f"setting set journal.core.processes.run-batch-size {NOTE_COUNT * 2} --environment main", actor=story.user)
    story.container.get(Bus).run(ManyNotes(NOTE_COUNT), story.user)
    notes = list(story.story_rows(EventNote))
    story.expect_rows(len(notes) == NOTE_COUNT, len(script_calls(story, "see.sh")) == ROUND_LIMIT, "were skipped" in story.system_log_text())


def test_s34_a_merge_runs_no_guard_script_and_runs_its_commit_script(new_story):
    story = event_plugin_story(new_story, {"event": WORKTREE_MERGE, "guard": "refuse.sh", "commit": "see.sh"}, fixture=EventWorkerStarted)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    original_commit = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    repository.expect_merge_commits_after(ENVIRONMENT_BRANCH, original_commit, 1)
    story.expect_rows(not script_calls(story, "refuse.sh"), "were skipped" in story.system_log_text(), "runs only once" in story.system_log_text())
    story.run_listeners()
    story.expect_rows(len(script_calls(story, "see.sh")) == 1)
