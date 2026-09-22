from features.base import FeatureDetails, Line


class PluginsDetails(FeatureDetails):
    name = "plugins"

    title = "Plugins"


    abstract = "A repository installed into the journal hears the bus, answers it, and may run services of its own"

    help = """
        The servers a plugin declares are kept up while the session runs and die with it; one
        that gives up is said once over the chat, and journal services
        list|start|stop|restart|log <plugin>.<service> inspects them.

        Install one with journal plugin install <url>: its .journal-plugin/plugin.json says what
        it listens to, what it runs and which pages it shows. A plugin runs as you; install
        shows every command before it runs any. It writes back by calling the journal itself,
        or by appending journal commands to the file at $JOURNAL_QUEUE, one per line, which the
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
