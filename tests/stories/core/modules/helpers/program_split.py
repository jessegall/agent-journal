import json
from datetime import timedelta

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.fake_launcher import FakeLauncher
from tests.stories.core.modules.helpers.start_helper import START, started
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, START as FILE_START, helper_agent
from core.modules.helpers.support.helper_programs import HelperPrograms
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.suites.coding.modules.workers.support.program_split import SPLIT, real_program_checks, set_split, viewer_client
from tests.stories.support.program_states import real_program_states


@pytest.fixture
def helper_split_story(new_story, tmp_path):
    story = new_story(fixture=BuilderWithUser)
    folder = tmp_path / 'helper-project'
    folder.mkdir()
    story.expect_success(f'environment edit 1 --folder "{folder}"')
    return story


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


def test_split_passes_over_a_program_not_trusted(helper_split_story, tmp_path, monkeypatch, helper_viewer):
    story = helper_split_story
    set_split(story, 'claude 20,codex 80', viewer=helper_viewer)
    monkeypatch.setenv('CODEX_HOME', str(tmp_path / 'codex-config'))
    monkeypatch.setattr('shutil.which', lambda name: name)
    real_program_checks(story)
    story.container.get(HelperPrograms).checked("claude", tmp_path / "helper-project")
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
def test_split_setting_must_add_to_100(helper_split_story, helper_viewer, shares, reason):
    story = helper_split_story
    helper_viewer.refusal('settings.settings', ['setting', 'set', SPLIT, shares, '--project'], reason)
    story.expect_absent(f'setting show {SPLIT}', shares)


def test_split_setting_must_add_to_100_empty_means_today(helper_split_story, helper_viewer):
    story = helper_split_story
    set_split(story, '', viewer=helper_viewer)
    helper_id, _ = started(story)
    story.expect_text(f'agent show {helper_id}', 'program: claude')


@pytest.mark.parametrize('shares,reason', [('claude -1,codex 101', 'whole'), ('claude 50.5,codex 49.5', 'whole'), ('claude 100,codex 0,claude 0', 'twice'), ('claude', 'whole')])
def test_split_setting_must_add_to_100_invalid_lines_are_refused(helper_split_story, helper_viewer, shares, reason):
    story = helper_split_story
    helper_viewer.refusal('settings.settings', ['setting', 'set', SPLIT, shares, '--project'], reason)


def test_helper_goes_by_the_split(helper_split_story, helper_viewer):
    story = helper_split_story
    set_split(story, 'claude 0,codex 100', viewer=helper_viewer)
    helper_id, _ = started(story)
    story.expect_text(f'agent show {helper_id}', 'program: codex', 'program_model: gpt-6.1-terra')
    answer = story.run('worker split --json --environment main')
    story.expect_rows(answer.code == 0, detail=answer.output_text)
    rows = json.loads(answer.output_text)['rows']
    codex = next(row for row in rows if row['id'] == 'codex')
    story.expect_rows(codex['recent'] == 0, codex['helpers_recent'] == 1)


def test_helper_goes_by_the_split_profile_program_wins(helper_split_story, helper_viewer):
    story = helper_split_story
    helper_viewer.value('profiles.profiles', ['profile', 'save', 'claude-reader', '--description', 'Reads files', '--body', 'Read files.', '--program', 'claude', '--model', 'sonnet'])
    set_split(story, 'codex 100,claude 0', viewer=helper_viewer)
    helper_id, _ = started(story, 'helper start claude-reader --brief "Read the queue" --environment main')
    story.expect_text(f'agent show {helper_id}', 'program: claude')


def test_helper_goes_by_the_split_reuse_still_goes_first(new_story):
    story = new_story(fixture=EndedHelper)
    helper_id = helper_agent(story).id
    set_split(story, 'codex 100,claude 0')
    FakeLauncher(story.home.socket('launcher'))
    story.expect_refusal(FILE_START, f'journal helper send {helper_id}', actor=story.agent)


def test_helper_goes_by_the_split_named_out_program_is_started_with_warning(helper_split_story):
    story = helper_split_story
    ends_at = (story.clock.timestamp().value + timedelta(minutes=15)).isoformat(timespec='microseconds')
    story.expect_success(f'provider-outage make codex "rate limit" --ends-at {ends_at}', actor=story.agent)
    real_program_states(story)
    launcher = FakeLauncher(story.home.socket('launcher'))
    answer = story.run(f'{START} --program codex', actor=story.agent)
    story.run_listeners()
    launcher.thread.join(timeout=5)
    launcher.server.close()
    story.home.socket('launcher').unlink()
    story.expect_rows(answer.code == 0, 'is out until' in answer.output_text, ends_at in answer.output_text)
