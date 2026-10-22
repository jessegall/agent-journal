from journal.support.rejection import Rejection
from journal.sync.team_refusal import TeamRefusal


class TeamRequests:
    """A request to the team server made for a person, its refusal or a network fault turned into a refusal they read."""

    @staticmethod
    def reached(request):
        try:
            return request()
        except TeamRefusal as refused:
            raise Rejection(f"the team server refused: {refused}") from refused
        except OSError as fault:
            raise Rejection(f"the team server could not be reached: {fault}") from fault
