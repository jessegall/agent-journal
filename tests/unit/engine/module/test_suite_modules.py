from engine.module.suite import Suite
from engine.helper_type.helper_type import HelperType
from engine.journal.journal_home import JournalHome
from engine.module.module import Module
from engine.module.module_finder import ModuleFinder
from engine.module.suite_list import SuiteList
from suites import DEFAULT_SUITES
from suites.coding.coding_module import CodingModule
from suites.coding.coding_suite import CodingSuite
from suites.coding.modules.checks.checks_module import ChecksModule
from suites.coding.modules.workers.workers_module import WorkersModule


def module(name: str, python_module: str = "samples.sample_module") -> type[Module]:
    return type("SampleModule", tuple([Module]), {"name": name, "requires_core": ">=5,<6", "__module__": python_module})


def suite(name: str, *modules: type[Module], helper_types: tuple[HelperType, ...] = ()) -> type[Suite]:
    return type("SampleSuite", tuple([Suite]), {"name": name, "modules": list(modules), "helper_types": list(helper_types)})


def test_the_first_module_a_suite_lists_ships_it_and_the_others_are_part_of_it():
    shop, carts = module("shop"), module("carts")
    suites = SuiteList([suite("shop", shop, carts)])
    assert [listed.name for listed in suites.module_suites(shop)] == ["shop"] and suites.module_suites(carts) == []
    assert suites.parent_name(carts) == "shop" and suites.parent_name(shop) is None
    assert suites.suite_names(shop) == tuple(["shop"]) and suites.suite_names(carts) == tuple(["shop"]) and suites.problems() == ()


def test_a_module_no_suite_lists_is_part_of_no_suite():
    assert SuiteList([suite("shop", module("shop"))]).suite_names(module("notes")) == ()


def test_a_module_listed_by_two_suites_is_refused_naming_both():
    carts = module("carts")
    problems = SuiteList([suite("shop", module("shop"), carts), suite("depot", module("depot"), carts)]).problems()
    assert problems == tuple(["module carts is listed by suite shop and suite depot: one suite lists a module"])


def test_a_core_module_listed_by_a_suite_is_refused():
    tasks = module("journal.core.tasks", "core.modules.tasks.tasks_module")
    problems = SuiteList([suite("shop", module("shop"), tasks)]).problems()
    assert problems == tuple(["suite shop lists core module journal.core.tasks: the core is always loaded, a suite lists its own modules"])


def test_a_suite_that_joins_another_adds_its_modules_to_it_and_ships_no_suite_to_pick():
    shop, reviews = module("shop"), module("reviews")
    joining = type("ReviewsSuite", tuple([Suite]), {"name": "reviews", "modules": [reviews], "joins": "shop"})
    suites = SuiteList([suite("shop", shop), joining])
    assert suites.parent_name(reviews) == "shop" and suites.module_suites(reviews) == []
    assert suites.suite_names(reviews) == tuple(["shop"]) and suites.problems() == ()


def test_the_helper_types_of_a_suite_are_those_of_the_module_that_ships_it():
    scout = HelperType("scout", "Scout")
    shop, carts = module("shop"), module("carts")
    suites = SuiteList([suite("shop", shop, carts, helper_types=tuple([scout]))])
    assert suites.helper_types(shop) == [scout] and suites.helper_types(carts) == []


def test_the_shipped_suites_are_the_coding_suite_and_it_lists_its_three_modules(tmp_path):
    finder = ModuleFinder(JournalHome(tmp_path))
    assert DEFAULT_SUITES == [CodingSuite] and list(CodingSuite.modules) == [CodingModule, WorkersModule, ChecksModule]
    assert finder.suite_list().suites == tuple([CodingSuite])
    loaded = finder.default_modules()
    assert [loaded.index(listed) for listed in CodingSuite.modules] == sorted(loaded.index(listed) for listed in CodingSuite.modules)
    assert len(set(loaded)) == len(loaded)
