import subprocess
import sys
import tempfile
import time
from pathlib import Path

HERE = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(HERE))
import features  # noqa: E402
from controllers.types import CONTROLLERS  # noqa: E402
from engine.record import Record  # noqa: E402
from engine.sessions import Sessions  # noqa: E402
from resources.base import AGENT, SYSTEM, USER  # noqa: E402
from tests.features.kit import report  # noqa: E402
from tests.kit import check, done, refused  # noqa: E402

features.unload()
features.load()

root = Path(tempfile.mkdtemp()) / ".journal"
record = Record(root, "main")
sessions = Sessions(root)
sessions.bind("claude-1", "main")


def cli(*argv, agent=""):
    p = subprocess.run([sys.executable, str(HERE / "journal.py"), "--root", str(root), "--env", "main", "--session", "claude-1", *(("--agent", agent) if agent else ()), *argv],
                       capture_output=True, text=True, timeout=30, cwd=root.parent)
    return p.returncode, (p.stdout + p.stderr).strip()


# NOT LENT: a subagent's write is refused, naming the grant; its reads are not
code, out = cli("todo", "add", "a row from a subagent", agent="runner-1")
check("without a grant a subagent's write is refused, and told what the dispatcher must do", (code, out), (1, "! environment 'main' is not lent to this session's subagents: journal environment <n> grant first"))
code, out = cli("todo", "all", agent="runner-1")
check("its reads are never refused", code, 0)

# LENT: its rows land in the same record, marked with its name; its agent row is born on the first write
sessions.grant("claude-1", "main")
code, out = cli("todo", "add", "a row from a subagent", agent="runner-1")
todos = CONTROLLERS["todo"](record, actor=SYSTEM)
check("with the grant the row is written, carrying the agent's mark", (code, todos.load(1).data.get("agent")), (0, "runner-1"))
agents = CONTROLLERS["agent"](record, actor=SYSTEM)
runner = agents.by_session("runner-1")
check("the agent row exists from the first write, stamped active, as a subagent", (runner.data.get("status"), runner.data.get("active", 0) > 0), ("subagent", True))

# THE REFUSED VERBS: a rule binds every environment; a pin is inherited
code, out = cli("pin", "create", "a fact from a subagent", agent="runner-1")
check("a pin is not a subagent's to write", (code, out), (1, "! a subagent never writes a pin: report it, and the main conversation files it"))
code, out = cli("rule", "create", "a ruling from a subagent", agent="runner-1")
check("nor a rule", code, 1)

# ASSIGN: one row, one agent; nobody else takes it, and auto mode skips it
CONTROLLERS["agent"](record, actor=SYSTEM).by_session("claude-1")
row = todos.create("a row for the runner")
CONTROLLERS["todo"](record, actor=AGENT).assign(row.n, to="runner-1")
check("assigned to one agent", todos.load(row.n).data.get("assigned"), "runner-1")
check("another cannot start it", refused(lambda: CONTROLLERS["work"](record, actor=AGENT).create("taking it", todo=row.n)), f"todo {row.n} is assigned to runner-1; nobody else may take it")
from features.auto.next import ready  # noqa: E402
check("auto mode skips an assigned row", row.n in [t.n for t in ready(record)], False)
code, out = cli("work", "start", "the runner takes it", "--set", f"todo={row.n}", agent="runner-1")
check("the agent it is assigned to may", code, 0)

# REPORT: the subagent says it is done; the dispatcher is told, and closes it
code, out = cli("todo", "report", str(row.n), "built and green", agent="runner-1")
check("report is the subagent's word", (code, todos.load(row.n).data.get("reported", {}).get("how")), (0, "built and green"))
nudges = [n.title for n in CONTROLLERS["nudge"](record).all()]
check("the dispatcher is nudged with the report", f"agent runner-1 reports todo {row.n} done" in nudges, True)
check("the row is not closed by the report", todos.load(row.n).completed, 0.0)
check("report without --agent is refused", refused(lambda: CONTROLLERS["todo"](record, actor=AGENT).report(row.n, "x")), "report is a subagent's word — the dispatcher closes a row with done")

# LAPSE: silent past the limit, an assignment clears and the dispatcher hears once
record.set_setting("agents", {"lapse": 0})
agents.update(agents.by_session("runner-1").n, active=time.time() - 120)
report(record, "idle", "Stop")
check("a silent subagent's row is back on the list, and the dispatcher told which", (todos.load(row.n).data.get("assigned"), todos.load(row.n).data.get("lapsed"), any("went silent" in t for t in [n.title for n in CONTROLLERS["nudge"](record).all()])), ("", "runner-1", True))

done()
