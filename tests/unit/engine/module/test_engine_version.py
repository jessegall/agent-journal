import pytest

from engine.module.errors.module_error import ModuleError
from engine.module.version_requirement import VersionRequirement


@pytest.mark.parametrize("requirement,version,allowed", [(">=5.0,<6", (5, 2, 0), True), (">=5.1,<6", (5, 0, 0), False), (">=5.0,<6", (6, 0, 0), False)])
def test_a_requirement_allows_only_the_engine_versions_it_names(requirement, version, allowed):
    assert VersionRequirement(requirement).allows(version) is allowed


def test_a_malformed_requirement_is_refused_with_how_to_write_it():
    with pytest.raises(ModuleError, match="write it like"):
        VersionRequirement("five or so").allows((5, 0, 0))
