from engine.registry.registry import Registry
from tests.unit.engine.registry.test_suite_windows import suite
from dataclasses import replace

REGISTRY = Registry("", {}, {}, {}, (), (), suites=(suite("coding", ()), suite("agency", (), requires=tuple(["coding"])), suite("studio", (), requires=tuple(["agency"])), suite("lone", ())))


def ancestors(name: str) -> tuple[str, ...]:
    return REGISTRY.ancestors(next(entry for entry in REGISTRY.suites if entry.name == name))


def test_a_suite_is_its_own_lineage_and_a_bundle_adds_every_suite_it_requires_however_far_down():
    assert ancestors("lone") == tuple(["lone"])
    assert ancestors("agency") == ("agency", "coding")
    assert ancestors("studio") == ("studio", "agency", "coding")


def test_a_suite_that_requires_one_that_is_not_installed_still_names_it():
    registry = Registry("", {}, {}, {}, (), (), suites=tuple([suite("agency", (), requires=tuple(["missing"]))]))
    assert registry.ancestors(registry.suites[0]) == ("agency", "missing")


def test_a_third_party_suite_does_not_remove_a_shipped_suite_from_the_shipped_roots():
    entries = tuple(replace(entry, shipped=entry.name == "coding") for entry in REGISTRY.suites)
    registry = replace(REGISTRY, suites=entries)
    assert [entry.name for entry in registry.default_suite_roots()] == ["coding"]


def test_only_shipped_requirements_choose_the_top_shipped_suite():
    entries = tuple(replace(entry, shipped=entry.name in ("coding", "agency")) for entry in REGISTRY.suites)
    registry = replace(REGISTRY, suites=entries)
    assert [entry.name for entry in registry.default_suite_roots()] == ["agency"]


def test_without_shipped_suites_the_installed_roots_are_kept():
    assert REGISTRY.default_suite_roots() == []
    assert [entry.name for entry in REGISTRY.top_suites()] == ["studio", "lone"]
