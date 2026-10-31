from dataclasses import replace

import pytest

from core.base.provider.providers import Providers
from core.base.provider.unknown_program_error import UnknownProgramError
from core.base.registry.dotted_path import DottedPath
from core.base.registry.provider_entry import ProviderEntry
from tests.unit.core.base.sample_container import empty_registry, sample_container
from tests.unit.core.base.samples.program_sample import SampleProgram

SAMPLE_ENTRY = ProviderEntry("sample", DottedPath.class_path(SampleProgram), "sample.program", "Sample program")


@pytest.fixture
def providers(tmp_path):
    registry = replace(empty_registry(), providers=tuple([SAMPLE_ENTRY]))
    return Providers(registry, sample_container(tmp_path, registry))


def test_a_program_is_found_by_the_name_its_hooks_give(providers):
    assert isinstance(providers.named("sample"), SampleProgram)


def test_every_registered_program_is_listed(providers):
    assert [provider.name for provider in providers.all()] == ["sample"]


def test_a_program_no_module_provides_is_refused_by_its_name(providers):
    with pytest.raises(UnknownProgramError, match="no module provides the agent program 'gemini'"):
        providers.named("gemini")
