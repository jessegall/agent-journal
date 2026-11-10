from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.modules.drivers.support.confirmed_skips import confirmed_skip
import json
from typing import NamedTuple
from unittest.mock import patch
from datetime import timedelta

import pytest

from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story import Story
from engine.enums.command_category import CommandCategory
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_folder, story_repository
from tests.stories.suites.coding.modules.workers.support.git_repository import GitRepository, ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.kept_workers import stopped
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.stories.suites.coding.modules.workers.support.route_expectations import expect_model_route_refusal, expect_unmatched_route

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.support.plan_steps import state_tasks_wait_on_nothing
from tests.stories.suites.coding.modules.workers.support.program_split import (
    SAMPLE_MODULE, dispatch, expect_program, new_task, outage, uninstall_sample_module, set_split, split_story, split_viewer,
)


class DeliveredWorkerStory(NamedTuple):
    story: Story
    repository: GitRepository
    worker: Actor


@pytest.fixture
def delivered_worker_story(split_story):
    repository = story_repository(split_story)
    worker = checked_worker(split_story, repository)
    return DeliveredWorkerStory(split_story, repository, worker)


@pytest.fixture
def merged_worker_story(delivered_worker_story, monkeypatch):
    story, repository, worker = delivered_worker_story
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f'worker merge {agent_number(story, worker.id)}', actor=story.agent)
    monkeypatch.setattr(ClaudeCodeProvider, 'session_matches_folder', lambda provider, folder, session: True)
    stopped(story, worker)
    return story, worker


@pytest.fixture
def unmerged_worker_story(delivered_worker_story, monkeypatch):
    story, _, worker = delivered_worker_story
    monkeypatch.setattr(ClaudeCodeProvider, 'session_matches_folder', lambda provider, folder, session: True)
    stopped(story, worker)
    return story, worker


def test_named_model_of_another_program_is_refused(split_story):
    expect_model_route_refusal(split_story, 'networking')


def test_route_tasks_count_toward_the_split(split_story, split_viewer):
    story = split_story
    set_split(story, 'claude 50,codex 50', viewer=split_viewer)
    story.expect_success('worker-route make --program codex --tags routed --environment main', actor=story.agent)
    tasks = [new_task(story, f'Routed {number}', '--tag routed --confirm') for number in range(10)]
    expect_program(story, dispatch(story, ' '.join(map(str, tasks))), 'codex')
    expect_program(story, dispatch(story), 'claude')
    rows = json.loads(story.run('worker split --json').output_text)['rows']
    story.expect_rows(next(row for row in rows if row['id'] == 'codex')['recent'] == 10)


def test_route_beats_the_split(split_story, split_viewer):
    story = split_story
    story.expect_success('task tag 1 networking linux --confirm', actor=story.agent)
    set_split(story, 'claude 100,codex 0', viewer=split_viewer)
    story.expect_success('worker-route make --program codex --tags networking,linux --environment main', actor=story.agent)
    expect_program(story, dispatch(story), 'codex', 'gpt-6.1-terra')
    story.run_listeners()
    story.expect_text('chat-mark list --json', 'route 1', 'networking', 'linux')


def test_first_route_wins_by_position(split_story):
    story = split_story
    first = story.new_row_id('worker-route make --program codex --tags linux --environment main', actor=story.agent)
    second = story.new_row_id('worker-route make --program claude --tags linux --environment main', actor=story.agent)
    story.expect_success('task tag 1 linux --confirm', actor=story.agent)
    story.expect_text('worker split --task 1', f'route {first}', 'codex')
    story.expect_success(f'worker-route move {second} --to 1', actor=story.agent)
    expect_program(story, dispatch(story), 'claude')
    story.expect_text('worker-route list', 'claude', 'codex')


def test_route_needs_tags_and_complexity_both(split_story, split_viewer):
    story = split_story
    story.expect_success('worker-route make --program codex --tags linux --complexity-from 4 --environment main', actor=story.agent)
    story.expect_success('task tag 1 linux --confirm', actor=story.agent)
    story.expect_success('task edit 1 --complexity 2', actor=story.agent)
    set_split(story, 'claude 100,codex 0', viewer=split_viewer)
    expect_program(story, dispatch(story), 'claude')


@pytest.mark.parametrize('program,model', [('claude', 'haiku'), ('codex', 'gpt-6-luna')])
def test_route_with_only_a_tier_keeps_the_program_of_the_split(split_story, program, model, split_viewer):
    story = split_story
    set_split(story, f'{program} 100', viewer=split_viewer)
    story.expect_success('worker-route make --complexity-to 2 --tier fast --environment main', actor=story.agent)
    story.expect_success('task edit 1 --complexity 2', actor=story.agent)
    expect_program(story, dispatch(story), program, model)


