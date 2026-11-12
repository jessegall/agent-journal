from core.modules.processes.models.reader import Reader


def stored_reader(name: str) -> Reader:
    # @righteous architecture_processes_stock_reader_outside_the_stock_file
    return Reader(name=name, commands="tool*", creator_id=2)
