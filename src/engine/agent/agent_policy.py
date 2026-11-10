from dataclasses import dataclass


@dataclass(frozen=True)
class AgentPolicy:
    """The roles a suite assigns to each type of core behavior."""

    job_roles: tuple[str, ...] = ()
    active_task_unblocked_roles: tuple[str, ...] = ()
    task_roles: tuple[str, ...] = tuple(["main"])
    prompt_roles: tuple[str, ...] = tuple(["main"])
    mark_roles: tuple[str, ...] = tuple(["main"])
    plugin_roles: tuple[str, ...] = tuple(["main"])
    dispatch_roles: tuple[str, ...] = tuple(["main"])
    stop_required_roles: tuple[str, ...] = tuple(["main"])
    private_output_roles: tuple[str, ...] = ()
    reader_request_roles: tuple[str, ...] = ()
    queued_run_roles: tuple[str, ...] = ()
    automatic_watch_roles: tuple[str, ...] = ()
    continuing_run_roles: tuple[str, ...] = ()
    project_skill_roles: tuple[str, ...] = ()
    pause_retention_roles: tuple[str, ...] = ()
    restricted_alias_roles: tuple[str, ...] = ()
    saved_command_roles: tuple[str, ...] = ()
    queue_limit_settings: tuple[str, ...] = ()
