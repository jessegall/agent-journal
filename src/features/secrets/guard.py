from pathlib import Path

from engine.reach import Reach
from features.parts import AgentContext, ToolInterceptor
from engine.gates import Runs
from features.secrets.values import secrets_folder

NAMED = ("agent-journal/secrets", "agent-journal\\secrets")


class RefuseSecretsFile(ToolInterceptor):
    reach = Reach.BOTH
    runs = Runs.SYNC

    def intercept(self, context: AgentContext, call) -> str:
        folder = secrets_folder().resolve()
        here = Path(context.hook.cwd) if context.hook.cwd else Path.cwd()
        read = any((here / path).resolve().is_relative_to(folder) for path in call.paths)
        named = any(word in command for command in call.commands for word in (*NAMED, str(folder)))
        if not read and not named:
            return ""
        return "The secrets file is never read by an agent: use journal secret run <name> -- <command>, and ask the user for what is missing with journal secret request."
