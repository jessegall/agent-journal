from engine.container.container import Container
from engine.driver.block_condition import BlockCondition
from core.modules.processes.queries.process_query import ProcessQuery


class ProcessCondition(BlockCondition):
    """A condition on one run, named by its number; its target is that run."""

    def has_target(self, container: Container) -> bool:
        return container.get(ProcessQuery).filter(id=int(self.text)).exists()
