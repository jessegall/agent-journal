import re


# @sin architecture_layout_KindFoldersHoldTheirKindDetector
# @sin architecture_core_OneClassPerFileDetector
class ShellLine:
    def __init__(self, source_line: str) -> None:
        # @righteous architecture_shell_NoWholeLineCheckDetector
        self._source_line = source_line

    def has_part_matching(self, pattern: str) -> bool:
        return True


# @sin architecture_layout_KindFoldersHoldTheirKindDetector
# @sin architecture_core_OneClassPerFileDetector
class HookCall:
    summary: str = ""


# @sin architecture_layout_KindFoldersHoldTheirKindDetector
# @sin architecture_core_OneClassPerFileDetector
class ChainRule:
    def answer(self, shell: ShellLine, call: HookCall):
        # @sin architecture_shell_NoWholeLineCheckDetector
        line_match = re.search("git", shell._source_line)
        shell_copy = shell
        # @sin architecture_shell_NoWholeLineCheckDetector
        copied_text = shell_copy._source_line
        # @sin architecture_shell_NoHookCallSummaryCheckDetector
        summary = call.summary
        # @righteous architecture_shell_NoWholeLineCheckDetector
        part_match = shell.has_part_matching("git")
        return line_match, copied_text, summary, part_match
