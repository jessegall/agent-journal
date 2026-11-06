from core.base.request_values import RequestValues


def counted_loader():
    calls = []

    def load() -> int:
        calls.append(1)
        return len(calls)

    return calls, load


def test_outside_a_request_every_read_loads():
    values = RequestValues()
    calls, load = counted_loader()
    values.read("key", lambda: 1, load)
    values.read("key", lambda: 1, load)
    assert len(calls) == 2


def test_inside_a_request_a_value_is_read_once_until_its_version_changes():
    values = RequestValues()
    calls, load = counted_loader()
    with values.opened():
        assert values.read("key", lambda: 1, load) == 1
        assert values.read("key", lambda: 1, load) == 1
        assert values.read("key", lambda: 2, load) == 2
    assert len(calls) == 2


def test_a_new_request_reads_again_and_a_nested_opening_keeps_the_values():
    values = RequestValues()
    calls, load = counted_loader()
    with values.opened():
        values.read("key", lambda: 1, load)
        with values.opened():
            values.read("key", lambda: 1, load)
        values.read("key", lambda: 1, load)
    with values.opened():
        values.read("key", lambda: 1, load)
    assert len(calls) == 2
