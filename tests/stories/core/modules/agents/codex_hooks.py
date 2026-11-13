import os
from pathlib import Path
from typing import NamedTuple

import pytest

from engine.provider.program_hooks import ProgramHooks
from engine.testing.stories.story import Story
from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.codex.providers.codex_provider import CodexProvider
from tests.stories.core.modules.helpers.program_split import helper_split_story
from tests.stories.core.modules.helpers.start_helper import START, started
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.support.program_split import real_program_checks

PERSON_CONFIG = 'model = "gpt-6.1-sol"\n'


class CodexHookProject(NamedTuple):
    story: Story
    folder: Path
    person_config: Path


@pytest.fixture
def codex_project(helper_split_story, tmp_path, monkeypatch):
    story = helper_split_story
    monkeypatch.setattr('shutil.which', lambda name: name)
    real_program_checks(story)
    person_config = Path(os.environ['CODEX_HOME']) / 'config.toml'
    person_config.parent.mkdir(parents=True, exist_ok=True)
    person_config.write_text(PERSON_CONFIG)
    return CodexHookProject(story, tmp_path / 'helper-project', person_config)


def journal_hooks(story) -> ProgramHooks:
    return ProgramHooks.journal(CodexProvider, story.home.folder / 'programs' / 'codex' / 'hooks.json')


def test_a_codex_helper_starts_on_the_journal_s_trusted_folder_and_the_person_config_stays(codex_project):
    story, folder, person_config = codex_project
    helper, _ = started(story, f'{START} --program codex --model gpt-6.1-sol')
    story.expect_text(f'agent show {agent_number(story, helper)}', 'program: codex')
    story.expect_success(f'program trust codex "{folder}"', 'ready')
    story.expect_rows(person_config.read_text() == PERSON_CONFIG, journal_hooks(story).is_complete())


def test_a_foreign_edit_of_the_journal_s_hooks_is_changed_until_the_next_start_writes_them_again(codex_project):
    story, folder, _ = codex_project
    started(story, f'{START} --program codex --model gpt-6.1-sol')
    hooks = journal_hooks(story)
    settings = hooks.settings()
    settings['hooks']['PreToolUse'][0]['hooks'][0]['command'] += ' --foreign'
    hooks.path.chmod(0o644)
    ProgramHooks.store(hooks.path, settings)
    story.expect_success(f'program trust codex "{folder}"', 'changed', actor=story.agent)
    FakeLauncher.accepting(story.home.socket('launcher'))
    story.expect_success(f'{START} --program codex --model gpt-6.1-sol', actor=story.agent)
    story.expect_success(f'program trust codex "{folder}"', 'ready', actor=story.agent)
    story.expect_rows('--foreign' not in hooks.path.read_text())
