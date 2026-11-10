from engine.request.request_values import RequestValues


def counted_loader():
    calls = []

    def read_value() -> int:
        calls.append(1)
        return len(calls)

    return calls, read_value


def test_outside_a_request_every_read_loads():
    values = RequestValues()
    calls, read_value = counted_loader()
    values.read("key", lambda: 1, read_value)
    values.read("key", lambda: 1, read_value)
    assert len(calls) == 2


def test_inside_a_request_a_value_is_read_once_until_its_version_changes():
    values = RequestValues()
    calls, read_value = counted_loader()
    with values.opened():
        assert values.read("key", lambda: 1, read_value) == 1
        assert values.read("key", lambda: 1, read_value) == 1
        assert values.read("key", lambda: 2, read_value) == 2
    assert len(calls) == 2


def test_a_new_request_reads_again_and_a_nested_opening_keeps_the_values():
    values = RequestValues()
    calls, read_value = counted_loader()
    with values.opened():
        values.read("key", lambda: 1, read_value)
        with values.opened():
            values.read("key", lambda: 1, read_value)
        values.read("key", lambda: 1, read_value)
    with values.opened():
        values.read("key", lambda: 1, read_value)
    assert len(calls) == 2
