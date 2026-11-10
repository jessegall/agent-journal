from engine.command.script_policy import ScriptPolicy
from engine.container.container import Container
from engine.listener.commit_listener_runner import CommitListenerRunner
from server.work.round_work import RoundWork


class PluginListenerWork(RoundWork):
    """Runs plugin deliveries separately from the journal's listeners."""

    def run(self, container: Container) -> None:
        container.bind(ScriptPolicy, ScriptPolicy(guards_run=False, commit_limit_ms=None))
        container.get(CommitListenerRunner).run_plugin_deliveries()
