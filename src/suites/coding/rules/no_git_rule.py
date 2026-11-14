from core.modules.drivers.rules.denied_programs_rule import DeniedProgramsRule
from suites.coding.support.coding_nudges import GIT_RESTRICTION


class NoGitRule(DeniedProgramsRule):
    """Refuses git commands anywhere in a shell line."""

    name = "drivers.no-git"
    denied_programs = ["git"]
    refusal = GIT_RESTRICTION
