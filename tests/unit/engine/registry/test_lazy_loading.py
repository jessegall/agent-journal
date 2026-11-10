import pytest

from engine.registry.errors.lazy_load_error import LazyLoadError
from engine.registry.lazy_loading import LazyLoading


def test_a_registry_built_twice_from_the_same_rows_stops_the_work():
    LazyLoading.registry_built(hash(("unit test fingerprint", "{}")))
    with pytest.raises(LazyLoadError, match="a registry was built again"):
        LazyLoading.registry_built(hash(("unit test fingerprint", "{}")))


def test_with_lazy_loading_allowed_a_second_build_goes_on(monkeypatch):
    monkeypatch.setattr(LazyLoading, "prevented", False)
    monkeypatch.setattr(LazyLoading, "disabled", False)
    LazyLoading.registry_built(hash(("another fingerprint", "{}")))
    LazyLoading.registry_built(hash(("another fingerprint", "{}")))
