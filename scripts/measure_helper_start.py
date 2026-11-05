import argparse
import json
import os
import signal
import sqlite3
import statistics
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from dataclasses import asdict, dataclass, replace
from datetime import datetime, timezone
from enum import StrEnum
from pathlib import Path
from uuid import uuid4

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from core.base.journal_home import JournalHome
from core.base.private.private_folder import PrivateFolder
from core.base.private.server_keys import ServerKeys
from core.base.provider.helper_launch import HelperLaunch
from core.base.provider.program_folders import ProgramFolders
from core.base.provider.resumed_session import ResumedSession
from core.base.provider.session_start import SessionStart
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider
from core.modules.codex.providers.codex_provider import CodexProvider


JOB = """Read only. Answer this repository question in at most 180 words with file paths:
How does WorkerCommand.launched construct a HelperLaunch, how do ClaudeCodeProvider.helper_command
and CodexProvider.helper_command turn it into a process command, and how does AgentHookRoute bind
the first hook to a launch row? Read those three provider/worker files and the hook route to answer.
Do not edit files, change journal rows, run tests, use the network, or delegate this job further.
Return your answer to your parent, never address the user."""
WAKE_JOB = "Read-only measurement: a helper has returned its report. Acknowledge receipt in one sentence; use no tools."


class Kind(StrEnum):
    HELPER = "helper"
    NATIVE = "native"
    LEAN = "lean"
    CONCURRENT = "four-at-once"
    WARM = "wake-warm"
    COLD = "wake-cold"


class MeasurementFailed(RuntimeError):
    @classmethod
    def because(cls, detail: str) -> "MeasurementFailed":
        return cls(detail)


@dataclass(frozen=True)
class Usage:
    input_tokens: int
    cache_write: int
    cache_read: int
    output_tokens: int

    @property
    def context_tokens(self) -> int:
        return self.input_tokens + self.cache_write + self.cache_read

    def haiku_dollars(self) -> float:
        return (self.input_tokens + self.cache_write * 1.25 + self.cache_read * .1 + self.output_tokens * 5) / 1_000_000

    @classmethod
    def claude(cls, fields: dict) -> "Usage":
        return cls(fields["input_tokens"], fields.get("cache_creation_input_tokens", 0),
                   fields.get("cache_read_input_tokens", 0), fields["output_tokens"])

    @classmethod
    def codex(cls, fields: dict) -> "Usage":
        cached = fields["cached_input_tokens"]
        return cls(fields["input_tokens"] - cached, 0, cached, fields["output_tokens"])

    @classmethod
    def total(cls, usages: list["Usage"]) -> "Usage":
        return cls(*(sum(getattr(usage, field) for usage in usages) for field in cls.__dataclass_fields__))


@dataclass(frozen=True)
class Spec:
    program: str
    model: str
    kind: Kind
    number: int
    session: str
    resume: bool = False

    @property
    def label(self) -> str:
        return f"{self.program}-{self.kind}-{self.number}"

    def prompt(self) -> str:
        if self.resume:
            return WAKE_JOB
        if self.kind is Kind.NATIVE:
            return ("Use the Agent tool exactly once to send this bounded repository research job to a read-only "
                    "agent named Lady Lovelace, on model haiku (the cheapest allowed Claude model). "
                    "Put the following job text verbatim in its prompt. Do no repository reads yourself. "
                    "Return the agent's answer.\n\n" + JOB)
        return JOB


@dataclass(frozen=True)
class AgentRow:
    id: int
    parent_id: int | None
    session: str
    role: str
    ended_at: str | None


@dataclass(frozen=True)
class Snapshot:
    agents: tuple[AgentRow, ...]

    @classmethod
    def read(cls, home: JournalHome) -> "Snapshot":
        with sqlite3.connect(f"file:{home.database}?mode=ro", uri=True) as database:
            rows = database.execute("SELECT id,parent_id,session,role,ended_at FROM agents ORDER BY id").fetchall()
        return cls(tuple(AgentRow(*row) for row in rows))

    def check_parents(self, after: "Snapshot") -> None:
        parents = {row.id: row.parent_id for row in after.agents}
        moved = [row.id for row in self.agents if parents.get(row.id) != row.parent_id]
        if moved:
            raise MeasurementFailed.because(f"Agent parents changed: {moved}")