def test_batch_across_programs_is_refused(split_story):
    story = split_story
    story.expect_success('worker-route make --program codex --tags networking --environment main', actor=story.agent)
    story.expect_success('worker-route make --program claude --tags windows --environment main', actor=story.agent)
    story.expect_success('task tag 1 networking --confirm', actor=story.agent)
    second = new_task(story, 'Windows task', '--tag windows --confirm')
    story.expect_refusal(f'worker dispatch --test-command python=pytest 1 {second}', 'codex', actor=story.agent)
    refusal = story.results[-1].output_text
    story.expect_rows('claude' in refusal, str(second) in refusal, '1' in refusal)
    story.expect_text('worker-worktree list', 'nothing found')


def test_batch_across_programs_is_refused_unrouted_goes_with_the_routed_task(split_story):
    story = split_story
    story.expect_success('worker-route make --program codex --tags batch --environment main', actor=story.agent)
    second = new_task(story, 'Routed batch task', '--tag batch --confirm')
    worker = dispatch(story, f'1 {second}')
    expect_program(story, worker, 'codex')
    story.expect_text(f'worker status {agent_number(story, worker.id)} --json', 'Routed batch task')


def test_batch_across_programs_is_refused_plan_names_phase(split_story, split_viewer):
    story = split_story
    plan = story.new_row_id('plan make "Two programs" --environment main', actor=story.agent)
    linux_phase = story.new_row_id(f'phase make "Linux" --plan {plan}', actor=story.agent)
    windows_phase = story.new_row_id(f'phase make "Windows" --plan {plan}', actor=story.agent)
    new_task(story, 'Linux task', f'--phase {linux_phase} --tag linux --confirm')
    new_task(story, 'Windows task', f'--phase {windows_phase} --tag windows --confirm')
    new_task(story, 'Linux follow-up', f'--phase {linux_phase} --tag linux --confirm')
    new_task(story, 'Windows follow-up', f'--phase {windows_phase} --tag windows --confirm')
    state_tasks_wait_on_nothing(story, story.agent, plan)
    story.expect_success(f'plan ready {plan}', actor=story.agent)
    split_viewer.value('messages.chat', ['plan', 'approve', str(plan)])
    story.expect_success('worker-route make --program codex --tags linux --environment main', actor=story.agent)
    story.expect_success('worker-route make --program claude --tags windows --environment main', actor=story.agent)
    story.expect_refusal(f'worker dispatch --test-command python=pytest --plan {plan}', '--phase', actor=story.agent)


def test_strict_route_refuses_when_its_program_is_out_non_strict_uses_split(split_story, split_viewer):
    story = split_story
    story.expect_success('worker-route make --program codex --tags fallback --environment main', actor=story.agent)
    story.expect_success('task tag 1 fallback --confirm', actor=story.agent)
    outage_id, ends_at = outage(story)
    set_split(story, viewer=split_viewer)
    expect_program(story, dispatch(story), 'claude')
    story.expect_text(f'agent-line list --agent {story.agent.id}', 'route 1', 'task 1', 'claude')
    story.expect_text('worker-route show 1', 'codex', actor=story.agent)
    story.expect_text(f'provider-outage show {outage_id}', 'codex', ends_at, actor=story.agent)


def test_complexity_route_needs_a_score(split_story):
    story = split_story
    story.expect_success('worker-route make --complexity-from 4 --program codex --environment main', actor=story.agent)
    story.expect_refusal('worker dispatch --test-command python=pytest 1', 'journal task edit 1 --complexity', actor=story.agent)
    story.expect_text('worker-worktree list', 'nothing found')


@pytest.mark.parametrize('flags,reason', [('--program codex', 'tags'), ('--tags linux', 'program'), ('--tags linux --tier fast --strict', 'program')])
def test_malformed_route_is_refused(split_story, flags, reason):
    story = split_story
    story.expect_refusal(f'worker-route make {flags} --environment main', reason, actor=story.agent)
    story.expect_text('worker-route list --environment main', 'nothing found')


def test_route_of_a_removed_provider_matches_nothing(split_story):
    story = split_story
    story.expect_sync_success(SAMPLE_MODULE)
    route = story.new_row_id('worker-route make --program sample --tags removed --environment main', actor=story.agent)
    story.expect_success('task tag 1 removed --confirm', actor=story.agent)
    uninstall_sample_module(story)
    story.expect_text('worker-route list --environment main', 'sample', 'gone')
    expect_program(story, dispatch(story), 'claude')


