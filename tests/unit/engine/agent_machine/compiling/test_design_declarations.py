from engine.agent_machine.compiling.declaration_check import DeclarationCheck
from engine.agent_machine.compiling.driver_compiler import DriverCompiler
from tests.unit.engine.agent_machine.compiling.design_declarations import AGENT_TYPES, DesignDeclarations


def test_the_complete_declarations_of_the_design_pass_every_check_of_sync() -> None:
    check = DeclarationCheck(DesignDeclarations.drivers(), DesignDeclarations.modules(), DesignDeclarations.programs(), AGENT_TYPES)
    assert [refusal.text() for refusal in check.refusals()] == []


def test_every_driver_of_the_design_compiles_a_table_of_its_own() -> None:
    tables = DriverCompiler(DesignDeclarations.modules()).tables(DesignDeclarations.drivers())
    assert [table.driver for table in tables] == ["core.main", "core.helper", "coding.main", "coding.worker", "coding.merger"]
    assert len({table.digest() for table in tables if table.driver != "coding.main"}) == 4
    assert "workers.status-first-needs" in next(table for table in tables if table.driver == "coding.worker").keys()
    assert "workers.status-first-needs" not in next(table for table in tables if table.driver == "core.helper").keys()
