import json
import shutil
from datetime import datetime, timedelta

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.query.queries import Queries
from core.modules.messages.models.message import Message
from core.testing.fake_launcher import FakeLauncher
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.environments.support.environment_rows import EnvironmentRows
from pathlib import Path
from tests.stories.core.modules.helpers.start_helper import START, started
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.suites.coding.modules.workers.support.program_split import (
    SAMPLE_MODULE, dispatch, exit_program, expect_program, new_task, outage, real_program_checks,
    set_split, split_story, split_viewer,
)
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry


@pytest.fixture
def failed_worker_story(split_story):
    launcher = FakeLauncher(split_story.home.socket('launcher'), request_count=4).serve()
    worker = dispatch(split_story)
    split_story.run_listeners()
    exit_program(split_story, worker)
    return split_story, worker, launcher


def test_nothing_set_dispatches_as_today(split_story):
    story = split_story
    worker = dispatch(story)
    expect_program(story, worker, 'claude', 'sonnet')
    story.expect_text(f'agent show {worker.id}', 'profile: journal-worker')


def test_nothing_set_dispatches_as_today_on_codex(split_story):
    story = split_story
    parent = Actor(story.new_row_id('agent start codex-parent codex main --environment main'), ActorType.AGENT)
    worker = dispatch(story, actor=parent)
    expect_program(story, worker, 'codex', 'gpt-6.1-terra')


def test_nothing_set_dispatches_as_today_person_needs_program(split_story):
    story = split_story
    story.expect_refusal('worker dispatch --test-command python=pytest 1 --environment main', '--program', actor=story.user)
    story.expect_text('worker-worktree list', 'nothing found')


@pytest.mark.parametrize('program,model', [('codex', 'gpt-6.1-sol'), ('claude', 'opus')])
def test_tier_flag_picks_the_model_of_each_program(split_story, program, model):
    story = split_story
    worker = dispatch(story, flags=f'--tier strongest --program {program}')
    expect_program(story, worker, program, model)


def test_tier_flag_picks_the_model_of_each_program_rare_needs_a_name(split_story):
    split_story.expect_refusal('worker dispatch --test-command python=pytest 1 --tier rare', 'name the model', actor=split_story.agent)


@pytest.mark.parametrize('program,model', [('codex', 'gpt-6.1-sol'), ('claude', 'opus')])
def test_profile_tier_fits_any_program(split_story, program, model):
    story = split_story
    worker = dispatch(story, flags=f'--profile journal-senior --program {program}')
    expect_program(story, worker, program, model)


def test_profile_tier_fits_any_program_added_provider(split_story):
    story = split_story
    story.expect_sync_success(SAMPLE_MODULE)
    worker = dispatch(story, flags='--profile journal-senior --program sample')
    expect_program(story, worker, 'sample', 'sample-strongest')


@pytest.mark.parametrize('program,model', [('claude', 'haiku'), ('codex', 'gpt-6.1-terra')])
def test_profile_tier_fits_any_program_saved_model(split_story, split_viewer, program, model):
    story = split_story
    split_viewer.value('profiles.profiles', ['profile', 'save', 'saved-worker', '--type', 'worker', '--description', 'Implements one task', '--body', 'Do the task.', '--model', 'haiku', '--codex-model', 'gpt-6.1-terra'])
    worker = dispatch(story, flags=f'--profile saved-worker --program {program}')
    expect_program(story, worker, program, model)


def test_allowed_models_narrow_a_tier(split_story, split_viewer):
    story = split_story
    split_viewer.value('settings.settings', ['setting', 'set', 'journal.core.helpers.allowed-models', 'claude sonnet', '--project'])
    worker = dispatch(story, flags='--program claude --tier strongest')
    expect_program(story, worker, 'claude', 'sonnet')
    story.run_listeners()
    story.expect_text('chat-mark list --json', 'tier', 'not allowed', 'sonnet')


