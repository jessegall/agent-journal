from pathlib import Path

from engine.journal.journal_home import JournalHome
from core.base.module.layer_rules import LayerRules
from core.base.module.layer_table import LayerTable
from core.base.module.module_finder import ModuleFinder


class LayerTablePrinter:
    """Prints one line per layer with what it may use, worked out from the modules the journal loads."""

    @staticmethod
    def lines() -> list[str]:
        return LayerRules(LayerTable(), ModuleFinder(JournalHome(Path(".journal"))).default_modules()).table_lines()


if __name__ == "__main__":
    print("\n".join(LayerTablePrinter.lines()))
