from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.secret_allowed import SecretAllowed


class SecretsConduct(Conduct):
    """The secrets feature's conduct in every state: no tool of the agent's touches the secrets folder or the MCP keys, by any spelling that resolves there, and the agent is told what a secret may now go to when the user lets it."""

    def on_tool_starting_secrets(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.secrets.feature import Secrets
        return self.hold(Secrets.SECRETS_OUT_OF_REACH.create()) if event.snapshot.of(Secrets).reaches(event.call.input) else self.unchanged()

    def on_secret_allowed_secrets(self, event: SecretAllowed, settings: Settings) -> Transition:
        from journal.features.secrets.feature import Secrets
        return self.unchanged(Secrets.SECRET_ALLOWED_FOR_PROGRAMS.create(n=event.secret_id, title=event.title, programs=", ".join(event.programs)))
