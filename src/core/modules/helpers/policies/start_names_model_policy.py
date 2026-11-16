from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from core.modules.helpers.agent_messages.start_model_missing_message import StartModelMissingMessage

MODEL_FLAG = "--model"


class StartNamesModelPolicy(EventPolicy):
    """An agent's helper start names its model, an exact one or default for the profile's own, so the model is
    always chosen (message 117983). A suite with starts of its own declares them on a rule of this class."""

    key = "helpers.start-names-model"
    rank = "helpers.policies"

    starts: tuple[str, ...] = ("helper start",)

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        shell = event.tool.shell if event.tool is not None else None
        if shell is None:
            return None
        starts = [part for start in self.starts for part in shell.parts_running_journal_command(start)]
        starts_without_model = [part for part in starts if not any(argument.split("=")[0] == MODEL_FLAG for argument in part.arguments)]
        return StartModelMissingMessage.declared().agent_message() if starts_without_model else None

