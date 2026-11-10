from engine.database.database import Database
from engine.registry.registry import Registry
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.engine.module.support.layer_project import LayerProject

SAMPLES = "tests.stories.engine.module.support.suite_samples"
CARTS_FOLDER = "src/suites/shop/modules/carts"


def test_527_a_suite_that_lists_its_modules_loads_them_with_it(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{SAMPLES}:ShopSuite")
    registry = Registry.read(story.container.get(Database))
    shop = registry.suite("shop")
    story.expect_rows(shop is not None and shop.module == "folder.shop", registry.module_suites["folder.shop"] == tuple(["shop"]), registry.module_suites["folder.carts"] == tuple(["shop"]),
                      detail=str(registry.module_suites.get("folder.carts")))


def test_528_a_module_listed_by_two_suites_is_refused_naming_both(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{SAMPLES}:ShopSuite")
    story.expect_sync_refusal(f"{SAMPLES}:DepotSuite", "module folder.carts is listed by suite shop and suite depot")


def test_529_a_module_folder_under_a_suite_that_the_suite_does_not_list_is_refused_naming_the_folder(new_story, tmp_path):
    story = new_story()
    project = LayerProject(story, tmp_path)
    project.add_module_folder("suites.shop", "shop")
    project.add_module_folder("suites.shop.modules.carts", "carts")
    shop = project.declaration("shop", "suites.shop")
    unlisted = project.check(shop)
    listed = project.check(shop, project.declaration("carts", "suites.shop.modules.carts"))
    story.expect_rows(unlisted == [f"{CARTS_FOLDER}: its declaration is not found by the loader"], listed == [], detail=str(unlisted))


def test_530_a_module_belongs_to_the_one_suite_that_lists_it_so_an_environment_of_the_coding_suite_runs_no_module_of_another(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{SAMPLES}:ShopSuite")
    module_suites = Registry.read(story.container.get(Database)).module_suites
    coding = sorted(name for name, suites in module_suites.items() if suites == tuple(["coding"]))
    story.expect_rows(coding == ["journal.suites.coding", "journal.suites.coding.checks", "journal.suites.coding.workers"], detail=str(coding))
    story.expect_rows("shop" not in [suite for name in coding for suite in module_suites[name]], module_suites["journal.core.tasks"] == (), detail="a core module is part of a suite")


def test_539_two_suites_that_register_one_helper_type_are_refused_naming_both(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{SAMPLES}:ShopSuite")
    story.expect_sync_refusal(f"{SAMPLES}:DepotScoutSuite", "folder.depot's helper type scout: folder.shop registers that helper type too")


def test_542_the_coding_suite_is_in_the_suite_layer_and_a_suite_folder_under_the_core_is_in_no_layer(new_story, tmp_path):
    story = new_story()
    project = LayerProject(story, tmp_path)
    project.add_file("src/core/suites/shop/shop_module.py")
    failures = project.check()
    story.expect_rows(project.layer_of("src/suites/coding/coding_suite.py") == "suite coding", project.layer_of("src/core/suites/shop/shop_module.py") == "no layer",
                      any("src/core/suites" in failure for failure in failures), detail=str(failures))
