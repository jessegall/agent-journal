import pytest

from core.base.metadata import Metadata


def test_a_module_reads_its_own_part():
    metadata = Metadata.parsed('{"workers": {"points": 3}, "reviews": {"asked": true}}')
    assert metadata.module_part("workers") == {"points": 3}


def test_a_part_no_module_wrote_is_empty():
    assert Metadata().module_part("workers") == {}
    assert Metadata.parsed("{}").module_part("workers") == {}


def test_a_part_cannot_be_written_in_place():
    metadata = Metadata.parsed('{"workers": {"points": 3}}')
    with pytest.raises(TypeError):
        metadata.module_part("workers")["points"] = 4
    with pytest.raises(TypeError):
        metadata.values["reviews"] = {}


def test_metadata_reads_back_from_its_text():
    metadata = Metadata.parsed('{"workers": {"points": 3}}')
    assert Metadata.parsed(metadata.text) == metadata
