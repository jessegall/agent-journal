import re


# @sin architecture_layout_helper_in_a_kind_folder
# @sin architecture_core_second_class_in_a_file
class ShellLine:
    def __init__(self, source_line: str) -> None:
        # @righteous architecture_shell_whole_shell_line_read
        self._source_line = source_line

    def has_part_matching(self, pattern: str) -> bool:
        return True


# @sin architecture_layout_helper_in_a_kind_folder
# @sin architecture_core_second_class_in_a_file
class HookCall:
    summary: str = ""


# @sin architecture_layout_helper_in_a_kind_folder
# @sin architecture_core_second_class_in_a_file
class ChainRule:
    def answer(self, shell: ShellLine, call: HookCall):
        # @sin architecture_shell_whole_shell_line_read
        line_match = re.search("git", shell._source_line)
        shell_copy = shell
        # @sin architecture_shell_whole_shell_line_read
        copied_text = shell_copy._source_line
        # @sin architecture_shell_hook_call_summary_read_as_command
        summary = call.summary
        # @righteous architecture_shell_whole_shell_line_read
        part_match = shell.has_part_matching("git")
        return line_match, copied_text, summary, part_match
