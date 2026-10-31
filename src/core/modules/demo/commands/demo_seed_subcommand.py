from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.actor_type import ActorType
from core.base.container import Container
from core.base.refusal import Refusal
from core.base.seed.demo import Demo
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.actors.queries.actor_query import ActorQuery
from core.modules.demo.commands.demo_report import DemoReport
from core.modules.demo.commands.demo_report_writing import DemoReportWriting
from core.modules.demo.support.demo_order import DemoOrder

PERSON_NAME = "Demo"


class DemoSeedSubcommand(DemoReportWriting, ReadSubcommand[DemoReport]):
    """`journal demo seed [--list]`: fills an empty journal with a demo, each module's seeder running in the
    order of what its module depends on; --list names the seeders and runs none."""

    cli_name = "demo"
    name = "seed"

    def __init__(self, order: DemoOrder, container: Container, actors: ActorQuery) -> None:
        self.order, self.container, self.actors = order, container, actors

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--list", action="store_true", dest="only_list")

    def read(self, arguments: Namespace, caller: Caller) -> DemoReport:
        seedings = self.order.seedings()
        if arguments.only_list:
            return DemoReport([seeding.module for seeding in seedings])
        if self.actors.filter(type=ActorType.USER, name=PERSON_NAME).exists():
            raise Refusal("this journal contains the demo already", "start a scratch journal with journal demo start")
        demo = Demo(self.container)
        for seeding in seedings:
            self.container.get(seeding.seeder).seed(demo)
        return DemoReport([*(seeding.module for seeding in seedings), f"seeded {len(seedings)} modules"])
