from core.modules.plugins.support.login_path import LoginPath


class StoryLoginPath(LoginPath):
    """A story that is not about the login path starts no login shell."""

    @staticmethod
    def shell_path() -> str:
        return ""
