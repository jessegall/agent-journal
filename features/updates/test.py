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
