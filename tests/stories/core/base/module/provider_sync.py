from tests.stories.core.base.module.support.sample_programs import PATH
from tests.unit.core.base.samples.program_sample import HOOK_FILE
from tests.stories.core.support.fixtures import MainEnvironment


def test_two_modules_providing_one_program_are_refused_at_sync(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:SampleProgramModule")
    story.expect_sync_refusal(f"{PATH}:TwinProgramModule", "two modules provide the agent program sample: sample.program and twin.program")


def test_a_module_that_adds_a_program_has_its_row_and_its_hooks_written_at_sync(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:SampleProgramModule")
    story.expect_registered_provider("sample", "sample.program")
    story.expect_program_row("sample", "Start", "BeforeTool", "End")
    story.expect_project_file(HOOK_FILE, "Start", "BeforeTool", "End")
