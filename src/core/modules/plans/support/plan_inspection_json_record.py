from typing import TypedDict


class PlanInspectionJsonRecord(TypedDict):
    """The JSON form of PlanInspection.json."""

    id: object
    title: object
    brief: object
    state: object
    reason: object
    total: object
    finished: object
    current_phase: object
    document_id: object
    assignee: object
    delegated: object
    agents: object
    phases: object
