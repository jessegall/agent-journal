import pytest

from core.modules.processes.support.process_nudges import READER_BLOCK, READER_REQUEST_REFUSAL
from core.modules.processes.support.reader_block_keys import ReaderBlockKeys


@pytest.mark.parametrize("nudge", [READER_BLOCK.nudge(output=3, request=7), READER_REQUEST_REFUSAL.nudge(request=7, command="make", block="{block}")])
def test_the_request_a_block_key_is_for_is_read_back_from_the_key_written(nudge):
    assert ReaderBlockKeys.request_id(ReaderBlockKeys.keyed(nudge, 7).key) == 7


@pytest.mark.parametrize("key", [f"{READER_BLOCK.key}", f"{READER_BLOCK.key}.later", f"{READER_BLOCK.key}.7.8", "other.7"])
def test_a_key_that_is_not_that_of_a_block_of_a_reader_request_names_no_request(key):
    assert ReaderBlockKeys.request_id(key) is None
