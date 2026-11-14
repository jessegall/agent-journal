import pytest

from engine.provider.managed_hooks import ManagedHooks
from engine.provider.program_hooks import ProgramHooks
from tests.stories.core.support.fixtures import MainEnvironment
from engine.testing.expectations.expect_row import expect_row
from tests.stories.support.story_checks import expect_answers, expect_command_hooks, expect_program_hooks, expect_program_hooks_2




def test_program_manage_refuses_an_unknown_program(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_refusal(f'program manage unknown "{story.home.project_folder}"', "unknown")
