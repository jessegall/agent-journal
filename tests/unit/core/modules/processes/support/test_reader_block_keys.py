import pytest

from core.modules.processes.nudges.reader_block_nudge import ReaderBlockNudge
from core.modules.processes.nudges.reader_request_refusal_nudge import ReaderRequestRefusalNudge
from core.modules.processes.support.reader_block_keys import ReaderBlockKeys


@pytest.mark.parametrize("nudge", [ReaderBlockNudge.declared().nudge(output=3, request=7), ReaderRequestRefusalNudge.declared().nudge(request=7, command="make", block="{block}")])
def test_the_request_a_block_key_is_for_is_read_back_from_the_key_written(nudge):
    assert ReaderBlockKeys.request_id(ReaderBlockKeys.keyed(nudge, 7).key) == 7


@pytest.mark.parametrize("key", [f"{ReaderBlockNudge.declared().key}", f"{ReaderBlockNudge.declared().key}.later", f"{ReaderBlockNudge.declared().key}.7.8", "other.7"])
def test_a_key_that_is_not_that_of_a_block_of_a_reader_request_names_no_request(key):
    assert ReaderBlockKeys.request_id(key) is None
