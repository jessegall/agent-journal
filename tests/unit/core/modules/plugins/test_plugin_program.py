import json
import time
from pathlib import Path

import pytest

from core.base.journal_home import JournalHome
from core.base.timestamp import Timestamp
from core.modules.plugins.support.plugin_call import PluginCall
from core.modules.plugins.support.plugin_event import PluginEvent
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_late_error import PluginLateError
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_program import PluginProgram
from core.modules.plugins.support.plugin_socket_paths import PluginSocketPaths

DETACHED_CHILD_PROGRAM = """#!/bin/sh
python3 -c 'import os, time; os.setsid(); time.sleep(6)' &
sleep 6
"""
LIMIT_MS = 1000
END_SECONDS = 2.5


def test_a_late_program_whose_child_keeps_its_output_open_ends_soon_after_its_limit(tmp_path: Path) -> None:
    home = JournalHome(tmp_path / "journal")
    folders = PluginFolders(home)
    folder = folders.code("late")
    folder.mkdir(parents=True)
    (folder / "journal-plugin.json").write_text(json.dumps({"name": "late", "title": "Late", "version": "1", "program": "run.sh"}))
    (folder / "run.sh").write_text(DETACHED_CHILD_PROGRAM)
    (folder / "run.sh").chmod(0o755)
    program = PluginProgram(home, folders, PluginSocketPaths(home))
    call = PluginCall(PluginManifest.read(folder), PluginEvent("idle", {}), "main", Timestamp.parsed("2026-10-31T09:00:00+00:00"), {})
    started = time.monotonic()
    with pytest.raises(PluginLateError):
        program.run(call, LIMIT_MS)
    assert time.monotonic() - started < END_SECONDS
