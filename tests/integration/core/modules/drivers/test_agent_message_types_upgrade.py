import re

from engine.registry.registry import Registry

OLD_NAMES = (("info", "instruction"), ("steering", "nudge"))


def old_registry(journal) -> None:
    connection = journal.database.connection
    entries = connection.execute("SELECT entries FROM registry WHERE id = 1").fetchone()["entries"]
    for new, old in OLD_NAMES:
        entries = re.sub(rf'("type":\s*"){new}"', rf'\g<1>{old}"', entries)
    connection.execute("UPDATE registry SET entries = ?, fingerprint = 'old' WHERE id = 1", [entries])


def registered_types(journal) -> set[str]:
    return {agent_message.type for agent_message in Registry.read(journal.database).agent_messages}


def test_a_database_that_holds_the_old_type_names_holds_the_new_ones_after_a_sync(journal):
    old_registry(journal)
    assert registered_types(journal) == {"instruction", "nudge", "refusal", "safety_refusal"}
    assert journal.synced().code == 0
    assert registered_types(journal) == {"info", "steering", "refusal", "safety_refusal"}


def test_the_agent_message_list_names_the_new_types_after_the_sync(journal):
    old_registry(journal)
    journal.synced()
    listed = journal.run("agent-message list --json").text
    assert '"type": "instruction"' not in listed and '"type": "steering"' in listed and '"type": "info"' in listed
