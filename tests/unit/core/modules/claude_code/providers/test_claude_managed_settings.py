import json
from pathlib import Path

import pytest

from engine.errors.refusal import Refusal
from core.modules.claude_code.providers.support.managed_hooks import ManagedHooks


@pytest.fixture
def managed_file(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Path:
    file = tmp_path / "managed-settings.json"
    monkeypatch.setattr(ManagedHooks, "files", (tmp_path / "absent.json", file))
    return file


def test_a_launch_is_refused_when_managed_settings_allow_only_managed_hooks(managed_file):
    managed_file.write_text(json.dumps({"allowManagedHooksOnly": True}))
    with pytest.raises(Refusal) as refusal:
        ManagedHooks().refuse_blocked_hooks()
    assert "allow only managed hooks, so the journal's hooks would not run" in refusal.value.reason
    assert str(managed_file) in refusal.value.suggestion and "allowManagedHooksOnly" in refusal.value.suggestion


def test_a_launch_goes_on_when_the_key_is_false(managed_file):
    managed_file.write_text(json.dumps({"allowManagedHooksOnly": False}))
    ManagedHooks().refuse_blocked_hooks()


def test_a_launch_goes_on_when_no_managed_file_exists(managed_file):
    ManagedHooks().refuse_blocked_hooks()


def test_a_launch_goes_on_when_the_file_is_unreadable(managed_file):
    managed_file.write_text("{not json")
    ManagedHooks().refuse_blocked_hooks()
