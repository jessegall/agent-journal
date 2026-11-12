from collections.abc import Mapping
from dataclasses import dataclass, field, replace

from engine.enums.access import Access
from engine.enums.occupant import INDEPENDENT_OCCUPANTS
from engine.errors.refusal import Refusal
from engine.profile.agent_profile import KEPT_AGENTS_TEXT, AgentProfile
from core.modules.profiles.support.profile_format import ProfileFormat

WRITING_TOOLS = ("Edit", "Write", "MultiEdit")


@dataclass(frozen=True)
class ProfileFields:
    """The front matter of one profile file: the profile settings it sets, by their AgentProfile names in the order
    of the overlaid fields, and the lines about the file itself. A file without a type changes a module's profile."""

    settings: Mapping[str, object] = field(default_factory=dict[str, object])
    name: str = ""
    agent_type: str = ""
    module: str = ""
    module_text: str = ""
    source_digest: str = ""
    could_write: bool = False
    tools: tuple[str, ...] = ()

    @classmethod
    def read(cls, text: str) -> "ProfileFields":
        source = ProfileFormat.header(text)
        lines = source.fields
        if "reuse" in lines:
            raise Refusal(KEPT_AGENTS_TEXT, "remove the reuse line: the occupant line sets when a session is replaced")
        settings = ProfileFormat.settings(source)
        if "occupant" in lines:
            settings["occupant"] = ProfileFormat.occupant(lines["occupant"])
        if "independent" in lines:
            independent_occupant = INDEPENDENT_OCCUPANTS[ProfileFormat.switch("independent", lines["independent"])]
            occupant = settings.setdefault("occupant", independent_occupant)
            if occupant is not independent_occupant:
                raise Refusal(f"occupant {lines['occupant']} and the independent line disagree", "remove the independent line")
        return cls(settings, lines.get("name", ""), ProfileFormat.agent_type(lines.get("agent_type", "")), lines.get("module", ""),
                   lines.get("module_text", ""), lines.get("source_digest", ""), lines.get("legacy_writing") == "true",
                   ProfileFormat.tools(lines.get("tools", "")))

    @property
    def changes_instructions(self) -> bool:
        return "body" in self.settings

    @property
    def native(self) -> "ProfileFields":
        """These fields read from a program's own agent file: a helper unless it names a type, and only reading when its
        tools could write."""
        return replace(self, agent_type=self.agent_type or "helper", could_write=self.could_write or any(tool in WRITING_TOOLS for tool in self.tools))

    def copied(self, profile: AgentProfile) -> AgentProfile:
        """The profile a program's own agent file describes: the mcp tools of its tools line join its mcp tools, and a
        file that could write only reads."""
        mcp_tools = tuple(dict.fromkeys((*profile.mcp_tools, *(tool for tool in self.tools if tool.startswith("mcp__")))))
        return replace(profile, mcp_tools=mcp_tools, access=Access.READ if self.could_write else profile.access)

    def text(self) -> str:
        own = {"name": self.name, "agent_type": self.agent_type, "module_text": self.module_text, "module": self.module,
               "source_digest": self.source_digest, "legacy_writing": "true" if self.could_write else ""}
        body = self.settings.get("body", "")
        lines = {**{name: value for name, value in self.settings.items() if name != "body" or value == ""}, **{name: value for name, value in own.items() if value}}
        return ProfileFormat.text(lines, str(body))
