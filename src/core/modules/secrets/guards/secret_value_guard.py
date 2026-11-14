from engine.guard.guard import Guard
from engine.model.model import Model
from engine.errors.refusal import Refusal
from engine.types.type_guards import is_tuple
from engine.private.secret_values import SecretValues
from engine.private.server_keys import ServerKeys
from engine.request.request_values import RequestValues
from engine.event.changed import Changed
from engine.event.deleted import Deleted
from engine.command.context import Context

SHORTEST_GUARDED_CHARACTERS = 6


class SecretValueGuard(Guard[Changed[Model]]):
    """Refuses a row whose text holds a hidden secret value, a replaced one or a server key; a value under six
    characters is too short to tell apart from ordinary text and is only masked."""

    name = "secrets.secret-value"
    is_safety = True

    def __init__(self, values: SecretValues, keys: ServerKeys, request_values: RequestValues) -> None:
        self.values, self.keys, self.request_values = values, keys, request_values

    # read once for a request, and again once a secret or a key was written in it, so each saved row of a hook costs no file call
    def guarded_values(self) -> dict[str, str]:
        guarded = {**self.values.hidden_values(), **{value: variable for variable, value in self.keys.all().items()}}
        return {value: variable for value, variable in guarded.items() if len(value) >= SHORTEST_GUARDED_CHARACTERS}

    def check(self, event: Changed[Model], context: Context) -> None:
        if isinstance(event, Deleted):
            return
        guarded = self.request_values.read("secrets.guarded_values", lambda: (self.values.writes, self.keys.writes), self.guarded_values)
        if not guarded:
            return
        fields = list(vars(event.row).values())
        texts = [value for value in fields if isinstance(value, str)] + [str(item) for value in fields if is_tuple(value) for item in value]
        variable = next((variable for value, variable in guarded.items() if any(value in text for text in texts)), None)
        if variable is not None:
            raise Refusal(f"a row may not hold the value of {variable}", "name the secret, never its value")
