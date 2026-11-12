import io
import json
import shlex

from engine.caller.caller import Caller
from engine.cli.console import Console
from core.modules.processes.models.enums.process_setting import ProcessSetting
from tests.stories.core.modules.plugins.plugin_calls import worker_with_tools
from tests.stories.core.modules.plugins.support.plugin_samples import event_plugin_folder
from tests.stories.core.modules.plugins.support.runner_binaries import recording_runner_at

PLUGIN = "kinds"
PROCESSES = [{"kind": "judge", "title": "Judging the project", "category": "check", "at_once": "judge_at_once"}]
SETTINGS = [{"key": "judge_at_once", "title": "Judges at once", "kind": "number", "default": 1, "help": "How many judges may run at once"}]


def kinds_plugin(story):
    folder = event_plugin_folder(story.home.folder.parent / "sources", [], {}, name=PLUGIN, processes=PROCESSES, settings="settings.json")
    (folder / "settings.json").write_text(json.dumps(SETTINGS))
    story.expect_success(f"plugin install {folder} --yes", actor=story.user)
    story.run_listeners()
    recording_runner_at(story.home)
    story.expect_success(f"setting set {ProcessSetting.RUN_BATCH_SIZE.key} 3 --project", actor=story.user)
    return story


def plugin_run(story, *flags: str) -> int:
    line = shlex.split(f"plugin run --agent {story.worker.id} {' '.join(flags)} -- sh ./tools/journal-run")
    return story.container.get(Console).run(line, Caller(story.user, 1, plugin_script=PLUGIN), io.StringIO())


def queue(story) -> dict[str, list[dict[str, object]]]:
    return json.loads(story.run("queue inspect --environment 1 --json", actor=story.user).output_text)


def test_a_plugin_run_takes_a_queue_place_and_a_kind_limited_to_one_runs_one_at_a_time(new_story):
    story = kinds_plugin(worker_with_tools(new_story))
    story.expect_rows(plugin_run(story, "--kind", "lint") != 0)
    story.expect_rows(plugin_run(story, "--kind", "judge") == 0, plugin_run(story, "--kind", "judge") == 0, plugin_run(story) == 0)
    rows = queue(story)
    running = [run for run in rows["running"] if run["plugin"] == PLUGIN]
    waiting = [run for run in rows["waiting"] if run["plugin"] == PLUGIN]
    story.expect_rows(len(running) == 2, all(run["uses_slot"] for run in running), sorted(run["category"] for run in running) == ["check", "unknown"],
                      len(waiting) == 1, waiting[0]["category"] == "check", detail=json.dumps(rows)[:600])
