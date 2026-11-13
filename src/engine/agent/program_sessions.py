from engine.time.timestamp import Timestamp


class ProgramSessions:
    """The running sessions of an agent program, answered by the module that knows the agent rows; here none run."""

    def has_prior_session(self, program: str, point: Timestamp) -> bool:
        return False
