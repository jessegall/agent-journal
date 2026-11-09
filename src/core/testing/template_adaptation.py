import dataclasses
import pickle
import shutil
from pathlib import Path

from core.base.database.database_text_replacement import DatabaseTextReplacement
from core.base.file_access import FileAccess
from core.base.type_guards import is_frozenset, is_list, is_mapping, is_set, is_tuple

CHECKOUT_FILE = "checkout"
REWRITTEN_FILES = ("module_list", "program_table")
STATE_FILE = "story-state.pickle"


class TemplateAdaptation:
    """Makes a template built in one checkout usable in another: a template holds the paths of the checkout
    that built it (the files of its skills, for one), so a copy for another checkout has that checkout's
    path put in place of the builder's, in its databases and its lists; it is made once for each checkout
    and kept beside the template."""

    def __init__(self, checkout: Path) -> None:
        self.checkout = str(checkout)

    def builder_name(self, folder: Path) -> str:
        file = folder / CHECKOUT_FILE
        return FileAccess.shared().read(file) if file.is_file() else self.checkout

    def mark(self, folder: Path) -> None:
        FileAccess.shared().write(folder / CHECKOUT_FILE, self.checkout)

    def adapted(self, template: Path, adapted: Path) -> None:
        builder = self.builder_name(template)
        shutil.rmtree(adapted, ignore_errors=True)
        shutil.copytree(template, adapted)
        for database in adapted.rglob("*.db"):
            DatabaseTextReplacement(database).replace(builder, self.checkout)
        for name in REWRITTEN_FILES:
            for file in adapted.rglob(name):
                FileAccess.shared().write(file, FileAccess.shared().read(file).replace(builder, self.checkout))
        for state in adapted.rglob(STATE_FILE):
            FileAccess.shared().write_binary(state, pickle.dumps(self.adapted_value(pickle.loads(FileAccess.shared().binary(state)), builder)))
        self.mark(adapted)

    def adapted_value(self, value: object, builder: str) -> object:
        if type(value) is str:
            return value.replace(builder, self.checkout)
        if is_list(value) and type(value) is list:
            return [self.adapted_value(item, builder) for item in value]
        if is_tuple(value) and type(value) is tuple:
            return tuple(self.adapted_value(item, builder) for item in value)
        if is_set(value) and type(value) is set:
            return {self.adapted_value(item, builder) for item in value}
        if is_frozenset(value) and type(value) is frozenset:
            return frozenset(self.adapted_value(item, builder) for item in value)
        if is_mapping(value) and value.__class__ is dict:
            return {self.adapted_value(key, builder): self.adapted_value(item, builder) for key, item in value.items()}
        if dataclasses.is_dataclass(value) and not isinstance(value, type):
            return dataclasses.replace(value, **{field.name: self.adapted_value(getattr(value, field.name), builder) for field in dataclasses.fields(value) if field.init})
        return value
