import json

import pytest

from core.base.journal_home import JournalHome
from core.base.module.module import Module
from core.base.module.module_error import ModuleError
from core.base.module.module_finder import ModuleFinder
from core.base.module.module_order import ModuleOrder
from core.base.module.version_requirement import VersionRequirement


def module(name: str, dependencies: tuple[str, ...] = (), requires_core: str = ">=5.0,<6") -> type[Module]:
    return type(name.title() + "Module", tuple([Module]), {"name": name, "dependencies": dependencies, "requires_core": requires_core})


def test_every_module_comes_after_the_modules_it_depends_on():
    plans, tasks, workers = module("plans", ["tasks"]), module("tasks"), module("workers", ("plans", "tasks"))
    assert [module.name for module in ModuleOrder().ordered((workers, plans, tasks))] == ["tasks", "plans", "workers"]


def test_a_loop_of_dependencies_is_refused():
    with pytest.raises(ModuleError, match="loop"):
        ModuleOrder().ordered((module("plans", ["tasks"]), module("tasks", ["plans"])))


def test_a_dependency_that_is_not_installed_is_refused():
    with pytest.raises(ModuleError, match="depends on tasks, which is not installed"):
        ModuleOrder().ordered([module("plans", ["tasks"])])


def test_core_versions_are_checked_against_the_bounds_a_module_gives():
    assert VersionRequirement(">=5.0,<6").allows((5, 2, 1))
    assert not VersionRequirement(">=5.3").allows((5, 2, 1))
    assert not VersionRequirement("<5").allows((5, 0, 0))
    with pytest.raises(ModuleError, match="no version bound"):
        VersionRequirement("about five").allows((5, 0, 0))


class FutureCoreModule(Module):
    name = "items"
    requires_core = ">=6"


def test_the_finder_loads_the_listed_plugins_and_refuses_one_for_another_core(tmp_path):
    home = JournalHome(tmp_path)
    home.module_list.write_text(json.dumps(["tests.core.base.samples.module_sample:ItemsModule"]))
    assert [module.name for module in ModuleFinder(home).modules()][-1] == "items"
    home.module_list.write_text(json.dumps(["tests.core.base.module.test_module_order:FutureCoreModule"]))
    with pytest.raises(ModuleError, match="needs core >=6"):
        ModuleFinder(home).modules()
    home.module_list.write_text(json.dumps([3]))
    with pytest.raises(ModuleError, match="no module path"):
        ModuleFinder(home).modules()
