from tests.stories.core.support.agent_labels import agent_number
import json
from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.tool_type import ToolType
from engine.enums.command_category import CommandCategory
from engine.testing.examples.shell_part import ShellPart
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


class DocumentReady(StoryFixture):
    parent = UserBuilder

    def steps(self, story):
        story.expect_success(f'agent edit {agent_number(story, story.agent.id)} --given-name "Lady Lovelace"')
        story.run('doc make "Notes" --abstract "Project notes" --body "Original"', actor=story.agent)


class DocumentOpen(StoryFixture):
    parent = DocumentReady

    def steps(self, story):
        story.expect_success('doc open 1', actor=story.agent)


class HelperDocumentReady(StoryFixture):
    parent = StartedHelper

    def steps(self, story):
        story.helper = Actor(helper_agent(story).id, ActorType.AGENT)
        story.run('doc make "Findings" --abstract "What was found" --body "First"', actor=story.helper)


class HelperDocumentOpen(StoryFixture):
    parent = HelperDocumentReady

    def steps(self, story):
        story.run('doc open 1', actor=story.helper)
        story.run('doc edit 1 --body "Checked"', actor=story.helper)


def test_two_edits_save_one_revision_by_the_agent(new_story):
    story = new_story(fixture=DocumentOpen)
    story.expect_success('doc edit 1 --body "First"', actor=story.agent)
    story.expect_success('doc edit 1 --body "Second"', actor=story.agent)
    story.expect_success('doc close 1', actor=story.agent)
    answer = story.run('doc revisions 1 --json')
    story.expect_rows(answer.code == 0)
    rows = json.loads(answer.output_text)['rows']
    story.expect_rows(len(rows) == 2, rows[-1]['body'] == 'Second', rows[-1]['author_id'] == story.agent.id,
                      rows[-1]['author_name'] == 'Main agent')


def test_another_agent_cannot_open_the_document(new_story):
    story = new_story(fixture=DocumentOpen)
    second_agent_id = story.new_row_id(f'agent start s-2 claude helper --parent {story.agent.id} --environment main')
    story.expect_refusal('doc open 1', 'main agent', actor=Actor(second_agent_id, ActorType.AGENT))


def test_a_second_document_names_the_one_to_close(new_story):
    story = new_story(fixture=DocumentOpen)
    story.run('doc make "Other" --abstract "Other notes" --body "Other"')
    story.expect_refusal('doc open 2', 'journal doc close 1', actor=story.agent)


def test_an_agent_edit_without_open_keeps_the_text(new_story):
    story = new_story(fixture=DocumentReady)
    story.expect_refusal('doc edit 1 --body "Lost"', 'journal doc open 1', actor=story.agent)
    story.expect_text('doc show 1 --all', 'Original')


def test_closing_without_changes_adds_no_revision(new_story):
    story = new_story(fixture=DocumentOpen)
    story.expect_success('doc close 1', actor=story.agent)
    story.expect_rows(len(json.loads(story.run('doc revisions 1 --json').output_text)['rows']) == 1)


def test_make_is_one_closed_revision(new_story):
    story = new_story(fixture=DocumentReady)
    rows = json.loads(story.run('doc revisions 1 --json').output_text)['rows']
    story.expect_rows(len(rows) == 1, rows[0]['author_id'] == story.agent.id)
    story.expect_success('task list', actor=story.agent)


def test_a_stop_is_refused_with_the_document_open_and_goes_through_once_it_is_closed(new_story):
    story = new_story(fixture=DocumentOpen)
    story.expect_hook_refusal('s-1', HookSamples.stop(), 'doc:1 is open')
    story.expect_success('doc edit 1 --body "Kept"', actor=story.agent)
    story.expect_text('doc show 1 --all', 'Kept', actor=story.agent)
    story.expect_hook_refusal('s-1', HookSamples.stop(), 'close it, then stop')
    story.expect_success('doc close 1', actor=story.agent)
    story.expect_hook_allowed('s-1', HookSamples.stop())


def test_repeated_stops_do_not_release_the_open_document(new_story):
    story = new_story(fixture=DocumentOpen)
    for _ in range(7):
        story.expect_hook_refusal('s-1', HookSamples.stop(), 'doc:1 is open')
    story.expect_success('doc close 1', actor=story.agent)
    story.expect_hook_allowed('s-1', HookSamples.stop())


