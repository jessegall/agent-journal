from features.base import FeatureDetails
from features.groups import Group
from resources.base import PROJECT


class MachinesDetails(FeatureDetails):
    explains = "More than one machine can write this journal, such as a server and your laptop. Each environment is written by one machine at a time."
    name = "machines"
    group = Group.SHARING
    label = "Let more than one machine write this journal"
    has_skill = False
    default = False
    scope = PROJECT

    title = "Machines"

    abstract = "A journal written from more than one machine, where each environment has one machine that writes it"

    help = """
        Off, the journal is written from this machine alone and works as it always has. On, a change pressed on a
        row someone else changed since you saw it is refused, so two people pressing the same thing never overwrite
        each other. Whichever way it is set, each environment is written by the one machine that holds it: a machine
        that handed an environment over and comes back later is refused, and a change it makes to an environment it
        does not hold is sent to the machine that does.
    """
