import json

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.provider.hook_trust import HookTrust
from core.base.provider.providers import Providers
from core.testing.fake_launcher import FakeLauncher
from tests.stories.core.modules.helpers.start_helper import START, started
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.suites.coding.modules.workers.support.program_split import SPLIT, real_program_checks, set_split, viewer_client


@pytest.fixture
def helper_split_story(new_story):
    return new_story(fixture=BuilderWithUser)


@pytest.fixture
def helper_viewer(helper_split_story):
    with viewer_client(helper_split_story) as viewer:
        yield viewer


def test_helper_with_nothing_set_runs_on_its_parent_program(helper_split_story):
    story = helper_split_story
    helper_id, _ = started(story)
    story.expect_text(f'agent show {helper_id}', 'program: claude', 'program_model: sonnet')


def test_helper_with_nothing_set_runs_on_its_parent_program_profile_can_name_one(helper_split_story, helper_viewer):
    story = helper_split_story
    helper_viewer.value('profiles.profiles', ['profile', 'save', 'codex-reader', '--description', 'Reads files', '--body', 'Read files.', '--program', 'codex', '--model', 'gpt-6.1-terra'])
    helper_id, _ = started(story, 'helper start codex-reader --brief "Read the queue" --environment main')
    story.expect_text(f'agent show {helper_id}', 'program: codex')


def test_split_passes_over_a_program_not_trusted(helper_split_story, tmp_path, monkeypatch):
    story = helper_split_story
    set_split(story, 'claude 20,codex 80')
    monkeypatch.setenv('CODEX_HOME', str(tmp_path / 'codex-config'))
    monkeypatch.setattr('shutil.which', lambda name: name)
    real_program_checks(story)
    helper_id, _ = started(story)
    story.expect_text(f'agent show {helper_id}', 'program: claude')


def test_split_passes_over_a_program_not_trusted_named_program_keeps_the_refusal(helper_split_story, tmp_path, monkeypatch):
    story = helper_split_story
    monkeypatch.setenv('CODEX_HOME', str(tmp_path / 'untrusted'))
    monkeypatch.setattr('shutil.which', lambda name: name)
    real_program_checks(story)
    FakeLauncher(story.home.socket('launcher'))
    story.expect_refusal(f'{START} --program codex', 'journal program trust', actor=story.agent)


@pytest.mark.parametrize('shares,reason', [('claude 80,codex 10', '100'), ('claude 80,unknown 20', 'unknown')])
def test_split_setting_must_add_to_100(helper_split_story, shares, reason):
    story = helper_split_story
    story.expect_refusal(f'setting set {SPLIT} "{shares}" --project', reason, actor=story.agent)
    story.expect_absent(f'setting show {SPLIT}', shares)


def test_split_setting_must_add_to_100_empty_means_today(helper_split_story):
    story = helper_split_story
    set_split(story, '')
    helper_id, _ = started(story)
    story.expect_text(f'agent show {helper_id}', 'program: claude')


def test_helper_goes_by_the_split(helper_split_story):
    story = helper_split_story
    set_split(story, 'claude 0,codex 100')
    helper_id, _ = started(story)
    story.expect_text(f'agent show {helper_id}', 'program: codex', 'program_model: gpt-6.1-terra')
    rows = json.loads(story.run('worker split --json --environment main').output_text)['rows']
    codex = next(row for row in rows if row['id'] == 'codex')
    story.expect_rows(codex['recent'] == 0, codex['helpers_recent'] == 1)


def test_helper_goes_by_the_split_profile_program_wins(helper_split_story, helper_viewer):
    story = helper_split_story
    helper_viewer.value('profiles.profiles', ['profile', 'save', 'claude-reader', '--description', 'Reads files', '--body', 'Read files.', '--program', 'claude', '--model', 'sonnet'])
    set_split(story, 'codex 100,claude 0')
    helper_id, _ = started(story, 'helper start claude-reader --brief "Read the queue" --environment main')
    story.expect_text(f'agent show {helper_id}', 'program: claude')


def test_helper_goes_by_the_split_reuse_still_goes_first(helper_split_story):
    story = helper_split_story
    helper_id, _ = started(story)
    story.expect_success(f'agent end {helper_id}', actor=story.user)
    set_split(story, 'codex 100,claude 0')
    FakeLauncher(story.home.socket('launcher'))
    story.expect_refusal(START, f'journal helper send {helper_id}', actor=story.agent)
