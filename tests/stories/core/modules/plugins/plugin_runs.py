from core.base.command.bus import Bus
from core.modules.plugins.commands.deliver_plugin_event.deliver_plugin_event import DeliverPluginEvent
from core.modules.plugins.commands.record_plugin_fault.record_plugin_fault import RecordPluginFault
from tests.stories.core.modules.plugins.hooks import LISTING_SAMPLE, installed_story
from tests.stories.core.modules.plugins.plugin_calls import TRY_KEY, tried_story
from tests.stories.core.modules.plugins.support.event_stories import SECOND_JOB, TASK_CREATED, event_plugin_story, plugin_row, script_calls
from tests.stories.core.modules.plugins.worker_steps import step_plugin_story
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DELIVERY, FIRST_PROOF, dispatched_worker

EDIT_EVENT = "file_edited"
OLD_FAULT = "an old fault"
PROGRAM_SCRIPT = "program.sh"
PROGRAM_MANIFEST = {"program": PROGRAM_SCRIPT, "hears": [EDIT_EVENT], "scripts": {PROGRAM_SCRIPT: ""}}
MAIN_ENVIRONMENT = 1


def with_a_fault(story, name="events"):
    story.container.get(Bus).run(RecordPluginFault(plugin_row(story, name).id, OLD_FAULT), story.user)
    story.expect_rows(plugin_row(story, name).fault_count == 1)


def deliver_file_edit(story):
    story.container.get(Bus).run(DeliverPluginEvent(plugin_row(story).id, None, EDIT_EVENT, "{}", ""), story.user, environment_id=MAIN_ENVIRONMENT)


def test_a_hears_delivery_of_a_plugin_with_changed_files_does_not_run_and_switches_it_off(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "see.sh"}, **PROGRAM_MANIFEST)
    story.run_listeners()
    call_count = len(script_calls(story, PROGRAM_SCRIPT))
    script = story.home.folder / "plugins" / "events" / PROGRAM_SCRIPT
    script.write_text(script.read_text() + "\n")
    deliver_file_edit(story)
    story.run_listeners()
    story.expect_rows(len(script_calls(story, PROGRAM_SCRIPT)) == call_count, plugin_row(story).enabled is False)


def test_a_clean_hears_delivery_clears_a_fault(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "see.sh"}, **PROGRAM_MANIFEST)
    story.run_listeners()
    with_a_fault(story)
    call_count = len(script_calls(story, PROGRAM_SCRIPT))
    deliver_file_edit(story)
    story.run_listeners()
    story.expect_rows(len(script_calls(story, PROGRAM_SCRIPT)) == call_count + 1, plugin_row(story).fault_count == 0, plugin_row(story).last_fault == "")


def test_a_clean_guard_script_clears_a_fault(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "see.sh"})
    with_a_fault(story)
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.expect_rows(plugin_row(story).fault_count == 0)


def test_a_clean_commit_script_clears_a_fault(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "see.sh"})
    with_a_fault(story)
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.expect_rows(plugin_row(story).fault_count == 0)


def test_a_clean_answer_to_a_hook_clears_a_fault(new_story):
    story = installed_story(new_story)
    with_a_fault(story, "sample")
    story.hook("s-1", LISTING_SAMPLE)
    story.run_listeners()
    story.expect_rows(plugin_row(story, "sample").fault_count == 0)


def test_a_clean_answer_to_a_workers_step_clears_a_fault(new_story):
    story = step_plugin_story(new_story, "worker_delivering")
    with_a_fault(story, "steps")
    worker = dispatched_worker(story)
    story.repository.changed(worker.id, "notes.md", "Notes\n")
    story.run(FIRST_PROOF, actor=worker)
    story.expect_success(DELIVERY, actor=worker)
    story.expect_rows(plugin_row(story, "steps").fault_count == 0)


def test_a_clean_try_shows_its_answer_and_leaves_a_fault_since_a_try_is_a_read(new_story):
    story = tried_story(new_story, "")
    with_a_fault(story, "tidy-worktrees")
    story.expect_text(f"plugin try tidy-worktrees {TRY_KEY} --agent {story.worker.id}", TRY_KEY, actor=story.user)
    story.run_listeners()
    story.expect_rows(plugin_row(story, "tidy-worktrees").fault_count == 1)
