import json
from collections.abc import Mapping

from engine.enums.access import Access
from engine.profile.model_tier import ModelTier
from engine.errors.refusal import Refusal
from engine.types.type_guards import is_list, is_mapping, is_tuple
from core.modules.profiles.support.profile_fields import ProfileFields
from core.modules.profiles.support.profile_text import ProfileText

FIELD_NAMES = {"type": "agent_type", "kind": "agent_type", "moved-from": "source_digest", "could-write": "legacy_writing"}
FILE_NAMES = {"agent_type": "type", "source_digest": "moved-from", "legacy_writing": "could-write"}


class ProfileFormat:
    """Reads the journal's small front matter format without interpreting YAML."""

    @staticmethod
    def fields(text: str) -> ProfileFields:
        source = ProfileFormat.header(text)
        raw = source.fields
        fields = ProfileFields()
        ProfileFormat.copy_text_fields(raw, fields)
        if source.body:
            fields["body"] = source.body
        if "access" in raw:
            fields["access"] = Access(raw["access"])
        if "tier" in raw:
            fields["tier"] = None if raw["tier"] in ("", "null") else ModelTier.automatic(raw["tier"])
        if fields.get("model") == "inherit":
            fields["model"] = ""
        if fields.get("codex_model") == "inherit":
            fields["codex_model"] = ""
        if fields.get("agent_type") == "subagent":
            fields["agent_type"] = "helper"
        if "independent" in raw:
            fields["independent"] = ProfileFormat.switch("independent", raw["independent"])
        if "preferred_program" in raw:
            fields["preferred_program"] = ProfileFormat.switch("preferred_program", raw["preferred_program"])
        if "uses_project_instructions" in raw:
            fields["uses_project_instructions"] = ProfileFormat.switch("uses_project_instructions", raw["uses_project_instructions"])
        if "program_models" in raw:
            fields["program_models"] = ProfileFormat.program_models(raw["program_models"])
        if "fallback_programs" in raw:
            fields["fallback_programs"] = ProfileFormat.tools(raw["fallback_programs"])
        if "injections" in raw:
            fields["injections"] = ProfileFormat.injections(raw["injections"])
        if "mcp_tools" in raw:
            fields["mcp_tools"] = ProfileFormat.tools(raw["mcp_tools"])
        if "writable_folders" in raw:
            fields["writable_folders"] = ProfileFormat.tools(raw["writable_folders"])
        if "skills" in raw:
            fields["skills"] = ProfileFormat.tools(raw["skills"])
        if "required_skills" in raw:
            fields["required_skills"] = ProfileFormat.tools(raw["required_skills"])
        return fields

    @staticmethod
    def copy_text_fields(raw: Mapping[str, str], fields: ProfileFields) -> None:
        if "name" in raw:
            fields["name"] = raw["name"]
        if "title" in raw:
            fields["title"] = raw["title"]
        if "description" in raw:
            fields["description"] = raw["description"]
        if "body" in raw:
            fields["body"] = raw["body"]
        if "agent_type" in raw:
            fields["agent_type"] = raw["agent_type"]
        if "program" in raw:
            fields["program"] = raw["program"]
        if "model" in raw:
            fields["model"] = raw["model"]
        if "codex_model" in raw:
            fields["codex_model"] = raw["codex_model"]
        if "module" in raw:
            fields["module"] = raw["module"]
        if "module_text" in raw:
            fields["module_text"] = raw["module_text"]
        if "source_digest" in raw:
            fields["source_digest"] = raw["source_digest"]
        if "legacy_writing" in raw:
            fields["legacy_writing"] = raw["legacy_writing"]
        if "tools" in raw:
            fields["tools"] = raw["tools"]

    @staticmethod
    def switch(name: str, value: str) -> bool:
        if value not in ("true", "false"):
            raise Refusal(f"{name.replace('_', '-')} must be true or false")
        return value == "true"

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
    def text(fields: Mapping[str, object]) -> str:
        header = "\n".join(f"{FILE_NAMES.get(name, name.replace('_', '-'))}: {json.dumps(value, ensure_ascii=False)}" for name, value in fields.items() if name != "body" or value == "")
        return f"---\n{header}\n---\n\n{fields.get('body', '')}\n"
