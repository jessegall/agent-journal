from pathlib import Path

from engine.module.layer_check import LayerCheck
from engine.module.layer_table import LayerTable
from engine.module.layer_table_printer import LayerTablePrinter
from engine.module.module import Module


class LayerProject:
    """A made-up project folder with a src folder and no configuration, which the layer check judges the way it
    judges the real one."""

    def __init__(self, folder: Path) -> None:
        self.folder = folder

    def add_module_folder(self, dotted_folder: str, name: str) -> None:
        self.add_file(f"src/{dotted_folder.replace('.', '/')}/{name}_module.py")

    def add_file(self, relative_path: str, source: str = "") -> None:
        target = self.folder / relative_path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(source)

    @staticmethod
    def declaration(name: str, dotted_folder: str, *dependencies: str) -> type[Module]:
        class SampleModule(Module):
            pass

        SampleModule.name = f"journal.{name}"
        SampleModule.dependencies = [f"journal.{dependency}" for dependency in dependencies]
        SampleModule.__module__ = f"{dotted_folder}.{name}_module"
        return SampleModule

    def check(self, *declarations: type[Module]) -> list[str]:
        return LayerCheck(self.folder, LayerTable(), declarations).failures()

    @staticmethod
    def layer_of(relative_path: str) -> str:
        layer = LayerTable().file_layer(relative_path)
        return "no layer" if layer is None else layer.label

    @staticmethod
    def emitted_layers() -> list[str]:
        return LayerTablePrinter.lines()
