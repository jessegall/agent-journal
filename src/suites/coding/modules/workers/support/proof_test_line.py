import shlex

from core.base.driver.command_category import CommandCategory
from core.base.refusal import Refusal
from core.modules.aliases.models.alias import ARGS_MARK
from core.modules.aliases.queries.alias_query import AliasQuery

JOURNAL_PROGRAM = "journal"
TEST_FILE_ENDINGS = (".py", ".js", ".mjs", ".ts", ".go")


class ProofTestLine:
    """Refuses a proof's test unless it is a saved test command naming the test files, so a worker cannot run a test
    command of its own or the whole suite through a proof."""

    def __init__(self, aliases: AliasQuery) -> None:
        self.aliases = aliases

    def check(self, line: str) -> None:
        if not line:
            return
        tokens = shlex.split(line)
        if not self.is_saved(line, tokens):
            raise Refusal("a proof's test must be a saved test command", "journal alias list --category 'test run' lists them; ask the main agent to add one")
        if not any("::" in token or token.split("::")[0].endswith(TEST_FILE_ENDINGS) for token in tokens):
            raise Refusal("a proof's test must name its test files, never the whole suite", "name each test file the proof covers")

    def is_saved(self, line: str, tokens: list[str]) -> bool:
        saved = [alias for alias in self.aliases.all_rows() if alias.category is CommandCategory.TEST_RUN]
        if len(tokens) > 1 and tokens[0] == JOURNAL_PROGRAM and tokens[1] in {alias.name for alias in saved}:
            return True
        return any(line.startswith(alias.line.replace(ARGS_MARK, "").strip()) for alias in saved)
