import json
from pathlib import Path

from core.modules.claude_code.providers.support.claude_trust import ClaudeTrust

FOLDER = Path("/work/app")


def test_a_folder_is_marked_trusted_in_claude_codes_state_file_and_other_entries_stay(tmp_path):
    state = tmp_path / ".claude.json"
    state.write_text(json.dumps({"theme": "dark", "projects": {"/elsewhere": {"hasTrustDialogAccepted": True}}}))
    ClaudeTrust(state).trusted(FOLDER)
    state_data = json.loads(state.read_text())
    assert state_data["theme"] == "dark" and state_data["projects"] == {"/elsewhere": {"hasTrustDialogAccepted": True}, str(FOLDER): {"hasTrustDialogAccepted": True}}


def test_a_folder_trusted_already_leaves_the_state_file_alone(tmp_path):
    state = tmp_path / ".claude.json"
    ClaudeTrust(state).trusted(FOLDER)
    modified_ns = state.stat().st_mtime_ns
    ClaudeTrust(state).trusted(FOLDER)
    assert state.stat().st_mtime_ns == modified_ns
