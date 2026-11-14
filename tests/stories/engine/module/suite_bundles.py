"""The install half of stories 540 and 541. The other half, a gate that allows or refuses each required suite,
waits for plan 1114."""
from engine.database.database import Database
from engine.registry.registry import Registry
from tests.stories.core.support.fixtures import MainEnvironment

SAMPLES = "tests.stories.engine.module.support.suite_samples"


def test_540_a_bundle_that_requires_two_suites_loads_once_both_are_installed(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{SAMPLES}:ShopSuite")
    story.expect_sync_success(f"{SAMPLES}:YardSuite")
    story.expect_sync_success(f"{SAMPLES}:BundleSuite")
    registry = Registry.read(story.container.get(Database))
    bundle = registry.suite("bundle")
    story.expect_rows(bundle is not None and bundle.requires == ("shop", "yard"), "bundle" in [suite.name for suite in registry.top_suites()],
                      "shop" not in [suite.name for suite in registry.top_suites()], detail=str([suite.name for suite in registry.top_suites()]))


def test_541_a_bundle_without_a_suite_it_requires_is_refused_naming_what_is_missing(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{SAMPLES}:ShopSuite")
    story.expect_sync_refusal(f"{SAMPLES}:LoneBundleSuite", "suite lone-bundle requires suite yard: install the module that ships it first")
