from dataclasses import dataclass

from core.base.access import Access
from core.base.agent_roster import AgentRoster


@dataclass(frozen=True)
class HelperType:
    """A kind of helper a module or a suite registers, with its file access and how it starts and holds work. Every
    agent outside the main agents is a helper of one of these kinds; whether it reads or writes is the kind's access."""

    key: str
    label: str
    extends: str = ""
    access: Access = Access.READ
    separate_folder: bool = False
    default_profile: str = ""
    start_line: str = ""
    roster: type[AgentRoster] | None = None
    run_limit_key: str = ""
    kept_limit_key: str = ""
    profile_limits_key: str = ""
    job_command: tuple[str, ...] = ()
    job_task_flag: str = ""
