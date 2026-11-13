class AssignRulesMode:
    """Whether a matching rule assigns its task or only records a dry run. It answers no until tasks are
    assigned only through the assignments (plan 1104, phase 8), so a rule never assigns half a task before
    then."""

    def assigns(self) -> bool:
        return False
