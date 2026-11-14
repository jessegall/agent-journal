from core.modules.drivers.models.hook_call import HookCall


def is_journal_prompt(prompt: HookCall) -> bool:
    # @righteous architecture_shell_hook_call_summary_read_as_command
    return prompt.summary.startswith("[journal] ")
