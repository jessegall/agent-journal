import os
import sys
import tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_HOME"] = tempfile.mkdtemp()
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from engine.record import Record  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


def fresh(env: str = "t") -> Record:
    return Record(Path(tempfile.mkdtemp()) / ".journal", env)


def refused(fn) -> str:
    try:
        fn()
        return ""
    except Exception as e:
        return str(e)


def done() -> None:
    print(f"\n{ok} passed, {fail} failed")
    sys.exit(1 if fail else 0)
