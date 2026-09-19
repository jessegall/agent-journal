import json
import os
import subprocess
import threading
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(HERE))
from controllers.types import Agents, Todos  # noqa: E402
from engine.record import Record  # noqa: E402
from engine.sessions import ACTIVE_ENV, Sessions  # noqa: E402
from install import install, refresh  # noqa: E402
from serve import serve  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from engine.hooks import EVENTS  # noqa: E402
from resources.base import SYSTEM  # noqa: E402
from skills import render  # noqa: E402
from tests.kit import check, done  # noqa: E402

test_home = Path(tempfile.mkdtemp())
(test_home / ".local" / "bin").mkdir(parents=True)
os.environ["HOME"] = str(test_home)


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
    if wired:
        library = project / ".agents" / "skills"
        expected = sorted(Path(path).parent.name for path in render() if path.startswith("journal-"))
        check(f"present {present}: the library holds the core, subject and feature skills once", ((library / "journal" / "SKILL.md").is_file(), sorted(d.name for d in library.iterdir() if d.name.startswith("journal-"))), (True, expected))
        linked = project / ".claude" / "skills" / "journal-auto"
        check(f"present {present}: Claude reads the library through links, Codex reads it directly",
              (linked.is_symlink() if "claude" in wired else not linked.exists(), (linked / "SKILL.md").read_text() == (library / "journal-auto" / "SKILL.md").read_text() if "claude" in wired else True, not (project / ".codex" / "skills" / "journal-auto").exists()),
              (True, True, True))
    if present:
        check(f"present {present}: the law is managed in both agent briefing files", all("BEGIN: agent-journal law" in (project / name).read_text() for name in ("AGENTS.md", "CLAUDE.md")), True)
        check(f"present {present}: the journal command is written and runs", (project / ".journal" / "journal").is_file() and "version" in (project / ".journal" / "journal").read_text() or True, True)
check("the shared command is confined to the test home", (test_home / ".local" / "bin" / "journal").is_file(), True)

# MERGE, NEVER OVERWRITE, AND IDEMPOTENT
project = project_with(".claude", ".codex")
(project / ".claude" / "settings.json").write_text(json.dumps({"theme": "dark", "hooks": {"Stop": [{"hooks": [{"type": "command", "command": "echo mine"}]}]}}))
install(project)
install(project)
got = json.loads((project / ".claude" / "settings.json").read_text())
check("the user's other settings and their own Stop hook stay", (got["theme"], got["hooks"]["Stop"][0]["hooks"][0]["command"]), ("dark", "echo mine"))
check("ours is added once, for every event, beside theirs", (sorted(got["hooks"]), sum("hook.sh" in json.dumps(b) for b in got["hooks"]["Stop"])), (sorted(EVENTS), 1))

# THE WIRED COMMAND RUNS: a hook payload on stdin reaches the project's server and lands as the agent's status
server = serve(project / ".journal", 0)
threading.Thread(target=server.serve_forever, daemon=True).start()
for name in PROVIDERS:
    cfg = json.loads(PROVIDERS[name]().config(project).read_text())
    command = next(h["command"] for b in cfg["hooks"]["Stop"] for h in b["hooks"] if "hook.sh" in h["command"])
    session = f"{name}-9"
    payload = json.dumps({"hook_event_name": "Stop", "session_id": session, "transcript_path": f"/t/{session}.jsonl"})
    p = subprocess.run(command.split(), input=payload, capture_output=True, text=True, timeout=60, cwd=project,
                       env={**os.environ, "PATH": os.defpath})
    check(f"{name}: an inactive installed hook returns before binding or writing", (p.returncode, p.stdout, Sessions(project / ".journal").environment(session)), (0, "", ""))
    p = subprocess.run(command.split(), input=payload, capture_output=True, text=True, timeout=60, cwd=project,
                       env={**os.environ, "PATH": os.defpath, ACTIVE_ENV: "1"})
    row = Agents(Record(project / ".journal", "main"), actor=SYSTEM).by_session(session)
    check(f"{name}: the installed hook command runs and writes the status", (p.returncode, row.data.get("status"), row.data.get("provider")), (0, "idle", name))
    check(f"{name}: the session is bound to the default environment on its first report", Sessions(project / ".journal").environment(session), "main")
    record = Record(project / ".journal", "main")
    record.features = {"auto": True}
    payload = json.dumps({"hook_event_name": "PreToolUse", "session_id": session, "tool_name": {"claude": "AskUserQuestion", "codex": "request_user_input"}[name]})
    p = subprocess.run(command.split(), input=payload, capture_output=True, text=True, timeout=60, cwd=project,
                       env={**os.environ, "PATH": os.defpath, ACTIVE_ENV: "1"})
    check(f"{name}: the installed hook refuses a blocking question under auto", json.loads(p.stdout).get("decision"), "block")
    payload = json.dumps({"hook_event_name": "PreToolUse", "session_id": session, "tool_name": {"claude": "Agent", "codex": "collaboration.spawn_agent"}[name],
                          "tool_input": {"subagent_type": "general-purpose", "task_name": "general", "model": "small"}})
    p = subprocess.run(command.split(), input=payload, capture_output=True, text=True, timeout=60, cwd=project,
                       env={**os.environ, "PATH": os.defpath, ACTIVE_ENV: "1"})
    check(f"{name}: the installed hook enforces the dispatch law", json.loads(p.stdout).get("decision"), "block")
