import io
import json
import shlex

from core.base.caller.caller import Caller
from core.base.cli.console import Console
from core.base.query.queries import Queries
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.processes.models.support.process_setting import ProcessSetting
from tests.stories.core.modules.plugins.plugin_calls import worker_with_tools
from tests.stories.core.modules.plugins.services import served_story
from tests.stories.core.modules.plugins.support.event_stories import SECOND_JOB, TASK_CREATED, event_plugin_story
from tests.stories.core.modules.plugins.support.runner_binaries import recording_runner_at

RUN_LINE = "plugin run --agent {} -- sh ./tools/journal-run"


def plugin_processes(story, plugin: str) -> list[Process]:
    return [process for process in story.container.get(Queries).query(Process).all_rows() if process.plugin == plugin]


def queue_runs(story, section: str) -> list[dict[str, object]]:
    return json.loads(story.run("queue inspect --environment 1 --json", actor=story.user).output_text)[section]


def run_for_plugin(story, plugin: str) -> int:
    caller = Caller(story.user, 1, plugin_script=plugin)
    return story.container.get(Console).run(shlex.split(RUN_LINE.format(story.worker.id)), caller, io.StringIO())


def test_a_service_runs_in_the_process_queue_under_its_plugins_name(new_story):
    story = served_story(new_story)
    try:
        listed = [run for run in queue_runs(story, "running") if run["plugin"] == "served"]
        story.expect_rows(len(listed) == 1, listed[0]["uses_slot"] is False)
        story.expect_text("queue list --environment 1", "plugin served", actor=story.user)
    finally:
        story.processes.close()


def test_a_plugin_switched_off_leaves_no_process_of_it_running(new_story):
    story = served_story(new_story)
    try:
        story.run("plugin disable served", actor=story.user)
        story.services.follow(story.processes)
        story.expect_rows(story.processes.running == {}, not [process for process in plugin_processes(story, "served") if process.state is ProcessState.RUNNING])
        story.expect_absent("queue list --environment 1", "plugin served", actor=story.user)
    finally:
        story.processes.close()


def test_a_run_a_plugin_asks_for_takes_a_place_in_the_queue_under_its_name(new_story):
    story = worker_with_tools(new_story)
    recorded = recording_runner_at(story.home)
    story.expect_success(f"setting set {ProcessSetting.RUN_BATCH_SIZE.key} 1 --project", actor=story.user)
    story.expect_rows(run_for_plugin(story, "events") == 0)
    listed = [run for run in queue_runs(story, "running") if run["plugin"] == "events"]
    story.expect_rows(len(listed) == 1, listed[0]["uses_slot"] is True, "--queue" in json.loads(recorded.read_text())["arguments"])


def test_a_run_a_plugin_asks_for_waits_when_every_place_is_taken(new_story):
    story = worker_with_tools(new_story)
    recording_runner_at(story.home)
    story.expect_success(f"setting set {ProcessSetting.RUN_BATCH_SIZE.key} 1 --project", actor=story.user)
    run_for_plugin(story, "events")
    run_for_plugin(story, "later")
    story.expect_rows([run["plugin"] for run in queue_runs(story, "running")] == ["events"], [run["plugin"] for run in queue_runs(story, "waiting")] == ["later"])


def test_a_script_on_an_event_runs_through_the_queue_and_leaves_its_row_ended(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "see.sh"})
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    runs = plugin_processes(story, "events")
    story.expect_rows(len(runs) >= 1, all(run.state is ProcessState.FINISHED and run.queued_at is None for run in runs))
