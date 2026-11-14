from tests.stories.engine.module.support.sample_programs import PATH
from tests.stories.core.support.fixtures import MainEnvironment


def test_a_module_that_adds_a_program_has_it_registered_at_sync(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:SampleProgramModule")
    story.expect_registered_provider("sample", "sample.program")
