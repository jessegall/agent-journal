from dataclasses import replace
from copy import copy

import pytest

from core.base.provider.providers import Providers
from core.base.provider.program_model import ProgramModel
from core.base.model_tier import ModelTier
from core.base.refusal import Refusal
from core.base.provider.unknown_program_error import UnknownProgramError
from core.base.dotted_path.dotted_path import DottedPath
from core.base.registry.provider_entry import ProviderEntry
from tests.unit.core.base.sample_container import empty_registry, sample_container
from tests.unit.core.base.samples.program_sample import SampleProgram

SAMPLE_ENTRY = ProviderEntry("sample", DottedPath.class_path(SampleProgram), "sample.program", "Sample program")


@pytest.fixture
def providers(tmp_path):
    registry = replace(empty_registry(), providers=tuple([SAMPLE_ENTRY]))
    return Providers(registry, sample_container(tmp_path, registry))


def test_a_program_is_found_by_the_name_its_hooks_give(providers):
    assert isinstance(providers.provider("sample"), SampleProgram)


def test_every_registered_program_is_listed(providers):
    assert [provider.name for provider in providers.all()] == ["sample"]


def test_a_program_no_module_provides_is_refused_by_its_name(providers):
    with pytest.raises(UnknownProgramError, match="no module provides the agent program 'gemini'"):
        providers.provider("gemini")


def test_a_named_model_finds_the_provider_that_offers_it(providers, monkeypatch):
    monkeypatch.setattr(providers.provider("sample"), "models", [ProgramModel("sample-model", ModelTier.GENERAL)])
    assert providers.program_for_model("sample-model") == "sample"


def test_a_model_no_provider_offers_is_refused(providers):
    with pytest.raises(Refusal, match="no program offers model missing"):
        providers.program_for_model("missing")


def test_a_model_offered_twice_needs_an_explicit_program(providers, monkeypatch):
    provider = providers.provider("sample")
    monkeypatch.setattr(provider, "models", [ProgramModel("shared", ModelTier.GENERAL)])
    other = copy(provider)
    other.name = "other"
    monkeypatch.setattr(providers, "all", lambda: [provider, other])
    with pytest.raises(Refusal, match="name --program explicitly"):
        providers.program_for_model("shared")
