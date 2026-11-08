import json
from collections.abc import Sequence
from contextlib import contextmanager
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
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
from tests.stories.support.story_checks import expect_greater, expect_value


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
class ViewerBackingRows:
    main_messages: int
    unrelated_messages: int
    tasks: int
    memories: int
    questions: int
    documents: int


@dataclass(frozen=True)
class ViewerWorkload:
    identifier: str
    backing: ViewerBackingRows
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
        definition["counter_scope"] = "/api/line and /api/lines; joined callers entering JoinedRead; receipt HTTP excluded"
        return definition


def viewer_workload() -> ViewerWorkload:
    return ViewerWorkload(
        "viewer-post-funnel-v1", ViewerBackingRows(main_messages=100, unrelated_messages=15, tasks=100,
                                                  memories=2, questions=2, documents=2), 50, ((51, 75), (76, 100)),
        tuple((dock_type, model, number) for dock_type, model in (
            ("tasks.task", "task"), ("memories.memory", "memory"), ("questions.question", "question"),
            ("documents.doc", "doc"), ("processes.output", "process")) for number in (1, 2)),
        ("running", "background", "finished", "failed", "running"), (0, 0, 4096, 65536, 1024), 60, 30,
        tuple(WorkloadEvent(2 * index, index % 2 == 0,
                            ("message", "edit", str((51 if index % 2 == 0 else 101) + index // 2), "--text", f"Scheduled event {index:02d}"),
                            "main" if index % 2 == 0 else "elsewhere") for index in range(30)),
        (ReadLine("messages.chat", ("message", "feed", "--after-id", "50", "--before-id", "76", "--limit", "25")),
         ReadLine("messages.chat", ("message", "feed", "--after-id", "75", "--before-id", "101", "--limit", "25")),
         ReadLine("messages.chat", ("dock-item", "main")),
         ReadLine("tasks.tasks", ("task", "list", "--page", "2", "--limit", "5")),
         ReadLine("processes.outputs", ("process", "feed", "--limit", "5")),
         ReadLine("processes.output", ("output", "page", "4", "--limit", "5"))),
        {"journal.core.developer.tools": True, "journal.core.developer.tools.repeated-work": True,
         "journal.core.developer.tools.hooks.request-log": True,
         "journal.core.developer.tools.hooks.request-log-size": 10000,
         "journal.core.docking.most-items": 10, "journal.core.processes.orphan-seconds": 600})


class ViewerReadDataset(StoryFixture):
    parent = UserJoined

    def steps(self, story):
        backing = viewer_workload().backing
        story.expect_success("environment make elsewhere /work/elsewhere")
        story.expect_success("setting set journal.core.viewer.tour-completed true --project", actor=story.user)
        for number in range(1, backing.main_messages + 1):
            story.expect_success(f'message send "Displayed message {number:03d}" --environment main', actor=story.user)
        for number in range(1, backing.tasks + 1):
            story.expect_success(f'task make "Backing task {number:03d}" --environment main', actor=story.user)
        for number in range(backing.unrelated_messages):
            story.expect_success(f'message send "Unrelated message {number:02d}" --environment elsewhere', actor=story.user)
        for number in range(1, backing.memories + 1):
            story.expect_success(f'memory make "Memory {number}" --weight 5 --environment main', actor=story.user)
        for number in range(1, backing.questions + 1):
            story.expect_success(f'question ask "Question {number}?" --context "A sample question for the workload." --environment main', actor=story.agent)
        for number in range(1, backing.documents + 1):
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
    for dock_type, model, number in viewer_workload().docks:
        dock_id = story.new_row_id(f"dock add {dock_type} {model} {number} --environment main", actor=story.user)
        story.expect_success(f"dock keep {dock_id} --environment main", actor=story.user)


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
        value["database_scope"] = "command containers opened through Database.opened; request-log bookkeeping excluded"
        value["file_bytes_kind"] = "logical bytes through FileAccess and bounded output byte ranges, including cache hits"
        value["overhead_scope"] = "callbacks and query-plan collection; developer logging remains enabled"
        return value


@dataclass(frozen=True)
class PageReadComparison:
    small: ReadMeasurement
    large: ReadMeasurement

    def report(self) -> dict[str, object]:
        return {"small": self.small.report(), "large": self.large.report()}


class WorkloadServer:
    def __init__(self, server, prior_settings: dict[str, object]):
        self.server = server
        self.workload = viewer_workload()
        self.cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        self.prior_settings = prior_settings

    def manifest(self) -> dict[str, object]:
        return {**self.workload.manifest(), "settings_before": self.prior_settings,
                "restore_method": "restore child values through setting set, then restore the tools group; discard the story journal"}

    def message_page_comparison(self) -> PageReadComparison:
        return PageReadComparison(
            self.read([ReadLine("messages.chat", ("message", "feed", "--limit", "5"))]),
            self.read([ReadLine("messages.chat", ("message", "feed", "--limit", str(self.workload.backing.main_messages)))]))

    def output_page_comparison(self) -> PageReadComparison:
        return PageReadComparison(
            self.read([ReadLine("processes.output", ("output", "page", "4", "--limit", "5"))]),
            self.read([ReadLine("processes.output", ("output", "page", "4", "--limit", "1024"))]))

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

    def attributed_evidence(self, funnel: dict[str, object]) -> dict[str, object]:
        status, _, text = viewer_answer(self.server.viewer_port(), "/api/request-log-status", self.cookie, "")
        assert status == 200, text
        status = json.loads(text)
        rows = self.server.viewer_line_value(self.cookie, {"window": "developer.hook-requests", "environment": "main",
                                                          "line": ["developer", "hook-requests"]})["rows"]
        attributed = tuple(row["body"]["attribution"] for row in rows if
                           row["body"].get("attribution", {}).get("client_id") == funnel["client_id"])
        if "start_status" in funnel:
            start = funnel["start_status"]
            if status["epoch"] != start["epoch"]:
                raise IncompleteViewerSample.for_reason("the server restarted during the sample")
            attributed = tuple(row for row in attributed if
                               datetime.fromisoformat(funnel["opened_at"]) <= datetime.fromisoformat(row["received_at"]) <= datetime.fromisoformat(funnel["closed_at"]))
            status = {**status, **{key: status[key] - start[key] for key in (
                "attempted", "recorded", "dropped", "disabled", "receipt_dropped", "recording_ms")}}
        if not all(row["complete"] for row in attributed):
            raise IncompleteViewerSample.for_reason("some joined reads have no completion receipt")
        commands = {row["command_id"]: row for row in attributed}
        evidence = {"attribution": {"http_requests": len({row["request_id"] for row in attributed}),
                                    "logical_commands": len(attributed),
                                    "joined_callers": sum(row["joined_callers"] for row in commands.values()),
                                    "trailing_reads": sum(bool(row["followed_command_id"]) for row in commands.values())},
                    "retention": {"required": status["recorded"], "retained": status["retained"]},
                    "losses": {"attempted": status["attempted"], "recorded": status["recorded"], "dropped": status["dropped"]},
                    "funnel": funnel["counts"]}
        if status["receipt_dropped"] or funnel["receiptFailures"]:
            raise IncompleteViewerSample.for_reason("completion receipts were lost")
        validate_sample(evidence)
        return {**evidence, "epoch": status["epoch"], "retention_limit": status["retention_limit"],
                "recording_ms": status["recording_ms"], "settings": self.workload.settings}

    def read(self, lines: Sequence[ReadLine]) -> ReadMeasurement:
        databases = []
        statements = []
        plans = []
        file_sizes = []
        overhead = []
        open_database = Database.opened
        read_binary = FileAccess.binary
        byte_range = OutputFolder.byte_range

        def opened(home):
            database = open_database(home)
            started_at = perf_counter()

            def traced(sql):
                traced_at = perf_counter()
                statements.append(sql)
                overhead.append(perf_counter() - traced_at)

            database.connection.set_trace_callback(traced)
            databases.append(database)
            close_database = database.close

            def close():
                collected_at = perf_counter()
                database.connection.set_trace_callback(None)
                queries = tuple(dict.fromkeys(sql for sql in statements if sql.lstrip().upper().startswith("SELECT")))
                selected = tuple(sql for sql in queries if any(table in sql.lower() for table in (
                    "from chat_messages", "from messages", "from tasks", "from process_rows", "from dock_items")))
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
            counted_at = perf_counter()
            file_sizes.append(len(value))
            overhead.append(perf_counter() - counted_at)
            return value

        def output_range(folder, process_id, first, last):
            value = byte_range(folder, process_id, first, last)
            counted_at = perf_counter()
            file_sizes.append(len(value))
            overhead.append(perf_counter() - counted_at)
            return value

        started_at = perf_counter()
        with (patch.object(Database, "opened", side_effect=opened), patch.object(FileAccess, "binary", binary),
              patch.object(OutputFolder, "byte_range", output_range)):
            status, _, text = viewer_answer(self.server.viewer_port(), "/api/lines", self.cookie, "",
                                           {"lines": [asdict(line) for line in lines]})
        duration_ms = (perf_counter() - started_at) * 1000
        assert status == 200, text
        point_counts = PointTally()
        for database in databases:
            point_counts.add(database.repeated_work.points())
        return ReadMeasurement(tuple(json.loads(text)["answers"]), len(databases), len(text.encode()),
                               sum(file_sizes), point_counts.points(), len(statements), tuple(plans), duration_ms, sum(overhead) * 1000)


@contextmanager
def workload_server(new_story, *, listen: bool = False):
    story = new_story(fixture=ViewerReadDataset)
    tools_key = "journal.core.developer.tools"
    initial_values = {tools_key: json.loads(story.run(f"setting show {tools_key} --json", actor=story.user).output_text)}
    story.expect_success(f"setting switch {tools_key} on --project", actor=story.user)
    for key, value in viewer_workload().settings.items():
        if key == tools_key:
            continue
        initial_values[key] = json.loads(story.run(f"setting show {key} --json", actor=story.user).output_text)
        story.expect_success(f"setting set {key} {json.dumps(value)} --project", actor=story.user)
    story.advance(datetime.now(timezone.utc) - story.clock.timestamp().value)
    build_workload_outputs_and_docks(story)
    try:
        with server_story(story, listener_thread_started=listen) as server:
            yield WorkloadServer(server, initial_values)
    finally:
        for key, setting in initial_values.items():
            if key == tools_key:
                continue
            story.expect_success(f'setting set {key} {json.dumps(setting["value"])} --project', actor=story.user)
        state = "on" if initial_values[tools_key]["value"] else "off"
        story.expect_success(f"setting switch {tools_key} {state} --project", actor=story.user)


@pytest.fixture
def read_sample(new_story):
    with workload_server(new_story) as sample:
        yield sample


@pytest.fixture
def browser_sample(new_story):
    with workload_server(new_story) as sample:
        yield sample


@pytest.fixture
def scheduled_sample(new_story):
    with workload_server(new_story, listen=True) as sample:
        yield sample


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
    if any(type(evidence[section][key]) is not int or evidence[section][key] < 0
           for section in ("attribution", "funnel") for key in counts):
        raise IncompleteViewerSample.for_reason("every counter must be a nonnegative integer")
    if not {"attempted", "recorded", "dropped"} <= evidence["losses"].keys():
        raise IncompleteViewerSample.for_reason("every loss count is required")
    if not {"retained", "required"} <= evidence["retention"].keys():
        raise IncompleteViewerSample.for_reason("the retained and required record counts are required")
    losses = evidence["losses"]
    if losses["dropped"] != 0 or losses["attempted"] != losses["recorded"]:
        raise IncompleteViewerSample.for_reason("the log lost records")
    retention = evidence["retention"]
    if retention["retained"] < retention["required"] or retention["required"] < losses["recorded"]:
        raise IncompleteViewerSample.for_reason("retention cannot cover the interval")
    if evidence["attribution"] != evidence["funnel"]:
        raise IncompleteViewerSample.for_reason("the attributed log and funnel counters disagree")


def validate_workload_sample(sample_data: dict[str, object]) -> None:
    if not sample_data["sample_complete"]:
        raise IncompleteViewerSample.for_reason(sample_data["incomplete_reason"])
    validate_sample(sample_data["counter_agreement"])


def run_workload_browser(sample: WorkloadServer, tmp_path: Path, case: str = "schedule") -> dict[str, object]:
    measured = sample.read(sample.workload.reads).report()
    comparisons = {"messages": sample.message_page_comparison().report(), "output": sample.output_page_comparison().report()}
    manifest = tmp_path / "viewer-workload.json"
    measurement_file = tmp_path / f"viewer-{case}.json"
    FileAccess.shared().write(manifest, json.dumps(sample.manifest()))
    address = f"http://127.0.0.1:{sample.server.viewer_port()}/?key={sample.server.viewer_key('Ada')}&environment=main"
    script = Path(__file__).resolve().parents[3] / "src/viewer/tests/viewerReadCounts.browser.mjs"
    completed = subprocess.run(["node", str(script), address, str(manifest), str(measurement_file), case],
                               cwd=script.parent.parent, env=os.environ, capture_output=True, text=True, timeout=180)
    assert completed.returncode == 0, completed.stdout + completed.stderr
    sample_data = json.loads(FileAccess.shared().read(measurement_file))
    sample_data["server_reads"] = measured
    sample_data["page_comparisons"] = comparisons
    assert sample_data["workload"]["identifier"] == sample.workload.identifier
    assert sample_data["workload"]["build"] == json.loads(FileAccess.shared().read(manifest))["build"]
    try:
        sample_data["counter_agreement"] = sample.attributed_evidence(sample_data["result"]["funnel"])
        sample_data["sample_complete"] = True
    except IncompleteViewerSample as error:
        sample_data["sample_complete"] = False
        sample_data["incomplete_reason"] = str(error)
    status, _, text = viewer_answer(sample.server.viewer_port(), "/api/request-log-status", sample.cookie, "")
    assert status == 200, text
    sample_data["log_status"] = json.loads(text)
    FileAccess.shared().write(measurement_file, json.dumps(sample_data))
    print(json.dumps({"identifier": sample_data["workload"]["identifier"], "build": sample_data["workload"]["build"],
                      "dataset": sample_data["workload"]["dataset"], "case": case,
                      "sample_complete": sample_data["sample_complete"], "log_status": sample_data["log_status"],
                      "funnel": sample_data["result"]["funnel"]["counts"], "server_reads": measured,
                      "artifact": str(measurement_file)}, sort_keys=True))
    return sample_data


def run_canonical_viewer_workload(new_story, output_folder: Path) -> tuple[dict[str, object], ...]:
    output_folder.mkdir(parents=True, exist_ok=True)
    case_samples = []
    for case in ("schedule", "hidden-pane", "hidden-tab", "initially-hidden", "failure-return", "action-event-race"):
        with workload_server(new_story, listen=case == "schedule") as sample:
            case_samples.append(run_workload_browser(sample, output_folder, case))
    return tuple(case_samples)


def test_workload_pins_dataset_pages_docks_settings_and_schedule():
    workload = viewer_workload()
    expect_value(workload.identifier, "viewer-post-funnel-v1")
    expect_value(workload.displayed_rows, 50)
    expect_value(len(workload.docks), 10)
    expect_value(len(workload.events), 30)
    expect_value(sum(event.relevant for event in workload.events), 15)
    expect_value(workload.visible_seconds, 60)
    expect_value(workload.hidden_seconds, 30)
    expect_value(workload.loaded_ranges, ((51, 75), (76, 100)))
    expect_value(workload.settings["journal.core.developer.tools.repeated-work"], True)


def test_workload_records_and_restores_prior_setting_values(new_story):
    with workload_server(new_story) as sample:
        previous = sample.prior_settings
        story = sample.server.story
        expect_value(previous["journal.core.developer.tools"]["value"], False)
        expect_value(previous["journal.core.developer.tools.hooks.request-log-size"]["value"], 50)
        expect_value(sample.manifest()["settings_before"], previous)
    restored = json.loads(story.run("setting show journal.core.developer.tools --json", actor=story.user).output_text)
    expect_value(restored["value"], False)
    story.expect_success("setting switch journal.core.developer.tools on --project", actor=story.user)
    for key, value in previous.items():
        if key == "journal.core.developer.tools":
            continue
        restored = json.loads(story.run(f"setting show {key} --json", actor=story.user).output_text)
        expect_value(restored["value"], value["value"])
    story.expect_success("setting switch journal.core.developer.tools off --project", actor=story.user)


def test_real_batch_counters_include_payload_points_statements_and_plans(read_sample):
    measured = read_sample.read(read_sample.workload.reads)
    expect_value(all(answer["code"] == 0 for answer in measured.answers), True)
    expect_value(measured.connections, 1)
    expect_greater(measured.payload_bytes, 0)
    expect_greater(measured.points.rows, 0)
    expect_greater(measured.points.bytes, 0)
    expect_value(measured.statement_count >= len(measured.points.statements), True)
    expect_value(any("SELECT" in plan.sql.upper() for plan in measured.plans), True)
    expect_value(all(plan.steps for plan in measured.plans), True)
    print(json.dumps(measured.report(), sort_keys=True))


def test_fixture_creates_ten_mixed_docks_and_fifty_loaded_messages(read_sample):
    docks = read_sample.read([ReadLine("messages.chat", ("dock-item", "main"))]).answers[0]["value"]["rows"]
    active = [dock for dock in docks if dock["state"] == "docked"]
    expect_value(len(active), 10)
    expect_value(len({dock["type"] for dock in active}), 5)
    rows = read_sample.loaded_messages()
    expect_value(len(rows), 50)
    expect_value({row["id"] for row in rows}, set(range(51, 101)))


def test_older_loaded_rows_refresh_after_delete_and_an_action_event_race(read_sample):
    initial_values = read_sample.loaded_messages()
    expect_value(60 in {row["id"] for row in initial_values}, True)
    read_sample.action(("message", "delete", "60"))
    created = read_sample.action(("message", "send", "An action racing the refresh"))
    after = read_sample.loaded_messages()
    expect_value(60 not in {row["id"] for row in after}, True)
    expect_value(created["id"] not in {row["id"] for row in after}, True)
    expect_value({row["id"] for row in after}, set(range(51, 101)) - {60})


def test_small_page_does_not_load_the_large_message_backing_set(read_sample):
    comparison = read_sample.message_page_comparison()
    small, large = comparison.small, comparison.large
    expect_value(len(small.answers[0]["value"]["rows"]), 5)
    expect_value(len(large.answers[0]["value"]["rows"]), 100)
    expect_greater(large.points.rows, small.points.rows)
    expect_greater(large.points.bytes, small.points.bytes)
    expect_greater(large.payload_bytes, small.payload_bytes)


def test_output_bytes_and_small_pages_use_the_fixed_large_file(read_sample):
    comparison = read_sample.output_page_comparison()
    small, large = comparison.small, comparison.large
    expect_value(small.answers[0]["value"]["total"], 65536)
    expect_value(len(small.answers[0]["value"]["lines"]), 5)
    expect_value(len(large.answers[0]["value"]["lines"]), 1024)
    expect_greater(large.file_bytes, small.file_bytes)
    expect_greater(large.payload_bytes, small.payload_bytes)


def test_one_and_fifty_message_rows_are_one_answer_with_the_same_statements(read_sample):
    read_sample.read([ReadLine("messages.chat", ("message", "feed", "--limit", "1"))])
    one = read_sample.read([ReadLine("messages.chat", ("message", "feed", "--limit", "1"))])
    fifty = read_sample.read([ReadLine("messages.chat", ("message", "feed", "--limit", "50"))])
    print(json.dumps({"one": one.report(), "fifty": fifty.report()}, sort_keys=True))
    expect_value((len(one.answers), len(one.answers[0]["value"]["rows"])), (1, 1))
    expect_value((len(fifty.answers), len(fifty.answers[0]["value"]["rows"])), (1, 50))
    expect_value((one.connections, fifty.connections), (1, 1))
    expect_value(fifty.statement_count, one.statement_count)
    expect_value((one.points.tables["chat_messages"], fifty.points.tables["chat_messages"]), (1, 50))
    expect_greater(fifty.points.bytes, one.points.bytes)


def test_one_and_ten_docks_are_one_answer_with_the_same_statements(read_sample):
    line = [ReadLine("messages.chat", ("dock-item", "main"))]
    read_sample.read(line)
    ten = read_sample.read(line)
    for dock in [dock for dock in ten.answers[0]["value"]["rows"] if dock["state"] == "docked"][1:]:
        read_sample.action(("dock", "remove", str(dock["id"])))
    read_sample.read(line)
    one = read_sample.read(line)
    print(json.dumps({"one": one.report(), "ten": ten.report()}, sort_keys=True))
    expect_value(len([dock for dock in ten.answers[0]["value"]["rows"] if dock["state"] == "docked"]), 10)
    expect_value(len([dock for dock in one.answers[0]["value"]["rows"] if dock["state"] == "docked"]), 1)
    expect_value(ten.statement_count, one.statement_count)


def test_the_workload_reads_scan_no_large_table_whole(read_sample):
    measured = read_sample.read(read_sample.workload.reads)
    whole_reads = [(plan.sql, step) for plan in measured.plans for step in plan.steps
                   if (step.startswith("SCAN") and "USING" not in step) or step.startswith("USE TEMP B-TREE")]
    expect_value(whole_reads, [])


def test_an_agents_inspector_is_one_answer_on_one_connection(read_sample):
    agent_id = read_sample.server.story.agent.id
    measured = read_sample.read([ReadLine("agents.agent-detail", ("usage", "inspector", str(agent_id), "--environment", "main"))])
    print(json.dumps(measured.report(), sort_keys=True))
    expect_value((len(measured.answers), measured.answers[0]["code"], measured.connections), (1, 0, 1))
    expect_value(measured.answers[0]["value"]["agent"]["id"], agent_id)


def test_a_rows_two_people_are_one_answer_on_one_connection(read_sample):
    agent_id = read_sample.server.story.agent.id
    measured = read_sample.read([ReadLine("viewer.shell", ("agent", "people", "--creator", str(agent_id), "--owner", str(agent_id)))])
    expect_value((len(measured.answers), measured.answers[0]["code"], measured.connections), (1, 0, 1))
    expect_value((measured.answers[0]["value"]["actor"]["id"], measured.answers[0]["value"]["owner"]["id"]), (agent_id, agent_id))


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
def test_browser_visibility_failure_recovery_and_return(browser_sample, tmp_path, case):
    sample_data = run_workload_browser(browser_sample, tmp_path, case)
    if case != "failure-return":
        validate_workload_sample(sample_data)


def test_canonical_visible_and_hidden_schedule(scheduled_sample, tmp_path):
    sample_data = run_workload_browser(scheduled_sample, tmp_path)
    expect_value(sample_data["result"]["elapsedMs"] >= 90000, True)
    if sample_data["sample_complete"]:
        validate_workload_sample(sample_data)
        return
    expect_value(bool(sample_data["log_status"]["dropped"] or sample_data["log_status"]["receipt_dropped"]), True)
    with pytest.raises(IncompleteViewerSample):
        validate_workload_sample(sample_data)
