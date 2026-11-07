import json
from datetime import timedelta

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from core.base.provider.hook_trust import HookTrust
from core.base.provider.providers import Providers
from core.testing.fake_launcher import FakeLauncher
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.helpers.start_helper import START, started
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.suites.coding.modules.workers.program_choice import failed_worker_story
from tests.stories.suites.coding.modules.workers.worker_routes import known_worker_story
from tests.stories.suites.coding.modules.workers.support.program_split import (
    SAMPLE_MODULE, SPLIT, dispatch, exit_program, expect_program, make_task, outage,
    real_program_checks, remove_sample, set_split, split_story, split_viewer,
)
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry


@pytest.mark.parametrize('agent_role', ['worker', 'helper'])
@pytest.mark.parametrize('cause', ['window', 'outage'])
def test_nothing_set_ignores_readiness(split_story, agent_role, cause):
    story = split_story
    if cause == 'outage':
        outage(story, 'claude')
    if cause == 'window':
        save_status_file(story, 's-1', {'rate_limits': {'five_hour': {'used_percentage': 96, 'resets_at': int((story.clock.timestamp().value + timedelta(hours=1)).timestamp())}}})
    if agent_role == 'worker':
        expect_program(story, dispatch(story), 'claude', 'sonnet')
        return
    helper_id, _ = started(story)
    story.expect_text(f'agent show {helper_id}', 'program: claude')


def test_worker_returns_when_its_program_is_back(failed_worker_story):
    story, worker, launcher = failed_worker_story
    story.expect_rows(len(launcher.requests) == 1)
    story.advance(timedelta(minutes=15, seconds=1))
    WorkerResumeRetry()(story.container)
    story.run_listeners()
    story.expect_rows(len(launcher.requests) == 2, launcher.requests[-1]['agent_id'] == worker.id)
    story.expect_text(f'agent-line list --agent {story.agent.id}', 'back', f'{worker.id}')


def test_both_plans_reuse_stays_on_the_chosen_program(known_worker_story):
    story, worker = known_worker_story
    set_split(story, 'claude 0,codex 100')
    task_id = make_task(story, 'Different program', '--complexity 2')
    next_worker = dispatch(story, str(task_id))
    expect_program(story, next_worker, 'codex')
    story.expect_rows(next_worker.id != worker.id)


def test_both_plans_reuse_stays_on_the_chosen_program_repeated_dispatch(split_story):
    story = split_story
    set_split(story, 'claude 50,codex 50')
    expect_program(story, dispatch(story), 'claude')
    task_id = make_task(story, 'Second dispatch')
    expect_program(story, dispatch(story, str(task_id)), 'codex')


@pytest.mark.parametrize('program,model,shares', [('claude', 'sonnet', 'codex 100,claude 0'), ('codex', 'gpt-6.1-terra', 'claude 100,codex 0')])
@pytest.mark.parametrize('agent_role', ['worker', 'helper'])
def test_named_model_fixes_the_program(split_story, program, model, shares, agent_role):
    story = split_story
    set_split(story, shares)
    if agent_role == 'worker':
        expect_program(story, dispatch(story, flags=f'--model {model}'), program, model)
        return
    helper_id, _ = started(story, f'{START} --model {model}')
    story.expect_text(f'agent show {helper_id}', f'program: {program}', f'program_model: {model}')


def test_named_model_fixes_the_program_route_still_holds(split_story):
    story = split_story
    story.expect_success('worker-route make --program codex --tags named --environment main', actor=story.agent)
    story.expect_success('task tag 1 named --confirm', actor=story.agent)
    story.expect_refusal('worker dispatch 1 --model sonnet', '--tier', actor=story.agent)
    story.expect_text('worker-worktree list', 'nothing found')


def test_split_counts_only_since_it_changed(split_story):
    story = split_story
    task_ids = [1, *[make_task(story, f'History {number}') for number in range(49)]]
    dispatch(story, ' '.join(map(str, task_ids)), '--program claude')
    story.advance(timedelta(seconds=1))
    set_split(story)
    task_id = make_task(story, 'First under split')
    expect_program(story, dispatch(story, str(task_id)), 'claude')
    answer = story.run('worker split --json')
    story.expect_rows(answer.code == 0)
    rows = json.loads(answer.output_text)['rows']
    story.expect_rows(next(row for row in rows if row['id'] == 'claude')['recent'] == 1)


