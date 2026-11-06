import json
from contextlib import contextmanager
from dataclasses import asdict, dataclass
from hashlib import sha256
from pathlib import Path
import os
import subprocess
from time import perf_counter
from unittest.mock import patch

import pytest

from core.base.database.database import Database
from core.base.database.point_tally import PointTally
from core.base.database.points import Points
from core.base.file_access import FileAccess
from core.modules.processes.support.output_folder import OutputFolder
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.processes.support.process_samples import ended_run, moved_run, started_run
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story, viewer_answer


@dataclass(frozen=True)
class ReadLine:
    window: str
    line: tuple[str, ...]
    environment: str = "main"


@dataclass(frozen=True)
class WorkloadEvent:
    at_seconds: int
    relevant: bool
    line: tuple[str, ...]
    environment: str


@dataclass(frozen=True)
class ViewerWorkload:
    identifier: str
    displayed_rows: int
    loaded_ranges: tuple[tuple[int, int], ...]
    docks: tuple[tuple[str, str, int], ...]
    process_states: tuple[str, ...]
    output_bytes: tuple[int, ...]
    visible_seconds: int
    hidden_seconds: int
    events: tuple[WorkloadEvent, ...]
    reads: tuple[ReadLine, ...]
    settings: dict[str, object]

    def manifest(self) -> dict[str, object]:
        definition = asdict(self)
        source_root = Path(__file__).resolve().parents[3]
        source_files = (Path(__file__).resolve(), source_root / "src/viewer/tests/viewerReadCounts.browser.mjs",
                        *(source_root / "src/viewer/src" / name for name in (
                            "api/transport.js", "api/joinedRead.js", "windows/lineBatch.js",
                            "windows/windowContext.js", "windows/windowSubscriptions.js")))
        definition["build"] = sha256(b"".join(FileAccess.shared().binary(path) for path in source_files)).hexdigest()
        definition["dataset"] = sha256(json.dumps(asdict(self), sort_keys=True).encode()).hexdigest()
        return definition


def viewer_workload() -> ViewerWorkload:
    return ViewerWorkload(
        "viewer-post-funnel-v1", 50, ((51, 75), (76, 100)),
        tuple((kind, model, number) for kind, model in (
            ("tasks.task", "task"), ("memories.memory", "memory"), ("questions.question", "question"),
            ("documents.doc", "doc"), ("processes.output", "process")) for number in (1, 2)),
        ("running", "background", "finished", "failed", "running"), (0, 0, 4096, 65536, 1024), 60, 30,
        tuple(WorkloadEvent(2 * index, index % 2 == 0,
                            ("message", "send", f"Scheduled event {index:02d}"),
                            "main" if index % 2 == 0 else "elsewhere") for index in range(30)),
        (ReadLine("messages.chat", ("message", "feed", "--after-id", "50", "--before-id", "76", "--limit", "25")),
         ReadLine("messages.chat", ("message", "feed", "--after-id", "75", "--before-id", "101", "--limit", "25")),
         ReadLine("messages.chat", ("dock-item", "main")),
         ReadLine("tasks.tasks", ("task", "list", "--page", "2", "--limit", "5")),
         ReadLine("processes.outputs", ("output", "list", "--page", "1", "--limit", "5")),
         ReadLine("processes.output", ("output", "page", "4", "--limit", "5"))),
        {"journal.core.developer.tools": True, "journal.core.developer.tools.repeated-work": True,
         "journal.core.developer.tools.hooks.request-log": True,
         "journal.core.developer.tools.hooks.request-log-size": 10000})


class ViewerReadDataset(StoryFixture):
    parent = UserJoined

    def steps(self, story):
        story.expect_success("environment make elsewhere /work/elsewhere")
        story.expect_success("setting switch journal.core.developer.tools on --project", actor=story.user)
        for key, value in viewer_workload().settings.items():
            if key == "journal.core.developer.tools":
                continue
            story.expect_success(f"setting set {key} {json.dumps(value)} --project", actor=story.user)
        story.expect_success("setting set journal.core.viewer.tour-completed true --project", actor=story.user)
        for number in range(1, 101):
            story.expect_success(f'message send "Displayed message {number:03d}" --environment main', actor=story.user)
            story.expect_success(f'task make "Backing task {number:03d}" --environment main', actor=story.user)
        for number in (1, 2):
            story.expect_success(f'memory make "Memory {number}" --weight 5 --environment main', actor=story.user)
            story.expect_success(f'question ask "Question {number}?" --environment main', actor=story.agent)
            story.expect_success(f'doc make "Document {number}" --abstract "Workload document" --body "Fixed body" --environment main', actor=story.user)


