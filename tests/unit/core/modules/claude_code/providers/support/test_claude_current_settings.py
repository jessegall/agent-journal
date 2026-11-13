import json

from core.modules.claude_code.providers.support.claude_current_settings import ClaudeCurrentSettings

KEY = "autoCompactWindow"


def settings(folder):
    return json.loads((folder / ".claude" / "settings.json").read_text())


def test_a_new_setting_is_written_with_a_self_ignoring_ignore_file(tmp_path):
    ClaudeCurrentSettings(tmp_path).write(KEY, 600_000)
    assert settings(tmp_path) == {KEY: 600_000}
    assert (tmp_path / ".claude" / ".gitignore").read_text() == "settings.json\n.gitignore\n"


def test_a_setting_keeps_the_other_keys_of_the_file_and_adds_no_ignore_file_to_it(tmp_path):
    (tmp_path / ".claude").mkdir()
    (tmp_path / ".claude" / "settings.json").write_text('{"enableAllProjectMcpServers": true}')
    ClaudeCurrentSettings(tmp_path).write(KEY, 400_000)
    assert settings(tmp_path) == {KEY: 400_000, "enableAllProjectMcpServers": True}
    assert not (tmp_path / ".claude" / ".gitignore").exists()


def test_a_file_that_is_not_json_is_left_as_it_is(tmp_path):
    (tmp_path / ".claude").mkdir()
    (tmp_path / ".claude" / "settings.json").write_text("{broken")
    ClaudeCurrentSettings(tmp_path).write(KEY, 400_000)
    assert (tmp_path / ".claude" / "settings.json").read_text() == "{broken"