@pytest.fixture
def unavailable_split(split_story):
    set_split(split_story, 'claude 0,codex 100')
    _, ends_at = outage(split_story)
    return split_story, ends_at


@pytest.mark.parametrize('agent_role', ['worker', 'helper'])
def test_split_with_none_eligible_differs_from_unset(unavailable_split, agent_role):
    story, ends_at = unavailable_split
    if agent_role == 'worker':
        story.expect_refusal('worker dispatch 1', ends_at, actor=story.agent)
        story.expect_text('worker-worktree list', 'nothing found')
        return
    FakeLauncher(story.home.socket('launcher'))
    story.expect_refusal(START, ends_at, actor=story.agent)
    story.expect_text('agent list --role helper', 'nothing found')


def test_helper_send_on_an_out_program_says_until_when(split_story):
    story = split_story
    helper_id, _ = started(story)
    story.expect_success(f'agent end {helper_id}', actor=story.user)
    _, ends_at = outage(story, 'claude')
    FakeLauncher(story.home.socket('launcher'))
    story.expect_refusal(f'helper send {helper_id} "Read the listener"', ends_at, actor=story.agent)
    story.expect_text(f'agent show {helper_id}', 'ended_at:')


def test_helper_send_on_an_out_program_says_until_when_reuse_names_it(split_story):
    story = split_story
    helper_id, _ = started(story)
    story.expect_success(f'agent end {helper_id}', actor=story.user)
    _, ends_at = outage(story, 'claude')
    FakeLauncher(story.home.socket('launcher'))
    story.expect_refusal(START, ends_at, actor=story.agent)
    story.expect_rows(f'journal helper send {helper_id}' in story.results[-1].output_text)


def test_back_now_ends_all_outages_of_a_program(split_story, split_viewer):
    story = split_story
    first_id, _ = outage(story, minutes=15)
    second_id, _ = outage(story, minutes=30, reason='its login expired')
    story.advance(timedelta(minutes=1))
    split_viewer.value('workers.workers', ['provider-outage', 'end', 'codex'])
    set_split(story, 'codex 100,claude 0')
    expect_program(story, dispatch(story), 'codex')
    answer = story.run('provider-outage list --json')
    story.expect_rows(answer.code == 0)
    rows = json.loads(answer.output_text)['rows']
    story.expect_rows({row['id'] for row in rows} == {first_id, second_id}, all(row['ends_at'] <= story.clock.timestamp().text for row in rows))


def test_mark_a_program_out(split_story):
    story = split_story
    _, ends_at = outage(story, reason='out of credit')
    story.expect_text('worker split', 'codex', 'out of credit', ends_at)


def test_mark_a_program_out_in_the_tab(split_story, split_viewer):
    story = split_story
    ends_at = (story.clock.timestamp().value + timedelta(minutes=30)).isoformat()
    split_viewer.value('workers.workers', ['provider-outage', 'make', 'codex', 'out of credit', '--ends-at', ends_at])
    rows = split_viewer.value('workers.workers', ['worker', 'split'])['rows']
    story.expect_rows('out of credit' in str(rows), ends_at in str(rows))


@pytest.mark.parametrize('program,ends_at,reason', [('unknown', '2026-11-01T09:00:00+00:00', 'unknown'), ('codex', '2026-10-30T09:00:00+00:00', 'future')])
def test_mark_a_program_out_invalid_values_are_refused(split_story, program, ends_at, reason):
    story = split_story
    story.expect_refusal(f'provider-outage make {program} "out of credit" --ends-at {ends_at}', reason, actor=story.agent)
    story.expect_text('provider-outage list', 'nothing found')


def test_profile_with_tools_stays_on_its_program(split_story, split_viewer):
    story = split_story
    split_viewer.value('profiles.profiles', ['profile', 'save', 'tool-reader', '--description', 'Reads the design', '--body', 'Read the design.', '--model', 'sonnet', '--mcp-tools', 'mcp__design__read'])
    set_split(story, 'codex 100,claude 0')
    helper_id, _ = started(story, 'helper start tool-reader --brief "Read the design" --environment main')
    story.expect_text(f'agent show {helper_id}', 'program: claude')


