import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(HERE))
from v2.controllers.types import CONTROLLERS  # noqa: E402
from v2.engine.record import Record  # noqa: E402
from v2.install import install  # noqa: E402
from v2.providers import PROVIDERS  # noqa: E402
from v2.providers.base import EVENTS  # noqa: E402
from v2.resources.base import SYSTEM  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


def project_with(*folders):
    p = Path(tempfile.mkdtemp())
    for f in folders:
        (p / f).mkdir()
    return p


# ONE PROVIDER PRESENT, THE OTHER NOT — and both, and neither. Presence is the folder or the binary; the
# binaries are on this machine, so presence is measured by folder with PATH emptied.
os.environ["PATH"] = ""
for present in ([], [".claude"], [".codex"], [".claude", ".codex"]):
    project = project_with(*present)
    said = install(project)
    wired = sorted(name for name, cls in PROVIDERS.items() if cls().config(project).is_file())
    check(f"present {present}: exactly those are wired", wired, sorted(f[1:] for f in present))
    if not present:
        check("nothing present: says so", said, ["no agent found here: neither Claude nor Codex"])

# MERGE, NEVER OVERWRITE, AND IDEMPOTENT
project = project_with(".claude", ".codex")
(project / ".claude" / "settings.json").write_text(json.dumps({"theme": "dark", "hooks": {"Stop": [{"hooks": [{"type": "command", "command": "echo mine"}]}]}}))
install(project)
install(project)
got = json.loads((project / ".claude" / "settings.json").read_text())
check("the user's other settings and their own Stop hook stay", (got["theme"], got["hooks"]["Stop"][0]["hooks"][0]["command"]), ("dark", "echo mine"))
check("ours is added once, for every event, beside theirs", (sorted(got["hooks"]), sum("hook.py" in json.dumps(b) for b in got["hooks"]["Stop"])), (sorted(EVENTS), 1))

# THE WIRED COMMAND RUNS: a hook payload on stdin lands as the agent's status
for name in PROVIDERS:
    cfg = json.loads(PROVIDERS[name]().config(project).read_text())
    command = next(h["command"] for b in cfg["hooks"]["Stop"] for h in b["hooks"] if "hook.py" in h["command"])
    payload = json.dumps({"hook_event_name": "Stop", "session_id": "s-9", "transcript_path": "/t/s-9.jsonl"})
    p = subprocess.run(command.split(), input=payload, capture_output=True, text=True, timeout=60, cwd=project,
                       env={**os.environ, "PATH": os.defpath})
    row = CONTROLLERS["agent"](Record(project / ".journal", "main"), actor=SYSTEM).by_session("s-9")
    check(f"{name}: the installed hook command runs and writes the status", (p.returncode, row.data.get("status"), row.data.get("provider")), (0, "idle", name))
    from v2.engine.sessions import Sessions  # noqa: E402
    check(f"{name}: the session is bound to the default environment on its first report", Sessions(project / ".journal").environment("s-9"), "main")

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
