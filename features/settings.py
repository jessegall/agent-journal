from features.text import paragraphs


class Setting:
    def __init__(self, name: str, default, title: str, abstract: str = "", unit: str = ""):
        self.name, self.default, self.title, self.abstract, self.unit = name, default, paragraphs(title), paragraphs(abstract), unit

    def kind(self) -> str:
        return "switch" if isinstance(self.default, bool) else "number" if isinstance(self.default, (int, float)) else "text"

    def describe(self) -> dict:
        return {"name": self.name, "title": self.title, "abstract": self.abstract, "default": self.default, "unit": self.unit, "kind": self.kind()}


class Settings(dict):
    def __init__(self, declared: list[Setting], saved: dict):
        super().__init__({**{s.name: s.default for s in declared}, **saved})

    def __getattr__(self, name: str):
        try:
            return self[name]
        except KeyError:
            raise AttributeError(f"no setting called {name}")
