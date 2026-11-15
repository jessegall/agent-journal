from collections.abc import Sequence

from engine.agent_stack.open_block import OpenBlock
from engine.driver.part import Part
from engine.driver.tool import Tool

EXIT_COMMANDS = ("journal agent-block skip", "journal refusal skip", "journal refusal confirm", "journal refusal withdraw", "journal question ask",
                 "journal wait stuck", "journal permission ask")
MESSAGE_COMMAND = "journal message"
JOURNAL_PROGRAM = "journal"


class BlockExemptions:
    """What passes a block's tool scope (doc 1310 section 4.2 point 4). A skill read, and a line made only of
    the lifting commands of any open block of the agent, exit commands, reads and searches, pass every
    block, the command's arguments compared; a read, a search, or a line of reads, searches and journal
    commands with no file redirect passes a block that is not strict; while the agent is paused its message
    commands pass every block."""

    def __init__(self, blocks: Sequence[OpenBlock], is_paused: bool) -> None:
        allowed = [*(line for block in blocks for line in block.reason.lifting_lines), *EXIT_COMMANDS]
        if is_paused:
            allowed.append(MESSAGE_COMMAND)
        self.allowed_lines = allowed

    def passes(self, tool: Tool, block: OpenBlock) -> bool:
        return self.is_universally_exempt(tool) or (not block.is_strict and tool.block_exempt)

    def is_universally_exempt(self, tool: Tool) -> bool:
        if tool.is_skill_read:
            return True
        return tool.shell is not None and not tool.shell.has_file_redirect and tool.shell.has_only_parts(self.part_passes)

    def part_passes(self, part: Part) -> bool:
        if part.program != JOURNAL_PROGRAM:
            return part.classification.category.is_readonly
        return any(self.names(part, line) for line in self.allowed_lines)

    @staticmethod
    def names(part: Part, line: str) -> bool:
        tokens = line.split()[1:]
        return part.program == JOURNAL_PROGRAM and list(part.arguments[:len(tokens)]) == tokens
