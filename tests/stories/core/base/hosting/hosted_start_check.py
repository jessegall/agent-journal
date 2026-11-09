from pathlib import Path

import pytest

from core.base.hosting.hosted_mode import HostedMode
from core.base.hosting.hosted_start_check import CGROUP_CONTROLLERS, HostedStartCheck, SYSTEMD_FOLDER
from core.base.hosting.hosting import Hosting
from core.base.hosting.missing_cgroup_refusal import MissingCgroupRefusal
from core.base.hosting.missing_systemd_refusal import MissingSystemdRefusal
from core.base.hosting.shared_user_refusal import SharedUserRefusal
from core.base.hosting.unsupported_kernel_refusal import UnsupportedKernelRefusal
from core.base.hosting.writable_hosted_file_refusal import WritableHostedFileRefusal
from core.base.hosting.wrong_socket_mode_refusal import WrongSocketModeRefusal
from tests.stories.core.base.hosting.support.fake_host import FakeHost

HOSTED_FILE = Path("/etc/journal/hosted.toml")
VIEWER_SOCKET = Path("/run/journal/viewer.sock")
HOSTED = Hosting.hosted(HostedMode("https://journal.example.com", "journal-agent", "caddy", 60, 24, 5, True))
HOST_FINDINGS = {
    "not_linux": (FakeHost(kernel="Darwin"), UnsupportedKernelRefusal, "this host is Darwin"),
    "no_systemd": (FakeHost(paths=frozenset({CGROUP_CONTROLLERS})), MissingSystemdRefusal, "/run/systemd/system is missing"),
    "no_cgroup": (FakeHost(paths=frozenset({SYSTEMD_FOLDER})), MissingCgroupRefusal, "cgroup.controllers is missing"),
    "agent_is_journal_user": (FakeHost(journal_user="journal-agent"), SharedUserRefusal, "the agent user journal-agent is the user the journal runs as"),
    "file_not_owned_by_root": (FakeHost(file_owner=1000), WritableHostedFileRefusal, "is owned by user id 1000"),
    "file_group_writable": (FakeHost(file_mode=0o664), WritableHostedFileRefusal, "has mode 0664"),
}


def hosted_check(host):
    return HostedStartCheck(HOSTED, host, HOSTED_FILE)


@pytest.mark.parametrize("host, refusal, text", HOST_FINDINGS.values(), ids=HOST_FINDINGS.keys())
def test_an_unsafe_host_is_refused_by_what_is_wrong(host, refusal, text):
    with pytest.raises(refusal, match=text):
        hosted_check(host).check_host()


def test_a_clean_host_passes_both_checks():
    check = hosted_check(FakeHost())
    check.check_host()
    check.check_socket(VIEWER_SOCKET)


def test_a_viewer_socket_with_another_mode_than_0660_is_refused():
    with pytest.raises(WrongSocketModeRefusal, match="has mode 0666, and it must be 0660"):
        hosted_check(FakeHost(socket_mode=0o666)).check_socket(VIEWER_SOCKET)


def test_a_local_journal_is_never_checked():
    local = HostedStartCheck(Hosting.local(), FakeHost(kernel="Darwin", socket_mode=0o666), HOSTED_FILE)
    local.check_host()
    local.check_socket(VIEWER_SOCKET)
