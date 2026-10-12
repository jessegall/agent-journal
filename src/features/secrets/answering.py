from pathlib import Path

from controllers.secrets.values import secrets_folder
from events.answers import Allowed, Answer, Refused
from events.asking import ToolCallAsked
from receiving import Answerer

NAMED = ("agent-journal/secrets", "agent-journal\\secrets")
NEVER_READ = ("The secrets file is never read by an agent: use journal secret run <name> -- <command>, "
              "and ask the user for what is missing with journal secret request.")


class RefuseSecretsFile(Answerer[ToolCallAsked]):
    def answer(self, event: ToolCallAsked) -> Answer:
        folder = secrets_folder().resolve()
        here = Path(event.cwd) if event.cwd else Path.cwd()
        read = any((here / path).resolve().is_relative_to(folder) for path in event.paths)
        named = event.tool == "Bash" and any(word in event.input for word in (*NAMED, str(folder)))
        return Refused(NEVER_READ) if read or named else Allowed()
