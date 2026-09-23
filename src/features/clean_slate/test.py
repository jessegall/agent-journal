import json

from features.clean_slate.slate import KEY, others, put_back, set_aside, state
from tests.conftest import fresh

JOURNAL = "sh /p/.journal/src/hook.sh claude /p/.journal"


def test_the_other_hooks_are_set_aside_and_put_back_and_skills_stay(tmp_path, monkeypatch):
    monkeypatch.setenv("HOME", str(tmp_path / "home"))
    record = fresh()
    project = record.root.parent
    (project / ".claude" / "skills" / "graphify").mkdir(parents=True)
    settings = project / ".claude" / "settings.local.json"
    hooks = {"Stop": [{"hooks": [{"type": "command", "command": "keep-going.sh"}]}, {"hooks": [{"type": "command", "command": JOURNAL}]}]}
    settings.write_text(json.dumps({"model": "opus", "hooks": hooks}))
    before = settings.read_text()

    set_aside(record, project, "claude")
    assert json.loads(settings.read_text()) == {"model": "opus", "hooks": {"Stop": [{"hooks": [{"type": "command", "command": JOURNAL}]}]}}, \
        "only the journal's hooks stay, the rest of the file is untouched"
    assert [p.name for p in (project / ".claude" / "skills").iterdir()] == ["graphify"], "skills are never moved"
    assert others(project, "claude") == [], "nothing else is left to set aside"

    from engine.record import Record
    put_back(Record(record.root, "another"))
    assert settings.read_text() == before, "putting back restores the hook file as it was, from any environment of the project"
    assert put_back(record) == 0, "a second put back has nothing to do"


def test_skills_an_earlier_version_set_aside_come_back_and_a_failure_puts_everything_back(tmp_path, monkeypatch):
    import features.clean_slate.slate as slate
    monkeypatch.setenv("HOME", str(tmp_path / "home"))
    record = fresh()
    project = record.root.parent
    kept_at = slate.place(record) / "skill-0-graphify"
    kept_at.mkdir(parents=True)
    home = project / ".claude" / "skills" / "graphify"
    record.set_setting(KEY, {**state(record), "moved": [{"from": str(home), "to": str(kept_at), "tracked": []}]})
    put_back(record)
    assert (home.is_dir(), kept_at.exists()) == (True, False), "a skill set aside before this version is put back"

    settings = project / ".claude" / "settings.local.json"
    settings.write_text(json.dumps({"hooks": {"Stop": [{"hooks": [{"type": "command", "command": "keep-going.sh"}]}]}}))
    before = settings.read_text()
    monkeypatch.setattr(slate, "others", lambda project, agent: [settings])
    monkeypatch.setattr(slate, "kept", lambda settings: (_ for _ in ()).throw(OSError("disk full")))
    assert set_aside(record, project, "claude").startswith("nothing set aside"), "a failure part way says so instead of crashing the launch"
    assert settings.read_text() == before, "and the hook file is as it was"
