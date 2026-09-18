from v2.engine.queries import start_block
from v2.features.base import Feature, on


def start_file(root, env):
    return root / "runtime" / f"start-{env}.md"


class Start(Feature):
    name = "start"
    title_ = "The start block"
    abstract_ = "What a session is handed at its start, kept current on every change to the record"
    help_ = "The hook hands the file over at SessionStart; nothing is computed inside the hook."

    @on("*")
    def write(self, event, record) -> None:
        f = start_file(record.root, record.env)
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(start_block(record))
