import re
from dataclasses import replace
from datetime import timedelta
from urllib.parse import parse_qs, unquote, urlsplit

from engine.time.clock import Clock
from engine.database.kept_rows import KeptRows
from engine.driver.nudge import Nudge
from engine.driver.tool import Tool
from engine.enums.tool_type import ToolType
from engine.query.conditions.among import Among
from engine.query.conditions.greater import Greater
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.prefix import Prefix
from engine.query.queries import Queries
from engine.time.timestamp import Timestamp
from engine.types.type_guards import is_list, is_mapping
from core.modules.pins.commands.make_pin.make_pin import MakePin
from core.modules.pins.models.pin import Pin
from core.modules.pins.support.project_repositories import ProjectRepositories
from core.modules.pins.support.pin_nudges import BANG_BUTTON_REQUEST, LINK_PIN_REQUEST, UNPINNED_CLAIM

FILE_TOOLS = (ToolType.READ, ToolType.SEARCH, ToolType.EDIT, ToolType.NEW_FILE)
LINK = re.compile(r"https?://[^\s<>()\[\]\"'`]+")
LOCAL_ADDRESS = re.compile(r"^https?://(?:[^/.:]+|127\.0\.0\.1)(?:[:/]|$)")
PIN_CLAIM = re.compile(r"\b(pinned (?:above|at the top|for you)|(?:i've|i have|i) pinned|(?:it's|it is|now) pinned)\b", re.IGNORECASE)
PR_ADDRESS = re.compile(r"https://github\.com/[\w.-]+/[\w.-]+/pull/\d+")
DESIGN_ADDRESS = re.compile(r"^https://claude\.ai/design/[^\s]+$")
PROJECT_PATH = "/design/p/"
OPEN_LABEL = "Open"
CLAIM_WINDOW_SECONDS = 60
BANG_COMMAND = re.compile(r"(?:^|`|\b(?:run|type|enter|try)\s+)!\s?([^\s`][^`\n]*)", re.IGNORECASE | re.MULTILINE)


