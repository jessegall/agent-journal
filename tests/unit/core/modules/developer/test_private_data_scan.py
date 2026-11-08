from pathlib import Path

import pytest

from core.modules.developer.support.private_data_kind import PrivateDataKind
from core.modules.developer.support.private_data_scan import PrivateDataScan

# the private shapes are put together here, so this file holds none of them whole
PLANTED = {
    PrivateDataKind.EMAIL: "contact " + "jane.doe" + "@" + "mail" + ".nl for access",
    PrivateDataKind.HOME_PATH: "path = '/" + "Users/" + "janedoe/projects/app'",
    PrivateDataKind.SESSION_ID: "session_id = " + "0a1b2c3d-4e5f-6789-abcd-ef0123456789",
    PrivateDataKind.TOKEN: "token = " + "gh" + "p_" + "A1b2C3d4E5f6G7h8I9j0K1l2M3",
    PrivateDataKind.KEY: "-----" + "BEGIN RSA PRIVATE" + " KEY-----",
    PrivateDataKind.TRANSCRIPT: '{"type": "user", "' + 'sessionId": "x", "message": {"content": "hello"}}',
}
SANITISED = [
    "contact someone@example.com for access",
    "path = '/Users/user/projects/app'",
    "path = '/home/you/app'",
    "session_id = none yet",
    "token = " + "ghp_" + "short",
    "plain text with an @ sign and no private data",
]


@pytest.mark.parametrize("kind", list(PLANTED))
def test_each_kind_is_found_in_a_planted_file_by_line_and_kind(kind):
    findings = PrivateDataScan().scan(Path("planted.txt"), "first line\n" + PLANTED[kind] + "\n")
    assert [(finding.line, finding.kind) for finding in findings] == [(2, kind)]


@pytest.mark.parametrize("line", SANITISED)
def test_a_sanitised_sample_passes(line):
    assert PrivateDataScan().scan(Path("sample.txt"), line) == []


def test_a_recording_not_marked_sanitised_is_a_finding_and_a_marked_one_passes():
    scan = PrivateDataScan()
    assert [finding.kind for finding in scan.scan(Path("run.cast"), "{}")] == [PrivateDataKind.RECORDING]
    assert scan.scan(Path("run.cast"), '{"note": "sanitised"}') == []


def test_a_finding_names_the_file_line_and_kind_and_never_the_text():
    finding = PrivateDataScan().scan(Path("a.txt"), PLANTED[PrivateDataKind.EMAIL])[0]
    assert finding.text == "a.txt, line 1: an email address"
