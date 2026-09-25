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
        inspects them. The servers a plugin declares are kept up while the session runs and stop with it; an upgrade removes
        each one and starts it again from the new code. A service keeps what it writes in $JOURNAL_PLUGIN_DATA, which
        outlives upgrades, never in the plugin's own folder or the project. A plugin writes back
        by calling the journal itself, or by appending journal commands to the file at $JOURNAL_QUEUE, one per line, which the
        host drains a few at a time. Answering an event, that file belongs to the event's environment and its commands run
        there; a line that names --env is refused. journal plugin raise <plugin> <event> "<brief>" in that file raises one of the events its
        manifest declares, with the same card and activity item as an answer that raises it. An event is declared as
        "events": {"<name>": {"title": "...", "tone": "...", "card": {"label", "icon", "color", "collapsed"}}}: the card
        shows it in the chat, and "collapsed": true makes its item in the activity list start folded to its title, opening
        on a click. A raise can name one of its dashboard pages, --open <dashboard>/<page> or "open" in an answer's raise,
        and clicking its card in the chat opens that page in a side panel.

        A plugin shows its output as a dashboard: "dashboards": [{"name": "<id>", "title": "<Title>"}] in its manifest, and a
        JSON file it writes to $JOURNAL_PLUGIN_DATA/dashboards/<id>.json whenever its output changes. The viewer lists each
        dashboard as a button on the Plugins page and opens it in a large panel, drawn from the file:
        {"title": "...", "start": "<page id>", "pages": {"<page id>": {"title": "...", "view": <node>}}}. A node is
        {"type": ..., props, "children": [nodes]}: stack (gap), row (gap, wrap), grid (columns, gap) and card (title, note,
        open) hold children; heading (text, level), divider, stat (label, value, note, tone, open), bars (title, unit, items of
        label, value, note, tone, open), table (columns, rows of cells, tone, open), list (items of label, note, badge, tone,
        open), text (body, with the chat's formatting), fact (label, body: a small heading with its text below, for
        explanations such as what it is and how to fix it), badge (text, tone), code (text, language) and file (path, line, label)
        draw. tone is note, good, warn, danger or muted; open names another page of the same dashboard, and the panel keeps a
        trail back. A file that does not fit is shown with the place that is wrong, such as pages.overview.view.children[1].
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