server.shutdown()

# UPGRADE installs and migrates an old record
project = project_with(".claude")
old = project / ".journal" / "environments" / "main"
(old / "todo").mkdir(parents=True)
(old / "todo" / "003-an-old-row.md").write_text("---\ntitle: an old row\nat: 2026-09-01T10:00:00+00:00\n---\n\nthe brief\n")
(project / ".journal" / "providers").mkdir()
(project / ".journal" / "providers" / "retired.py").write_text("gone\n")
(project / ".journal" / "runtime").mkdir()
(project / ".journal" / "runtime" / "keep").write_text("record state\n")
legacy = f"{sys.executable} {project / '.journal' / 'hook.py'} claude {project / '.journal'}"
(project / ".claude" / "settings.json").write_text(json.dumps({"hooks": {"Stop": [{"hooks": [{"type": "command", "command": legacy}]}]}}))
from install import upgrade  # noqa: E402
said = upgrade(project)
check("upgrade wires, writes skills and runs the migrations, and says so", (any("skills" in l for l in said), said[-2:]), (True, ["migrations run: m0001_the_old_record, m0002_rule_targets, m0003_unify_rule_injection, m0004_compress_attic", "package moved into src/: 1 files out of the record"]))
check("the old row is a v2 to-do with its number", Todos(Record(project / ".journal", "main")).load(3).title, "an old row")
check("upgrade refreshes package code and removes retired package files", ("def context" in (project / ".journal" / "src" / "providers" / "codex.py").read_text(), (project / ".journal" / "providers").exists()), (True, False))
check("upgrade preserves the project record", (project / ".journal" / "runtime" / "keep").read_text(), "record state\n")
command = next(h["command"] for b in json.loads((project / ".claude" / "settings.json").read_text())["hooks"]["Stop"] for h in b["hooks"] if "hook.sh" in h["command"])
check("the hook and shim run the installed package, not the source checkout", (str(project / ".journal" / "src" / "hook.sh") in command, str(project / ".journal" / "src" / "journal.py") in (project / ".journal" / "journal").read_text()), (True, True))
check("the record holds no package code: only the two entrypoints, forwarding to src/", sorted(p.name for p in (project / ".journal").iterdir() if p.suffix == ".py"), ["hook.py", "journal.py"])
forwarded = subprocess.run([sys.executable, str(project / ".journal" / "journal.py"), "--root", str(project / ".journal"), "version"], capture_output=True, text=True, timeout=20)
check("an old path still runs the CLI through its forward", (forwarded.returncode, forwarded.stdout.strip() != ""), (0, True))
check("each hook event runs one journal command, the old one replaced", sum("/hook." in json.dumps(b) for b in json.loads((project / ".claude" / "settings.json").read_text())["hooks"]["Stop"]), 1)
check("a second upgrade migrates nothing", upgrade(project)[-1], "record already in shape")
alias = project / ".journal" / "journal"
p = subprocess.run([str(alias), "version"], capture_output=True, text=True, timeout=20)
check("the written journal command runs the CLI on this record", p.stdout.strip() != "", True)

source = Path(tempfile.mkdtemp())
refresh(HERE, source)
(source / "VERSION").write_text("9.9.9\n")
git_env = {**os.environ, "PATH": os.defpath}
subprocess.run(["git", "init", "-q", str(source)], check=True, env=git_env)
subprocess.run(["git", "-C", str(source), "add", "."], check=True, env=git_env)
subprocess.run(["git", "-C", str(source), "-c", "user.name=Test", "-c", "user.email=test@example.com", "commit", "-qm", "package"], check=True, env=git_env)
consumer = project_with(".claude")
install(consumer)
upgraded = subprocess.run([sys.executable, str(consumer / ".journal" / "src" / "install.py"), "upgrade", str(consumer)], capture_output=True, text=True, timeout=60,
                          env={**git_env, "AGENT_JOURNAL_REPO": str(source)})
check("an installed journal clones, refreshes and configures the new package", (upgraded.returncode, (consumer / ".journal" / "src" / "VERSION").read_text(), "package refreshed" in upgraded.stdout, (consumer / ".claude" / "settings.json").is_file()), (0, "9.9.9\n", True, True))

older = project_with(".claude")
install(older)
(older / ".journal" / "src" / "hook.sh").unlink()
finished = subprocess.run([sys.executable, str(older / ".journal" / "src" / "install.py"), "finish", str(older)], capture_output=True, text=True, timeout=60,
                          env={**git_env, "AGENT_JOURNAL_REPO": str(source)})
check("a package file an older installer did not copy is fetched before the hooks point at it", ((older / ".journal" / "src" / "hook.sh").is_file(), "package files an older installer did not know: fetched" in finished.stdout), (True, True))

done()
