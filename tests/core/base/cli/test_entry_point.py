import os
import subprocess
import sys
import time
from pathlib import Path

from core.base.journal_home import JournalHome
from tests.core.base.module.test_module_sync import ITEMS, synced

ROOT = Path(__file__).resolve().parents[4]
STARTUP_LIMIT_SECONDS = 3.0
TIMEOUT_SECONDS = 30
SCRIPT = "import sys; from core.journal import main; sys.exit(main(sys.argv[1:]))"


def test_a_run_answers_within_its_startup_limit(tmp_path):
    synced(JournalHome(tmp_path), ITEMS)
    environment = {**os.environ, "JOURNAL_HOME": str(tmp_path), "PYTHONPATH": f"{ROOT / 'src'}{os.pathsep}{ROOT}", "JOURNAL_AGENT_SESSION": ""}
    started = time.monotonic()
    finished = subprocess.run([sys.executable, "-c", SCRIPT, "item", "list"], env=environment, capture_output=True, text=True, timeout=TIMEOUT_SECONDS)
    assert time.monotonic() - started < STARTUP_LIMIT_SECONDS
    assert (finished.returncode, finished.stdout) == (0, "nothing found\n")


def test_a_journal_never_synced_is_told_to_sync(tmp_path):
    environment = {**os.environ, "JOURNAL_HOME": str(tmp_path), "PYTHONPATH": str(ROOT / "src")}
    finished = subprocess.run([sys.executable, str(ROOT / "src" / "core" / "journal.py"), "item", "list"], env=environment, capture_output=True, text=True,
                              timeout=TIMEOUT_SECONDS)
    assert (finished.returncode, finished.stdout) == (2, "the journal has never been synced: journal module sync\n")


def test_a_direct_run_names_its_caller_through_the_same_resolver_as_a_request(tmp_path):
    synced(JournalHome(tmp_path), ITEMS)
    environment = {**os.environ, "JOURNAL_HOME": str(tmp_path), "PYTHONPATH": f"{ROOT / 'src'}{os.pathsep}{ROOT}", "JOURNAL_AGENT_SESSION": "s-9"}
    finished = subprocess.run([sys.executable, "-c", SCRIPT, "item", "list"], env=environment, capture_output=True, text=True, timeout=TIMEOUT_SECONDS)
    assert finished.returncode == 2 and "which is no open agent" in finished.stdout