@dataclass(frozen=True)
class Result:
    spec: Spec
    agent_id: int
    first_hook: float | None
    first_tool: float | None
    first: Usage | None
    total: Usage | None
    first_dollars: float | None
    total_dollars: float | None
    peak_mib: float
    seconds: float
    returncode: int
    transcripts: tuple[str, ...]
    error: str

    def values(self) -> list:
        first = self.first
        total = self.total
        return [self.first_hook, self.first_tool, first.context_tokens if first else None,
                total.context_tokens if total else None, total.input_tokens if total else None,
                total.cache_write if total else None, total.cache_read if total else None,
                self.first_dollars, self.total_dollars, self.peak_mib, self.seconds]


def json_rows(path: Path) -> list[dict]:
    return [json.loads(line) for line in path.read_text().splitlines() if line.strip()]


def claude_usages(paths: list[Path], after_at: float) -> list[Usage]:
    messages = {}
    for path in paths:
        for row in json_rows(path):
            if row.get("type") != "assistant" or "usage" not in row.get("message", {}):
                continue
            if datetime.fromisoformat(row["timestamp"].replace("Z", "+00:00")).timestamp() < after_at:
                continue
            message = row["message"]
            messages[message["id"]] = Usage.claude(message["usage"])
    return list(messages.values())


def codex_usages(paths: list[Path], after_at: float) -> list[Usage]:
    usages = []
    previous = None
    for path in paths:
        for row in json_rows(path):
            payload = row.get("payload", {})
            if payload.get("type") != "token_count" or not payload.get("info"):
                continue
            if datetime.fromisoformat(row["timestamp"].replace("Z", "+00:00")).timestamp() < after_at:
                continue
            info = payload["info"]
            cumulative = info["total_token_usage"]
            if cumulative == previous:
                continue
            usages.append(Usage.codex(info["last_token_usage"]))
            previous = cumulative
    return usages


def process_tree_mib(roots: list[int]) -> float:
    output = subprocess.check_output(["ps", "-axo", "pid=,ppid=,rss="], text=True)
    processes = [tuple(map(int, line.split())) for line in output.splitlines()]
    members = set(roots)
    while True:
        children = {pid for pid, parent, _ in processes if parent in members}
        expanded = members | children
        if expanded == members:
            break
        members = expanded
    return sum(rss for pid, _, rss in processes if pid in members) / 1024


