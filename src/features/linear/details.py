from features.base import Line
from features.integrations.details import IntegrationDetails
from features.settings import Setting
from features.trigger import MINUTES, Trigger
from resources.base import PROJECT

REFUSED, UNREACHABLE = "refused", "unreachable"


class LinearDetails(IntegrationDetails):
    explains = "The journal reads your Linear issues into tickets. It is off until you switch it on and pick the key it signs in with."
    name = "linear"
    label = "Use Linear"
    hint = "Reads your Linear issues, once you pick a key"
    position = 10

    title = "Linear"

    abstract = "Your Linear issues, read into tickets by the journal; the key stays in your secrets"

    help = """
        Linear is off until you switch it on under Integrations and pick the key to sign in with, a personal Linear
        API key kept in your secrets. The journal sends the key only to api.linear.app, from its own process, and never
        shows it to an agent: only you pick it.
    """

    trigger = Trigger(every=5, unit=MINUTES)
    trigger_label = "Check Linear"

    settings = [
        *IntegrationDetails.settings,
        Setting(name="board", default=0, title="Board", abstract="The board your Linear issues land on, as tickets", scope=PROJECT),
        Setting(name="teams", default="", title="Which issues", abstract="The Linear teams whose issues assigned to you come in; none picked means every team", scope=PROJECT),
        Setting(name="stage_states", default={}, title="Stage states", abstract="For each stage of the board, the Linear state an issue is set to when a ticket moves there", scope=PROJECT),
        Setting(name="send_status", default=False, title="Send status changes to Linear", abstract="A ticket that moves to a mapped stage moves its issue to that state", scope=PROJECT, needs="stage_states"),
    ]

    lines = [
        Line(name=REFUSED, title="Linear refused the key", brief="Pick a working key for Linear under Integrations, in the viewer"),
        Line(name=UNREACHABLE, title="Linear could not be reached", brief="The journal tries again in five minutes; the card under Integrations says why"),
    ]
