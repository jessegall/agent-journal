from typing import TypedDict


class QueueInspectorJson(TypedDict):
    """The queue inspector's controls, counts and command lists."""

    environment_id: int
    environment_name: str
    parallel_limit: int
    limit_setting: str
    suite_limits: list[dict[str, object]]
    count_main_runs: bool
    main_spots_setting: str
    used_slots: int
    waiting_count: int
    halted: bool
    halt_reason: str
    halt_reason: str
    running: list[dict[str, object]]
    waiting: list[dict[str, object]]
    recent: list[dict[str, object]]
    recent_total: int