def test_read_only_helper_tags_only_when_making_a_task(split_story):
    story = split_story
    helper_id, _ = started(story, 'helper start journal-planner --brief "Plan networking" --environment main')
    helper = Actor(helper_id, ActorType.AGENT)
    task_id = story.new_row_id('task make "Network plan" --tag networking --complexity 3 --confirm --environment main', actor=helper)
    story.expect_refusal(f'task tag {task_id} linux --confirm', 'read', actor=helper)
    story.expect_refusal(f'task untag {task_id} networking', 'read', actor=helper)


@pytest.mark.parametrize('change', ['task untag 1 routed', 'task edit 1 --complexity 2'])
def test_read_only_helper_tags_only_when_making_a_task_changes_get_a_mark(split_story, change):
    story = split_story
    story.expect_success('task tag 1 routed --confirm', actor=story.agent)
    story.expect_success('task edit 1 --complexity 4', actor=story.agent)
    story.expect_success('worker-route make --program codex --tags routed --complexity-from 3 --environment main', actor=story.agent)
    story.expect_success(change, actor=story.agent)
    story.run_listeners()
    story.expect_text('chat-mark list --json', 'route', 'task 1')


def test_score_refusal_only_for_routes_that_could_match(split_story):
    story = split_story
    story.expect_success('worker-route make --program codex --tags scored --complexity-from 3 --environment main', actor=story.agent)
    expect_program(story, dispatch(story), 'claude')


def test_score_refusal_only_for_routes_that_could_match_names_all_tasks(split_story):
    story = split_story
    story.expect_success('worker-route make --tier fast --complexity-to 2 --environment main', actor=story.agent)
    task_id = make_task(story, 'Unscored')
    story.expect_refusal(f'worker dispatch 1 {task_id}', 'complexity', actor=story.agent)
    story.expect_rows('task 1' in story.results[-1].output_text, f'task {task_id}' in story.results[-1].output_text)


def test_score_refusal_only_for_routes_that_could_match_preview_reports(split_story):
    story = split_story
    story.expect_success('worker-route make --tier fast --complexity-to 2 --environment main', actor=story.agent)
    story.expect_text('worker split --task 1', 'no complexity', 'journal task edit 1')
    story.expect_text('worker-worktree list', 'nothing found')


@pytest.mark.parametrize('reverse', [False, True])
def test_batch_combines_route_constraints(split_story, reverse):
    story = split_story
    story.expect_success('worker-route make --tags easy --tier fast --environment main', actor=story.agent)
    story.expect_success('worker-route make --tags server --program codex --tier strongest --environment main', actor=story.agent)
    story.expect_success('task tag 1 easy --confirm', actor=story.agent)
    task_id = make_task(story, 'Server', '--tag server --confirm')
    tasks = [1, task_id]
    if reverse:
        tasks.reverse()
    flags = ' '.join(f'--task {number}' for number in tasks)
    story.expect_text(f'worker split {flags}', 'codex', 'gpt-6.1-sol')
    expect_program(story, dispatch(story, ' '.join(map(str, tasks))), 'codex', 'gpt-6.1-sol')


def test_only_a_person_changes_the_split(split_story):
    story = split_story
    story.expect_refusal(f'setting set {SPLIT} "claude 50,codex 50" --project', 'person', actor=story.agent)
    story.run_listeners()
    story.expect_text('chat-mark list --json', 'split', 'claude', 'codex')
    story.expect_absent(f'setting show {SPLIT}', 'claude 50')


@pytest.mark.parametrize('role', ['worker', 'helper'])
@pytest.mark.parametrize('line', ['worker-route make --program codex --tags protected --environment main',
                                 'provider-outage make codex "out of credit" --ends-at 2026-11-01T09:00:00+00:00',
                                 f'setting set {SPLIT} "claude 50,codex 50" --project'])
def test_only_a_person_changes_the_split_child_agents_cannot_write(split_story, role, line):
    story = split_story
    child = Actor(story.new_row_id(f'agent start child-session claude {role} --parent {story.agent.id} --environment main'), ActorType.AGENT)
    story.expect_refusal(line, role, actor=child)
    story.expect_text('worker-route list --environment main', 'nothing found')
    story.expect_text('provider-outage list', 'nothing found')


