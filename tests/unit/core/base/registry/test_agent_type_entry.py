import json
from dataclasses import asdict

from core.base.agent_type import AgentType
from core.base.registry.agent_type_entry import AgentTypeEntry


def test_job_commands_and_task_flags_survive_registry_storage():
    declared = AgentTypeEntry.declared("sample.module", AgentType("sample", "Sample", job_command=("sample", "send"), job_task_flag="--task"))
    restored = AgentTypeEntry.restored(json.loads(json.dumps(asdict(declared))))
    assert restored == declared


def test_older_type_entries_have_no_job_action():
    stored = asdict(AgentTypeEntry.declared("sample.module", AgentType("sample", "Sample")))
    del stored["job_command"]
    del stored["job_task_flag"]
    restored = AgentTypeEntry.restored(stored)
    assert restored.job_command == () and restored.job_task_flag == ""
