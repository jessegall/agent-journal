from engine.enums.starter_type import StarterType
from engine.execution.execution_starter import ExecutionStarter


def test_labels():
    assert ExecutionStarter(StarterType.MAIN_AGENT, agent_id=78).label == "main agent"
    assert ExecutionStarter(StarterType.HELPER, agent_id=849, agent_role="worker").label == "worker 849"
    assert ExecutionStarter(StarterType.HELPER, agent_id=850, agent_role="helper").label == "helper 850"
    assert ExecutionStarter(StarterType.PERSON).label == "the person"
    assert ExecutionStarter(StarterType.PLUGIN, plugin_name="code-commandments").label == "plugin code-commandments"
    assert ExecutionStarter(StarterType.JOURNAL).label == "the journal"