class Measurement:
    """Runs registered read-only sessions and keeps their raw output and measurements outside the journal."""

    def __init__(self, arguments: argparse.Namespace) -> None:
        self.arguments = arguments
        self.home = JournalHome(arguments.home.resolve())
        self.folder = arguments.project.resolve()
        self.output = arguments.output.resolve()
        self.output.mkdir(parents=True, exist_ok=True)
        folders = ProgramFolders()
        keys = ServerKeys(PrivateFolder(self.home))
        self.providers = {"claude": ClaudeCodeProvider(folders, keys), "codex": CodexProvider(folders, keys)}
        self.base_environment = {key: value for key, value in os.environ.items()
                                 if not key.startswith(("JOURNAL_", "AGENT_JOURNAL_", "CLAUDE", "CODEX_"))}
        for key in ("CLAUDE_CONFIG_DIR", "CODEX_HOME"):
            if key in os.environ:
                self.base_environment[key] = os.environ[key]
        self.variables = {"JOURNAL_HOME": str(self.home.folder), "JOURNAL_ENV": arguments.environment,
                          "AGENT_JOURNAL_ACTIVE": "1"}

    def register(self, spec: Spec) -> int:
        command = ["journal", "agent", "start", spec.session, spec.program, "subagent", "--parent",
                   str(self.arguments.parent), "--environment", self.arguments.environment, "--json"]
        response = subprocess.check_output(command, text=True)
        (self.output / f"{spec.label}-registration.json").write_text(response)
        rows = Snapshot.read(self.home).agents
        return next(row.id for row in rows if row.session == spec.session)

    def command(self, spec: Spec):
        provider = self.providers[spec.program]
        session = ResumedSession(spec.session) if spec.resume else SessionStart(spec.session)
        launch = HelperLaunch(root=self.home.project_folder, folder=self.folder, model=spec.model,
                              launch=spec.session, session=session, variables=self.variables, brief=spec.prompt())
        command = provider.helper_command(launch)
        arguments = list(command.arguments)
        if spec.kind is Kind.LEAN:
            flags = {"claude": ["--strict-mcp-config", "--mcp-config", '{"mcpServers":{}}', "--disable-slash-commands"],
                     "codex": ["--ignore-user-config"]}
            arguments[1:1] = flags[spec.program] if spec.program == "claude" else []
            if spec.program == "codex":
                arguments[2:2] = flags[spec.program]
        return replace(command, arguments=arguments, variables={**command.variables, "JOURNAL_LAUNCH": spec.session})

    def hook_seconds(self, agent_id: int, after_at: float) -> tuple[float | None, float | None]:
        with sqlite3.connect(f"file:{self.home.database}?mode=ro", uri=True) as database:
            rows = database.execute("SELECT created_at,hook FROM hook_calls WHERE agent_id=? ORDER BY id", (agent_id,)).fetchall()
        moments = [(datetime.fromisoformat(at).timestamp() - after_at, hook) for at, hook in rows]
        current = [(seconds, hook) for seconds, hook in moments if seconds >= 0]
        first = next((seconds for seconds, _ in current), None)
        tool = next((seconds for seconds, hook in current if hook == "pre_tool_use"), None)
        return first, tool

    def transcripts(self, spec: Spec, agent_id: int) -> list[Path]:
        row = next(row for row in Snapshot.read(self.home).agents if row.id == agent_id)
        path = self.providers[spec.program].transcript(self.folder, row.session)
        if path is None:
            return []
        if spec.kind is Kind.NATIVE:
            return sorted(path.with_suffix("").joinpath("subagents").glob("agent-*.jsonl"))
        return [path]

    def run(self, spec: Spec) -> Result:
        before = Snapshot.read(self.home)
        agent_id = self.register(spec)
        command = self.command(spec)
        output = self.output / f"{spec.label}.stdout.jsonl"
        errors = self.output / f"{spec.label}.stderr.txt"
        with output.open("w") as stdout, errors.open("w") as stderr:
            started_at = time.time()
            process = subprocess.Popen(command.arguments, cwd=command.folder,
                                       env={**self.base_environment, **command.variables},
                                       stdin=subprocess.DEVNULL, stdout=stdout, stderr=stderr, start_new_session=True)
            peak = self.wait(process)
        seconds = time.time() - started_at
        before.check_parents(Snapshot.read(self.home))
        first_hook, first_tool = self.hook_seconds(agent_id, started_at)
        paths = self.transcripts(spec, agent_id)
        parser = {"claude": claude_usages, "codex": codex_usages}[spec.program]
        usages = parser(paths, started_at)
        first = usages[0] if usages else None
        total = Usage.total(usages) if usages else None
        first_dollars = first.haiku_dollars() if first and spec.program == "claude" else None
        total_dollars = total.haiku_dollars() if total and spec.program == "claude" else None
        result = Result(spec, agent_id, first_hook, first_tool, first, total, first_dollars, total_dollars,
                        peak, seconds, process.returncode, tuple(str(path) for path in paths), errors.read_text())
        (self.output / f"{spec.label}.measurement.json").write_text(json.dumps(asdict(result), indent=2))
        print(table_row(spec.label, result.values()), flush=True)
        return result

    def wait(self, process: subprocess.Popen) -> float:
        deadline = time.monotonic() + self.arguments.timeout
        peak = 0.
        while process.poll() is None:
            peak = max(peak, process_tree_mib([process.pid]))
            if time.monotonic() >= deadline:
                os.killpg(process.pid, signal.SIGTERM)
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    os.killpg(process.pid, signal.SIGKILL)
                    process.wait()
                break
            time.sleep(.05)
        return peak


