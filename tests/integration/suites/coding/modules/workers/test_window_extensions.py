from engine.registry.registry import Registry


def test_workers_supply_the_agent_feeds_through_window_declarations(journal):
    window = journal.container.get(Registry).window("agents.agents")
    assert {source['key']: source['read'] for source in window.sources} == {'waits': 'worker waits', 'progress': 'worker progress', 'queue': 'proof list --limit 50'}
    assert journal.container.get(Registry).window('plugins.plugins').links == {'files': 'coding.files'}
