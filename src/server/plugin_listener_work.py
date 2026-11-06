from core.base.command.script_policy import ScriptPolicy
from core.base.container import Container
from core.base.listener.commit_listener_runner import CommitListenerRunner
from server.round_work import RoundWork


class PluginListenerWork(RoundWork):
    """The round of plugin deliveries in a running server, on a thread of their own, since a commit script has no time
    limit and must not hold up the journal's own listeners."""

    def run(self, container: Container) -> None:
        container.bind(ScriptPolicy, ScriptPolicy(guards_run=False, commit_limit_ms=None))
        container.get(CommitListenerRunner).run_plugin_deliveries()