def test_agent_deletes_its_own_route_above_a_persons(split_story, split_viewer):
    story = split_story
    route_id = story.new_row_id('worker-route make --tags agent --program claude --environment main', actor=story.agent)
    split_viewer.value('workers.workers', ['worker-route', 'make', '--tags', 'person', '--program', 'codex'])
    story.expect_success(f'worker-route delete {route_id}', actor=story.agent)
    story.expect_text('worker-route show 2', 'position: 1', 'program: codex')


def test_agent_deletes_its_own_route_above_a_persons_deliberate_move_is_refused(split_story, split_viewer):
    story = split_story
    split_viewer.value('workers.workers', ['worker-route', 'make', '--tags', 'person', '--program', 'codex'])
    route_id = story.new_row_id('worker-route make --tags agent --program claude --environment main', actor=story.agent)
    story.expect_refusal(f'worker-route move {route_id} --to 1', 'person', actor=story.agent)
    story.expect_text('worker-route show 1', 'position: 1')


@pytest.fixture
def provider_failure_story(split_story, request):
    exit_program(split_story, dispatch(split_story), text=request.param)
    return split_story


@pytest.mark.parametrize('provider_failure_story', ['Please run /login'], indirect=True)
def test_chat_says_once_when_a_program_goes_out(provider_failure_story):
    story = provider_failure_story
    story.run_listeners()
    marks = story.run('chat-mark list --json').output_text
    story.expect_rows('login' in marks, 'claude' in marks, 'journal program' in marks or '/login' in marks)
    before = marks.count('login')
    story.run_listeners()
    story.expect_rows(story.run('chat-mark list --json').output_text.count('login') == before)


@pytest.mark.parametrize('provider_failure_story', ['The fixture prints "API Error: 429 rate limit reached" as sample data.\nAssertionError: bad cart total',
                                 'Application request failed: HTTP 429 from cart.example.test\nAssertionError: retry test',
                                 'Old output: Please run /login\nThe current job failed: AssertionError'], indirect=True)
def test_outage_only_from_a_provider_failure(provider_failure_story):
    story = provider_failure_story
    story.expect_text('provider-outage list', 'nothing found')


@pytest.fixture
def tier_worker_story(split_story, split_viewer):
    story = split_story
    split_viewer.value('profiles.profiles', ['profile', 'save', 'tier-worker', '--type', 'worker', '--description', 'Implements a task', '--body', 'Do the task.', '--tier', 'strongest'])
    profiles = split_viewer.value('profiles.profiles', ['profile', 'list'])['rows']
    profile = next(row for row in profiles if row['name'] == 'tier-worker')
    story.expect_rows(profile['tier'] == 'strongest')
    return story


@pytest.mark.parametrize('program,model', [('claude', 'opus'), ('codex', 'gpt-6.1-sol')])
def test_profile_tier_alone_beats_default_models(tier_worker_story, program, model):
    story = tier_worker_story
    expect_program(story, dispatch(story, flags=f'--profile tier-worker --program {program}'), program, model)


def test_profile_tier_alone_beats_default_models_cli_save(split_story):
    story = split_story
    story.expect_success('profile save tier-reader --description "Reads files" --body "Read files." --tier strongest', actor=story.user)
    helper_id, _ = started(story, 'helper start tier-reader --brief "Read the queue" --environment main')
    story.expect_text(f'agent show {helper_id}', 'program_model: opus')


def test_profile_tier_alone_beats_default_models_bad_file_is_a_problem(split_story):
    story = split_story
    profile = story.home.project_folder / '.agents' / 'profiles' / 'bad-tier.md'
    profile.parent.mkdir(parents=True, exist_ok=True)
    profile.write_text('---\nname: bad-tier\ntype: helper\ndescription: Reads files\ntier: enormous\n---\nRead files.\n')
    story.expect_text('profile list --json', 'bad-tier', 'problem', 'enormous')


@pytest.mark.parametrize('program,model', [('claude', 'fable'), ('codex', 'gpt-6-astra')])
def test_rare_model_is_never_automatic(split_story, split_viewer, program, model):
    story = split_story
    split_viewer.value('workers.models', ['setting', 'set', 'journal.core.helpers.allowed-models', f'{program} {model}', '--project'])
    story.expect_refusal(f'worker dispatch 1 --program {program} --tier strongest', 'name', actor=story.agent)
    expect_program(story, dispatch(story, flags=f'--program {program} --model {model}'), program, model)


