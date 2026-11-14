import pytest

from engine.registry.registry import Registry


@pytest.mark.parametrize("name,matched_events,unmatched_events", [
    ("documents.reply-links", ["message.create"], ("message.update", "task.update", "doc.create", "agent.create", "proof.queue")),
    ("workers.tests", ("proof.queue", "proof.run"), ("proof.check", "task.start", "process.finish", "affected_test.create")),
    ("workers.test-ends", ("process.finish", "process.fail"), ("proof.queue", "affected_test.create")),
])
def test_the_registry_names_only_the_events_the_listener_handles(journal, name, matched_events, unmatched_events):
    entry = next(listener for listener in journal.container.get(Registry).listeners if listener.name == name)
    assert all(entry.event.matches(event) for event in matched_events)
    assert not any(entry.event.matches(event) for event in unmatched_events)
