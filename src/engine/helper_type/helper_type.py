from typing import ClassVar

from engine.agent.agent_roster import AgentRoster
from engine.enums.access import Access
from engine.helper_type.helper_behaviours import HelperBehaviours


class HelperType:
    """A kind of helper a module or a suite registers, as a class with plain fields: its file access and how it
    starts and holds work. A subclass extends its base and takes every field it does not set from it. Every agent
    outside the main agents is a helper of one of these kinds; whether it reads or writes is the kind's access."""

    key: ClassVar[str]
    label: ClassVar[str]
    access: ClassVar[Access] = Access.READ
    separate_folder: ClassVar[bool] = False
    default_profile: ClassVar[str] = ""
    start_line: ClassVar[str] = ""
    roster: ClassVar[type[AgentRoster] | None] = None
    run_limit_key: ClassVar[str] = ""
    kept_limit_key: ClassVar[str] = ""
    profile_limits_key: ClassVar[str] = ""
    job_command: ClassVar[tuple[str, ...]] = ()
    job_task_flag: ClassVar[str] = ""
    line: ClassVar[str] = ""
    behaviours: ClassVar[HelperBehaviours]

    @classmethod
    def bases(cls) -> tuple[str, ...]:
        return tuple(base.key for base in cls.__mro__[1:] if issubclass(base, HelperType) and "key" in vars(base))

    @classmethod
    def declares(cls, field: str) -> bool:
        return any(field in vars(base) for base in cls.__mro__)
