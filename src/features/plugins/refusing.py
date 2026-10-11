import json
import threading

from engine import bus
from engine.wording import fill
from features.parts import Context
from features.plugins.answer import apply
from features.plugins.declared import called, declared
from features.plugins.environment import placed
from features.plugins.paths import logged, plugin_socket
from features.plugins.run import PluginReply, asked, call


class PluginAsk:
    """Asks a plugin whether to refuse a tool call: within the time the hook may wait, or beside the call."""

    def within(self, context: Context, row, tool: str, payload: dict, wait: float) -> str:
        """A plugin's refusal is waited for as long as the hook may wait; past that the call goes ahead, and what the plugin answers then reaches the agent as a message."""
        record, journal, session = context.record, context.feature.journal, context.hook.session
        name, seconds = called(row), declared(row).refuse_budget
        answered, late, found = threading.Event(), threading.Event(), []

        def ask() -> None:
            refused = self.answer(record, row, tool, payload, seconds)
            found.append(refused)
            answered.set()
            if late.is_set() and refused:
                apply(record, journal, name, session, {"say": f"{refused} (it answered after the call went ahead)"})
        self.apart(name, ask)
        if answered.wait(max(wait, 0.0)):
            return found[0]
        late.set()
        return found[0] if answered.is_set() else ""

    def beside(self, context: Context, row, payload: dict) -> None:
        """A plugin that declared its hook async never holds the tool call: it is asked on a thread of its own, and what it answers reaches the agent as a message, never as a refusal."""
        record, journal, session, tool = context.record, context.feature.journal, context.hook.session, context.hook.tool.name
        name, seconds = called(row), declared(row).refuse_budget

        def ask() -> None:
            refused = self.answer(record, row, tool, payload, seconds)
            if refused:
                apply(record, journal, name, session, {"say": refused})
        self.apart(name, ask)

    @staticmethod
    def apart(name: str, job) -> None:
        """Asks a plugin on a thread of its own, or at once when the threads are switched off, as in a test, so none outlives the call that asked it and loads rows in the work of another."""
        if not bus.BACKGROUND:
            job()
            return
        threading.Thread(target=job, name=f"plugin-{name}", daemon=True).start()

    def answer(self, record, row, tool: str, payload: dict, seconds: float) -> str:
        name = called(row)
        served = declared(row).refuse_socket and asked(plugin_socket(record.root, name), payload, seconds)
        ok, reply = served if served and served[0] else self.spawned(record, row, payload, seconds)
        if ok and reply:
            logged(record.root, name, f"refuse? {tool} {json.dumps(reply, ensure_ascii=False)}")
        return PluginReply.from_json(reply).refuse if ok else ""

    @staticmethod
    def spawned(record, row, payload: dict, seconds: float) -> tuple:
        _, where, env = placed(record, row)
        return call(fill(declared(row).refuse, env), where, env, payload, seconds)
