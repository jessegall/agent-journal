from declaring.details import FeatureDetails, Line
from declaring.groups import Group
from declaring.settings import Setting

NAME = "heavy_runs"
WAITING = "waiting"
WENT_AHEAD = "went_ahead"


class HeavyRunsDetails(FeatureDetails):
    explains = "A test run, an import or a benchmark is heavy enough that two at once make both of them slower and neither of them trustworthy. The journal keeps the queue so nobody has to."
    name = NAME
    group = Group.LONG_COMMANDS
    label = "Heavy runs"
    position = 9
    has_skill = False

    title = "Heavy runs, one at a time"

    abstract = """
        One queue of heavy runs for the whole project: a test run waits for the one before it
        rather than racing it, and says where it stands
    """

    help = """
        A test run, a browser scenario or a check takes the machine for as long as it lasts, so two
        at once take longer than one after the other and neither time can be trusted. The journal
        keeps one queue of them for the project. An agent that asks to start one while another is
        going is told which run it waits behind and where it stands, and the place is on the ticket
        too, so a ticket that looks stuck explains itself.

        The queue holds what is running and what waits, each entry naming the environment it was
        asked for and the command it will run. A run leaves the queue when its command ends, and a
        run whose agent is gone leaves it after heavy_runs.forgotten_after minutes, so a queue is
        never held by something nobody is waiting for.
    """

    settings = [
        Setting(
            name="forgotten_after",
            default=20,
            title="Forget a run after",
            abstract="Minutes before a run nobody is waiting on is dropped from the queue, so a crashed agent never holds it.",
        ),
    ]

    lines = [
        Line(
            name=WAITING,
            title="{{command}} waits for the run before it",
            brief="{{ahead}} is running in {{where}}; this is {{place}} in the queue. It starts when that one ends, and the journal tells you; nothing of yours is lost by waiting.",
        ),
        Line(
            name=WENT_AHEAD,
            title="the queue is clear, so {{command}} may run now",
            brief="Nothing heavy is running in this project any more: the run you were holding is yours to start.",
        ),
    ]
