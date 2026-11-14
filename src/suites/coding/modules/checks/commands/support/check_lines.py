from suites.coding.modules.checks.models.check import Check

TAIL_CHARACTERS = 800


class CheckLines:
    """How a check reads in a command's answer, in the list and in what the agent is told."""

    @staticmethod
    def made(check: Check) -> str:
        return f"check {check.id}: {check.title}"

    @staticmethod
    def outcome_lines(check: Check) -> list[str]:
        head = f"check {check.id} {'passed' if check.last_passed else 'failed'}: {check.title}"
        return [head] if check.last_passed or not check.last_output else [head, check.last_output]

    @staticmethod
    def listed(check: Check) -> str:
        schedule = f"every {check.interval_minutes} min" if check.interval_minutes else "by hand"
        return f"{check.id:>4}  {check.status}  {check.title} ({schedule})"

    @staticmethod
    def report_text(check: Check) -> str:
        return f"check {check.id} failed: {check.title}\n{check.last_output[-TAIL_CHARACTERS:]}".strip()