def shown(value) -> str:
    if value is None:
        return "N/A"
    if isinstance(value, float):
        return f"{value:.6f}"
    return str(value)


def table_row(label: str, values: list) -> str:
    return "| " + " | ".join([label, *(shown(value) for value in values)]) + " |"


def table(results: list[Result]) -> str:
    header = """| Run | Hook s | Tool s | First input incl cache | Job input incl cache | Job uncached input | Cache write | Cache read | First USD | Job USD | Peak tree MiB | Job s |
|---|---|---|---|---|---|---|---|---|---|---|---|"""
    rows = [table_row(result.spec.label, result.values()) for result in results]
    groups = sorted({(result.spec.program, result.spec.kind) for result in results})
    for program, kind in groups:
        selected = [result.values() for result in results if (result.spec.program, result.spec.kind) == (program, kind)]
        columns = list(zip(*selected))
        medians = [statistics.median(column) if all(value is not None for value in column) else None for column in columns]
        rows.append(table_row(f"{program}-{kind} median", medians))
    return header + "\n" + "\n".join(rows)


def main() -> None:
    parser = argparse.ArgumentParser(description="Measure helper startup without changing journal code or settings.")
    parser.add_argument("--home", type=Path, default=Path(os.environ["JOURNAL_HOME"]))
    parser.add_argument("--project", type=Path, required=True)
    parser.add_argument("--environment", required=True)
    parser.add_argument("--parent", type=int, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--timeout", type=float, default=240)
    parser.add_argument("--runs", type=int, default=5)
    parser.add_argument("--smoke", action="store_true")
    arguments = parser.parse_args()
    measurement = Measurement(arguments)
    before = Snapshot.read(measurement.home)
    (measurement.output / "agents-before.json").write_text(json.dumps(asdict(before), indent=2))
    results = []
    count = 1 if arguments.smoke else arguments.runs
    for number in range(1, count + 1):
        for program, model, kind in [("claude", "haiku", Kind.HELPER), ("codex", "gpt-6-luna", Kind.HELPER),
                                     ("claude", "haiku", Kind.NATIVE)]:
            results.append(measurement.run(Spec(program, model, kind, number, str(uuid4()))))
    if not arguments.smoke:
        for program, model in [("claude", "haiku"), ("codex", "gpt-6-luna")]:
            for number in range(1, arguments.runs + 1):
                results.append(measurement.run(Spec(program, model, Kind.LEAN, number, str(uuid4()))))
            specs = [Spec(program, model, Kind.CONCURRENT, number, str(uuid4())) for number in range(1, 5)]
            with ThreadPoolExecutor(max_workers=4) as executor:
                results.extend(executor.map(measurement.run, specs))
        parent = Spec("claude", "haiku", Kind.NATIVE, count + 1, str(uuid4()))
        results.append(measurement.run(parent))
        results.append(measurement.run(replace(parent, kind=Kind.WARM, resume=True)))
        cold_after_at = time.monotonic() + 310
        while time.monotonic() < cold_after_at:
            time.sleep(min(5, cold_after_at - time.monotonic()))
        results.append(measurement.run(replace(parent, kind=Kind.COLD, resume=True)))
    after = Snapshot.read(measurement.home)
    before.check_parents(after)
    (measurement.output / "agents-after.json").write_text(json.dumps(asdict(after), indent=2))
    (measurement.output / "results.json").write_text(json.dumps([asdict(result) for result in results], indent=2))
    (measurement.output / "table.md").write_text(table(results) + "\n")
    print(table(results), flush=True)


if __name__ == "__main__":
    main()
