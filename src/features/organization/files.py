import tomllib
from dataclasses import dataclass, field, replace
from pathlib import Path

from engine.fields import Loaded
from resources.base import Refused

FOLDER = "agentic-organization"
WORKTREE, PLURAL = "worktree", "plural"
CARDINALITIES = (WORKTREE, PLURAL)


@dataclass(frozen=True)
class Role(Loaded):
    name: str = ""
    title: str = ""
    icon: str = ""
    description: str = ""
    responsible: str = ""
    not_responsible: str = ""
    skills: list = field(default_factory=list)
    tools: list = field(default_factory=list)
    inputs: list = field(default_factory=list)
    outputs: list = field(default_factory=list)
    cardinality: str = WORKTREE
    model: str = ""


@dataclass(frozen=True)
class Domain(Loaded):
    name: str = ""
    title: str = ""
    icon: str = ""
    description: str = ""
    responsible: str = ""
    not_responsible: str = ""
    lead: str = ""
    roles: tuple = ()

    def role(self, name: str) -> Role:
        found = next((role for role in self.roles if role.name == name), None)
        if not found:
            raise Refused(f"domain {self.name} has no role {name!r}; it has {', '.join(r.name for r in self.roles) or 'none'}")
        return found


@dataclass(frozen=True)
class Organization:
    domains: tuple = ()

    def domain(self, name: str) -> Domain:
        found = next((domain for domain in self.domains if domain.name == name), None)
        if not found:
            raise Refused(f"the organization has no domain {name!r}; it has {', '.join(d.name for d in self.domains) or 'none'}")
        return found

    def shaped(self) -> dict:
        return {"domains": [{**{k: v for k, v in vars(d).items() if k != "roles"}, "roles": [vars(r) for r in d.roles]} for d in self.domains],
                "out": self.text()}

    def text(self) -> str:
        if not self.domains:
            return f"no organization yet: add {FOLDER}/domains/<domain>/domain.toml and roles/<role>/role.toml"
        return "\n".join(f"{d.name}: {d.title or d.name}, led by {d.lead or 'nobody'}\n" + "\n".join(f"  {r.name}: {r.title or r.name} ({r.cardinality})" for r in d.roles)
                         for d in self.domains)


def parsed(path: Path) -> dict:
    try:
        return tomllib.loads(path.read_text())
    except (OSError, tomllib.TOMLDecodeError) as broken:
        raise Refused(f"{path} cannot be read: {broken}")


def role_of(path: Path) -> Role:
    role = Role.from_json({**parsed(path), "name": path.parent.name})
    if role.cardinality not in CARDINALITIES:
        raise Refused(f"{path}: cardinality is one of {', '.join(CARDINALITIES)}, not {role.cardinality!r}")
    return role


def domain_of(path: Path) -> Domain:
    roles = tuple(role_of(found) for found in sorted(path.parent.glob("roles/*/role.toml")))
    domain = replace(Domain.from_json({**parsed(path), "name": path.parent.name}), roles=roles)
    if domain.lead and domain.lead not in {role.name for role in roles}:
        raise Refused(f"{path}: its lead {domain.lead!r} is not one of its roles")
    return domain


def organization(project: Path) -> Organization:
    return Organization(tuple(domain_of(found) for found in sorted((project / FOLDER).glob("domains/*/domain.toml"))))
