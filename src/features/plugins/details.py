from features.base import FeatureDetails, Line


class PluginsDetails(FeatureDetails):
    name = "plugins"
    when = "a plugin is installed, upgraded, configured or answers"

    title = "Plugins"


    abstract = "A repository installed into the journal hears the bus, answers it, and may run services of its own"

    help = """
        Install a plugin with journal plugin install <url>, upgrade it with journal plugin upgrade <n>, and change a setting with
        journal plugin configure <n> <key> --value <value>. Install shows every command before it runs any, because a plugin
        runs as you. Its .journal-plugin/plugin.json says what it listens to, what it runs, which pages it shows and which
        events it raises.

        Some events can be cancelled before they happen, such as agent.dispatching, raised when a subagent is about to be
        dispatched. A plugin cancels one through "cancels": {"agent.dispatching": "<command>"} in its manifest: the command
        reads the event as JSON and answers {"cancel": "<reason>"} to stop it, and the reason is what the agent is told.

        When one of its servers gives up, you are told once; journal services list|start|stop|restart|log <plugin>.<service>
        inspects them. The servers a plugin declares are kept up while the session runs and stop with it. A plugin writes back
        by calling the journal itself, or by appending journal commands to the file at $JOURNAL_QUEUE, one per line, which the
        host drains a few at a time.
    """

    fixed = True

    lines = [
        Line(
            name="plugin",
            title="{{title}}",
            brief="{{brief}}",
        ),
        Line(
            name="installed",
            title="Plugin {{name}} installed",
            brief="From {{source}}{{commit}}.",
        ),
        Line(
            name="failing",
            title="Plugin {{name}} is failing",
            brief="{{why}}\nIts log is {{log}}.",
        ),
        Line(
            name="stopped",
            title="Service {{name}} is not running",
            brief="{{why}}\nIts log is {{log}}.",
        ),
    ]
