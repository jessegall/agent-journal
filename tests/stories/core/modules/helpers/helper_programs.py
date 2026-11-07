import shutil

import pytest

from core.base.journal_home import JournalHome
from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.providers import Providers
from core.base.refusal import Refusal
from core.modules.helpers.support.helper_programs import HelperPrograms
from tests.stories.core.support.coding_fixtures import BuilderStarted


def programs(story):
    return HelperPrograms(story.container.get(JournalHome), story.container.get(Providers), story.container.get(ManagedHooks))


def test_a_program_that_is_not_installed_is_refused(new_story, tmp_path, monkeypatch):
    story = new_story(fixture=BuilderStarted)
    monkeypatch.setattr(shutil, "which", lambda name: None)
    with pytest.raises(Refusal, match="not installed"):
        programs(story).checked("claude", tmp_path)


def test_a_folder_with_no_hooks_gets_the_program_s_hooks(new_story, tmp_path, monkeypatch):
    story = new_story(fixture=BuilderStarted)
    monkeypatch.setattr(shutil, "which", lambda name: name)
    programs(story).checked("claude", tmp_path)
    story.expect_rows((tmp_path / ".claude" / "settings.local.json").is_file())


def test_a_program_trusts_the_hooks_the_journal_writes(new_story, tmp_path, monkeypatch):
    story = new_story(fixture=BuilderStarted)
    monkeypatch.setattr(shutil, "which", lambda name: name)
    monkeypatch.setenv("CODEX_HOME", str(tmp_path / "codex-home"))
    programs(story).checked("codex", tmp_path)
    story.expect_success(f'program trust codex "{tmp_path}"', "ready")
