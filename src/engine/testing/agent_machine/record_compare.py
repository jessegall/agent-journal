from dataclasses import fields

from engine.agent_machine.decision_record import DecisionRecord

EXCLUDED_FIELDS = ("identity", "basis", "inputs", "printing")


class RecordCompare:
    """The shadow's compare of two decision records of one event: each field that decides what the agent sees
    or what runs, named where the two differ; who asked, the basis read and the inputs kept are not
    compared."""

    @staticmethod
    def differences(old: DecisionRecord, new: DecisionRecord) -> list[str]:
        checked_fields = [field.name for field in fields(DecisionRecord) if field.name not in EXCLUDED_FIELDS]
        return [f"{name}: {getattr(old, name)!r} against {getattr(new, name)!r}" for name in checked_fields if getattr(old, name) != getattr(new, name)]
