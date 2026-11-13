import json
from dataclasses import asdict, fields

from engine.helper_type.helper_behaviours import HelperBehaviours
from engine.helper_type.helper_type import HelperType
from engine.helper_type.helper_type_entry import HelperTypeEntry


class SampleType(HelperType):
    key = "sample"
    label = "Sample"
    behaviours = HelperBehaviours(**{field.name: False for field in fields(HelperBehaviours)})


class SendingSample(SampleType):
    key = "sending-sample"
    label = "Sending sample"
    job_command = ("sample", "send")
    job_task_flag = "--task"


def test_job_commands_and_task_flags_survive_registry_storage():
    declared = HelperTypeEntry.declared("sample.module", SendingSample)
    restored = HelperTypeEntry.restored(json.loads(json.dumps(asdict(declared))))
    assert restored == declared


def test_older_type_entries_have_no_job_action():
    stored = asdict(HelperTypeEntry.declared("sample.module", SampleType))
    del stored["job_command"]
    del stored["job_task_flag"]
    restored = HelperTypeEntry.restored(stored)
    assert restored.job_command == () and restored.job_task_flag == ""
