from tests.stories.suites.coding.modules.workers.support.program_split import SPLIT, outage, split_story, split_viewer

from core.base.driver.tool_type import ToolType
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.core.support.fixtures import UserJoined

TODO_LIST_HOOK = HookSamples.sample("post_tool_use", {"name": "TodoWrite", "category": ToolType.UNCATEGORISED, "files": [], "diff": None}).with_fields(
    raw={"tool_name": "TodoWrite", "tool_input": {"todos": [{"content": "Add the tax", "status": "completed"},
                                                             {"content": "Round to cents", "status": "in_progress"}]}})


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(fixture=UserJoined))


def test_the_points_window_is_a_page_window_of_one_agent_that_reads_with_no_allowance(new_story):
    window = window_story(new_story)
    window.expect_declared_window("workers.points", "component", "pane", "one-agent")
    window.expect_window_allowed("workers.points", "worker-worktree points --agent 2")


def test_the_todos_window_is_a_page_window_of_one_agent_that_reads_with_no_allowance(new_story):
    window = window_story(new_story)
    window.expect_declared_window("workers.todos", "component", "pane", "one-agent")
    window.expect_window_allowed("workers.todos", "todo-item list --agent 2 --oldest")


def test_a_to_do_list_the_agent_program_writes_is_kept_in_place_of_the_last(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", TODO_LIST_HOOK)
    story.hook("s-1", TODO_LIST_HOOK)
    story.expect_rows(story.run(f"todo-item list --agent {story.agent.id}").output_text.count("Add the tax") == 1)
    story.expect_text(f"todo-item list --agent {story.agent.id} --oldest", "Add the tax", "completed", "Round to cents", "in_progress")


def test_split_tab_saves_shares_that_add_to_100(split_story, split_viewer):
    story = split_story
    rows = split_viewer.value('workers.workers', ['worker', 'split'])['rows']
    story.expect_rows({row['id'] for row in rows} >= {'claude', 'codex'})
    split_viewer.value('workers.workers', ['setting', 'set', SPLIT, 'claude 65,codex 35', '--project'])
    saved = split_viewer.value('workers.workers', ['worker', 'split'])['rows']
    story.expect_rows(sum(row['share'] for row in saved) == 100)
    story.expect_rows({row['id']: row['share'] for row in saved} == {'claude': 65, 'codex': 35})
    story.expect_text('setting list --json', SPLIT)


def test_split_tab_saves_shares_that_add_to_100_worker_limit_matches_settings(split_story, split_viewer):
    story = split_story
    key = 'journal.suites.coding.workers.worker-run-limit'
    split_viewer.value('workers.workers', ['setting', 'set', key, '4', '--project'])
    dropdown = split_viewer.value('workers.workers', ['setting', 'show', key])
    settings = split_viewer.value('settings.settings', ['setting', 'show', key])
    story.expect_rows(dropdown == settings, '4' in str(settings))


def test_person_adds_a_route_in_the_split_tab(split_story, split_viewer):
    story = split_story
    story.expect_success('task edit 1 --tag networking --tag linux --confirm', actor=story.agent)
    tags = split_viewer.value('workers.workers', ['task', 'tags'])['rows']
    story.expect_rows({row['word'] for row in tags} >= {'networking', 'linux'})
    split_viewer.value('workers.workers', ['worker-route', 'make', '--tags', 'networking,linux', '--program', 'codex', '--tier', 'strongest'])
    rows = split_viewer.value('workers.workers', ['worker-route', 'list'])['rows']
    story.expect_rows(rows[0]['program'] == 'codex', rows[0]['tier'] == 'strongest', set(rows[0]['tags']) == {'networking', 'linux'})


def test_split_tab_shows_a_program_that_is_out(split_story, split_viewer):
    story = split_story
    outage_id, ends_at = outage(story, 'codex', reason='out of credit')
    rows = split_viewer.value('workers.workers', ['worker', 'split'])['rows']
    codex = next(row for row in rows if row['id'] == 'codex')
    story.expect_rows('out of credit' in str(codex), ends_at in str(codex))
    split_viewer.value('workers.workers', ['provider-outage', 'delete', str(outage_id)])
    ready = split_viewer.value('workers.workers', ['worker', 'split'])['rows']
    story.expect_rows('out of credit' not in str(next(row for row in ready if row['id'] == 'codex')))
