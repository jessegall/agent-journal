from resources.text import paragraphs


class Setting:
    def __init__(self, name: str, default, title: str, abstract: str = "", unit: str = "", choices: dict[str, str] | None = None):
        self.name, self.default, self.title, self.abstract, self.unit = name, default, paragraphs(title), paragraphs(abstract), unit
        self.choices = choices or {}

    def kind(self) -> str:
        if self.choices:
            return "choice"
        if isinstance(self.default, bool):
            return "switch"
        if isinstance(self.default, (int, float)):
            return "number"
        return "map" if isinstance(self.default, dict) else "text"

    def describe(self) -> dict:
        return {"name": self.name, "title": self.title, "abstract": self.abstract, "default": self.default, "unit": self.unit, "kind": self.kind(),
                "choices": [{"key": key, "label": label} for key, label in self.choices.items()]}

    def allows(self, value) -> bool:
        return not self.choices or value in self.choices


class Settings(dict):
    def __init__(self, declared: list[Setting], saved: dict):
        saved = {name: value for name, value in saved.items() if all(s.allows(value) for s in declared if s.name == name)}
        merged = {s.name: {**s.default, **saved[s.name]} for s in declared if isinstance(s.default, dict) and isinstance(saved.get(s.name), dict)}
        super().__init__({**{s.name: s.default for s in declared}, **saved, **merged})

    def __getattr__(self, name: str):
        try:
            return self[name]
        except KeyError as error:
            raise AttributeError(f"no setting called {name}") from error
