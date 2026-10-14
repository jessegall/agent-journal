from resources.base import Refused, SYSTEM
from resources.buttons import Button

MOST = 5


class Buttons:
    def runs_action(self, type_: str, action: str) -> bool:
        from controllers.base import CONTROLLERS
        if type_ not in CONTROLLERS:
            return False
        try:
            return callable(CONTROLLERS[type_](self.record, actor=SYSTEM).action(action))
        except (AttributeError, Refused):
            return False

    def shaped_button(self, given) -> dict:
        if not isinstance(given, dict):
            return {}
        button = Button.from_payload(given)
        if button.label and button.runs:
            return Button(label=button.label, runs=button.runs, again=button.again, choice=button.choice, ask=button.ask, outcome=button.outcome).to_json()
        if button.label and button.say.strip():
            return Button(label=button.label, say=button.say.strip(), again=button.again, choice=button.choice, ask=button.ask).to_json()
        if not button.label or not button.action or not self.runs_action(button.type, button.action):
            return {}
        return button.to_json()

    def shaped_buttons(self, given) -> list[dict]:
        if not isinstance(given, list):
            return []
        return [kept for kept in (self.shaped_button(b) for b in given[:MOST]) if kept]
