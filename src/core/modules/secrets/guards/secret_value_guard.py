from core.base.guard.guard import Guard
from core.base.model.model import Model
from engine.errors.refusal import Refusal
from engine.types.type_guards import is_tuple
from core.base.private.secret_values import SecretValues
from core.base.private.server_keys import ServerKeys
from core.base.change.changed import Changed
from core.base.change.deleted import Deleted
from core.base.command.context import Context

SHORTEST_GUARDED_CHARACTERS = 6


class SecretValueGuard(Guard[Changed[Model]]):
    """Refuses a row whose text holds a hidden secret value, a replaced one or a server key; a value under six
    characters is too short to tell apart from ordinary text and is only masked."""

    name = "secrets.secret-value"
    is_safety = True

    def __init__(self, values: SecretValues, keys: ServerKeys) -> None:
        self.values, self.keys = values, keys

    def check(self, event: Changed[Model], context: Context) -> None:
        if isinstance(event, Deleted):
            return
        guarded = {**self.values.hidden_values(), **{value: variable for variable, value in self.keys.all().items()}}
        guarded = {value: variable for value, variable in guarded.items() if len(value) >= SHORTEST_GUARDED_CHARACTERS}
        if not guarded:
            return
        fields = list(vars(event.row).values())
        texts = [value for value in fields if isinstance(value, str)] + [str(item) for value in fields if is_tuple(value) for item in value]
        variable = next((variable for value, variable in guarded.items() if any(value in text for text in texts)), None)
        if variable is not None:
            raise Refusal(f"a row may not hold the value of {variable}", "name the secret, never its value")
