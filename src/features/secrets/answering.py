from resources.runs import SHELL
from events.answers import Allowed, Answer, Refused
from events.asking import ToolCallAsked
from receiving import Answerer
from resources.secrets import Secret
from serving import ReadRows

NEVER_READ = ("The secrets file is never read by an agent: use journal secret run <name> -- <command>, "
              "and ask the user for what is missing with journal secret request.")


class RefuseSecretsFile(Answerer[ToolCallAsked]):
    def answer(self, event: ToolCallAsked, secrets: ReadRows[Secret]) -> Answer:
        command = event.input if event.tool == SHELL else ""
        return Refused(NEVER_READ) if secrets.keeps_out(event.cwd, event.paths, command) else Allowed()
