import json

from features.clean_slate.slate import others, put_back, set_aside
from tests.conftest import fresh

JOURNAL = "sh /p/.journal/src/hook.sh claude /p/.journal"


def test_the_other_skills_and_hooks_are_set_aside_and_put_back(tmp_path, monkeypatch):
    monkeypatch.setenv("HOME", str(tmp_path / "home"))
    record = fresh()
    project = record.root.parent
    for home in (project, tmp_path / "home"):
        for name in ("journal-todos", "graphify"):
            (home / ".claude" / "skills" / name).mkdir(parents=True)
            (home / ".claude" / "skills" / name / "SKILL.md").write_text(name)
    settings = project / ".claude" / "settings.local.json"
    hooks = {"Stop": [{"hooks": [{"type": "command", "command": "keep-going.sh"}]}, {"hooks": [{"type": "command", "command": JOURNAL}]}]}
    settings.write_text(json.dumps({"model": "opus", "hooks": hooks}))
    before = settings.read_text()

    set_aside(record, project, "claude")
    assert sorted(p.name for home in (project, tmp_path / "home") for p in (home / ".claude" / "skills").iterdir()) == ["journal-todos", "journal-todos"], \
        "every skill that is not the journal's is moved out, in the project and at home"
    assert json.loads(settings.read_text()) == {"model": "opus", "hooks": {"Stop": [{"hooks": [{"type": "command", "command": JOURNAL}]}]}}, \
        "only the journal's hooks stay, the rest of the file is untouched"
    assert others(project, "claude") == ([], []), "nothing else is left to set aside"

    put_back(record)
    assert (sorted(p.name for p in (project / ".claude" / "skills").iterdir()), settings.read_text()) == (["graphify", "journal-todos"], before), \
        "putting back restores every skill and the hook file as it was"
    assert put_back(record) == 0, "a second put back has nothing to do"


def test_linked_homes_count_once_git_never_sees_a_deletion_and_a_failure_puts_everything_back(tmp_path, monkeypatch):
    import subprocess
    import features.clean_slate.slate as slate
    monkeypatch.setenv("HOME", str(tmp_path / "home"))
    record = fresh()
    project = record.root.parent
    git = lambda *a: subprocess.run(["git", "-C", str(project), *a], capture_output=True, text=True, timeout=20).stdout
    git("init", "-q")
    for name in ("absence", "layout"):
        (project / "skills" / name).mkdir(parents=True)
        (project / "skills" / name / "SKILL.md").write_text(name)
    git("add", "skills")
    git("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "-m", "skills")
    for home in (".agents", ".codex"):
        (project / home).mkdir()
        (project / home / "skills").symlink_to("../skills")
    assert [s.name for s in others(project, "codex")[0]] == ["absence", "layout"], "two links to one folder list each skill once"
    set_aside(record, project, "codex")
    assert (sorted(p.name for p in (project / "skills").iterdir()), git("status", "--short", "--untracked-files=no")) == ([], ""), "both set aside, and git sees no deletion"
    put_back(record)
    assert (sorted(p.name for p in (project / "skills").iterdir()), git("status", "--short", "--untracked-files=no")) == (["absence", "layout"], ""), "both back, git clean"
    real = slate.shutil.move
    calls = []
    monkeypatch.setattr(slate.shutil, "move", lambda a, b: calls.append(a) or ((_ for _ in ()).throw(OSError("disk full")) if len(calls) == 2 else real(a, b)))
    assert set_aside(record, project, "codex").startswith("nothing set aside"), "a failure part way says so instead of crashing the launch"
    monkeypatch.setattr(slate.shutil, "move", real)
    assert sorted(p.name for p in (project / "skills").iterdir()) == ["absence", "layout"], "and what it had moved is back"
