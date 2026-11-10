from pathlib import Path

from engine.module.layer_check import LayerCheck
from engine.module.layer_table import LayerTable
from engine.module.layer_table_printer import LayerTablePrinter
from engine.module.module import Module
from core.testing.story import Story


class LayerProject:
    """A made-up project folder with a src folder and no configuration, which the layer check judges the way it
    judges the real one; each check is a step of the story."""

    def __init__(self, story: Story, folder: Path) -> None:
        self.story, self.folder = story, folder

    def add_module_folder(self, dotted_folder: str, name: str) -> None:
        self.add_file(f"src/{dotted_folder.replace('.', '/')}/{name}_module.py")

    def add_file(self, relative_path: str, source: str = "") -> None:
        target = self.folder / relative_path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(source)

    @staticmethod
    def declaration(name: str, dotted_folder: str, dependencies: tuple[str, ...] = ()) -> type[Module]:
        class SampleModule(Module):
            pass

        SampleModule.name = f"journal.{name}"
        SampleModule.dependencies = [f"journal.{dependency}" for dependency in dependencies]
        SampleModule.__module__ = f"{dotted_folder}.{name}_module"
        return SampleModule

    def check(self, *declarations: type[Module]) -> list[str]:
        failures = LayerCheck(self.folder, LayerTable(), declarations).failures()
        reasons = "; ".join(failure.partition(": ")[2] for failure in failures)
        self.story.steps.append(f"layer check of {self.folder.name}")
        self.story.path.append(f"layer check fails: {reasons}" if failures else "layer check passes")
        return failures

    @staticmethod
    def layer_of(relative_path: str) -> str:
        layer = LayerTable().file_layer(relative_path)
        return "no layer" if layer is None else layer.label

    def printed_layers(self) -> list[str]:
        self.story.steps.append("print the layers")
        self.story.path.append("print the layers")
        return LayerTablePrinter.lines()
