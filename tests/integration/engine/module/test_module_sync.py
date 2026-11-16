from engine.registry.registry import Registry

SAMPLES = "tests.stories.engine.module.support.suite_samples"
NOTES_DEPENDENT = "tests.stories.engine.module.support.notes_dependent:NotesDependent"
LOOP_FIRST = "tests.stories.engine.module.support.loop_modules:LoopFirst"


def test_a_module_that_lists_a_dependency_that_is_not_installed_is_refused_at_boot_naming_both(journal):
    journal.expect_sync_refusal(NOTES_DEPENDENT, "module folder.dependent depends on folder.notes, which is not installed")


def test_524_a_module_whose_dependencies_lead_back_to_it_is_refused_at_boot_with_the_loop_printed(journal):
    journal.expect_sync_refusal(LOOP_FIRST, "folder.loop-first > folder.loop-first")


def test_527_a_suite_that_lists_its_modules_loads_them_with_it(journal):
    journal.expect_sync_success(f"{SAMPLES}:ShopSuite")
    registry = Registry.read(journal.database)
    shop = registry.suite("shop")
    assert shop is not None and shop.module == "folder.shop"
    assert registry.module_suites["folder.shop"] == tuple(["shop"]) and registry.module_suites["folder.carts"] == tuple(["shop"]), registry.module_suites.get("folder.carts")


def test_528_a_module_listed_by_two_suites_is_refused_naming_both(journal):
    journal.expect_sync_success(f"{SAMPLES}:ShopSuite")
    journal.expect_sync_refusal(f"{SAMPLES}:DepotSuite", "module folder.carts is listed by suite shop and suite depot")


def test_530_a_module_belongs_to_the_one_suite_that_lists_it_so_an_environment_of_the_coding_suite_runs_no_module_of_another(journal):
    journal.expect_sync_success(f"{SAMPLES}:ShopSuite")
    module_suites = Registry.read(journal.database).module_suites
    coding = sorted(name for name, suites in module_suites.items() if suites == tuple(["coding"]))
    assert coding == ["journal.suites.coding", "journal.suites.coding.checks", "journal.suites.coding.workers"], coding
    assert "shop" not in [suite for name in coding for suite in module_suites[name]] and module_suites["journal.core.tasks"] == (), "a core module is part of a suite"


def test_539_two_suites_that_register_one_helper_type_are_refused_naming_both(journal):
    journal.expect_sync_success(f"{SAMPLES}:ShopSuite")
    journal.expect_sync_refusal(f"{SAMPLES}:DepotScoutSuite", "suite depot and suite shop both register helper type scout")
