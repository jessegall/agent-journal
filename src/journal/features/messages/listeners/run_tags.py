from journal.console.console import Console
from journal.support.where import Where
from journal.events.agent.turn_written import TurnWritten
from journal.events.agent_listener import AgentListener
from journal.features.messages.support.tags import Tags
from journal.repositories.environments import Environments
from journal.supervisor_link import SupervisorLink

RUNS = {
    "todo": ("task", "create", "{name}", "--brief", "{text}"),
    "log": ("task", "log", "{n}", "{text}"),
    "end": ("task", "done", "{n}", "--how", "{text}"),
    "fact": ("fact", "create", "{name}", "--reason", "{text}"),
    "rule": ("rule", "create", "{name}", "--reason", "{text}"),
    "reminder": ("reminder", "create", "{name}", "--reason", "{text}"),
}


class RunTags(AgentListener[TurnWritten]):
    """A tag opening a line of the turn runs the command it stands for, with the turn's words as its text: [!todo="the title"] files a task with the turn as its brief, [!log:N] makes the turn the log line, [!end:N] what landed, [!fact="the claim"] the fact's reason. A refusal is typed back; the reply tag belongs to the recorder."""

    def __init__(self, console: Console, environments: Environments, supervisor: SupervisorLink) -> None:
        self.console, self.environments, self.supervisor = console, environments, supervisor

    def handle(self, event: TurnWritten) -> None:
        if not event.final:
            return
        text = Tags.visible(event.text)
        where = Where(self.environments.find(event.environment_id).name, event.session)
        for name, numbers, argument in Tags.carried(event.text):
            if name not in RUNS:
                continue
            argv = [word.format(name=argument, n=numbers, text=text) for word in RUNS[name]]
            outcome = self.console.run(argv, where)
            if outcome.code:
                self.supervisor.type(event.environment_id, f"the [!{name}] tag did not run: {(outcome.err or outcome.out).strip().splitlines()[-1]}")
