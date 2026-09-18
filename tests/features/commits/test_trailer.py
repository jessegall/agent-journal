import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import CONTROLLERS  # noqa: E402
from engine.record import Record  # noqa: E402
from resources.base import SYSTEM, USER  # noqa: E402
from tests.features.kit import report  # noqa: E402
from tests.kit import check, done  # noqa: E402

features.unload()
features.load()

project = Path(tempfile.mkdtemp())
git = lambda *a: subprocess.run(["git", *a], cwd=project, capture_output=True, text=True, timeout=5, check=True)
git("init", "-q")
git("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "--allow-empty", "-m", "before the journal looked")
record = Record(project / ".journal", "t")
todos = CONTROLLERS["todo"](record, actor=USER)
todos.create("first")
todos.create("second")
todos.create("third")


def commit(message):
    git("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "--allow-empty", "-m", message)
    report(record, "working", "PostToolUse")


report(record, "idle", "SessionStart")
check("the first look closes nothing: it only marks where the log was", [t.completed for t in todos.all()], [0.0, 0.0, 0.0])
commit("a change\n\nJournal: todos done 1")
check("a trailer at column 0 closes the row it names, as SYSTEM, citing the commit", (bool(todos.load(1).completed), record.events()[-1].actor, record.events()[-1].data["how"].startswith("a change (")), (True, SYSTEM, True))
commit("only prose\n\nThis closes to-do 2, honestly.\n    Journal: todos done 2")
check("prose and an indented example close nothing", todos.load(2).completed, 0.0)
commit("with a how\n\nJournal: todos done 2 the placement vocabulary is settled")
check("the words after the number are the how", (bool(todos.load(2).completed), record.events()[-1].data["how"]), (True, "the placement vocabulary is settled"))
commit("again\n\nJournal: todos done 2")
check("a row already closed is left alone", [e.action for e in record.events() if e.type == "todo"].count("completed"), 2)
commit("no such row\n\nJournal: todos done 99")
check("a number with no row is ignored", todos.load(3).completed, 0.0)
report(record, "idle", "Stop")
check("nothing new: nothing happens", [e.action for e in record.events() if e.type == "todo"].count("completed"), 2)

done()
