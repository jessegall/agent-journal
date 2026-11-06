from core.base.command.bus import Bus
from core.base.query.queries import Queries
from tests.stories.core.modules.plugins.support.event_modules import NOTE_CREATED, NOTES, EventNote, ManyNotes
from tests.stories.core.modules.plugins.support.event_stories import (
    NOTES_PIN_TITLE, REFUSAL, SECOND_JOB, commands_as_in_a_server, SECOND_JOB_TITLE, TASK_CREATED, EventWorkerStarted, answer_with_commands, deliveries, event_page, event_plugin_story, install_event_plugin, pins_titled,
    script_calls, tasks_titled)
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

NOTE_COUNT = 30
ROUND_LIMIT = 20
WORKTREE_MERGE = "suites.coding.workers.worker_worktree.merge"
SECOND_PIN_TITLE = "More notes"
SECOND_PIN_LINE = f'pin make "{SECOND_PIN_TITLE}" --link https://example.org/more --environment main'


def test_s31_two_guards_run_in_install_order_and_the_first_refusal_stops_the_second(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "refuse.sh"})
    install_event_plugin(story, {"event": TASK_CREATED, "guard": "see.sh"}, name="second")
    story.expect_refusal(SECOND_JOB, REFUSAL, actor=story.agent)
    story.expect_rows(len(script_calls(story, "refuse.sh")) == 1, not script_calls(story, "see.sh", "second"))


def test_s31_when_the_first_guard_faults_the_second_still_decides(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "fail.sh"})
    install_event_plugin(story, {"event": TASK_CREATED, "guard": "refuse.sh"}, name="second")
    story.expect_refusal(SECOND_JOB, "[plugin second] not today", actor=story.agent)
    story.expect_rows(len(script_calls(story, "fail.sh")) == 1, not tasks_titled(story, SECOND_JOB_TITLE))


def test_s31_two_listen_scripts_both_add_their_lines(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "listen": "pin.sh"})
    install_event_plugin(story, {"event": TASK_CREATED, "listen": "more.sh"}, scripts={"more.sh": answer_with_commands(SECOND_PIN_LINE)}, name="second")
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.expect_rows(len(pins_titled(story, NOTES_PIN_TITLE)) == 1, len(pins_titled(story, SECOND_PIN_TITLE)) == 1)


def test_s31_two_commit_scripts_each_get_their_own_delivery(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "see.sh"})
    install_event_plugin(story, {"event": TASK_CREATED, "commit": "see.sh"}, name="second")
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.expect_rows(len(deliveries(story)) == 2)
    story.run_listeners()
    story.expect_rows(len(script_calls(story, "see.sh")) == 1, len(script_calls(story, "see.sh", "second")) == 1)


def test_s32_a_plugin_that_is_off_gets_no_script_and_coming_back_on_replays_nothing(event_page):
    story = event_page.story
    install_event_plugin(story, {"event": TASK_CREATED, "guard": "guard.sh", "listen": "pin.sh", "commit": "see.sh"}, scripts={"guard.sh": ""})
    commands_as_in_a_server(story)
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.expect_rows(len(deliveries(story)) == 1)
    initial_guard_count, initial_listen_count = len(script_calls(story, "guard.sh")), len(script_calls(story, "pin.sh"))
    event_page.disable()
    story.run_listeners()
    story.expect_rows(not script_calls(story, "see.sh"))
    story.expect_success('task make "Third job" --brief "Do it" --environment main', actor=story.agent)
    story.run_listeners()
    story.expect_rows(len(script_calls(story, "guard.sh")) == initial_guard_count, len(script_calls(story, "pin.sh")) == initial_listen_count, not script_calls(story, "see.sh"))
    event_page.enable()
    story.run_listeners()
    story.expect_rows(not script_calls(story, "see.sh"))
    story.expect_success('task make "Fourth job" --brief "Do it" --environment main', actor=story.agent)
    story.run_listeners()
    story.expect_rows(len(script_calls(story, "guard.sh")) == 2, len(script_calls(story, "see.sh")) == 1)


def test_s33_a_command_on_thirty_rows_stops_asking_after_twenty_rounds_and_still_commits(new_story):
    story = event_plugin_story(new_story, {"event": NOTE_CREATED, "guard": "see.sh"}, modules=[NOTES])
    story.container.get(Bus).run(ManyNotes(NOTE_COUNT), story.user)
    notes = list(story.container.get(Queries).query(EventNote).all_rows())
    story.expect_rows(len(notes) == NOTE_COUNT, len(script_calls(story, "see.sh")) == ROUND_LIMIT, "were skipped" in story.system_log_text())


def test_s34_a_merge_runs_no_guard_script_and_runs_its_commit_script(new_story):
    story = event_plugin_story(new_story, {"event": WORKTREE_MERGE, "guard": "refuse.sh", "commit": "see.sh"}, fixture=EventWorkerStarted)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    original_commit = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    repository.expect_merge_commits_after(ENVIRONMENT_BRANCH, original_commit, 1)
    story.expect_rows(not script_calls(story, "refuse.sh"), "were skipped" in story.system_log_text(), "runs only once" in story.system_log_text())
    story.run_listeners()
    story.expect_rows(len(script_calls(story, "see.sh")) == 1)


def test_s35_a_commit_script_does_not_hear_its_own_write(new_story):
    command_answer = answer_with_commands('task make "Written by the script" --brief "Do it" --environment main')
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "write.sh"}, scripts={"write.sh": command_answer})
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.run_listeners()
    story.expect_rows(len(tasks_titled(story, "Written by the script")) == 1, len(script_calls(story, "write.sh")) == 1)
