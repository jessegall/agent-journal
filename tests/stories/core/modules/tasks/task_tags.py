import json

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.helpers.start_helper import started
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client


@pytest.fixture
def tag_story(new_story):
    return new_story(fixture=BuilderWithUser)


@pytest.fixture
def tag_viewer(tag_story):
    with viewer_client(tag_story) as viewer:
        yield viewer


def test_task_takes_many_tags(tag_story):
    story = tag_story
    task_id = story.new_row_id('task make "Network queue" --tag networking --tag linux --confirm --environment main', actor=story.agent)
    story.expect_text(f'task show {task_id}', 'networking', 'linux')
    rows = json.loads(story.run('task tags --json --environment main').output_text)['rows']
    story.expect_rows({row['word']: row['count'] for row in rows} == {'networking': 1, 'linux': 1})


def test_task_takes_many_tags_in_a_phase(tag_story):
    story = tag_story
    plan = story.new_row_id('plan make "Queue" --environment main', actor=story.agent)
    phase = story.new_row_id(f'phase make "Linux" --plan {plan}', actor=story.agent)
    task = story.new_row_id(f'task make "Queue" --phase {phase} --tag linux --confirm --environment main', actor=story.agent)
    story.expect_text(f'task show {task}', 'linux', f'phase_id: {phase}')
    story.expect_text(f'plan tasks {plan}', 'Queue')


@pytest.mark.parametrize('word', ['Linux', 'network queue'])
def test_task_takes_many_tags_invalid_words_are_refused(tag_story, word):
    story = tag_story
    story.expect_refusal(f'task make "Queue" --tag "{word}" --confirm --environment main', 'tag', actor=story.agent)
    story.expect_text('task list --environment main', 'nothing found')


def test_new_tag_word_needs_confirm(tag_story):
    story = tag_story
    story.expect_success('task make "Existing" --tag networking --confirm --environment main', actor=story.agent)
    story.expect_refusal('task make "New" --tag networks --environment main', 'networking', actor=story.agent)
    story.expect_text('task list --environment main', 'Existing')
    story.expect_success('task make "New" --tag networks --confirm --environment main', actor=story.agent)
    story.expect_text('task tags --environment main', 'networking', 'networks')


def test_new_tag_word_needs_confirm_person_does_not_confirm(tag_story, tag_viewer):
    story = tag_story
    value = tag_viewer.value('tasks.tasks', ['task', 'make', 'Queue', '--tag', 'networks'])
    story.expect_rows('networks' in json.dumps(value))
    story.expect_text('task tags --environment main', 'networks')


def test_new_tag_word_needs_confirm_even_the_first_word(tag_story):
    story = tag_story
    story.expect_refusal('task make "First" --tag networks --environment main', '--confirm', actor=story.agent)
    story.expect_text('task tags --environment main', 'nothing found')
    story.expect_success('task make "First" --tag networks --confirm --environment main', actor=story.agent)


def test_task_list_finds_by_tags(tag_story):
    story = tag_story
    both = story.new_row_id('task make "Both" --tag networking --tag linux --confirm --environment main', actor=story.agent)
    story.expect_success('task make "One" --tag networking --environment main', actor=story.agent)
    story.expect_success('task make "Other" --tag linux --environment main', actor=story.agent)
    answer = story.run('task list --tag networking --tag linux --environment main --json', actor=story.agent)
    story.expect_rows(answer.code == 0)
    story.expect_rows([row['id'] for row in json.loads(answer.output_text)['rows']] == [both])


def test_tags_go_with_the_task(tag_story):
    story = tag_story
    task = story.new_row_id('task make "Remove me" --tag networking --tag linux --confirm --environment main', actor=story.agent)
    story.expect_success(f'task delete {task}', actor=story.agent)
    story.expect_text('task tags --environment main', 'nothing found')
    story.expect_text('event list --json --limit 100', 'task_tag', 'networking', 'linux', 'deleted')


@pytest.mark.parametrize('score', [0, 6])
def test_complexity_out_of_range_is_refused(tag_story, score):
    story = tag_story
    story.expect_refusal(f'task make "Queue" --complexity {score} --environment main', '1', actor=story.agent)
    story.expect_rows('5' in story.results[-1].output_text)
    task = story.new_row_id('task make "Queue" --complexity 3 --environment main', actor=story.agent)
    story.expect_text(f'task show {task}', 'complexity: 3')


def test_read_only_planner_tags_and_scores(tag_story):
    story = tag_story
    helper_id, _ = started(story, 'helper start journal-planner --brief "Plan the network queue" --environment main')
    details = story.run(f'agent show {helper_id}').output_text
    session = next(line.removeprefix('session: ') for line in details.splitlines() if line.startswith('session: '))
    arguments = ['task', 'make', 'Queue', '--complexity', '3', '--tag', 'networking', '--confirm', '--environment', 'main']
    story.expect_hook_allowed(session, HookSamples.shell('journal task make Queue --complexity 3 --tag networking --confirm --environment main', ShellPart('journal', CommandCategory.JOURNAL, arguments, subcommand='task')))
    task = story.new_row_id('task make Queue --complexity 3 --tag networking --confirm --environment main', actor=Actor(helper_id, ActorType.AGENT))
    story.expect_hook_refusal(session, HookSamples.shell(f'journal task edit {task} --complexity 4', ShellPart('journal', CommandCategory.JOURNAL, ['task', 'edit', str(task), '--complexity', '4'], subcommand='task')), 'reads and searches only')


def test_task_card_shows_tags_and_complexity(tag_story, tag_viewer):
    story = tag_story
    task = story.new_row_id('task make "Network queue" --tag networking --tag linux --complexity 3 --confirm --environment main', actor=story.agent)
    card = tag_viewer.value('tasks.tasks', ['task', 'show', str(task)])
    story.expect_rows('networking' in json.dumps(card), 'linux' in json.dumps(card), '3' in json.dumps(card))
    story.expect_success('task make "Other" --environment main', actor=story.agent)
    board = tag_viewer.value('tasks.tasks', ['task', 'board', '--tag', 'networking'])
    story.expect_rows('Network queue' in json.dumps(board), 'Other' not in json.dumps(board))
