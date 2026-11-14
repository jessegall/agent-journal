from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_sample import HookSample
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart


def journal_hook_line(*arguments: str) -> HookSample:
    return HookSamples.shell("journal " + " ".join(arguments), ShellPart("journal", CommandCategory.JOURNAL, list(arguments), subcommand=arguments[0])).with_fields(event="pre_tool_use")
