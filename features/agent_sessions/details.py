from features.base import Behaviour, FeatureDetails, Line
from features.settings import Setting
from features.trigger import MINUTES, Trigger


class AgentsDetails(FeatureDetails):
    name = "agent_sessions"

    title = "Agent sessions"

    abstract = """
        Every agent session is kept honest: one evicted from its environment is held, one gone
        quiet is marked stopped, and a subagent's rows are minded and handed back
    """

    help = """
        Another session claimed the environment with a reason; the hold names it. A row still
        saying working or idle with no word from it for agents.quiet minutes is marked stopped,
        because a session that ended without its last hook would say working for ever.

        A subagent is lent an environment (journal environment <n> grant) and names itself with
        --agent on every command; its rows carry that mark in the same record. agents.lapse is
        how long it may go silent before an assignment clears.
    """

    aliases = (("sessions", "eviction"), "agents")

    behaviours = [
        Behaviour(
            name="eviction",
            title="Hold a session whose environment was claimed",
            abstract="Its writes wait until it switches or claims the environment back",
        ),
        Behaviour(
            name="liveness",
            title="Mark a silent session stopped",
            abstract="Checked every hour",
            trigger=Trigger(every=60, unit=MINUTES),
        ),
        Behaviour(
            name="subagents",
            title="Mind a subagent's rows",
            abstract="Its writes keep it alive; a report is handed to the dispatcher; silence gives its rows back",
        ),
    ]

    settings = [
        Setting(
            name="quiet",
            default=60,
            title="Mark a session stopped after",
            abstract="A session that says working or idle but has not been heard from this long",
            unit="minutes",
        ),
        Setting(
            name="lapse",
            default=20,
            title="Give a subagent's rows back after",
            abstract="A silent subagent's assignment clears after this long",
            unit="minutes",
        ),
        Setting(
            name="recent",
            default=60,
            title="List sessions active in the last",
            abstract="How far back the agent bar lists sessions",
            unit="minutes",
        ),
    ]

    lines = [
        Line(
            name="reported",
            title="agent {{who}} reports todo {{n}} done",
            brief="{{how}} — journal todo done {{n}} is yours",
        ),
        Line(
            name="lapsed",
            title="agent {{who}} went silent — todo {{n}} is back on the list",
            brief="no write from it for {{minutes}} minutes",
        ),
        Line(
            name="evicted",
            title="environment {{environment}} was claimed by session {{by}} ({{why}}): switch to another, or claim it back",
        ),
    ]
