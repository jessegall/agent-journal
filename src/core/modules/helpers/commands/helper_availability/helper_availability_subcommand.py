from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.helpers.support.helper_availability import HelperAvailability
from core.modules.helpers.support.helper_start_state import HelperStartState


class HelperAvailabilitySubcommand(ReadSubcommand[HelperStartState]):
    """`journal helper availability`: whether a person can start a helper here, why not, and on which programs."""

    cli_name = "helper"
    name = "availability"

    def __init__(self, availability: HelperAvailability) -> None:
        self.availability = availability

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--profile", default=None)
        parser.add_argument("--program", default="")

    def read(self, arguments: Namespace, caller: Caller) -> HelperStartState:
        return self.availability.state(caller, arguments.profile, arguments.program)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, HelperStartState):
            output.write(value.reason or "a helper can start here", {"can_start": not value.reason, "reason": value.reason, "programs": list(value.programs),
                         "idle_helpers": [{"id": helper.id, "number": helper.number, "name": helper.given_name or f"Helper {helper.number}"} for helper in value.idle_helpers],
                         "can_start_fresh": value.can_start_new, "fresh_reason": value.new_reason})
