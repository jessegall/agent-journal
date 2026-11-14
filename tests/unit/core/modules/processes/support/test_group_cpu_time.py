import pytest

from core.modules.processes.support.group_cpu_time import GroupCpuTime

LISTING = "  100   0:01.50\n  100  12:00.25\n  200   5:00.00\n  100 1-02:03:04\n"


def test_the_time_of_every_process_of_the_group_is_added():
    assert GroupCpuTime.group_total(LISTING, 100) == pytest.approx(1.5 + 720.25 + 93784)


def test_a_group_with_no_process_has_no_time():
    assert GroupCpuTime.group_total(LISTING, 300) is None


@pytest.mark.parametrize("text,seconds", [("0:01.50", 1.5), ("12:00.25", 720.25), ("2:03:04", 7384.0), ("1-02:03:04", 93784.0), ("nonsense", 0.0)])
def test_a_time_reads_in_every_format_ps_prints(text, seconds):
    assert GroupCpuTime.parsed(text) == pytest.approx(seconds)
