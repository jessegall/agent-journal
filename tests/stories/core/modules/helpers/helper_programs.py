import shutil

import pytest

from engine.errors.refusal import Refusal
from core.modules.helpers.support.helper_programs import HelperPrograms
from tests.stories.core.support.coding_fixtures import BuilderStarted


def programs(story):
    return story.container.constructed(HelperPrograms)


def test_a_program_that_is_not_installed_is_refused(new_story, tmp_path, monkeypatch):
    story = new_story(fixture=BuilderStarted)
    monkeypatch.setattr(shutil, "which", lambda name: None)
    with pytest.raises(Refusal, match="not installed"):
        programs(story).checked("claude", tmp_path)


def test_a_claude_folder_gets_no_hook_file_of_the_journal(new_story, tmp_path, monkeypatch):
    story = new_story(fixture=BuilderStarted)
    monkeypatch.setattr(shutil, "which", lambda name: name)
    programs(story).checked("claude", tmp_path)
    story.expect_rows(not (tmp_path / ".claude" / "settings.local.json").exists())


def test_a_program_trusts_the_hooks_the_journal_writes(new_story, tmp_path, monkeypatch):
    story = new_story(fixture=BuilderStarted)
    monkeypatch.setattr(shutil, "which", lambda name: name)
    monkeypatch.setenv("CODEX_HOME", str(tmp_path / "codex-home"))
    programs(story).checked("codex", tmp_path)
    story.expect_success(f'program trust codex "{tmp_path}"', "ready")