@pytest.mark.parametrize('reset_seconds', [0, -1])
def test_program_states_copes(split_story, reset_seconds):
    story = split_story
    set_split(story, 'claude 100,codex 0')
    resets_at = int((story.clock.timestamp().value + timedelta(seconds=reset_seconds)).timestamp())
    save_status_file(story, 's-1', {'rate_limits': {'five_hour': {'used_percentage': 99, 'resets_at': resets_at}}})
    expect_program(story, dispatch(story), 'claude')


def test_program_states_copes_with_a_removed_program(split_story):
    story = split_story
    story.expect_sync_success(SAMPLE_MODULE)
    set_split(story, 'sample 50,claude 50')
    remove_sample(story)
    expect_program(story, dispatch(story), 'claude')


def test_program_states_copes_with_a_stale_file(split_story):
    story = split_story
    set_split(story, 'claude 100,codex 0')
    save_status_file(story, 's-1', {'rate_limits': {'five_hour': {'used_percentage': 99, 'resets_at': int(story.clock.timestamp().value.timestamp()) + 3600}}})
    story.advance(timedelta(days=1))
    expect_program(story, dispatch(story), 'claude')


def test_codex_hooks_run_in_the_worker_folder(split_story, tmp_path, monkeypatch):
    story = split_story
    monkeypatch.setenv('CODEX_HOME', str(tmp_path / 'codex-home'))
    real_program_checks(story)
    story.expect_success('program trust codex --environment main', actor=story.user)
    worker = dispatch(story, flags='--program codex')
    folder = story.home.folder.parent / 'project' / '.journal' / 'worktrees' / 'main' / f'worker-{worker.id}'
    provider = story.container.get(Providers).provider('codex')
    story.expect_rows(provider.hook_trust(folder) is HookTrust.READY, (folder / '.codex' / 'hooks.json').is_file())


def test_codex_hooks_run_in_the_worker_folder_changed_hooks_are_not_trusted(split_story, tmp_path, monkeypatch):
    story = split_story
    monkeypatch.setenv('CODEX_HOME', str(tmp_path / 'codex-home'))
    real_program_checks(story)
    story.expect_success('program trust codex --environment main', actor=story.user)
    provider = story.container.get(Providers).provider('codex')
    folder = story.home.folder.parent / 'project'
    hooks = folder / '.codex' / 'hooks.json'
    hooks.write_text(hooks.read_text().replace('journal-hook', 'changed-journal-hook'))
    story.expect_rows(provider.hook_trust(folder) is HookTrust.CHANGED)


def test_board_filters_tags_beyond_the_first_page(split_story, split_viewer):
    story = split_story
    matching = make_task(story, 'Older matching task', '--tag networking --confirm')
    for number in range(12):
        make_task(story, f'New unrelated {number}')
    board = split_viewer.value('tasks.tasks', ['task', 'board', '--tag', 'networking', '--limit', '1'])
    opened = next(group for group in board['groups'] if group['state'] == 'open')
    story.expect_rows(opened['total'] == 1, [row['id'] for row in opened['rows']] == [matching])


def test_third_provider_in_every_list(split_story, split_viewer):
    story = split_story
    story.expect_sync_success(SAMPLE_MODULE)
    choices = split_viewer.value('profiles.profiles', ['helper', 'availability'])
    story.expect_rows('sample' in str(choices), 'sample-general' in str(choices))
    expect_program(story, dispatch(story, flags='--program sample --tier general'), 'sample', 'sample-general')
    story.expect_text('worker-worktree show 1', 'state: cut')


def test_route_commands_as_the_doc_writes_them(split_story):
    story = split_story
    for line in ['worker-route make --program codex --tags networking,linux',
                 'worker-route make --program claude --tags windows --strict',
                 'worker-route make --program claude --complexity-from 4 --tier strongest',
                 'worker-route make --complexity-to 2 --tier fast']:
        story.expect_success(f'{line} --environment main', actor=story.agent)
    answer = story.run('worker-route list --environment main --json')
    story.expect_rows(answer.code == 0)
    rows = json.loads(answer.output_text)['rows']
    story.expect_rows([row['position'] for row in rows] == [1, 2, 3, 4], rows[0]['tags'] == ['networking', 'linux'])