def test_allowed_models_narrow_a_tier_named_model_is_refused(split_story, split_viewer):
    story = split_story
    split_viewer.value('settings.settings', ['setting', 'set', 'journal.core.helpers.allowed-models', 'claude sonnet', '--project'])
    story.expect_refusal('worker dispatch --test-command python=pytest 1 --model opus --program claude', 'sonnet', actor=story.agent)


def test_split_passes_over_a_program_not_installed(split_story, monkeypatch, split_viewer):
    story = split_story
    set_split(story, 'claude 20,codex 80', viewer=split_viewer)
    real_program_checks(story)
    story.container.get(HelperPrograms).checked('claude', Path(story.container.get(EnvironmentRows).find(1).folder))
    monkeypatch.setattr(shutil, 'which', lambda name: None if name == 'codex' else name)
    worker = dispatch(story)
    expect_program(story, worker, 'claude')
    story.expect_text('worker split', 'codex', 'not installed')


@pytest.fixture
def window_split_story(split_story, request, split_viewer):
    set_split(split_story, viewer=split_viewer)
    resets_at = int((split_story.clock.timestamp().value + timedelta(hours=1)).timestamp())
    save_status_file(split_story, 's-1', {'rate_limits': {'five_hour': {'used_percentage': request.param, 'resets_at': resets_at}}})
    return split_story, dispatch(split_story)


@pytest.mark.parametrize('window_split_story', [96], indirect=True)
def test_split_passes_over_a_nearly_used_plan_window(window_split_story):
    story, worker = window_split_story
    expect_program(story, worker, 'codex')
    story.advance(timedelta(hours=1, seconds=1))
    next_task = new_task(story, 'After reset')
    expect_program(story, dispatch(story, str(next_task)), 'claude')


@pytest.mark.parametrize('window_split_story', [94], indirect=True)
def test_split_passes_over_a_nearly_used_plan_window_at_94_is_ready(window_split_story):
    story, worker = window_split_story
    expect_program(story, worker, 'claude')


def test_split_passes_over_a_nearly_used_plan_window_no_status_is_ready(split_story, split_viewer):
    story = split_story
    set_split(story, 'codex 100,claude 0', viewer=split_viewer)
    expect_program(story, dispatch(story), 'codex')


def test_exit_on_a_limit_opens_an_outage(failed_worker_story):
    story, worker, launcher = failed_worker_story
    story.expect_text('provider-outage list', 'claude', 'rate limit')
    rows = json.loads(story.run('provider-outage list --json').output_text)['rows']
    story.expect_rows(datetime.fromisoformat(rows[0]['ends_at']) == story.clock.timestamp().value + timedelta(minutes=15))
    story.expect_text(f'agent show {worker.id}', 'ended_at:')
    story.expect_rows(len(launcher.requests) == 1)


def test_exit_on_a_limit_opens_an_outage_for_a_helper(split_story):
    story = split_story
    helper_id, _ = started(story, START)
    exit_program(story, Actor(helper_id, ActorType.AGENT))
    story.expect_text('provider-outage list', 'claude', 'rate limit')
    report = story.container.get(Queries).query(Message).filter(session_agent_id=helper_id).first()
    story.expect_text(f'message read {report.id}', 'rate limit')


def test_exit_on_a_limit_opens_an_outage_only_for_a_failed_exit(split_story):
    story = split_story
    worker = dispatch(story)
    exit_program(story, worker, code=0)
    story.expect_text('provider-outage list', 'nothing found')


def test_exit_on_a_limit_opens_an_outage_for_an_expired_login(split_story):
    story = split_story
    exit_program(story, dispatch(story), text='Please run /login')
    story.expect_text('provider-outage list', 'claude', 'login expired')


def test_outage_ends_on_time(split_story, split_viewer):
    story = split_story
    row_id, ends_at = outage(story)
    set_split(story, 'codex 100,claude 0', viewer=split_viewer)
    story.expect_text('worker split', 'codex', ends_at)
    story.advance(timedelta(minutes=15, seconds=1))
    expect_program(story, dispatch(story), 'codex')
    story.expect_text(f'provider-outage show {row_id}', 'rate limit', ends_at)


