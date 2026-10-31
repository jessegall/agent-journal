"""Times version 5's whole hook path: builds tools/journal-hook into a scratch folder, starts a scratch version 5 server
on a journal folder that is the .journal of a scratch project root, replays the recorded Claude bodies through the
built binary as journal-hook claude <root> with AGENT_JOURNAL_ACTIVE=1, and prints the median and 95th percentile of
each step per event from the server's runtime/timing.log. Run with PYTHONPATH=src:. python3 scripts/measure_hook_path.py;
it is a measurement, never part of the test run. Every subprocess has a time limit, and the server is stopped by the
process that holds its socket, never by name."""
import json
import os
import signal
import statistics
import subprocess
import sys
import tempfile
import time
from pathlib import Path

from core.base.journal_home import JournalHome
from core.base.timing import Timing
from core.testing.template_databases import TemplateDatabases
from server.server_files import socket_path
from scripts.timing_report import logged_timings, report
from tests.stories.core.support.coding_fixtures import BuilderWithStartedTask

ROOT = Path(__file__).resolve().parents[1]
RECORDED = ROOT / "tools" / "journal-hook" / "testdata" / "recorded" / "claude"
EVENTS = ("SessionStart", "UserPromptSubmit", "PreToolUse", "PostToolUse", "PostToolUseFailure", "MessageDisplay", "Stop", "SubagentStop", "PreCompact", "SessionEnd")
BODIES_PER_EVENT = 40
BUILD_TIMEOUT_SECONDS = 180
HOOK_TIMEOUT_SECONDS = 20
SERVER_WAIT_SECONDS = 30
LSOF_TIMEOUT_SECONDS = 10
STEPS = (("preparation (go_start -> go_sent)", "go_start", "go_sent"), ("request (go_sent -> server_received)", "go_sent", "server_received"),
         ("server parse (server_received -> hook_read)", "server_received", "hook_read"), ("rules and write (hook_read -> hook_answered)", "hook_read", "hook_answered"),
         ("server answer (hook_answered -> answered)", "hook_answered", "answered"))
WHOLE_HOOK = "whole hook (process start to exit)"


