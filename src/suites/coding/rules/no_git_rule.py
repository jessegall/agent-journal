from core.modules.drivers.rules.denied_programs_rule import DeniedProgramsRule
from suites.coding.nudges.git_restriction_nudge import GitRestrictionNudge


class NoGitRule(DeniedProgramsRule):
    """Refuses git commands anywhere in a shell line."""

    name = "drivers.no-git"
    denied_programs = ["git"]
    refusal = GitRestrictionNudge.declared()
