from engine.agent_machine.compiling.contribution_declaration import ContributionDeclaration
from engine.agent_machine.compiling.module_contributions import ModuleContributions
from engine.agent_machine.compiling.driver_compiler import DriverCompiler
from engine.agent_machine.compiling.driver_declaration import DriverDeclaration
from engine.agent_machine.needs.rank_order import RankOrder
from engine.enums.contribution_type import ContributionType
from engine.enums.responder import Responder
from engine.enums.work_stop import WorkStop

ORDER = RankOrder(("safety.all", "messages.show"), ("overview.first", "messages.unread"))
MAIN = DriverDeclaration("core.main", "main", "core", (), ORDER, WorkStop.REFUSE_WHILE_WORK_REMAINS, Responder.PERSON)
CODING_MAIN = DriverDeclaration("coding.main", "coding-main", "coding", ("core.main",), ORDER, WorkStop.REFUSE_WHILE_WORK_REMAINS, Responder.PERSON)
WORKER = DriverDeclaration("coding.worker", "worker", "coding", (), ORDER, WorkStop.REFUSE_WHILE_WORK_REMAINS, Responder.PARENT)


def need(key: str, rank: str, *agent_types: str) -> ContributionDeclaration:
    return ContributionDeclaration(key, ContributionType.NEED, rank, agent_types, "Blocked")


MODULES = [
    ModuleContributions("messages", True, ("overview",), (need("messages.unread-needs", "messages.unread"),
                                                     ContributionDeclaration("messages.show", ContributionType.POLICY, "messages.show"))),
    ModuleContributions("overview", True, (), (need("overview.first-needs", "overview.first", "main"),
                                          ContributionDeclaration("drivers.database-file", ContributionType.POLICY, "safety.all", is_safety=True))),
]


def test_each_list_is_sorted_by_the_rank_order_then_module_order() -> None:
    table = DriverCompiler(MODULES).tables([MAIN])[0]
    assert table.keys() == ["overview.first-needs", "messages.unread-needs", "drivers.database-file", "messages.show"]


def test_a_driver_takes_the_contributions_of_the_type_it_gathers() -> None:
    tables = {table.driver: table for table in DriverCompiler(MODULES).tables([MAIN, CODING_MAIN, WORKER])}
    assert "overview.first-needs" in tables["coding.main"].keys()
    assert "overview.first-needs" not in tables["coding.worker"].keys()


def test_a_module_left_out_leaves_its_contributions_out_and_changes_the_digest() -> None:
    whole, without = DriverCompiler(MODULES).tables([WORKER])[0], DriverCompiler(MODULES[:1]).tables([WORKER])[0]
    assert (without.keys(), whole.digest() == without.digest()) == (["messages.unread-needs", "messages.show"], False)
