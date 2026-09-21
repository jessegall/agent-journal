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
