import pytest

from engine.module.module_removal import ModuleRemoval
from server.viewer.windows_route import WindowsRoute
from tests.stories.engine.driver.support.samples import SAMPLES
from tests.stories.core.modules.drivers.support.extended_suites import PATH
from tests.stories.core.modules.drivers.support.environment_with_sample_driver import SampleDriverEnvironment
from tests.stories.core.support.fixtures import MainEnvironment
from core.modules.drivers.support.driver_settings import SUITE_SETTING


@pytest.mark.parametrize("saved_suite", ["samples", "coding"])
def test_a_removed_driver_uses_the_default_without_changing_settings(new_story, saved_suite):
    story = new_story(SAMPLES, fixture=SampleDriverEnvironment)
    story.expect_success(f"suite choose {saved_suite} --environment main")
    story.container.get(ModuleRemoval).remove("samples")
    code, text = story.synced()
    story.expect_rows(code == 0)
    story.expect_text("suite current main", "suite: coding", "main: coding.main")
    story.expect_text(f"setting show {SUITE_SETTING} --environment main", f"value: {saved_suite}")
    story.expect_text("setting show journal.core.drivers.driver.main --environment main", "value: samples.lead")
    story.expect_rows({"messages.chat", "coding.files"}.issubset({window.name for window in WindowsRoute(story.home).windows("main")}))


def test_reinstalling_a_removed_suite_restores_the_saved_choice(new_story):
    story = new_story(f"{PATH}:AcmeSuiteOfAcmeModule", fixture=MainEnvironment)
    story.expect_success("suite choose acme --environment main")
    story.container.get(ModuleRemoval).remove("acme.suite")
    code, text = story.synced()
    story.expect_rows(code == 0)
    story.expect_text("suite current main", "suite: coding")
    story.expect_sync_success(f"{PATH}:AcmeSuiteOfAcmeModule")
    story.expect_success("suite current main", "suite: acme")
    story.expect_text(f"setting show {SUITE_SETTING} --environment main", "value: acme")