def test_worker_split_previews_a_task(split_story):
    story = split_story
    story.expect_success('task tag 1 preview --confirm', actor=story.agent)
    route = story.new_row_id('worker-route make --program codex --tags preview --environment main', actor=story.agent)
    story.expect_text('worker split --task 1', 'codex', 'gpt-6.1-terra', f'route {route}')
    story.expect_text('worker-worktree list', 'nothing found')
    story.expect_text('agent list --role worker', 'nothing found')
    story.expect_text('task show 1', 'state: open')


def test_task_assign_holds_the_route(split_story):
    story = split_story
    worker = dispatch(story, flags='--program claude')
    route = story.new_row_id('worker-route make --program codex --tags assigned --environment main', actor=story.agent)
    task = new_task(story, 'Assigned task', '--tag assigned --confirm')
    story.expect_refusal(f'task assign {task} --to {agent_number(story, worker.id)}', f'route {route}', actor=story.agent)
    story.expect_absent(f'task show {task}', f'delegated_to: {worker.id}')


def test_task_assign_holds_the_route_started_task_is_released_too(split_story):
    story = split_story
    worker = dispatch(story, flags='--program codex')
    story.expect_success('task tag 1 held --confirm', actor=story.agent)
    route = story.new_row_id('worker-route make --program codex --tags held --environment main', actor=story.agent)
    task_id = new_task(story, 'Claude worker')
    claude = dispatch(story, str(task_id), '--program claude')
    queued = new_task(story, 'Codex follow-up')
    story.expect_success(f'task assign {queued} --to {agent_number(story, worker.id)}', actor=story.agent)
    story.expect_refusal(f'task assign 1 --to {agent_number(story, claude.id)}', f'route {route}', actor=story.agent)
    story.expect_text('task show 1', f'holder_id: {worker.id}', 'state: started')


def test_task_assign_holds_the_route_person_passes(split_story, split_viewer):
    story = split_story
    worker = dispatch(story, flags='--program claude')
    story.expect_success('worker-route make --program codex --tags person --environment main', actor=story.agent)
    task = new_task(story, 'Person assigned task', '--tag person --confirm')
    split_viewer.value('tasks.tasks', ['task', 'assign', str(task), '--to', str(agent_number(story, worker.id))])
    story.expect_text(f'task show {task}', f'delegated_to: {worker.id}')


def test_task_assign_holds_the_route_out_program_passes(split_story):
    story = split_story
    worker = dispatch(story, flags='--program claude')
    outage(story)
    story.expect_success('worker-route make --program codex --tags outage --environment main', actor=story.agent)
    task = new_task(story, 'Out program task', '--tag outage --confirm')
    story.expect_success(f'task assign {task} --to {agent_number(story, worker.id)}', actor=story.agent)
    story.expect_text(f'task show {task}', f'delegated_to: {worker.id}')


@pytest.fixture
def protected_route_story(split_story):
    route = split_story.new_row_id('worker-route make --program codex --tags protected --environment main', actor=split_story.agent)
    split_story.expect_success('task tag 1 protected --confirm', actor=split_story.agent)
    return split_story, route


def test_agent_naming_another_program_is_refused_before_git(protected_route_story):
    story, route = protected_route_story
    with patch.object(WorktreeGit, 'git', side_effect=AssertionError('route must be checked before git')):
        story.expect_refusal('worker dispatch --test-command python=pytest 1 --program claude', f'route {route}', actor=story.agent)
    story.expect_text('worker-worktree list', 'nothing found')
    story.expect_rows(not list((story.home.folder.parent / 'project' / '.journal' / 'worktrees').glob('*/*')))


def test_agent_naming_another_program_is_refused_before_git_explicit_skip_is_logged(protected_route_story):
    story, route = protected_route_story
    story.expect_refusal('worker dispatch --test-command python=pytest 1 --program claude', 'route 1', actor=story.agent)
    confirmed_skip(story, "workers.route-holds", story.agent, "The person asked for a comparison")
    worker = dispatch(story, flags='--program claude --skip-guard workers.route-holds --skip-reason "The person asked for a comparison"')
    expect_program(story, worker, 'claude')
    story.expect_text('worker-worktree list', 'cut')
    story.expect_text('event list --json --limit 100', 'workers.route-holds', 'The person asked for a comparison')


def test_person_names_any_program(split_story):
    story = split_story
    worker = dispatch(story, flags='--program codex --model gpt-6.1-terra --environment main', actor=story.user)
    expect_program(story, worker, 'codex', 'gpt-6.1-terra')


