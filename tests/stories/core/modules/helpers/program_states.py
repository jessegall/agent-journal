from datetime import timedelta
from unittest.mock import Mock

import pytest

from core.base.provider.hook_trust import HookTrust
from core.base.provider.providers import Providers
from core.modules.helpers.support.program_states import ProgramStates
from tests.stories.core.support.coding_fixtures import BuilderWithUser


@pytest.fixture
def ready_program_story(new_story, monkeypatch):
    story = new_story(fixture=BuilderWithUser)
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


def test_outage_unknown_program_is_refused(ready_program_story):
    ready_program_story.expect_refusal('provider-outage make gone "rate limit" --ends-at 2027-01-01T00:00:00+00:00', 'no module provides', actor=ready_program_story.agent)
