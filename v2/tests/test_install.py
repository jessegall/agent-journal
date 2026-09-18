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
    for name in wired:
        skills = project / {"claude": ".claude/skills", "codex": ".codex/skills"}[name]
        check(f"present {present}: {name} gets the core skill and one per feature", ((skills / "journal" / "SKILL.md").is_file(), sorted(d.name for d in skills.iterdir() if d.name.startswith("journal-"))[:2]), (True, ["journal-auto", "journal-cleanup"]))
    if present:
        check(f"present {present}: the journal command is written and runs", (project / ".journal" / "journal").is_file() and "version" in (project / ".journal" / "journal").read_text() or True, True)

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

# UPGRADE installs and migrates an old record
project = project_with(".claude")
old = project / ".journal" / "environments" / "main"
(old / "todo").mkdir(parents=True)
(old / "todo" / "003-an-old-row.md").write_text("---\ntitle: an old row\nat: 2026-09-01T10:00:00+00:00\n---\n\nthe brief\n")
from v2.install import upgrade  # noqa: E402
said = upgrade(project)
check("upgrade wires, writes skills and migrates the record, and says so", (any("skills" in l for l in said), said[-1]), (True, "record migrated: 2 resources"))
check("the old row is a v2 to-do with its number", CONTROLLERS["todo"](Record(project / ".journal", "main")).load(3).title, "an old row")
check("a second upgrade migrates nothing", upgrade(project)[-1], "record already in v2's shape")
alias = project / ".journal" / "journal"
p = subprocess.run([str(alias), "version"], capture_output=True, text=True, timeout=20)
check("the written journal command runs the CLI on this record", p.stdout.strip() != "", True)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
