from features.base import Behaviour, FeatureDetails, Line
from features.settings import Setting
from features.trigger import MINUTES, Trigger
from features.groups import Group


class AgentSessionsDetails(FeatureDetails):
    name = "agent_sessions"
    group = Group.SESSIONS
    label = "Track agent sessions"
    has_skill = False

    title = "Agent sessions"


    abstract = """
        Every agent session is tracked: one pushed out of its environment has its writes held, one
        silent too long is marked stopped, and a subagent's assigned rows come back when it goes silent
    """

    help = """
        When another session claims your environment, your writes are held and you are told its reason. A row still
        saying working or idle with no word from it for agents.quiet minutes is marked stopped,
        because a session that ended without its last hook would say working for ever.

        A subagent is lent an environment (journal environment grant <n>) and names itself with
        --agent on every command; its rows carry that mark in the same record. agents.lapse is
        how long it may go silent before an assignment clears.
    """

    aliases = (("sessions", "eviction"), "agents")

    behaviours = [
        Behaviour(
            name="eviction",
            title="Pause a session pushed out of its environment",
            abstract="Its writes wait until it claims the environment back",
        ),
        Behaviour(
            name="liveness",
            title="Mark silent sessions stopped",
            trigger=Trigger(every=60, unit=MINUTES),
        ),
        Behaviour(
            name="subagents",
            title="Release a silent subagent's rows",
        ),
    ]

    settings = [
        Setting(
            name="quiet",
            default=60,
            title="Silent for",
            under="liveness",
            unit="minutes",
        ),
        Setting(
            name="lapse",
            default=20,
            title="Silent for",
            under="subagents",
            unit="minutes",
        ),
        Setting(
            name="recent",
            default=60,
            title="List sessions active in the last",
            unit="minutes",
        ),
    ]

    lines = [
        Line(
            name="stop",
            title="the user asked to stop {{description}}",
            brief="{{how}}; then carry on with the work",
        ),
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
