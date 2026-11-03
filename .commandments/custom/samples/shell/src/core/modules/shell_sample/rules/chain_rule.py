import re


# @sin architecture_layout_KindFoldersHoldTheirKindDetector
class ChainRule:
    def answer(self, tool, call):
        # @sin architecture_shell_NoWholeLineCheckDetector
        line_match = re.search("git", tool.shell.line)
        # @sin architecture_shell_NoHookCallSummaryCheckDetector
        summary = call.summary
        # @righteous architecture_shell_NoWholeLineCheckDetector
        part_match = tool.shell.part_matches("git")
        # @righteous architecture_shell_NoWholeLineCheckDetector
        has_command = tool.shell.runs("journal overview")
        # @righteous architecture_shell_NoWholeLineCheckDetector
        part_texts = [part.text for part in tool.shell.parts]
        return line_match, summary, part_match, has_command, part_texts
