from datetime import timedelta
from unittest.mock import Mock

import pytest

from engine.provider.hook_trust import HookTrust
from engine.provider.providers import Providers
from core.modules.helpers.support.program_states import ProgramStates
from tests.stories.core.support.coding_fixtures import UserBuilder


@pytest.fixture
def ready_program_story(new_story, monkeypatch):
    story = new_story(fixture=UserBuilder)
    monkeypatch.setattr('shutil.which', lambda name: name)
    for provider in story.container.get(Providers).all():
        monkeypatch.setattr(provider, 'hook_trust', Mock(return_value=HookTrust.READY))
    story.container.bind(ProgramStates, story.container.constructed(ProgramStates))
    return story


def test_outage_ends_on_time_without_split(ready_program_story):
    story = ready_program_story
    ends_at = (story.clock.timestamp().value + timedelta(minutes=15)).isoformat()
    row_id = story.new_row_id(f'provider-outage make codex "rate limit" --ends-at {ends_at}', actor=story.agent)
    states = story.container.get(ProgramStates)
    folder = story.home.project_folder
    story.expect_rows(not states.state('codex', folder).is_ready)
    story.advance(timedelta(minutes=15, seconds=1))
    story.expect_rows(states.state('codex', folder).is_ready)
    story.expect_text(f'provider-outage show {row_id}', 'rate limit', 'ends_at:')


def test_mark_a_program_out_past_time_is_refused(ready_program_story):
    story = ready_program_story
    story.expect_refusal('provider-outage make codex "out of credit" --ends-at 2026-10-30T09:00:00+00:00', 'future', actor=story.agent)


@pytest.fixture
def overlapping_outages(ready_program_story):
    story = ready_program_story
    for minutes in [15, 30]:
        ends_at = (story.clock.timestamp().value + timedelta(minutes=minutes)).isoformat()
        story.expect_success(f'provider-outage make codex "rate limit" --ends-at {ends_at}', actor=story.agent)
    return story


def test_back_now_ends_all_outages_of_a_program_without_split(overlapping_outages):
    story = overlapping_outages
    story.expect_success('provider-outage end codex', actor=story.agent)
    story.expect_text('provider-outage list', 'rate limit')
    story.expect_rows(story.container.get(ProgramStates).state('codex', story.home.project_folder).is_ready)


def test_chat_says_once_when_a_program_goes_out_without_split(overlapping_outages):
    story = overlapping_outages
    story.run_listeners()
    marks = story.run('chat-mark list --json').output_text
    story.expect_rows(marks.count('codex is out until') == 1)
    story.run_listeners()
    story.expect_rows(story.run('chat-mark list --json').output_text.count('codex is out until') == 1)
