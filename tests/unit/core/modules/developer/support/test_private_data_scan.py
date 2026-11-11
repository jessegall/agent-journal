import subprocess
from pathlib import Path

import pytest

from core.modules.developer.models.enums.private_data_category import PrivateDataCategory
from core.modules.developer.support.private_data_scan import PrivateDataScan

# the private shapes are put together here, so this file holds none of them whole
PLANTED = {
    PrivateDataCategory.EMAIL: "contact " + "jane.doe" + "@" + "mail" + ".nl for access",
    PrivateDataCategory.HOME_PATH: "path = '/" + "Users/" + "janedoe/projects/app'",
    PrivateDataCategory.SESSION_ID: "session_id = " + "0a1b2c3d-4e5f-6789-abcd-ef0123456789",
    PrivateDataCategory.TOKEN: "token = " + "gh" + "p_" + "A1b2C3d4E5f6G7h8I9j0K1l2M3",
    PrivateDataCategory.KEY: "-----" + "BEGIN RSA PRIVATE" + " KEY-----",
    PrivateDataCategory.TRANSCRIPT: '{"type": "user", "' + 'sessionId": "x", "message": {"content": "hello"}}',
}
SANITISED = [
    "contact someone@example.com for access",
    "path = '/Users/user/projects/app'",
    "path = '/home/you/app'",
    "session_id = none yet",
    "token = " + "ghp_" + "short",
    "plain text with an @ sign and no private data",
]


@pytest.mark.parametrize("category", list(PLANTED))
def test_each_category_is_found_in_a_planted_file_by_line_and_category(category):
    findings = PrivateDataScan().scan(Path("planted.txt"), "first line\n" + PLANTED[category] + "\n")
    assert [(finding.line, finding.category) for finding in findings] == [(2, category)]


@pytest.mark.parametrize("line", SANITISED)
def test_a_sanitised_sample_passes(line):
    assert PrivateDataScan().scan(Path("sample.txt"), line) == []


def test_a_recording_not_marked_sanitised_is_a_finding_and_a_marked_one_passes():
    scan = PrivateDataScan()
    assert [finding.category for finding in scan.scan(Path("run.cast"), "{}")] == [PrivateDataCategory.RECORDING]
    assert scan.scan(Path("run.cast"), '{"note": "sanitised"}') == []


def test_a_finding_names_the_file_line_and_category_and_never_the_text():
    finding = PrivateDataScan().scan(Path("a.txt"), PLANTED[PrivateDataCategory.EMAIL])[0]
    assert finding.text == "a.txt, line 1: an email address"


@pytest.mark.parametrize("line", ['journal-path-begin:/home/.nvm/bin', 'layouts = {"home@notes.orchestrator": 1}', "@pytest.fixture", "see@AGENTS.md", '"/home/example/x"'])
def test_what_only_looks_like_private_data_is_not_a_finding(line):
    assert list(PrivateDataScan().categories(line)) == []


@pytest.mark.parametrize("line, category", [("/home/" + "jdoe/src", PrivateDataCategory.HOME_PATH), ("reach me at jane" + "@acme.com", PrivateDataCategory.EMAIL), ("jane" + "@acme.nl", PrivateDataCategory.EMAIL)])
def test_a_real_name_or_address_is_a_finding(line, category):
    assert list(PrivateDataScan().categories(line)) == [category]


def test_no_tracked_file_holds_private_data():
    root = Path(__file__).parents[6]
    tracked = subprocess.check_output(["git", "ls-files", "-z"], cwd=root).decode().split("\0")
    scan, matched = PrivateDataScan(), []
    for name in filter(None, tracked):
        path = root / name
        data = path.read_bytes() if path.is_file() else b"\0"
        matched += [] if b"\0" in data else [f"{name}:{finding.line} {finding.category}" for finding in scan.scan(Path(name), data.decode(errors="replace"))]
    assert matched == [], matched[:20]

