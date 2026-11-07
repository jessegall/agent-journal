from types import SimpleNamespace
import json
import time
import subprocess
import threading
from pathlib import Path
from unittest.mock import Mock

import pytest

from core.base.agent_checkouts import AgentCheckouts
from core.base.journal_home import JournalHome
from core.base.plugin_script_processes import PluginScriptProcesses
from core.base.timestamp import Timestamp
from core.modules.plugins.support.plugin_call import PluginCall
from core.modules.plugins.support.plugin_event import PluginEvent
from core.modules.plugins.support.plugin_fault_error import PluginFaultError
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_late_error import PluginLateError
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_program import PluginProgram, STOP_LIMIT_SECONDS
from core.modules.plugins.support.plugin_socket_paths import PluginSocketPaths

DETACHED_CHILD_PROGRAM = """#!/bin/sh
python3 -c 'import os, signal; os.setsid(); signal.pause()' &
python3 -c 'import signal; signal.pause()'
"""
QUICK_PROGRAM = """#!/bin/sh
cat > /dev/null
echo '{"v": 1, "tell": "done"}'
"""
WAITING_PROGRAM = """#!/bin/sh
cat > /dev/null
python3 -c 'import signal; signal.pause()'
"""
LIMIT_MS = 1000
END_SECONDS = 2.5


@pytest.mark.parametrize("failure", [ProcessLookupError, PermissionError])
def test_a_missing_or_refused_process_group_still_finishes_output(monkeypatch, failure):
    process = Mock(pid=123)
    monkeypatch.setattr("core.modules.plugins.support.plugin_program.os.killpg", Mock(side_effect=failure))
    PluginProgram.stop(process)
    process.communicate.assert_called_once_with(timeout=STOP_LIMIT_SECONDS)


@pytest.mark.parametrize("failure", [ProcessLookupError, PermissionError])
def test_output_cleanup_stays_bounded_after_a_group_signal_fails(monkeypatch, failure):
    process = Mock(pid=123)
    process.communicate.side_effect = subprocess.TimeoutExpired("plugin", STOP_LIMIT_SECONDS)
    monkeypatch.setattr("core.modules.plugins.support.plugin_program.os.killpg", Mock(side_effect=failure))
    PluginProgram.stop(process)
    process.communicate.assert_called_once_with(timeout=STOP_LIMIT_SECONDS)
    process.stdin.close.assert_called_once()
    process.stdout.close.assert_called_once()


def program_at(tmp_path: Path, body: str, script: str = "") -> tuple[PluginProgram, PluginCall]:
    home = JournalHome(tmp_path / "journal")
    folders = PluginFolders(home)
    folder = folders.code("late")
    folder.mkdir(parents=True)
    (folder / "journal-plugin.json").write_text(json.dumps({"name": "late", "title": "Late", "version": "1", "program": "run.sh"}))
    (folder / "run.sh").write_text(body)
    (folder / "run.sh").chmod(0o755)
    program = PluginProgram(home, folders, PluginSocketPaths(home), SimpleNamespace(names=lambda agent_id: ()), AgentCheckouts(), PluginScriptProcesses(), SimpleNamespace(find=lambda agent_id: SimpleNamespace(role="main")))
    return program, PluginCall(PluginManifest.read(folder), PluginEvent("idle", {}), "main", Timestamp.parsed("2026-10-31T09:00:00+00:00"), {}, script=script)


def test_a_late_program_whose_child_keeps_its_output_open_ends_soon_after_its_limit(tmp_path: Path) -> None:
    program, call = program_at(tmp_path, DETACHED_CHILD_PROGRAM)
    started = time.monotonic()
    with pytest.raises(PluginLateError):
        program.run(call, LIMIT_MS)
    assert time.monotonic() - started < END_SECONDS


def test_a_script_that_cannot_start_is_the_plugins_fault(tmp_path: Path) -> None:
    program, call = program_at(tmp_path, QUICK_PROGRAM, "missing.sh")
    with pytest.raises(PluginFaultError, match="missing.sh could not start"):
        program.run(call, None)


def test_a_call_with_no_limit_waits_for_the_script_it_names(tmp_path: Path) -> None:
    program, call = program_at(tmp_path, QUICK_PROGRAM, "run.sh")
    assert program.run(call, None).line == "done"


def test_a_script_that_was_stopped_is_a_fault_that_says_so_and_does_not_count(tmp_path: Path, monkeypatch) -> None:
    program, call = program_at(tmp_path, WAITING_PROGRAM, "run.sh")
    failures: list[PluginFaultError] = []
    started = threading.Event()
    register = program.scripts.start

    def start(*args):
        register(*args)
        started.set()

    monkeypatch.setattr(program.scripts, "start", start)

    def run() -> None:
        try:
            program.run(call, None)
        except PluginFaultError as fault:
            failures.append(fault)

    thread = threading.Thread(target=run)
    thread.start()
    assert started.wait(END_SECONDS)
    program.scripts.stop("late")
    thread.join(END_SECONDS)
    assert str(failures[0]) == "it was stopped when the plugin was switched off"
    assert failures[0].counts_toward_failing is False
    assert program.scripts.running("late") == ()