def test_a_new_session_hook_keeps_the_document_open(new_story):
    story = new_story(fixture=DocumentOpen)
    story.hook('s-1', HookSamples.sample('compact'))
    story.expect_hook_refusal('s-1', HookSamples.edit('cart.py'), 'doc:1 is open')
    story.expect_success('doc close 1', actor=story.agent)


def test_the_refusal_is_one_short_line_with_a_way_out(new_story):
    story = new_story(fixture=DocumentOpen)
    reply = story.hook('s-1', HookSamples.edit('cart.py'))
    story.expect_rows('doc:1 is open' in reply.refusal, 'close it' in reply.refusal, len(reply.refusal) < 120)


def test_reading_the_open_document_goes_through(new_story):
    story = new_story(fixture=DocumentOpen)
    story.expect_success('doc show 1 --all', actor=story.agent)
    story.expect_hook_allowed('s-1', HookSamples.shell('journal doc comments 1', ShellPart('journal', CommandCategory.JOURNAL, ['doc', 'comments', '1'])))
    story.expect_hook_allowed('s-1', HookSamples.tool_use('Read', ToolType.READ, ['notes.txt'], None))


def test_searching_and_other_reads_go_through_with_the_document_open(new_story):
    story = new_story(fixture=DocumentOpen)
    story.expect_hook_allowed('s-1', HookSamples.shell('grep -rn cart src', ShellPart('grep', CommandCategory.SEARCH, ['-rn', 'cart', 'src'])))
    story.expect_hook_allowed('s-1', HookSamples.shell('journal task list', ShellPart('journal', CommandCategory.JOURNAL, ['task', 'list'])))
    story.expect_hook_allowed('s-1', HookSamples.shell('journal doc show 2', ShellPart('journal', CommandCategory.JOURNAL, ['doc', 'show', '2'])))


def test_a_file_edit_and_a_command_that_edits_are_refused_with_the_document_open(new_story):
    story = new_story(fixture=DocumentOpen)
    story.expect_hook_refusal('s-1', HookSamples.edit('cart.py'), 'doc:1 is open')
    story.expect_hook_refusal('s-1', HookSamples.shell("sed -i s/a/b/ cart.py", ShellPart('sed', CommandCategory.EDIT, ['-i', 's/a/b/', 'cart.py'])), 'doc:1 is open')
    story.expect_success('doc close 1', actor=story.agent)
    story.expect_hook_allowed('s-1', HookSamples.edit('cart.py'))


def test_writing_a_document_with_several_edits_and_searches_in_between_makes_one_revision(new_story):
    story = new_story(fixture=DocumentOpen)
    story.expect_success('doc edit 1 --body "First"', actor=story.agent)
    story.expect_hook_allowed('s-1', HookSamples.shell('grep -rn cart src', ShellPart('grep', CommandCategory.SEARCH, ['-rn', 'cart', 'src'])))
    story.expect_success('doc edit 1 --body "Second"', actor=story.agent)
    story.expect_success('doc edit 1 --body "Third"', actor=story.agent)
    story.expect_success('doc close 1', actor=story.agent)
    rows = json.loads(story.run('doc revisions 1 --json').output_text)['rows']
    story.expect_rows(len(rows) == 2, rows[-1]['body'] == 'Third')


def test_loading_a_skill_and_reading_files_together_go_through(new_story):
    story = new_story(fixture=DocumentOpen)
    story.expect_hook_allowed('s-1', HookSamples.shell('cat notes.txt && journal skill required',
        ShellPart('cat', CommandCategory.READ, ['notes.txt']), ShellPart('journal', CommandCategory.JOURNAL, ['skill', 'required'])))
    story.expect_hook_allowed('s-1', HookSamples.tool_use('Skill', ToolType.READ, [], None))


def test_an_incomplete_journal_command_goes_through_without_a_fault(new_story):
    story = new_story(fixture=DocumentOpen)
    story.expect_hook_allowed('s-1', HookSamples.shell('journal', ShellPart('journal', CommandCategory.JOURNAL, [])))


