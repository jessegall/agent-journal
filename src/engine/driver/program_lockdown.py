from engine.driver.lockdown import Lockdown


class ProgramLockdown:
    """Answers whether an agent program is locked down at a usage limit. This one never locks down; the module
    that reads the usage limits replaces it."""

    def lockdown(self, program: str) -> Lockdown:
        return Lockdown()