def test_person_names_any_program_over_a_route(split_story):
    story = split_story
    story.expect_success('worker-route make --program claude --tags override --environment main', actor=story.agent)
    story.expect_success('task tag 1 override --confirm', actor=story.agent)
    worker = dispatch(story, flags='--program codex --environment main', actor=story.user)
    expect_program(story, worker, 'codex')


def test_agent_cannot_change_a_route_a_person_made(split_story, split_viewer):
    story = split_story
    split_viewer.value('workers.workers', ['worker-route', 'make', '--tags', 'owned', '--program', 'codex'])
    story.expect_refusal('worker-route edit 1 --program claude', 'person', actor=story.agent)
    story.expect_refusal('worker-route delete 1', 'person', actor=story.agent)
    story.expect_text('worker-route show 1', 'program: codex')


def test_agent_cannot_change_a_route_a_person_made_own_route_can_change(split_story):
    story = split_story
    route = story.new_row_id('worker-route make --program codex --tags own --environment main', actor=story.agent)
    story.expect_success(f'worker-route edit {route} --program claude', actor=story.agent)
    story.expect_text(f'worker-route show {route}', 'program: claude')


def test_worker_cannot_dispatch_by_a_route(split_story):
    story = split_story
    worker = Actor(story.new_row_id(f'agent start worker-session claude worker --parent {story.agent.id} --environment main'), ActorType.AGENT)
    story.expect_refusal('worker dispatch --test-command python=pytest 1 --model sonnet', 'a worker dispatches no workers', actor=worker)
    story.expect_text('worker-worktree list', 'nothing found')


def test_worker_cannot_dispatch_by_a_route_even_with_a_matching_route(split_story):
    story = split_story
    story.expect_success('worker-route make --program codex --tags nested --environment main', actor=story.agent)
    story.expect_success('task tag 1 nested --confirm', actor=story.agent)
    worker = Actor(story.new_row_id(f'agent start nested-worker claude worker --parent {story.agent.id} --environment main'), ActorType.AGENT)
    story.expect_refusal('worker dispatch --test-command python=pytest 1', 'a worker dispatches no workers', actor=worker)
    story.expect_text('worker-worktree list', 'nothing found')


def test_job_to_a_known_worker_stays_on_its_program(unmerged_worker_story):
    story, worker = unmerged_worker_story
    story.expect_success('worker-route make --program codex --tags known --environment main', actor=story.agent)
    task_id = new_task(story, 'Known worker task', '--tag known --confirm')
    story.expect_success(f'task edit {task_id} --brief "Change cart.py again"', actor=story.agent)
    arguments = ['worker', 'dispatch', str(task_id), '--model', 'sonnet']
    story.expect_hook_refusal('s-1', HookSamples.shell(f'journal worker dispatch {task_id} --model sonnet', ShellPart('journal', CommandCategory.JOURNAL, arguments, subcommand='worker')),
                              f'worker:{agent_number(story, worker.id)} changed these files')
    story.expect_refusal(f'worker send {agent_number(story, worker.id)} --wait --task {task_id}', 'route 1', actor=story.agent)
    confirmed_skip(story, "workers.route-holds", story.agent, "Keep the existing worker for this comparison")
    story.expect_success(f'worker send {agent_number(story, worker.id)} --wait --task {task_id} --skip-guard workers.route-holds '
                         '--skip-reason "Keep the existing worker for this comparison"', actor=story.agent)
    expect_program(story, worker, 'claude')
    story.expect_text(f'task show {task_id}', f'delegated_to: {worker.id}', 'state: open')


def test_skills_name_tiers_tags_and_routes(split_story):
    story = split_story
    story.expect_success('skill write')
    texts = {
        'journal-workers': ('--tier general', 'journal worker split --task', '--skip-guard workers.route-holds', 'log', 'first matching route'),
        'journal-helpers': ('--tier general', "profile's program", "parent's program", 'separately from workers'),
        'journal-tasks': ('journal task tags', '--tag networking', '--complexity 3', '| 5 | Core paths, migrations, concurrency, or a design |'),
        'journal-plans': ('scores and tags each task as it writes it', '--complexity <1-5>', '--tag <word>'),
    }
    for name, fragments in texts.items():
        story.expect_text(f'skill show {name}', *fragments)
        for folder in ('.agents/skills', '.claude/skills'):
            published = (story.home.project_folder / folder / name / 'SKILL.md').read_text()
            story.expect_rows(all(fragment in published for fragment in fragments))
