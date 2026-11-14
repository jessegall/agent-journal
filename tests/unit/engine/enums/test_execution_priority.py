from engine.enums.execution_priority import ExecutionPriority


def test_raised_stops_at_reserved():
    assert [priority.raised() for priority in ExecutionPriority] == [ExecutionPriority.NORMAL, ExecutionPriority.AGENT, ExecutionPriority.RESERVED,
                                                                     ExecutionPriority.RESERVED, ExecutionPriority.IMMEDIATE]


def test_only_immediate_is_unlimited():
    assert [priority for priority in ExecutionPriority if priority.is_unlimited] == [ExecutionPriority.IMMEDIATE]


def test_order_is_ascending():
    assert list(ExecutionPriority) == sorted(ExecutionPriority)
