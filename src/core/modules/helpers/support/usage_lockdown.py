from core.base.driver.lockdown import Lockdown
from core.base.driver.program_lockdown import ProgramLockdown
from core.base.system_log_writer import SystemLogWriter
from core.modules.helpers.support.program_states import ProgramStates
from engine.enums.log_level import LogLevel

STOP_LINE = "[journal] {program} is at your usage limit until {ends_at}. Everything is stopped until then{lift}."
LIFT_TEXT = "; a person can lift the limit with usage-limit delete {limit}"


class UsageLockdown(ProgramLockdown):
    """A program is locked down while its plan window is used up in full or a limit a person set on it is
    reached, until the later of the two ends. A fault while reading
    locks nothing down and is written to the system log, so a broken status file never stops every agent."""

    def __init__(self, states: ProgramStates, system_log: SystemLogWriter) -> None:
        self.states, self.system_log = states, system_log

    def lockdown(self, program: str) -> Lockdown:
        try:
            end = self.states.limit_end(program)
        except Exception as error:
            self.system_log.write(LogLevel.ERROR, f"the usage limit of {program} could not be read, so nothing is stopped: {type(error).__name__}: {error}")
            return Lockdown()
        if end is None:
            return Lockdown()
        lift = LIFT_TEXT.format(limit=end.limit_id) if end.limit_id is not None else ""
        return Lockdown(end.ends_at, STOP_LINE.format(program=program.capitalize(), ends_at=end.ends_at.value.astimezone().strftime("%H:%M on %d %b"), lift=lift))
