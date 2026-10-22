from journal.models.template import Template
from journal.repositories.repository import Repository


class Templates(Repository[Template]):
    model = Template

    def testing(self) -> list[Template]:
        from journal.features.templates.shipped import TESTING
        return self.matching(purpose=TESTING)

    def testing_titled(self, title: str) -> list[Template]:
        from journal.features.templates.shipped import TESTING
        return self.matching(purpose=TESTING, title=title)
