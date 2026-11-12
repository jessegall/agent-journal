class StockReader:
    def __init__(self, name: str, commands: str, title: str, lines: str) -> None:
        self.name, self.commands, self.title, self.lines = name, commands, title, lines


STOCK_READERS = (
    # @righteous architecture_processes_stock_reader_outside_the_stock_file
    StockReader("tool-test", "tool test*", "Tool tests", "passed"),
)