def build_workload_outputs_and_docks(story) -> None:
    started_run(story, "workload running")
    moved_run(story, "workload background")
    ended_run(story, "workload finished", ("a" * 63 + "\n") * 64)
    ended_run(story, "workload failed", ("b" * 63 + "\n") * 1024, exit_code=1)
    running = started_run(story, "workload output")
    story.container.get(OutputFolder).write_output(running.id, 1, ("c" * 63 + "\n") * 16)
    current = json.loads(story.run("dock-item main --environment main --json", actor=story.user).output_text)
    for dock in current["rows"]:
        story.expect_success(f'dock remove {dock["id"]} --environment main', actor=story.user)
    for kind, model, number in viewer_workload().docks:
        story.expect_success(f"dock add {kind} {model} {number} --environment main", actor=story.user)


@dataclass(frozen=True)
class QueryPlan:
    sql: str
    steps: tuple[str, ...]


@dataclass(frozen=True)
class ReadMeasurement:
    answers: tuple[dict, ...]
    connections: int
    payload_bytes: int
    file_bytes: int
    points: Points
    statement_count: int
    plans: tuple[QueryPlan, ...]
    duration_ms: float
    measurement_overhead_ms: float

    def report(self) -> dict[str, object]:
        value = asdict(self)
        del value["answers"]
        value["points"] = {"rows": self.points.rows, "writes": self.points.writes, "bytes": self.points.bytes,
                           "tables": dict(self.points.tables), "statements": dict(self.points.statements),
                           "update_statements": dict(self.points.update_statements)}
        value["database_points"] = self.points.total
        value["file_bytes_kind"] = "logical bytes through FileAccess, including cache hits"
        value["overhead_scope"] = "callbacks and query-plan collection; developer logging remains enabled"
        return value


class WorkloadServer:
    def __init__(self, server):
        self.server = server
        self.workload = viewer_workload()
        self.cookie = server.expect_viewer_login(server.viewer_key("Ada"))

    def action(self, line: tuple[str, ...], environment: str = "main") -> object:
        status, _, text = viewer_answer(self.server.viewer_port(), "/api/line", self.cookie, "",
                                       asdict(ReadLine("messages.chat", line, environment)))
        assert status == 200, text
        answer = json.loads(text)
        assert answer["code"] == 0, answer
        return answer["value"]

    def loaded_messages(self) -> tuple[dict, ...]:
        measured = self.read(self.workload.reads[:2])
        assert all(answer["code"] == 0 for answer in measured.answers), measured.answers
        return tuple(row for answer in measured.answers for row in answer["value"]["rows"])

    def read(self, lines: tuple[ReadLine, ...]) -> ReadMeasurement:
        databases = []
        statements = []
        plans = []
        file_sizes = []
        overhead = []
        open_database = Database.opened
        read_binary = FileAccess.binary
        byte_range = OutputFolder.byte_range

        def opened(home):
            started_at = perf_counter()
            database = open_database(home)
            database.connection.set_trace_callback(statements.append)
            databases.append(database)
            close_database = database.close

            def close():
                collected_at = perf_counter()
                database.connection.set_trace_callback(None)
                selected = tuple(dict.fromkeys(sql for sql in statements if sql.lstrip().upper().startswith("SELECT")))[:3]
                for sql in selected:
                    rows = database.connection.execute("EXPLAIN QUERY PLAN " + sql).fetchall()
                    plans.append(QueryPlan(sql, tuple(str(row[3]) for row in rows)))
                overhead.append(perf_counter() - collected_at)
                close_database()

            database.close = close
            overhead.append(perf_counter() - started_at)
            return database

        def binary(access, path):
            value = read_binary(access, path)
            file_sizes.append(len(value))
            return value

        def output_range(folder, process_id, first, last):
            value = byte_range(folder, process_id, first, last)
            file_sizes.append(len(value))
            return value

        started_at = perf_counter()
        with (patch.object(Database, "opened", side_effect=opened), patch.object(FileAccess, "binary", binary),
              patch.object(OutputFolder, "byte_range", output_range)):
            status, _, text = viewer_answer(self.server.viewer_port(), "/api/lines", self.cookie, "",
                                           {"lines": [asdict(line) for line in lines]})
        duration_ms = (perf_counter() - started_at) * 1000
        assert status == 200, text
        tally = PointTally()
        for database in databases:
            tally.add(database.tally.points())
        return ReadMeasurement(tuple(json.loads(text)["answers"]), len(databases), len(text.encode()),
                               sum(file_sizes), tally.points(), len(statements), tuple(plans), duration_ms, sum(overhead) * 1000)


