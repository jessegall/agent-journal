import inspect
from pathlib import Path

from suites import DEFAULT_SUITES

SUITES_FOLDER = Path(inspect.getfile(DEFAULT_SUITES[0])).resolve().parents[1]


def driver_folder_problems() -> list[str]:
    problems = []
    for module in DEFAULT_SUITES:
        for driver in module.drivers:
            folder = module.folder() / "drivers" / driver.name.split(".", 1)[1].replace("-", "_")
            if Path(inspect.getfile(driver)).resolve() != folder / f"{folder.name}.py":
                problems.append(f"{driver.name} is not in {folder.relative_to(SUITES_FOLDER)}/{folder.name}.py")
            parts = [("rules", driver.rules), ("rules", driver.permanent_rules), ("guards", driver.guards)]
            problems += [f"{part.__name__} of {driver.name} is not in {folder.relative_to(SUITES_FOLDER)}/{part_folder}"
                         for part_folder, declared in parts for part in declared if Path(inspect.getfile(part)).resolve().parent != folder / part_folder]
    return problems


def test_every_suite_module_lives_in_its_own_folder_under_src_suites():
    assert [module.folder() for module in DEFAULT_SUITES] == [SUITES_FOLDER / module.name.rsplit(".", 1)[1] for module in DEFAULT_SUITES]


def test_every_driver_and_each_rule_limit_and_guard_it_names_live_in_its_driver_folder():
    assert driver_folder_problems() == []
