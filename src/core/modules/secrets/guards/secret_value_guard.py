from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.secrets.support.secret_values import SecretValues
from core.modules.secrets.support.server_keys import ServerKeys

SHORTEST_GUARDED_CHARACTERS = 6


class SecretValueGuard(Guard):
    """Refuses a row whose text holds a hidden secret value, a replaced one or a server key; a value under six
    characters is too short to tell apart from ordinary text and is only masked."""

    name = "secrets.secret-value"
    event = "*"

    def __init__(self, values: SecretValues, keys: ServerKeys) -> None:
        self.values, self.keys = values, keys

    def check(self, change: Change[Model]) -> None:
        if change.new_row is None:
            return
        guarded = {**self.values.hidden_values(), **{value: variable for variable, value in self.keys.all().items()}}
        guarded = {value: variable for value, variable in guarded.items() if len(value) >= SHORTEST_GUARDED_CHARACTERS}
        if not guarded:
            return
        texts = [str(value) for value in vars(change.new_row).values() if isinstance(value, str | tuple)]
        held = next((variable for value, variable in guarded.items() if any(value in text for text in texts)), None)
        if held is not None:
            raise Refusal(f"a row may not hold the value of {held}", "name the secret, never its value")
