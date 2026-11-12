from tests.stories.server.window_data_route import window_data
from tests.stories.suites.coding.support.main_controls_fixture import PersonViewer

WINDOW = "coding.work-mode"
AUTO = "journal.suites.coding.auto-mode"
SENDS = "journal.suites.coding.workers.main-dispatches-workers"
LONG_TABS = ("work", "tests", "advanced")
TYPE_SCREENS = ("helper-type.workers", "helper-type.merger", "helper-type.read-only")


class Modal:
    """The agent settings as the modal's client plays them through the viewer routes: it reads the screens of the
    window, and its one save sends every change with the revision each screen was read at."""

    def __init__(self, viewer: PersonViewer) -> None:
        self.server, self.cookie, self.environment = viewer.server, viewer.cookie, viewer.environment

    def line(self, words: list[str]) -> dict[str, object]:
        return self.server.viewer_line_value(self.cookie, {"window": WINDOW, "environment": self.environment, "line": words})

    def screen(self, name: str) -> dict[str, object]:
        if name in LONG_TABS:
            return self.window_keys(f"{name}-screen")[f"{name}-screen"]["value"]
        type_name = name.partition(".")[2]
        return self.window_keys("type-screen", query=f"environment={self.environment}&type-screen.type={type_name}")["type-screen"]["value"]

    def nodes(self, name: str) -> dict[str, dict[str, object]]:
        return {node["key"]: node for node in self.screen(name)["nodes"]}

    def value(self, name: str, key: str) -> object:
        return self.nodes(name)[key]["value"]

    def revisions(self, *names: str) -> dict[str, str]:
        return {name: self.screen(name)["revision"] for name in names}

    def save_line(self, changes: dict[str, str], screens: dict[str, str]) -> list[str]:
        (first, revision), *others = screens.items()
        return ["setting-screen", "apply", first, "--revision", revision, *[part for name, rev in others for part in ("--also", f"{name}={rev}")], *[f"{key}={value}" for key, value in changes.items()]]

    def save(self, changes: dict[str, str], *names: str) -> dict[str, object]:
        return self.line(self.save_line(changes, self.revisions(*names)))

    def expect_refused(self, changes: dict[str, str], screens: dict[str, str], text: str) -> None:
        body = {"window": WINDOW, "environment": self.environment, "line": self.save_line(changes, screens)}
        self.server.expect_viewer_line(self.cookie, body, 200, text)

    def first_of_kind(self, name: str, kind: str) -> dict[str, object]:
        return next(node for node in self.screen(name)["nodes"] if node["kind"] == kind and not node["requires"])

    def window_keys(self, keys: str, window: str = WINDOW, query: str = "environment=main") -> dict[str, object]:
        status, answer = window_data(self.server, self.cookie, keys=keys, window=window, query=query)
        assert status == 200, (status, answer)
        return answer["keys"]
