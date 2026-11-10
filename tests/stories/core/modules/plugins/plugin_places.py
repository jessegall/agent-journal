import io
import json
import shlex

from engine.caller.caller import Caller
from engine.cli.console import Console
from core.modules.processes.models.support.process_setting import ProcessSetting
from tests.stories.core.modules.plugins.plugin_calls import worker_with_tools
from tests.stories.core.modules.plugins.services import served_story
from tests.stories.core.modules.plugins.support.runner_binaries import recording_runner_at

RUN_LINE = "plugin run --agent {} -- sh ./tools/journal-run"


def queue_runs(story, section: str) -> list[dict[str, object]]:
    return json.loads(story.run("queue inspect --environment 1 --json", actor=story.user).output_text)[section]


def plugin_run(story, plugin: str) -> int:
    caller = Caller(story.user, 1, plugin_script=plugin)
    return story.container.get(Console).run(shlex.split(RUN_LINE.format(story.worker.id)), caller, io.StringIO())


def test_a_service_takes_no_place_in_the_process_queue(new_story):
    story = served_story(new_story)
    try:
        listed = [run for run in queue_runs(story, "running") if run["plugin"] == "served"]
        story.expect_rows(not listed)
        story.expect_absent("queue list --environment 1", "plugin served", actor=story.user)
    finally:
        story.processes.close()


def test_a_run_a_plugin_asks_for_takes_a_place_in_the_queue_under_its_name(new_story):
    story = worker_with_tools(new_story)
    recorded = recording_runner_at(story.home)
    story.expect_success(f"setting set {ProcessSetting.RUN_BATCH_SIZE.key} 1 --project", actor=story.user)
    story.expect_rows(plugin_run(story, "events") == 0)
    listed = [run for run in queue_runs(story, "running") if run["plugin"] == "events"]
    story.expect_rows(len(listed) == 1, listed[0]["uses_slot"] is True, "--queue" in json.loads(recorded.read_text())["arguments"])
