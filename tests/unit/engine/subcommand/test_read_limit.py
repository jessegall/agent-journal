from argparse import ArgumentTypeError

import pytest

from engine.subcommand.page_arguments import read_limit


def test_a_limit_from_one_to_a_thousand_is_taken():
    assert (read_limit("1"), read_limit("50"), read_limit("1000")) == (1, 50, 1000)


@pytest.mark.parametrize("text", ["0", "1001"])
def test_a_limit_outside_one_to_a_thousand_says_plainly_how_to_read_further(text):
    with pytest.raises(ArgumentTypeError, match="--limit is from 1 to 1000; read further rows with --page"):
        read_limit(text)
