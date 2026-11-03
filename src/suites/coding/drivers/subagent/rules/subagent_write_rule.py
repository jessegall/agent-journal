from suites.coding.support.coding_nudges import SUBAGENT_EDIT_BAN
from core.modules.drivers.rules.readonly_rule import ReadonlyRule


class SubagentWriteRule(ReadonlyRule):
    """A subagent reads and searches only: an edit, a write or a shell line that writes files is refused,
    under every overlay; journal commands go through, so it can search and file tasks and plans."""

    name = "coding.subagent-reads-only"
    refusal = SUBAGENT_EDIT_BAN
