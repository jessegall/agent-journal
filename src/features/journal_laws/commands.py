from framework.parts import Command, Context
from providers import PROVIDERS
from resources.base import Refused


class Keep(Command):
    name = "keep"

    def run(self, context: Context, outputs, path: str, command_line: str = "", provider: str | None = None, session_id: str | None = None, shown: int = 0):
        if provider is not None and provider not in PROVIDERS:
            raise Refused(f"no such provider: {provider}")
        unwrapped = PROVIDERS[provider]().unwrapped_command(command_line) if provider is not None else command_line
        return outputs.store(path, unwrapped, session_id, shown)
