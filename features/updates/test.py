import features.updates.feature as updates
from tests.conftest import fresh
from tests.kit import nudges, report


def test_a_newer_version_is_told_to_the_agent_once_when_it_does_not_install_itself(monkeypatch):
    record = fresh()
    record.set_setting("features", {**record.setting("features", {}), "updates.install": False})
    record.set_setting("triggers", {"updates": {"every": 0, "unit": "minutes"}})
    monkeypatch.setattr(updates, "upstream", lambda root: "99.0.0")
    report(record, "working", "PreToolUse")
    report(record, "idle", "Stop")
    told = [n for n in nudges(record) if n.startswith("journal 99.0.0 is out")]
    assert len(told) == 1, "told once, with the version it would install"
    monkeypatch.setattr(updates, "upstream", lambda root: "0.0.1")
    report(record, "working", "PreToolUse")
    assert len([n for n in nudges(record) if "is out" in n]) == 1, "an older published version says nothing"


def test_the_installed_command_runs_quietly_before_any_server_has_started(tmp_path):
    import subprocess
    import sys
    from install import launcher
    script = tmp_path / "said.py"
    script.write_text("print('ran')")
    shim = tmp_path / "journal"
    shim.write_text(launcher(sys.executable, script, tmp_path / ".journal"))
    ran = subprocess.run(["sh", str(shim), "todo", "all"], capture_output=True, text=True, timeout=20)
    assert (ran.stdout.strip(), ran.stderr) == ("ran", ""), "no heartbeat file yet: it falls through to the package without an error"


def test_the_journals_hook_py_runs_the_current_hook_for_an_older_command_that_passes_nothing(tmp_path):
    import subprocess
    import sys
    from install import HOOK
    (tmp_path / "src").mkdir()
    (tmp_path / "src" / "hook.sh").write_text('echo "$1 $2"\n')
    (tmp_path / "hook.py").write_text(HOOK)
    ran = subprocess.run([sys.executable, str(tmp_path / "hook.py")], capture_output=True, text=True, timeout=20)
    assert ran.stdout.strip() == f"claude {tmp_path.resolve()}", "no provider given: Claude, on the journal hook.py sits in"
    from install import ENTRYPOINTS
    assert all(text.startswith("#!/usr/bin/env python3") for text in ENTRYPOINTS.values()), "an entry made executable runs with Python, never the shell"


def test_an_install_over_version_1_leaves_only_its_own_hooks(tmp_path):
    import json
    from install import configure
    (tmp_path / ".claude").mkdir()
    (tmp_path / ".git" / "hooks").mkdir(parents=True)
    walk = 'd="${CLAUDE_PROJECT_DIR:-$PWD}"; if [ -x "$d/.journal/hook.py" ]; then exec "$d/.journal/hook.py"; fi'
    direct = f"python3 {tmp_path}/.journal/hook.py claude"
    mine = {"type": "command", "command": "echo not the journal"}
    (tmp_path / ".claude" / "settings.json").write_text(json.dumps({"hooks": {"Stop": [{"hooks": [{"type": "command", "command": walk}]},
                                                                                  {"hooks": [{"type": "command", "command": direct}]}, {"hooks": [mine]}]}}))
    (tmp_path / ".git" / "hooks" / "post-commit").write_text('#!/bin/sh\n# agent-journal: a commit that names a to-do closes it.\n"$top/.journal/journal.py" todos from-commit HEAD\n')
    configure(tmp_path, tmp_path / ".journal")
    commands = lambda name: [h["command"] for block in json.loads((tmp_path / ".claude" / name).read_text())["hooks"]["Stop"] for h in block["hooks"]]
    assert commands("settings.json") == ["echo not the journal"], "the shared file keeps only what is not the journal's"
    assert [c.split("/")[-1] for c in commands("settings.local.json")] == [".journal"], "the journal's hook is wired per person, where every worktree reads it"
    assert not (tmp_path / ".git" / "hooks" / "post-commit").exists(), "version 1's git hook calls a command that is gone"
