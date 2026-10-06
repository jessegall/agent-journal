from features.base import Behaviour, FeatureDetails, Line
from features.settings import Setting
from features.trigger import MINUTES, Trigger
from features.groups import Group


class AgentSessionsDetails(FeatureDetails):
    explains = 'The journal tracks each agent session and its current work. You can open a session to see its activity and controls.'
    name = "agent_sessions"
    group = Group.SESSIONS
    label = "Track agent sessions"
    has_skill = False

    title = "Agent sessions"


    abstract = """
        Tracks every agent session. A session whose environment another one takes is paused, a
        session silent too long is marked stopped, and a silent subagent's to-dos are given back.
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
            title="Pause a session when another takes its environment",
            abstract="Its file changes wait until it takes the environment back",
        ),
        Behaviour(
            name="liveness",
            title="Mark a silent session stopped",
            trigger=Trigger(every=60, unit=MINUTES),
        ),
        Behaviour(
            name="subagents",
            title="Give a silent subagent's to-dos back",
        ),
    ]

    settings = [
        Setting(
            name="quiet",
            default=60,
            title="After it has been silent for",
            under="liveness",
            unit="minutes",
        ),
        Setting(
            name="lapse",
            default=20,
            title="After it has been silent for",
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
