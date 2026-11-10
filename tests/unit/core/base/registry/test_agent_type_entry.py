import json
from dataclasses import asdict

from engine.helper_type.helper_type import HelperType
from core.base.registry.helper_type_entry import HelperTypeEntry


def test_job_commands_and_task_flags_survive_registry_storage():
    declared = HelperTypeEntry.declared("sample.module", HelperType("sample", "Sample", job_command=("sample", "send"), job_task_flag="--task"))
    restored = HelperTypeEntry.restored(json.loads(json.dumps(asdict(declared))))
    assert restored == declared


def test_older_type_entries_have_no_job_action():
    stored = asdict(HelperTypeEntry.declared("sample.module", HelperType("sample", "Sample")))
    del stored["job_command"]
    del stored["job_task_flag"]
    restored = HelperTypeEntry.restored(stored)
    assert restored.job_command == () and restored.job_task_flag == ""