@contextmanager
def workload_server(new_story, *, listen: bool = False):
    story = new_story(fixture=ViewerReadDataset)
    build_workload_outputs_and_docks(story)
    with server_story(story, listener_thread_started=listen) as server:
        yield WorkloadServer(server)


class IncompleteViewerSample(AssertionError):
    @classmethod
    def for_reason(cls, reason: str):
        return cls(f"Incomplete viewer sample: {reason}")


def complete_sample_evidence() -> dict[str, object]:
    return {"attribution": {"http_requests": 1, "logical_commands": 2, "joined_callers": 1, "trailing_reads": 0},
            "retention": {"required": 2, "retained": 2}, "losses": {"attempted": 2, "recorded": 2, "dropped": 0},
            "funnel": {"http_requests": 1, "logical_commands": 2, "joined_callers": 1, "trailing_reads": 0}}


def validate_sample(evidence: dict[str, object]) -> None:
    required = {"attribution", "retention", "losses", "funnel"}
    if not required <= evidence.keys():
        raise IncompleteViewerSample.for_reason("attribution, retention, loss and funnel evidence are required")
    counts = {"http_requests", "logical_commands", "joined_callers", "trailing_reads"}
    if not counts <= evidence["attribution"].keys() or not counts <= evidence["funnel"].keys():
        raise IncompleteViewerSample.for_reason("every counter must have explicit attribution")
    losses = evidence["losses"]
    if losses["dropped"] != 0 or losses["attempted"] != losses["recorded"]:
        raise IncompleteViewerSample.for_reason("the log lost records")
    retention = evidence["retention"]
    if retention["retained"] < retention["required"] or retention["required"] < losses["recorded"]:
        raise IncompleteViewerSample.for_reason("retention cannot cover the interval")
    if evidence["attribution"] != evidence["funnel"]:
        raise IncompleteViewerSample.for_reason("the attributed log and funnel counters disagree")


def run_workload_browser(new_story, tmp_path: Path, case: str = "schedule") -> dict[str, object]:
    with workload_server(new_story, listen=True) as sample:
        manifest = tmp_path / "viewer-workload.json"
        result_file = tmp_path / f"viewer-{case}.json"
        FileAccess.shared().write(manifest, json.dumps(sample.workload.manifest()))
        address = f"http://127.0.0.1:{sample.server.viewer_port()}/?key={sample.server.viewer_key('Ada')}&environment=main"
        script = Path(__file__).resolve().parents[3] / "src/viewer/tests/viewerReadCounts.browser.mjs"
        completed = subprocess.run(["node", str(script), address, str(manifest), str(result_file), case],
                                   cwd=script.parent.parent, env=os.environ, capture_output=True, text=True, timeout=180)
        assert completed.returncode == 0, completed.stdout + completed.stderr
        result = json.loads(FileAccess.shared().read(result_file))
        assert result["workload"]["identifier"] == sample.workload.identifier
        assert result["workload"]["build"] == sample.workload.manifest()["build"]
        print(json.dumps(result, sort_keys=True))
        return result


def test_workload_pins_dataset_pages_docks_settings_and_schedule():
    workload = viewer_workload()
    assert workload.identifier == "viewer-post-funnel-v1"
    assert workload.displayed_rows == 50
    assert len(workload.docks) == 10
    assert len(workload.events) == 30
    assert sum(event.relevant for event in workload.events) == 15
    assert workload.visible_seconds == 60
    assert workload.hidden_seconds == 30
    assert workload.loaded_ranges == ((51, 75), (76, 100))
    assert workload.settings["journal.core.developer.tools.repeated-work"] is True


