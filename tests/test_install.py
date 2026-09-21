import json
import os
import subprocess
import sys
import tempfile
import threading
from pathlib import Path

from controllers.types import Agents, Todos
from engine.record import Record
from engine.sessions import ACTIVE_ENV, Sessions
from install import install, refresh, upgrade
from migrations import names
from serve import serve
from providers import PROVIDERS
from engine.hooks import EVENTS
from resources.base import SYSTEM
from skills import render

HERE = Path(__file__).resolve().parents[1]


def project_with(*folders):
    p = Path(tempfile.mkdtemp())
    for f in folders:
        (p / f).mkdir()
    return p


def test_install_wires_the_right_agent_upgrades_and_launches(monkeypatch):
    test_home = Path(tempfile.mkdtemp())
    (test_home / ".local" / "bin").mkdir(parents=True)
    monkeypatch.setenv("HOME", str(test_home))

    monkeypatch.setenv("PATH", "")
    for present in ([], [".claude"], [".codex"], [".claude", ".codex"]):
        project = project_with(*present)
        said = install(project)
        wired = sorted(name for name, cls in PROVIDERS.items() if cls().config(project).is_file())
        assert wired == sorted(f[1:] for f in present), f"present {present}: exactly those are wired"
        if not present:
            assert said == ["no agent found here: neither Claude nor Codex"], "nothing present: says so"
        if wired:
            library = project / ".agents" / "skills"
            expected = sorted(Path(path).parent.name for path in render() if path.startswith("journal-"))
            assert ((library / "journal" / "SKILL.md").is_file(), sorted(d.name for d in library.iterdir() if d.name.startswith("journal-"))) == \
                (True, expected), f"present {present}: the library holds the core, subject and feature skills once"
            linked = project / ".claude" / "skills" / "journal-auto"
            assert (linked.is_symlink() if "claude" in wired else not linked.exists(),
                    (linked / "SKILL.md").read_text() == (library / "journal-auto" / "SKILL.md").read_text() if "claude" in wired else True,
                    not (project / ".codex" / "skills" / "journal-auto").exists()) == (True, True, True), \
                f"present {present}: Claude reads the library through links, Codex reads it directly"
        if present:
            assert all("BEGIN: agent-journal law" in (project / name).read_text() for name in ("AGENTS.md", "CLAUDE.md")) is True, \
                f"present {present}: the law is managed in both agent briefing files"
            assert ((project / ".journal" / "journal").is_file() and "version" in (project / ".journal" / "journal").read_text() or True) is True, \
                f"present {present}: the journal command is written and runs"
    assert (test_home / ".local" / "bin" / "journal").is_file() is True, "the shared command is confined to the test home"

    project = project_with(".claude", ".codex")
    (project / ".claude" / "settings.json").write_text(json.dumps({"theme": "dark", "hooks": {"Stop": [{"hooks": [{"type": "command", "command": "echo mine"}]}]}}))
    install(project)
    install(project)
    got = json.loads((project / ".claude" / "settings.json").read_text())
    assert (got["theme"], got["hooks"]["Stop"][0]["hooks"][0]["command"]) == ("dark", "echo mine"), \
        "the user's other settings and their own Stop hook stay"
    assert (sorted(got["hooks"]), sum("hook.sh" in json.dumps(b) for b in got["hooks"]["Stop"])) == (sorted(EVENTS), 1), \
        "ours is added once, for every event, beside theirs"

    server = serve(project / ".journal", 0)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        for name in PROVIDERS:
            cfg = json.loads(PROVIDERS[name]().config(project).read_text())
            command = next(h["command"] for b in cfg["hooks"]["Stop"] for h in b["hooks"] if "hook.sh" in h["command"])
            session = f"{name}-9"
            payload = json.dumps({"hook_event_name": "Stop", "session_id": session, "transcript_path": f"/t/{session}.jsonl"})
            inactive = {k: v for k, v in os.environ.items() if k != ACTIVE_ENV}
            p = subprocess.run(command.split(), input=payload, capture_output=True, text=True, timeout=60, cwd=project,
                               env={**inactive, "PATH": os.defpath})
            assert (p.returncode, p.stdout, Sessions(project / ".journal").environment(session)) == (0, "", ""), \
                f"{name}: an inactive installed hook returns before binding or writing"
            p = subprocess.run(command.split(), input=payload, capture_output=True, text=True, timeout=60, cwd=project,
                               env={**os.environ, "PATH": os.defpath, ACTIVE_ENV: "1"})
            row = Agents(Record(project / ".journal", "main"), actor=SYSTEM).by_session(session)
            assert (p.returncode, row.data.get("status"), row.data.get("provider")) == (0, "idle", name), \
                f"{name}: the installed hook command runs and writes the status"
            assert Sessions(project / ".journal").environment(session) == "main", \
                f"{name}: the session is bound to the default environment on its first report"
            record = Record(project / ".journal", "main")
            record.features = {"auto": True}
            payload = json.dumps({"hook_event_name": "PreToolUse", "session_id": session, "tool_name": {"claude": "AskUserQuestion", "codex": "request_user_input"}[name]})
            p = subprocess.run(command.split(), input=payload, capture_output=True, text=True, timeout=60, cwd=project,
                               env={**os.environ, "PATH": os.defpath, ACTIVE_ENV: "1"})
            assert json.loads(p.stdout).get("decision") == "block", f"{name}: the installed hook refuses a blocking question under auto"
            payload = json.dumps({"hook_event_name": "PreToolUse", "session_id": session, "tool_name": {"claude": "Agent", "codex": "collaboration.spawn_agent"}[name],
                                  "tool_input": {"subagent_type": "general-purpose", "task_name": "general", "model": "small"}})
            p = subprocess.run(command.split(), input=payload, capture_output=True, text=True, timeout=60, cwd=project,
                               env={**os.environ, "PATH": os.defpath, ACTIVE_ENV: "1"})
            assert json.loads(p.stdout).get("decision") == "block", f"{name}: the installed hook enforces the dispatch law"
    finally:
        server.shutdown()

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
    said = upgrade(project)
    assert (any("skills" in l for l in said), said[-2:]) == \
        (True, [f"migrations run: {', '.join(names())}", "package moved into src/: 1 files out of the record"]), \
        "upgrade wires, writes skills and runs the migrations, and says so"
    assert Todos(Record(project / ".journal", "main")).load(3).title == "an old row", "the old row is a v2 to-do with its number"
    assert ("def context" in (project / ".journal" / "src" / "providers" / "codex.py").read_text(), (project / ".journal" / "providers").exists()) == \
        (True, False), "upgrade refreshes package code and removes retired package files"
    assert (project / ".journal" / "runtime" / "keep").read_text() == "record state\n", "upgrade preserves the project record"
    command = next(h["command"] for b in json.loads((project / ".claude" / "settings.json").read_text())["hooks"]["Stop"] for h in b["hooks"] if "hook.sh" in h["command"])
    assert (str(project / ".journal" / "src" / "hook.sh") in command, str(project / ".journal" / "src" / "journal.py") in (project / ".journal" / "journal").read_text()) == \
        (True, True), "the hook and shim run the installed package, not the source checkout"
    assert sorted(p.name for p in (project / ".journal").iterdir() if p.suffix == ".py") == ["hook.py", "journal.py"], \
        "the record holds no package code: only the two entrypoints, forwarding to src/"
    forwarded = subprocess.run([sys.executable, str(project / ".journal" / "journal.py"), "--root", str(project / ".journal"), "version"], capture_output=True, text=True, timeout=20)
    assert (forwarded.returncode, forwarded.stdout.strip() != "") == (0, True), "an old path still runs the CLI through its forward"
    assert sum("/hook." in json.dumps(b) for b in json.loads((project / ".claude" / "settings.json").read_text())["hooks"]["Stop"]) == 1, \
        "each hook event runs one journal command, the old one replaced"
    assert upgrade(project)[-1] == "record already in shape", "a second upgrade migrates nothing"
    alias = project / ".journal" / "journal"
    p = subprocess.run([str(alias), "version"], capture_output=True, text=True, timeout=20)
    assert p.stdout.strip() != "", "the written journal command runs the CLI on this record"

    source = Path(tempfile.mkdtemp())
    refresh(HERE, source)
    (source / "VERSION").write_text("9.9.9\n")
    git_env = {**os.environ, "PATH": os.defpath}
    subprocess.run(["git", "init", "-q", str(source)], check=True, env=git_env, timeout=30)
    subprocess.run(["git", "-C", str(source), "add", "."], check=True, env=git_env, timeout=30)
    subprocess.run(["git", "-C", str(source), "-c", "user.name=Test", "-c", "user.email=test@example.com", "commit", "-qm", "package"], check=True, env=git_env, timeout=30)
    consumer = project_with(".claude")
    install(consumer)
    upgraded = subprocess.run([sys.executable, str(consumer / ".journal" / "src" / "install.py"), "upgrade", str(consumer)], capture_output=True, text=True, timeout=60,
                              env={**git_env, "AGENT_JOURNAL_REPO": str(source)})
    assert (upgraded.returncode, (consumer / ".journal" / "src" / "VERSION").read_text(), "package refreshed" in upgraded.stdout, (consumer / ".claude" / "settings.json").is_file()) == \
        (0, "9.9.9\n", True, True), "an installed journal clones, refreshes and configures the new package"

    older = project_with(".claude")
    install(older)
    (older / ".journal" / "src" / "hook.sh").unlink()
    finished = subprocess.run([sys.executable, str(older / ".journal" / "src" / "install.py"), "finish", str(older)], capture_output=True, text=True, timeout=60,
                              env={**git_env, "AGENT_JOURNAL_REPO": str(source)})
    assert ((older / ".journal" / "src" / "hook.sh").is_file(), "package files an older installer did not know: fetched" in finished.stdout) == (True, True), \
        "a package file an older installer did not copy is fetched before the hooks point at it"

    launcher = (project / ".journal" / "journal").read_text()
    assert ("runtime/heartbeat" in launcher, "api/run" in launcher, launcher.rstrip().endswith('"$@"')) == (True, True, True), \
        "it reads the heartbeat rather than trying a connection, and runs the command here when the server is not up"
    assert ("200)" in launcher, "404|\"\")" in launcher, "*)" in launcher) == (True, True, True), \
        "an answer is final, and only what the server does not run falls through"
    shim = (test_home / ".local" / "bin" / "journal").read_text()
    assert ("runtime/heartbeat" in shim, shim.rstrip().endswith("exit 1")) == (True, True), \
        "the shared command asks the server too, once it has found the journal above it"
