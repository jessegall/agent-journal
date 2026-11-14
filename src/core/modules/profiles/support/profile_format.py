import json
from collections.abc import Callable, Mapping

from engine.enums.access import Access
from engine.enums.model_tier import ModelTier
from engine.enums.occupant import Occupant
from engine.errors.refusal import Refusal
from engine.types.type_guards import is_list, is_mapping, is_tuple
from core.modules.profiles.support.profile_text import ProfileText

OCCUPANT_REFUSAL_TEXT = "occupant must be continue, when-cold or each-launch"

FIELD_NAMES = {"type": "agent_type", "kind": "agent_type", "moved-from": "source_digest", "could-write": "legacy_writing"}
FILE_NAMES = {"agent_type": "type", "source_digest": "moved-from", "legacy_writing": "could-write"}
OVERLAID_FIELDS = ("title", "description", "body", "access", "program", "preferred_program", "fallback_programs", "model", "codex_model", "program_models", "uses_project_instructions", "injections", "tier", "mcp_tools", "writable_folders", "protected_folders", "skills", "required_skills", "occupant")


class ProfileFormat:
    """Reads and writes the journal's small front matter format without interpreting YAML."""

    @staticmethod
    def settings(source: ProfileText) -> dict[str, object]:
        values = {name: read(source.fields[name]) for name, read in SETTING_READERS.items() if name in source.fields}
        if source.body:
            values["body"] = source.body
        return {name: values[name] for name in OVERLAID_FIELDS if name in values}

    @staticmethod
    def switch(name: str, value: str) -> bool:
        if value not in ("true", "false"):
            raise Refusal(f"{name.replace('_', '-')} must be true or false")
        return value == "true"

    @staticmethod
    def model(value: str) -> str:
        return "" if value == "inherit" else value

    @staticmethod
    def tier(value: str) -> ModelTier | None:
        return None if value in ("", "null") else ModelTier.automatic(value)

    @staticmethod
    def agent_type(value: str) -> str:
        return "helper" if value == "subagent" else value

    @staticmethod
    def program_models(value: str) -> dict[str, str]:
        models = json.loads(value)
        names = {name: model for name, model in models.items() if isinstance(name, str) and isinstance(model, str)} if is_mapping(models) else {}
        if not is_mapping(models) or len(names) != len(models):
            raise Refusal("program-models must contain a model name for each program name")
        return {name: "" if model == "inherit" else model for name, model in names.items()}

    @staticmethod
    def injections(value: object) -> dict[str, bool]:
        switches = json.loads(value) if isinstance(value, str) else value
        names = {name: switch for name, switch in switches.items() if isinstance(name, str) and isinstance(switch, bool)} if is_mapping(switches) else {}
        if not is_mapping(switches) or len(names) != len(switches):
            raise Refusal("injections must name each injection with true or false")
        return names

    @staticmethod
    def header(text: str) -> ProfileText:
        if any(line.startswith(("<<<<<<<", "=======", ">>>>>>>")) for line in text.splitlines()):
            raise Refusal("profile contains merge conflict markers")
        if not text.startswith("---\n") or "\n---\n" not in text:
            raise Refusal("profile needs front matter between --- lines")
        head, _, body = text[4:].partition("\n---\n")
        fields: dict[str, str] = {}
        multiline: str | None = None
        separator = "\n"
        for line in head.splitlines():
            if multiline is not None and (not line or line[:1].isspace()):
                fields[multiline] += (separator if fields[multiline] else "") + line.strip()
                continue
            if not line.strip():
                continue
            key, colon, value = line.partition(":")
            if not colon or line[:1].isspace():
                raise Refusal(f"invalid profile field: {line}")
            key = FIELD_NAMES.get(key.strip(), key.strip().replace("-", "_"))
            if key in fields:
                raise Refusal(f"profile repeats {key}")
            value = value.strip()
            multiline = key if value in ("|", ">") else None
            separator = "\n" if value == "|" else " "
            fields[key] = "" if multiline is not None else ProfileFormat.scalar(value)
        return ProfileText(fields, body.strip("\n"))

    @staticmethod
    def scalar(value: str) -> str:
        if value.startswith('"'):
            return str(json.loads(value))
        return value[1:-1] if len(value) >= 2 and value.startswith("'") and value.endswith("'") else value

    @staticmethod
    def tools(value: object) -> tuple[str, ...]:
        if is_list(value) or is_tuple(value):
            return tuple(str(tool) for tool in value)
        text = str(value)
        if text.startswith("["):
            return tuple(str(tool) for tool in json.loads(text))
        return tuple(tool.strip() for tool in text.split(",") if tool.strip())

    @staticmethod
    def occupant(word: str) -> Occupant:
        if word not in tuple(Occupant):
            raise Refusal(OCCUPANT_REFUSAL_TEXT, "write one of the three words")
        return Occupant(word)

    @staticmethod
    def text(lines: Mapping[str, object], body: str) -> str:
        header = "\n".join(f"{FILE_NAMES.get(name, name.replace('_', '-'))}: {json.dumps(value, ensure_ascii=False)}" for name, value in lines.items())
        return f"---\n{header}\n---\n\n{body}\n"


SETTING_READERS: Mapping[str, Callable[[str], object]] = {
    "title": str, "description": str, "body": str, "access": Access, "program": str,
    "preferred_program": lambda value: ProfileFormat.switch("preferred_program", value),
    "fallback_programs": ProfileFormat.tools, "model": ProfileFormat.model, "codex_model": ProfileFormat.model,
    "program_models": ProfileFormat.program_models,
    "uses_project_instructions": lambda value: ProfileFormat.switch("uses_project_instructions", value),
    "injections": ProfileFormat.injections, "tier": ProfileFormat.tier, "mcp_tools": ProfileFormat.tools,
    "writable_folders": ProfileFormat.tools, "protected_folders": ProfileFormat.tools, "skills": ProfileFormat.tools, "required_skills": ProfileFormat.tools,
}
