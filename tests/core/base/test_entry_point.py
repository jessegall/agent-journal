import os
import subprocess
import sys
import time
from pathlib import Path

from core.base.journal_home import JournalHome
from tests.core.base.test_module_sync import LOANS, synced

ROOT = Path(__file__).resolve().parents[3]
START_UP_BUDGET_SECONDS = 3.0
TIMEOUT_SECONDS = 30
SCRIPT = ("import sys; from core.journal import main; code = main(sys.argv[1:]); "
          "print('imported' if 'tests.core.base.test_module_check' in sys.modules else 'not imported'); sys.exit(code)")


def test_a_run_answers_within_its_budget_and_imports_no_guard_it_does_not_need(tmp_path):
    synced(JournalHome(tmp_path), LOANS)
    environment = {**os.environ, "JOURNAL_HOME": str(tmp_path), "PYTHONPATH": f"{ROOT / 'src'}{os.pathsep}{ROOT}"}
    started = time.monotonic()
    finished = subprocess.run([sys.executable, "-c", SCRIPT, "loan", "list"], env=environment, capture_output=True, text=True, timeout=TIMEOUT_SECONDS)
    assert time.monotonic() - started < START_UP_BUDGET_SECONDS
    assert (finished.returncode, finished.stdout) == (0, "nothing found\nnot imported\n")


def test_a_journal_never_synced_is_told_to_sync(tmp_path):
    environment = {**os.environ, "JOURNAL_HOME": str(tmp_path), "PYTHONPATH": str(ROOT / "src")}
    finished = subprocess.run([sys.executable, str(ROOT / "src" / "core" / "journal.py"), "loan", "list"], env=environment, capture_output=True, text=True,
                              timeout=TIMEOUT_SECONDS)
    assert (finished.returncode, finished.stdout) == (2, "the journal has never been synced: journal module sync\n")
