from core.base.registry.registry import Registry
from tests.unit.core.base.registry.test_suite_windows import suite

REGISTRY = Registry("", {}, {}, {}, (), (), suites=(suite("coding", ()), suite("agency", (), requires=tuple(["coding"])), suite("studio", (), requires=tuple(["agency"])), suite("lone", ())))


def lineage(name: str) -> tuple[str, ...]:
    return REGISTRY.lineage(next(entry for entry in REGISTRY.suites if entry.name == name))


def test_a_suite_is_its_own_lineage_and_a_bundle_adds_every_suite_it_requires_however_far_down():
    assert lineage("lone") == tuple(["lone"])
    assert lineage("agency") == ("agency", "coding")
    assert lineage("studio") == ("studio", "agency", "coding")


def test_a_suite_that_requires_one_that_is_not_installed_still_names_it():
    registry = Registry("", {}, {}, {}, (), (), suites=tuple([suite("agency", (), requires=tuple(["missing"]))]))
    assert registry.lineage(registry.suites[0]) == ("agency", "missing")
