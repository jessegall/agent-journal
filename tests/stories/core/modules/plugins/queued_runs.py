import json
import os
from datetime import timedelta
from pathlib import Path

from core.modules.plugins.support.machine_runs import MACHINE_FOLDER_VARIABLE
from core.modules.processes.models.enums.process_setting import ProcessSetting
from tests.stories.core.modules.plugins.plugin_calls import worker_with_tools
from tests.stories.core.modules.plugins.support.event_stories import script_calls
from tests.stories.core.modules.plugins.support.plugin_samples import event_plugin_folder
from tests.stories.core.modules.plugins.support.runner_binaries import recording_runner_at
from tests.stories.core.modules.processes.output_timeout import timeout_tick

PLUGIN = "queues"
ENDED_EVENT = "core.plugins.queued_run.ended"
PROCESSES = [{"kind": "judge", "title": "Judging the project", "at_once": "judge_at_once"},
             {"kind": "index", "coalesce": True},
             {"kind": "shared", "at_once": "judge_at_once", "scope": "machine"},
             {"kind": "big", "memory_mb": 1_000_000_000}]
SETTINGS = [{"key": "judge_at_once", "title": "Judges at once", "kind": "number", "default": 1, "help": "How many judges may run at once"}]


def queues_plugin(new_story):
    story = worker_with_tools(new_story)
    folder = event_plugin_folder(story.home.folder.parent / "sources", [{"event": ENDED_EVENT, "commit": "ended.sh"}], {"ended.sh": ""}, name=PLUGIN,
                                 processes=PROCESSES, settings="settings.json")
    (folder / "settings.json").write_text(json.dumps(SETTINGS))
    story.expect_success(f"plugin install {folder} --yes", actor=story.user)
    story.run_listeners()
    recording_runner_at(story.home)
    story.expect_success(f"setting set {ProcessSetting.RUN_BATCH_SIZE.key} 5 --project", actor=story.user)
    return story


def queued(story, category: str, *flags: str, line: str = "true") -> int:
    outcome = story.run(f"plugin queue {PLUGIN} --kind {category} --agent {story.worker.id} --detach {' '.join(flags)} -- {line}", actor=story.user)
    terms = outcome.output_text.split()
    assert outcome.code == 0 and terms[:1] == ["run"] and terms[1].isdigit(), outcome.output_text
    return int(terms[1])


def shown(story, run: int) -> dict[str, object]:
    return json.loads(story.run(f"plugin queue-show {run} --json", actor=story.user).output_text)


def ended(story, run: int, exit_code: int = 0) -> None:
    story.expect_success(f"process end {shown(story, run)['process_id']} --exit-code {exit_code} --bytes 0 --lines 0", actor=story.worker)


def test_a_kind_limited_to_one_gives_the_free_place_to_the_run_at_agent_priority_and_tells_each_end(new_story):
    story = queues_plugin(new_story)
    first, normal, cancelled = queued(story, "judge"), queued(story, "judge"), queued(story, "judge")
    high = queued(story, "judge", "--priority", "agent")
    story.expect_rows(shown(story, first)["state"] == "running", shown(story, normal)["state"] == "waiting")
    story.expect_text(f"plugin queue-cancel {cancelled}", "cancelled", actor=story.user)
    story.expect_refusal(f"plugin queue-cancel {cancelled}", "is over already", actor=story.user)
    ended(story, first, 3)
    story.run_listeners()
    calls = script_calls(story, "ended.sh", PLUGIN)
    rows = {call["data"]["row"]["id"]: call["data"]["row"] for call in calls}
    story.expect_rows(shown(story, first)["state"] == "ended", shown(story, first)["exit_code"] == 3, shown(story, high)["state"] == "running",
                      shown(story, normal)["state"] == "waiting", sorted(rows) == sorted([first, cancelled]), rows[first]["run_name"] == "judge",
                      rows[cancelled]["state"] == "cancelled", detail=json.dumps(calls)[:600])


def test_runs_wait_for_a_machine_wide_count_and_free_memory_join_a_waiting_twin_and_stop_at_their_timeout(new_story):
    story = queues_plugin(new_story)
    machine = Path(os.environ[MACHINE_FOLDER_VARIABLE])
    different = machine / "machine-runs" / PLUGIN / "shared" / "other-project-7"
    different.parent.mkdir(parents=True)
    different_pid = machine / "other-project-7.pid"
    different_pid.write_text(str(os.getpid()))
    different.write_text(str(different_pid))
    shared, big = queued(story, "shared"), queued(story, "big")
    story.expect_rows(shown(story, shared)["state"] == "waiting", shown(story, big)["state"] == "waiting")
    different.unlink()
    timed = queued(story, "judge", "--timeout", "60")
    story.expect_rows(shown(story, shared)["state"] == "running")
    story.expect_success("queue halt 'a deploy is going'", actor=story.user)
    index, repeated, different_line = queued(story, "index", line="make index"), queued(story, "index", line="make index"), queued(story, "index", line="make other")
    story.expect_rows(index == repeated, different_line != index)
    story.advance(timedelta(minutes=2))
    timeout_tick(story)
    story.expect_rows(shown(story, timed)["state"] == "timed-out", shown(story, timed)["timed_out"] in (True, 1), detail=json.dumps(shown(story, timed)))


def test_a_queued_run_reads_what_it_printed_and_an_undeclared_kind_or_a_missing_agent_is_refused(new_story):
    story = queues_plugin(new_story)
    story.expect_refusal(f"plugin queue {PLUGIN} --kind lint --agent {story.worker.id} --detach -- true", "declares no kind of run named lint", actor=story.user)
    story.expect_refusal(f"plugin queue {PLUGIN} --kind judge --detach -- true", "only an agent has a checkout", actor=story.user)
    run = queued(story, "judge")
    story.expect_text(f"plugin queue-show {run}", f"run {run} of {PLUGIN} judge is running", actor=story.user)
    story.expect_rows(story.run(f"plugin queue-read {run} --tail 5", actor=story.user).code == 0)