def test_outage_ends_on_time_back_now_ends_it_early(split_story, split_viewer):
    story = split_story
    row_id, _ = outage(story)
    split_viewer.value('workers.workers', ['provider-outage', 'delete', str(row_id)])
    set_split(story, 'codex 100,claude 0', viewer=split_viewer)
    expect_program(story, dispatch(story), 'codex')


def test_worker_on_an_out_program_does_not_restart(failed_worker_story):
    story, worker, launcher = failed_worker_story
    WorkerResumeRetry()(story.container)
    WorkerResumeRetry()(story.container)
    lines = story.run(f'agent-line list --agent {story.agent.id}').output_text
    story.expect_rows(lines.count(f'worker:{worker.id} stopped') == 1)
    story.expect_text(f'worker status {worker.id}', 'Program: claude', 'rate limit', 'until', '09:15', f'journal worker release {worker.id}')
    story.expect_rows(len(launcher.requests) == 1)
    story.expect_text(f'agent show {worker.id}', 'ended_at:')


def test_worker_on_an_out_program_does_not_restart_until_the_outage_ends(failed_worker_story):
    story, worker, launcher = failed_worker_story
    story.advance(timedelta(minutes=15, seconds=1))
    WorkerResumeRetry()(story.container)
    story.run_listeners()
    story.expect_rows(len(launcher.requests) == 2, launcher.requests[-1]['agent_id'] == worker.id, detail=str(launcher.requests))


def test_every_program_out_refuses_a_dispatch(split_story, split_viewer):
    story = split_story
    _, earliest = outage(story, 'claude', 10)
    outage(story, 'codex', 20)
    set_split(story, viewer=split_viewer)
    story.expect_refusal('worker dispatch --test-command python=pytest 1', earliest, actor=story.agent)
    story.expect_text('worker-worktree list', 'nothing found')
    story.expect_rows(not list((story.home.folder.parent / 'project' / '.journal' / 'worktrees').glob('*/*')))


def test_split_counts_tasks_not_workers(split_story, split_viewer):
    story = split_story
    second = new_task(story, 'Second')
    third = new_task(story, 'Third')
    dispatch(story, f'1 {second} {third}', '--program codex')
    set_split(story, 'claude 50,codex 50', viewer=split_viewer)
    story.expect_text('worker-worktree show 1', 'task_count: 3')
    answer = story.run('worker split --json')
    story.expect_rows(answer.code == 0)
    rows = json.loads(answer.output_text)['rows']
    story.expect_rows(next(row for row in rows if row['id'] == 'codex')['recent'] == 3)
    fourth = new_task(story, 'Fourth')
    expect_program(story, dispatch(story, str(fourth)), 'claude')


def test_out_program_share_goes_to_the_others(split_story, split_viewer):
    story = split_story
    split_viewer.value('settings.settings', ['setting', 'set', 'journal.suites.coding.workers.worker-run-limit', '3', '--environment', 'main'])
    set_split(story, 'claude 50,codex 50', viewer=split_viewer)
    outage(story)
    expect_program(story, dispatch(story), 'claude')
    second = new_task(story, 'During outage')
    expect_program(story, dispatch(story, str(second)), 'claude')
    story.advance(timedelta(minutes=15, seconds=1))
    third = new_task(story, 'After outage')
    expect_program(story, dispatch(story, str(third)), 'codex')


def test_provider_added_later_takes_a_share(split_story, split_viewer):
    story = split_story
    story.expect_sync_success(SAMPLE_MODULE)
    answer = story.run('worker split --json')
    story.expect_rows(answer.code == 0)
    rows = json.loads(answer.output_text)['rows']
    story.expect_rows(next(row for row in rows if row['id'] == 'sample')['share'] == 0)
    set_split(story, 'sample 100,claude 0,codex 0', viewer=split_viewer)
    expect_program(story, dispatch(story), 'sample', 'sample-general')
