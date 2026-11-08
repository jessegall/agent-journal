import json

from core.base.access import Access
from core.base.provider.model_tier import ModelTier
from core.base.refusal import Refusal
from core.base.type_guards import is_mapping
from core.modules.profiles.support.profile_fields import ProfileFields
from core.modules.profiles.support.profile_text import ProfileText

FIELD_NAMES = {"type": "agent_type", "kind": "agent_type", "moved-from": "source_digest", "could-write": "legacy_writing"}
FILE_NAMES = {"agent_type": "type", "source_digest": "moved-from", "legacy_writing": "could-write"}


class ProfileFormat:
    """Reads the journal's small front matter format without interpreting YAML."""

    @staticmethod
    def fields(text: str) -> ProfileFields:
        source = ProfileFormat.header(text)
        fields = ProfileFields(**source.fields)
        if source.body:
            fields["body"] = source.body
        if "access" in fields:
            fields["access"] = Access(fields["access"])
        if "tier" in fields:
            value = fields["tier"]
            fields["tier"] = None if value in (None, "", "null") else ModelTier.automatic(value)
        for name in ("model", "codex_model"):
            if fields.get(name) == "inherit":
                fields[name] = ""
        if fields.get("agent_type") == "subagent":
            fields["agent_type"] = "helper"
        for name in ("independent", "program_if_possible", "keeps_project_instructions"):
            if name not in fields:
                continue
            value = fields[name]
            if value not in (True, False, "true", "false"):
                raise Refusal(f"{name.replace('_', '-')} must be true or false")
            fields[name] = value is True or value == "true"
        if "program_models" in fields:
            models = json.loads(fields["program_models"]) if isinstance(fields["program_models"], str) else fields["program_models"]
            if not is_mapping(models) or not all(isinstance(name, str) and isinstance(model, str) for name, model in models.items()):
                raise Refusal("program-models must contain a model name for each program name")
            fields["program_models"] = {name: "" if model == "inherit" else model for name, model in models.items()}
        if "injections" in fields:
            fields["injections"] = ProfileFormat.injections(fields["injections"])
        if "mcp_tools" in fields:
            fields["mcp_tools"] = ProfileFormat.tools(fields["mcp_tools"])
        if "writable_folders" in fields:
            fields["writable_folders"] = ProfileFormat.tools(fields["writable_folders"])
        return fields

    @staticmethod
    def injections(value: object) -> dict[str, bool]:
        switches = json.loads(value) if isinstance(value, str) else value
        if not is_mapping(switches) or not all(isinstance(name, str) and isinstance(switch, bool) for name, switch in switches.items()):
            raise Refusal("injections must name each injection with true or false")
        return dict(switches)

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
        if isinstance(value, (list, tuple)):
            return tuple(str(tool) for tool in value)
        text = str(value)
        if text.startswith("["):
            return tuple(str(tool) for tool in json.loads(text))
        return tuple(tool.strip() for tool in text.split(",") if tool.strip())

    @staticmethod
    def text(fields: ProfileFields) -> str:
        header = "\n".join(f"{FILE_NAMES.get(name, name.replace('_', '-'))}: {json.dumps(value, ensure_ascii=False)}" for name, value in fields.items() if name != "body" or value == "")
        return f"---\n{header}\n---\n\n{fields.get('body', '')}\n"
