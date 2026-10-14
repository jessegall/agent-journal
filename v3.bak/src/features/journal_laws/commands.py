from framework.parts import Command, Context
from serving import SERVED, Providers
from resources.base import Refused


class Keep(Command):
    name = "keep"

    def run(self, context: Context, outputs, path: str, command_line: str = "", provider: str | None = None, session_id: str | None = None, shown: int = 0):
        providers = SERVED.given(Providers)
        if provider is not None and not providers.knows(provider):
            raise Refused(f"no such provider: {provider}")
        unwrapped = providers.of(provider).unwrapped_command(command_line) if provider is not None else command_line
        return outputs.store(path, unwrapped, session_id, shown)
