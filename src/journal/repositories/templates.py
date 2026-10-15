from journal.models.template import Template
from journal.repositories.repository import Repository


class Templates(Repository[Template]):
    model = Template
