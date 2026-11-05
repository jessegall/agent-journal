from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.developer.commands.reset_hook_numbers.reset_hook_numbers import ResetHookNumbers
from core.modules.developer.support.hook_numbers_file import HookNumbersFile


class ResetHookNumbersHandler(Handler[ResetHookNumbers, None]):
    """Removes the file of the counts."""

    command = ResetHookNumbers

    def __init__(self, numbers: HookNumbersFile) -> None:
        self.numbers = numbers

    def handle(self, command: ResetHookNumbers, context: Context) -> None:
        self.numbers.reset()
