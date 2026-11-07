from typing import TypedDict


class TaskInspectionJsonRecord(TypedDict):
    """The JSON form of TaskInspection.json."""

    id: object
    title: object
    brief: object
    state: object
    priority: object
    complexity: object
    tags: object
    reason: object
    outcome: object
    holder_id: object
    helper_id: object
    helper_name: object
    created_at: object
    updated_at: object
    openers: object
    waits: object
    logs: object
    block_renewals: object
