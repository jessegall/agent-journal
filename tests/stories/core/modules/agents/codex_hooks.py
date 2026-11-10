from pathlib import Path
from typing import NamedTuple

import pytest

from engine.provider.program_hooks import ProgramHooks
from engine.provider.providers import Providers
from engine.testing.stories.story import Story
from core.testing.fake_launcher import FakeLauncher
from core.modules.codex.providers.codex_provider import CodexProvider
from install.hook_writer import HookWriter
from tests.stories.core.modules.helpers.program_split import helper_split_story
from tests.stories.core.modules.helpers.start_helper import START, started
from tests.stories.suites.coding.modules.workers.support.program_split import real_program_checks


class CodexHookProject(NamedTuple):
    story: Story
    folder: Path
    config: Path


@pytest.fixture
def codex_project(helper_split_story, tmp_path, monkeypatch):
    story = helper_split_story
    monkeypatch.setattr('shutil.which', lambda name: name)
    real_program_checks(story)
    config = story.container.get(Providers).provider('codex').trust_record().config_file
    config.parent.mkdir(parents=True, exist_ok=True)
    config.write_text('model = "gpt-6.1-sol"\n')
    return CodexHookProject(story, tmp_path / 'helper-project', config)


@pytest.fixture
def installed_codex_project(codex_project):
    _, folder, _ = codex_project
    HookWriter(folder).write(f'"{folder}/.journal/bin/journal-hook"')
    return codex_project


@pytest.mark.parametrize('upgrade', [False, True])
def test_an_install_trusts_generated_hooks_and_a_codex_helper_starts(codex_project, upgrade):
    story, folder, config = codex_project
    if upgrade:
        ProgramHooks.hooks(CodexProvider, folder).write('old/journal-hook', folder)
        config.write_text(config.read_text().replace('sha256:', 'stale:'))
        story.expect_success(f'program trust codex "{folder}"', 'changed')
    HookWriter(folder).write(f'"{folder}/.journal/bin/journal-hook"', is_upgrade=upgrade)
    story.expect_success(f'program trust codex "{folder}"', 'ready')
    helper, _ = started(story, f'{START} --program codex --model gpt-6.1-sol')
    story.expect_text(f'agent show {helper}', 'program: codex')
    story.expect_rows('model = "gpt-6.1-sol"' in config.read_text())


def test_an_agent_cannot_trust_a_foreign_hook_file_by_reading_its_trust(installed_codex_project, tmp_path):
    story, folder, config = installed_codex_project
    foreign = tmp_path / 'foreign'
    ProgramHooks.store(foreign / CodexProvider.hook_file.path, ProgramHooks.hooks(CodexProvider, folder).settings())
    story.expect_success(f'program trust codex "{foreign}"', 'untrusted', actor=story.agent)
    story.expect_success(f'environment edit 1 --folder "{foreign}"')
    FakeLauncher.listening(story.home.socket('launcher'))
    story.expect_success(f'{START} --program codex --model gpt-6.1-sol', actor=story.agent)


def test_a_foreign_edit_is_not_approved_when_an_agent_asks_to_start(installed_codex_project):
    story, folder, config = installed_codex_project
    hooks = ProgramHooks.hooks(CodexProvider, folder)
    settings = hooks.settings()
    settings['hooks']['PreToolUse'][0]['hooks'][0]['command'] += ' --foreign'
    ProgramHooks.store(hooks.path, settings)
    FakeLauncher.listening(story.home.socket('launcher'))
    story.expect_success(f'{START} --program codex --model gpt-6.1-sol', actor=story.agent)
    story.expect_success(f'program trust codex "{folder}"', 'ready', actor=story.agent)