def sampled(lines: list[str]) -> list[str]:
    stride = max(1, len(lines) // BODIES_PER_EVENT)
    return lines[::stride][:BODIES_PER_EVENT]


def built(scratch: Path) -> Path:
    binary = scratch / "journal-hook"
    subprocess.run(["go", "build", "-o", str(binary), "."], cwd=ROOT / "tools" / "journal-hook", check=True, timeout=BUILD_TIMEOUT_SECONDS,
                   capture_output=True, env={**os.environ, "CGO_ENABLED": "0"})
    return binary


def project(scratch: Path) -> Path:
    """The project root whose .journal is a journal made by the coding stories' builder with a task in hand."""
    root = scratch / "project"
    TemplateDatabases(scratch / "templates").story(root / ".journal", (), BuilderWithStartedTask).close()
    (root / ".journal" / "port").write_text("1\n")
    (root / ".journal" / "hooks-on-socket").write_text("")
    return root


def socket_holders(socket: Path) -> list[int]:
    found = subprocess.run(["lsof", "-t", str(socket)], capture_output=True, text=True, timeout=LSOF_TIMEOUT_SECONDS)
    return [int(pid) for pid in found.stdout.split()]


def stopped(server: subprocess.Popen[str], socket: Path) -> None:
    for pid in socket_holders(socket):
        if pid != os.getpid():
            os.kill(pid, signal.SIGTERM)
    try:
        server.wait(LSOF_TIMEOUT_SECONDS)
    except subprocess.TimeoutExpired:
        server.kill()
        server.wait(LSOF_TIMEOUT_SECONDS)


def started(root: Path) -> tuple[subprocess.Popen[str], Path]:
    home = root / ".journal"
    environment = {"PATH": os.environ.get("PATH", ""), "PYTHONPATH": str(ROOT / "src")}
    server = subprocess.Popen([sys.executable, str(ROOT / "src" / "server" / "server.py"), "--home", str(home)], env=environment, text=True,
                              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    socket = socket_path(JournalHome(home))
    deadline = time.monotonic() + SERVER_WAIT_SECONDS
    while not socket.exists() and time.monotonic() < deadline:
        time.sleep(0.05)
    assert socket.exists(), "the scratch server never opened its socket"
    return server, socket


def replayed(binary: Path, root: Path) -> dict[str, tuple[str, float]]:
    """Runs every sampled body through the binary and returns, by the hook's process id, its event and its wall time."""
    environment = {"PATH": os.environ.get("PATH", ""), "HOME": os.environ.get("HOME", ""), "AGENT_JOURNAL_ACTIVE": "1", "JOURNAL_ENV": "main"}
    runs: dict[str, tuple[str, float]] = {}
    for event in EVENTS:
        for body in sampled((RECORDED / f"{event}.jsonl").read_text().splitlines()):
            started_at = time.perf_counter()
            process = subprocess.Popen([str(binary), "claude", str(root)], stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, env=environment, cwd=root, text=True)
            try:
                process.communicate(body, timeout=HOOK_TIMEOUT_SECONDS)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(HOOK_TIMEOUT_SECONDS)
                continue
            runs[str(process.pid)] = (event, (time.perf_counter() - started_at) * 1000)
    return runs


def stamp_gap(timing: Timing, first: str, second: str) -> float | None:
    stamps = dict(timing.stamps)
    if first not in stamps or second not in stamps:
        return None
    return (stamps[second] - stamps[first]) / 1000


def percentile(values: list[float], fraction: float) -> float:
    ordered = sorted(values)
    return ordered[min(len(ordered) - 1, int(len(ordered) * fraction))]


def figures(values: list[float]) -> str:
    return f"{statistics.median(values):8.2f} {percentile(values, 0.95):8.2f} {len(values):5}" if values else f"{'-':>8} {'-':>8} {0:5}"


def tables(runs: dict[str, tuple[str, float]], timing_log: Path) -> str:
    entries = [json.loads(line) for line in timing_log.read_text().splitlines()]
    by_event: dict[str, dict[str, list[float]]] = {event: {name: [] for name, _, _ in STEPS} | {WHOLE_HOOK: []} for event in EVENTS}
    for entry in entries:
        run = runs.get(entry["request_id"].split("-")[0])
        if run is None:
            continue
        event, wall_milliseconds = run
        timing = Timing.parsed(entry["timing"])
        by_event[event][WHOLE_HOOK].append(wall_milliseconds)
        for name, first, second in STEPS:
            gap = stamp_gap(timing, first, second)
            if gap is not None:
                by_event[event][name].append(gap)
    everything = {name: [value for event in EVENTS for value in by_event[event][name]] for name in by_event[EVENTS[0]]}
    rows = []
    for title, group in [("all events", everything), *[(event, by_event[event]) for event in EVENTS]]:
        rows.append(f"{title}")
        rows.append(f"  {'step':48} {'median ms':>8} {'p95 ms':>8} {'hooks':>5}")
        rows.extend(f"  {name:48} {figures(values)}" for name, values in group.items())
    return "\n".join(rows)


def main() -> int:
    with tempfile.TemporaryDirectory(prefix="measure-hook-path-") as folder:
        scratch = Path(folder)
        binary = built(scratch)
        root = project(scratch)
        server, socket = started(root)
        try:
            runs = replayed(binary, root)
        finally:
            stopped(server, socket)
        timing_log = root / ".journal" / "runtime" / "timing.log"
        print(f"{len(runs)} hooks replayed through the built journal-hook on a scratch server\n")
        print(tables(runs, timing_log))
        print("\nscripts/timing_report.py on the same log:\n")
        print(report(logged_timings(timing_log.read_text().splitlines())))
    return 0


if __name__ == "__main__":
    sys.exit(main())
