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


def queued(story, kind: str, *flags: str, line: str = "true") -> int:
    outcome = story.run(f"plugin queue {PLUGIN} --kind {kind} --agent {story.worker.id} --detach {' '.join(flags)} -- {line}", actor=story.user)
    words = outcome.output_text.split()
    assert outcome.code == 0 and words[:1] == ["run"] and words[1].isdigit(), outcome.output_text
    return int(words[1])


def shown(story, run: int) -> dict[str, object]:
    return json.loads(story.run(f"plugin queue-show {run} --json", actor=story.user).output_text)


def ended(story, run: int, exit_code: int = 0) -> None:
    story.expect_success(f"process end {shown(story, run)['process_id']} --exit-code {exit_code} --bytes 0 --lines 0", actor=story.worker)


def test_a_queued_run_of_a_kind_limited_to_one_waits_for_the_one_before_it_and_its_end_is_told(new_story):
    story = queues_plugin(new_story)
    first, second = queued(story, "judge"), queued(story, "judge")
    story.expect_rows(shown(story, first)["state"] == "running", shown(story, second)["state"] == "waiting")
    ended(story, first, 3)
    story.run_listeners()
    calls = script_calls(story, "ended.sh", PLUGIN)
    story.expect_rows(shown(story, first)["state"] == "ended", shown(story, first)["exit_code"] == 3, shown(story, second)["state"] == "running",
                      [call["data"]["row"]["id"] for call in calls] == [first], calls[0]["data"]["row"]["kind"] == "judge", calls[0]["data"]["row"]["timed_out"] in (False, 0),
                      detail=json.dumps(calls)[:600])


def test_a_high_priority_run_takes_the_free_place_before_an_older_normal_one(new_story):
    story = queues_plugin(new_story)
    running, normal = queued(story, "judge"), queued(story, "judge")
    high = queued(story, "judge", "--priority", "high")
    ended(story, running)
    story.expect_rows(shown(story, high)["state"] == "running", shown(story, normal)["state"] == "waiting")


def test_a_second_waiting_run_of_a_coalescing_kind_joins_the_first(new_story):
    story = queues_plugin(new_story)
    story.expect_success("queue halt 'a deploy is going'", actor=story.user)
    first, again = queued(story, "index", line="make index"), queued(story, "index", line="make index")
    other = queued(story, "index", line="make other")
    story.expect_rows(first == again, other != first)


def test_a_cancelled_run_stops_and_reads_cancelled(new_story):
    story = queues_plugin(new_story)
    queued(story, "judge")
    waiting = queued(story, "judge")
    story.expect_text(f"plugin queue-cancel {waiting}", "cancelled", actor=story.user)
    story.expect_refusal(f"plugin queue-cancel {waiting}", "is over already", actor=story.user)


def test_a_run_past_its_timeout_is_stopped_and_reads_timed_out(new_story):
    story = queues_plugin(new_story)
    run = queued(story, "judge", "--timeout", "60")
    story.advance(timedelta(minutes=2))
    timeout_tick(story)
    story.expect_rows(shown(story, run)["state"] == "timed-out", shown(story, run)["timed_out"] is True, detail=json.dumps(shown(story, run)))


def test_a_machine_wide_kind_counts_a_run_of_another_project_and_a_kind_short_of_free_memory_waits(new_story):
    story = queues_plugin(new_story)
    machine = Path(os.environ[MACHINE_FOLDER_VARIABLE])
    other = machine / "machine-runs" / PLUGIN / "shared" / "other-project-7"
    other.parent.mkdir(parents=True)
    other_pid = machine / "other-project-7.pid"
    other_pid.write_text(str(os.getpid()))
    other.write_text(str(other_pid))
    run = queued(story, "shared")
    story.expect_rows(shown(story, run)["state"] == "waiting")
    other.unlink()
    story.expect_success(f"process end {shown(story, queued(story, 'judge'))['process_id']} --exit-code 0 --bytes 0 --lines 0", actor=story.worker)
    story.expect_rows(shown(story, run)["state"] == "running")
    big = queued(story, "big")
    story.expect_rows(shown(story, big)["state"] == "waiting")


def test_a_queued_run_reads_what_it_printed_and_an_undeclared_kind_or_a_missing_agent_is_refused(new_story):
    story = queues_plugin(new_story)
    run = queued(story, "judge")
    story.expect_rows(story.run(f"plugin queue-read {run} --tail 5", actor=story.user).code == 0)
    story.expect_refusal(f"plugin queue {PLUGIN} --kind lint --agent {story.worker.id} --detach -- true", "declares no kind of run named lint", actor=story.user)
    story.expect_refusal(f"plugin queue {PLUGIN} --kind judge --detach -- true", "only an agent has a checkout", actor=story.user)
