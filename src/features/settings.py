from engine.text import paragraphs


class Setting:
    def __init__(self, name: str, default, title: str, abstract: str = "", unit: str = ""):
        self.name, self.default, self.title, self.abstract, self.unit = name, default, paragraphs(title), paragraphs(abstract), unit

    def kind(self) -> str:
        return "switch" if isinstance(self.default, bool) else "number" if isinstance(self.default, (int, float)) else "map" if isinstance(self.default, dict) else "text"

    def describe(self) -> dict:
        return {"name": self.name, "title": self.title, "abstract": self.abstract, "default": self.default, "unit": self.unit, "kind": self.kind()}


class Settings(dict):
    def __init__(self, declared: list[Setting], saved: dict):
        merged = {s.name: {**s.default, **saved[s.name]} for s in declared if isinstance(s.default, dict) and isinstance(saved.get(s.name), dict)}
        super().__init__({**{s.name: s.default for s in declared}, **saved, **merged})

    def __getattr__(self, name: str):
        try:
            return self[name]
        except KeyError as error:
            raise AttributeError(f"no setting called {name}") from error
