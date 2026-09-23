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

        Its "refuse" command is asked about every write, and every read too with "reads": true. A process started for each
        tool call is slow, so "refuse_socket": "<service>" names one of its services that answers instead: the service listens
        on the Unix socket at $JOURNAL_PLUGIN_SOCKET, reads one JSON line and writes its answer, and the command runs only
        when nothing listens there.

        "load": {"<event>": ["<skill>", ...]} names the skills the agent must load when one of the plugin's own events, a
        journal event or a hook.<event> happens: the agent's tool calls wait until they are loaded, as for the journal's own
        skills. A skill the plugin ships can carry "keywords: <word>, <word>" in its SKILL.md front matter, and the agent is
        asked to load it when one of those words comes up.

        When one of its servers gives up, you are told once; journal services list|start|stop|restart|log <plugin>.<service>
        inspects them. The servers a plugin declares are kept up while the session runs and stop with it. A plugin writes back
        by calling the journal itself, or by appending journal commands to the file at $JOURNAL_QUEUE, one per line, which the
        host drains a few at a time. journal plugin raise <plugin> <event> "<brief>" in that file raises one of the events its
        manifest declares, with the same card and activity item as an answer that raises it.
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