def test_a_viewer_edit_and_close_preserve_the_agent_author(new_story):
    story = new_story(fixture=DocumentOpen)
    story.expect_success('doc edit 1 --body "Agent text"', actor=story.agent)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key('Ada'))
        server.viewer_line_value(cookie, {'window': 'viewer.shell', 'line': ['doc', 'edit', '1', '--body', 'Person text'], 'environment': 'main'})
        server.viewer_line_value(cookie, {'window': 'viewer.shell', 'line': ['doc', 'close', '1'], 'environment': 'main'})
    rows = json.loads(story.run('doc revisions 1 --json').output_text)['rows']
    story.expect_rows(rows[-2]['body'] == 'Agent text', rows[-2]['author_id'] == story.agent.id,
                      rows[-1]['body'] == 'Person text', rows[-1]['author_id'] != story.agent.id, rows[-1]['author_name'] == 'Ada')


def test_an_ended_agent_revision_is_kept_on_tick(new_story):
    story = new_story(fixture=DocumentOpen)
    story.expect_success('doc edit 1 --body "Kept"', actor=story.agent)
    story.run(f'agent end {story.agent.id}')
    story.tick('s-1')
    story.expect_success('doc open 1')
    story.expect_text('doc revision 1 2', 'Kept')


def test_time_passing_does_not_close_an_open_revision(new_story):
    story = new_story(fixture=DocumentOpen)
    story.advance(timedelta(days=1))
    story.expect_success('doc edit 1 --body "Still open"', actor=story.agent)
    story.expect_success('doc close 1', actor=story.agent)
    story.expect_rows(len(json.loads(story.run('doc revisions 1 --json').output_text)['rows']) == 2)


def test_a_readonly_helper_can_make_open_edit_and_close_its_document(new_story):
    story = new_story(fixture=HelperDocumentReady)
    helper = helper_agent(story)
    story.expect_hook_allowed(helper.session, HookSamples.shell('journal doc open 1', ShellPart('journal', CommandCategory.JOURNAL, ['doc', 'open', '1'])))
    story.expect_success('doc open 1', actor=story.helper)
    story.expect_success('doc edit 1 --body "Checked"', actor=story.helper)
    story.expect_hook_allowed(helper.session, HookSamples.shell('journal doc close 1', ShellPart('journal', CommandCategory.JOURNAL, ['doc', 'close', '1'])))
    story.expect_success('doc close 1', actor=story.helper)
    story.expect_text('doc revisions 1 --json', f'"author_id": {story.helper.id}')


def test_closing_the_document_lets_the_edit_and_the_stop_through(new_story):
    story = new_story(fixture=DocumentOpen)
    story.expect_hook_refusal('s-1', HookSamples.edit('cart.py'), 'doc:1 is open')
    story.expect_hook_refusal('s-1', HookSamples.stop(), 'doc:1 is open')
    story.expect_success('doc close 1', actor=story.agent)
    story.expect_hook_allowed('s-1', HookSamples.edit('cart.py'))
    story.expect_hook_allowed('s-1', HookSamples.stop())


def test_an_ended_helper_keeps_its_revision_and_tells_its_parent(new_story):
    story = new_story(fixture=HelperDocumentOpen)
    story.run(f'agent end {story.helper.id}')
    story.run_listeners()
    story.expect_text('doc revision 1 2', 'Checked')
    story.expect_text('message show 1', 'doc 1 closed after its author ended')
    story.expect_success('doc open 1', actor=story.agent)


def test_a_server_restart_keeps_the_open_document(new_story):
    story = new_story(fixture=DocumentOpen)
    story.run('doc edit 1 --body "Before restart"', actor=story.agent)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key('Ada'))
        shown = server.viewer_line_value(cookie, {'window': 'viewer.shell', 'line': ['doc', 'inspect', '1'], 'environment': 'main'})
        story.expect_rows(shown['open_author_id'] == story.agent.id)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key('Ada'))
        shown = server.viewer_line_value(cookie, {'window': 'viewer.shell', 'line': ['doc', 'inspect', '1'], 'environment': 'main'})
        story.expect_rows(shown['open_author_id'] == story.agent.id, shown['body'] == 'Before restart')


def test_the_inspector_shows_revision_authors_in_light_and_dark(new_story):
    story = new_story(fixture=DocumentOpen)
    story.run('setting set journal.core.viewer.tour-completed true --project')
    story.run('doc edit 1 --body "Ready for review"', actor=story.agent)
    with server_story(story) as server:
        expect_browser(server, 'documentRevisionAuthors.browser.mjs', ['/tmp/document-revision-authors'])
