from tests.stories.core.support.agent_labels import agent_number
import json
from datetime import timedelta

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.modules.agents.testing.fake_launcher import FakeLauncher
from tests.stories.core.modules.helpers.start_helper import START, started
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, START as FILE_START, helper_agent
from core.modules.helpers.support.helper_programs import HelperPrograms
from engine.provider.program_hooks import ProgramHooks
from engine.provider.providers import Providers
from core.modules.codex.providers.codex_provider import CodexProvider
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.suites.coding.modules.workers.support.program_split import SPLIT, real_program_checks, set_split, viewer_client
from tests.stories.support.program_states import real_program_states


@pytest.fixture
def helper_split_story(new_story, tmp_path):
    story = new_story(fixture=UserBuilder)
    folder = tmp_path / 'helper-project'
    folder.mkdir()
    story.expect_success(f'environment edit 1 --folder "{folder}"')
    return story


@pytest.fixture
def helper_viewer(helper_split_story):
    with viewer_client(helper_split_story) as viewer:
        yield viewer


def test_split_passes_over_a_program_not_trusted(helper_split_story, tmp_path, monkeypatch, helper_viewer):
    story = helper_split_story
    set_split(story, 'claude 20,codex 80', viewer=helper_viewer)
    monkeypatch.setenv('CODEX_HOME', str(tmp_path / 'codex-config'))
    monkeypatch.setattr('shutil.which', lambda name: name)
    real_program_checks(story)
    story.container.get(HelperPrograms).checked("claude", tmp_path / "helper-project")
    helper_id, _ = started(story)
    story.expect_text(f'agent show {agent_number(story, helper_id)}', 'program: claude')


def test_a_named_program_whose_hooks_are_not_trusted_has_them_written_and_trusted(helper_split_story, tmp_path, monkeypatch):
    story = helper_split_story
    monkeypatch.setenv('CODEX_HOME', str(tmp_path / 'untrusted'))
    monkeypatch.setattr('shutil.which', lambda name: name)
    real_program_checks(story)
    hooks = ProgramHooks.hooks(CodexProvider, tmp_path / 'helper-project')
    hooks.write('journal-hook', story.home.project_folder)
    settings = hooks.settings()
    settings['hooks']['PreToolUse'][0]['hooks'][0]['command'] += ' --foreign'
    ProgramHooks.store(hooks.path, settings)
    FakeLauncher.accepting(story.home.socket('launcher'))
    story.expect_success(f'{START} --program codex', actor=story.agent)


def test_hooks_in_a_worktree_name_the_project_root_where_the_server_runs(helper_split_story, tmp_path, monkeypatch):
    # worker 707 on 8 November: its worktree's hooks named the worktree as root, found no server there and held every stop
    story = helper_split_story
    monkeypatch.setenv('CODEX_HOME', str(tmp_path / 'codex-config'))
    monkeypatch.setattr('shutil.which', lambda name: name)
    real_program_checks(story)
    folder = tmp_path / 'worktrees' / 'worker-707'
    hooks = ProgramHooks.journal(ClaudeCodeProvider, story.container.get(Providers).provider('claude').journal_hook_file(story.home))
    hooks.write('"journal-hook"', folder)
    story.container.get(HelperPrograms).checked('claude', folder)
    story.expect_rows(hooks.names_root(story.home.project_folder), not hooks.names_root(folder))


@pytest.mark.parametrize('shares,reason', [('claude 80,codex 10', '100'), ('claude 80,unknown 20', 'unknown')])
def test_split_setting_must_add_to_100(helper_split_story, helper_viewer, shares, reason):
    story = helper_split_story
    helper_viewer.refusal('settings.settings', ['setting', 'set', SPLIT, shares, '--project'], reason)
    story.expect_absent(f'setting show {SPLIT}', shares)


@pytest.mark.parametrize('shares,reason', [('claude -1,codex 101', 'does not follow'), ('claude 50.5,codex 49.5', 'does not follow'), ('claude 100,codex 0,claude 0', 'twice'), ('claude', 'does not follow')])
def test_split_setting_must_add_to_100_invalid_lines_are_refused(helper_split_story, helper_viewer, shares, reason):
    story = helper_split_story
    helper_viewer.refusal('settings.settings', ['setting', 'set', SPLIT, shares, '--project'], reason)


def test_helper_goes_by_the_split(helper_split_story, helper_viewer):
    story = helper_split_story
    set_split(story, 'claude 0,codex 100', viewer=helper_viewer)
    helper_id, _ = started(story)
    story.expect_text(f'agent show {agent_number(story, helper_id)}', 'program: codex', 'program_model: gpt-6.1-terra')
    answer = story.run('worker split --json --environment main')
    story.expect_rows(answer.code == 0, detail=answer.output_text)
    rows = json.loads(answer.output_text)['rows']
    codex = next(row for row in rows if row['id'] == 'codex')
    story.expect_rows(codex['recent'] == 0, codex['helpers_recent'] == 1)


def test_helper_goes_by_the_split_reuse_still_goes_first(new_story):
    story = new_story(fixture=EndedHelper)
    helper_id = helper_agent(story).id
    set_split(story, 'codex 100,claude 0')
    FakeLauncher.accepting(story.home.socket('launcher'))
    story.expect_refusal(FILE_START, f'journal helper send {agent_number(story, helper_id)}', actor=story.agent)


def test_helper_goes_by_the_split_named_out_program_is_started_with_warning(helper_split_story):
    story = helper_split_story
    ends_at = (story.clock.timestamp().value + timedelta(minutes=15)).isoformat(timespec='microseconds')
    story.expect_success(f'provider-outage make codex "rate limit" --ends-at {ends_at}', actor=story.agent)
    real_program_states(story)
    launcher = FakeLauncher.accepting(story.home.socket('launcher'))
    answer = story.run(f'{START} --program codex', actor=story.agent)
    story.run_listeners()
    launcher.drain_requests()
    launcher.server.close()
    story.home.socket('launcher').unlink()
    story.expect_rows(answer.code == 0, 'is out until' in answer.output_text, ends_at in answer.output_text)
