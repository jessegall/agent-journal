from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.helpers.support.job_costs import JobCosts
from core.modules.helpers.support.profile_job_costs import ProfileJobCosts


class HelperLifetimesSubcommand(ReadSubcommand[ProfileJobCosts]):
    """`journal helper lifetimes <profile> --environment <name>`: how many jobs of the profile began a new program
    session and how many resumed one, with the mean cost of a job of each, so a person can compare them."""

    cli_name = "helper"
    name = "lifetimes"
    environment_refusal = "the jobs of a profile are counted for one environment"

    def __init__(self, costs: JobCosts) -> None:
        self.costs = costs

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("profile")

    def read(self, arguments: Namespace, caller: Caller) -> ProfileJobCosts:
        return self.costs.profile_costs(arguments.profile)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ProfileJobCosts):
            output.write(f"{value.line(True)}\n{value.line(False)}", value.json())