class LinkPinCheck:
    """The lines a text gets: words that claim a pin no pin in the last minute exists for are named, else
    the first link no open pin has is offered, each link on its own count, and a ! command the agent asks the
    user to run is asked to become a button. The link of a closed pin is offered again."""

    def __init__(self, queries: Queries, clock: Clock, kept: KeptRows, repositories: ProjectRepositories) -> None:
        self.queries, self.clock, self.kept, self.repositories = queries, clock, kept, repositories

    @staticmethod
    def repository(url: str) -> str:
        return "/".join(url.split("/")[3:5]).lower()

    @staticmethod
    def is_file_read_tool(tool: Tool) -> bool:
        return tool.category in FILE_TOOLS or (tool.shell is not None and tool.shell.is_readonly)

    def nudges(self, agent_text: str, tool_output: str = "") -> list[Nudge]:
        if self.claims_missing_pin(agent_text):
            return [UNPINNED_CLAIM.nudge()]
        unpinned = self.first_unpinned(f"{agent_text}\n{tool_output}")
        nudges = [self.keyed(LINK_PIN_REQUEST.nudge(url=unpinned), unpinned)] if unpinned is not None else []
        command = self.first_unpinned_command(agent_text)
        return [*nudges, self.keyed(BANG_BUTTON_REQUEST.nudge(), command)] if command is not None else nudges

    @staticmethod
    def keyed(nudge: Nudge, name: str) -> Nudge:
        return replace(nudge, key=f"{nudge.key}.{name}")

    def first_unpinned_command(self, text: str) -> str | None:
        commands = dict.fromkeys(f"! {line.strip()}" for line in BANG_COMMAND.findall(text))
        pinned = {pin.link for pin in self.queries.query(Pin).matching(IsNull("closed_at")).matching(Among("link", tuple(commands))).all_rows()}
        return next((command for command in commands if command not in pinned), None)

    def change_request_pins(self, text: str) -> list[MakePin]:
        repositories = self.repositories.names()
        links = dict.fromkeys(url.rstrip(".,;:/") for url in LINK.findall(text) if self.is_complete_link(url) and PR_ADDRESS.fullmatch(url.rstrip(".,;:/"))
                              and self.repository(url.rstrip(".,;:/")) in repositories)
        pinned = {pin.link for pin in self.queries.query(Pin).matching(Among("link", self.with_trailing_slashes(tuple(links)))).all_rows()}
        return [MakePin(f"Pull request {url.rsplit('/', 1)[-1]}", url, OPEN_LABEL) for url in links if url not in pinned and f"{url}/" not in pinned]

    @staticmethod
    def with_trailing_slashes(urls: tuple[str, ...]) -> tuple[str, ...]:
        return (*urls, *(f"{url}/" for url in urls))

    def design_pins(self, text: str) -> list[MakePin]:
        links = dict.fromkeys(url.rstrip(".,;:/") for url in LINK.findall(text) if self.is_complete_link(url) and DESIGN_ADDRESS.fullmatch(url))
        pins = list(self.queries.query(Pin).matching(Prefix("link", "https://claude.ai/design/")).all_rows()) if links else []
        existing = {self.design_key(pin.link) for pin in pins}
        made: list[MakePin] = []
        for url in links:
            project, filename = self.design_key(url)
            if self.is_project_root(project, filename) or (project, filename) in existing or (not filename and any(key[0] == project for key in existing)):
                continue
            made.append(MakePin(self.design_title(url), url, OPEN_LABEL))
            existing.add((project, filename))
        return made

    @staticmethod
    def design_title(url: str) -> str:
        parsed = urlsplit(url)
        name = parse_qs(parsed.query).get("file", [parsed.path.rstrip("/").rsplit("/", 1)[-1]])[0]
        name = unquote(name).replace("-", " ").replace("_", " ")
        return f"Design: {name}"[:80]

    @staticmethod
    def is_project_root(path: str, filename: str) -> bool:
        return path.startswith(PROJECT_PATH) and not filename

    @staticmethod
    def design_key(url: str) -> tuple[str, str]:
        parsed = urlsplit(url)
        return parsed.path.rstrip("/"), parse_qs(parsed.query).get("file", [""])[0]

    @staticmethod
    def is_complete_link(url: str) -> bool:
        decoded = unquote(url)
        return "…" not in decoded and "..." not in decoded and "\\" not in decoded

    def first_unpinned(self, text: str) -> str | None:
        links = dict.fromkeys(url.rstrip(".,;:") for url in LINK.findall(text) if self.is_complete_link(url) and not LOCAL_ADDRESS.match(url) and not PR_ADDRESS.match(url) and not DESIGN_ADDRESS.match(url))
        if not links:
            return None
        variants = self.with_trailing_slashes(tuple(url.rstrip("/") for url in links))
        pins = self.queries.query(Pin).matching(IsNull("closed_at")).matching(Among("link", variants))
        pinned = self.kept.scoped_read("pins", lambda: {pin.link for pin in pins.all_rows()},
                                       f"closed_at IS NULL AND link IN ({', '.join('?' * len(variants))})", list(variants), name="pins.open_links")
        return next((url for url in links if url.rstrip("/") not in pinned and f"{url.rstrip('/')}/" not in pinned), None)

    def claims_missing_pin(self, text: str) -> bool:
        if not PIN_CLAIM.search(text):
            return False
        window_start = Timestamp(self.clock.timestamp().value - timedelta(seconds=CLAIM_WINDOW_SECONDS)).text
        return not self.queries.query(Pin).matching(Greater("created_at", window_start)).exists()

    def joined_text(self, value: object) -> str:
        if isinstance(value, str):
            return value
        if is_mapping(value):
            return "\n".join(self.joined_text(item) for item in value.values())
        return "\n".join(self.joined_text(item) for item in value) if is_list(value) else ""
