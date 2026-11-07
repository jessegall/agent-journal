import pytest

from core.base.library.library_ref import LibraryRef


def test_a_library_item_has_its_own_form_and_a_plain_number_is_the_local_row():
    assert (LibraryRef.row_id("library:12"), LibraryRef.row_id("12")) == (LibraryRef(12), 12)


def test_a_library_number_that_is_no_number_is_refused():
    with pytest.raises(ValueError):
        LibraryRef.row_id("library:twelve")