def test_real_batch_counters_include_payload_points_statements_and_plans(new_story):
    with workload_server(new_story) as sample:
        measured = sample.read(sample.workload.reads)
        assert all(answer["code"] == 0 for answer in measured.answers), measured.answers
        assert measured.connections == 1
        assert measured.payload_bytes > 0
        assert measured.points.rows > 0
        assert measured.points.bytes > 0
        assert measured.statement_count >= len(measured.points.statements)
        assert any("SELECT" in plan.sql.upper() for plan in measured.plans)
        assert all(plan.steps for plan in measured.plans)
        print(json.dumps(measured.report(), sort_keys=True))


def test_fixture_creates_ten_mixed_docks_and_fifty_loaded_messages(new_story):
    with workload_server(new_story) as sample:
        docks = sample.read((ReadLine("messages.chat", ("dock-item", "main")),)).answers[0]["value"]["rows"]
        assert len(docks) == 10
        assert len({dock["type"] for dock in docks}) == 5
        rows = sample.loaded_messages()
        assert len(rows) == 50
        assert {row["id"] for row in rows} == set(range(51, 101))


def test_older_loaded_rows_refresh_after_delete_and_an_action_event_race(new_story):
    with workload_server(new_story) as sample:
        before = sample.loaded_messages()
        assert 60 in {row["id"] for row in before}
        sample.action(("message", "delete", "60"))
        sample.action(("message", "send", "An action racing the refresh"))
        after = sample.loaded_messages()
        assert 60 not in {row["id"] for row in after}
        assert 101 not in {row["id"] for row in after}
        assert {row["id"] for row in after} == set(range(51, 101)) - {60}


def test_small_page_does_not_load_the_large_message_backing_set(new_story):
    with workload_server(new_story) as sample:
        small = sample.read((ReadLine("messages.chat", ("message", "feed", "--limit", "5")),))
        large = sample.read((ReadLine("messages.chat", ("message", "feed", "--limit", "100")),))
        assert len(small.answers[0]["value"]["rows"]) == 5
        assert len(large.answers[0]["value"]["rows"]) == 100
        assert small.points.rows < large.points.rows
        assert small.points.bytes < large.points.bytes
        assert small.payload_bytes < large.payload_bytes


def test_output_bytes_and_small_pages_use_the_fixed_large_file(new_story):
    with workload_server(new_story) as sample:
        small = sample.read((ReadLine("processes.output", ("output", "page", "4", "--limit", "5")),))
        large = sample.read((ReadLine("processes.output", ("output", "page", "4", "--limit", "1024")),))
        assert small.answers[0]["value"]["total"] == 65536
        assert len(small.answers[0]["value"]["lines"]) == 5
        assert len(large.answers[0]["value"]["lines"]) == 1024
        assert small.file_bytes < large.file_bytes
        assert small.payload_bytes < large.payload_bytes


@pytest.mark.parametrize("missing", ["attribution", "retention", "losses", "funnel"])
def test_baseline_rejects_missing_attribution_retention_losses_or_funnel(missing):
    evidence = complete_sample_evidence()
    del evidence[missing]
    with pytest.raises(IncompleteViewerSample):
        validate_sample(evidence)


@pytest.mark.parametrize("section,key,value", [
    ("losses", "dropped", 1), ("losses", "recorded", 1), ("retention", "retained", 1),
    ("funnel", "logical_commands", 3), ("attribution", "http_requests", None)])
def test_baseline_rejects_loss_eviction_disagreement_and_unattributed_http(section, key, value):
    evidence = complete_sample_evidence()
    evidence[section][key] = value
    with pytest.raises(IncompleteViewerSample):
        validate_sample(evidence)


def test_complete_attribution_and_funnel_agreement_is_accepted():
    validate_sample(complete_sample_evidence())


@pytest.mark.parametrize("case", ["hidden-pane", "hidden-tab", "initially-hidden", "failure-return", "action-event-race"])
def test_browser_visibility_failure_recovery_and_return(new_story, tmp_path, case):
    run_workload_browser(new_story, tmp_path, case)


def test_canonical_visible_and_hidden_schedule(new_story, tmp_path):
    result = run_workload_browser(new_story, tmp_path)
    assert result["result"]["elapsedMs"] >= 90000
