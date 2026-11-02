from typing import TypedDict


class TaskInspectionJsonRecord(TypedDict):
    """The JSON form of TaskInspection.json."""

    id: object
    title: object
    brief: object
    state: object
    priority: object
    reason: object
    outcome: object
    holder_id: object
    created_at: object
    updated_at: object
    openers: object
    waits: object
    logs: object
