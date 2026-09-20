import os
import sys
import tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_HOME"] = tempfile.mkdtemp()
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from engine.record import Record  # noqa: E402


def fresh(env: str = "t") -> Record:
    return Record(Path(tempfile.mkdtemp()) / ".journal", env)


def refused(fn) -> str:
    try:
        fn()
        return ""
    except Exception as e:
        return str(e)
