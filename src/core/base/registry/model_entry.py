from collections.abc import Sequence
from dataclasses import dataclass

from core.base.dotted_path.dotted_path import DottedPath
from core.base.dotted_path.wrong_base_error import WrongBaseError
from core.base.model.model import Model
from core.base.model.view_model import ViewModel


@dataclass(frozen=True)
class ModelEntry:
    """A model as the registry lists it: the module that adds it, the dotted path of its model, and its typed
    move commands, all by dotted path so a run imports only the model it is asked about."""

    module: str
    model: DottedPath
    commands: Sequence[str]
    excluded_subcommands: Sequence[str] = ()

    def model_class(self) -> type[Model] | type[ViewModel]:
        loaded = self.model.loaded()
        if issubclass(loaded, Model) or issubclass(loaded, ViewModel):
            return loaded
        raise WrongBaseError(f"{self.model.text} is no model or view")
