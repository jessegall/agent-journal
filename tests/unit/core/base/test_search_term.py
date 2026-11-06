import pytest

from core.base.search_term import SearchTerm


@pytest.mark.parametrize("word, stem", [("Hours", "hour"), ("two-hourly", "two-hour"), ("reviewer", "review"), ("reviews", "review"), ("cart", "cart"), ("ads", "ads"), ("rounding", "round")])
def test_a_word_is_cut_to_its_stem_in_lower_case(word, stem):
    assert SearchTerm.stem(word) == stem
