class EssentialAllowances:
    """Whether the user allowed a rule its module marks essential to be asked as one; with no module keeping
    allowances, none is."""

    def allowed(self, rule: str) -> bool:
        return False
