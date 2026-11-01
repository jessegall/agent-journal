PROJECT_ENVIRONMENT = 0


class DocumentEnvironment:
    """The version 5 environment of a version 4 document: none for one of the whole project, written as
    environment 0 or no environment in version 4."""

    @staticmethod
    def id(environment_id: int | None) -> int | None:
        return None if environment_id in (None, PROJECT_ENVIRONMENT) else environment_id
