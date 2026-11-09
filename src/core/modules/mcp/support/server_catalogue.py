from engine.errors.refusal import Refusal
from core.modules.mcp.models.enums.server_auth import ServerAuth
from core.modules.mcp.support.server_suggestion import ServerSuggestion

HTTP = "http"
SUGGESTIONS = (
    ServerSuggestion("linear", "Linear", "Issues, projects and cycles in Linear.", transport=HTTP, url="https://mcp.linear.app/mcp", auth=ServerAuth.OAUTH),
    ServerSuggestion("github", "GitHub", "Repositories, issues and pull requests.", command="npx", args=("-y", "@modelcontextprotocol/server-github"),
                     key_variable="GITHUB_PERSONAL_ACCESS_TOKEN", auth=ServerAuth.KEY),
    ServerSuggestion("sentry", "Sentry", "Errors and traces from Sentry.", transport=HTTP, url="https://mcp.sentry.dev/mcp", auth=ServerAuth.OAUTH),
    ServerSuggestion("wispr-flow", "Wispr Flow", "Meetings, notes and transcripts from Wispr Flow.", transport=HTTP, url="https://api.wisprflow.ai/connect/mcp",
                     auth=ServerAuth.OAUTH, has_transcripts=True),
    ServerSuggestion("notion", "Notion", "Pages and databases in Notion.", transport=HTTP, url="https://mcp.notion.com/mcp", auth=ServerAuth.OAUTH),
    ServerSuggestion("slack", "Slack", "Channels and messages in Slack.", command="npx", args=("-y", "@modelcontextprotocol/server-slack"),
                     key_variable="SLACK_BOT_TOKEN", auth=ServerAuth.KEY),
    ServerSuggestion("playwright", "Playwright", "A browser the agent can drive.", command="npx", args=("-y", "@playwright/mcp@latest", "--headless")),
    ServerSuggestion("context7", "Context7", "Up-to-date library documentation.", transport=HTTP, url="https://mcp.context7.com/mcp"),
    ServerSuggestion("figma", "Figma", "Designs and components in Figma.", transport=HTTP, url="https://mcp.figma.com/mcp", auth=ServerAuth.OAUTH),
)


class ServerCatalogue:
    """The MCP servers the Integrations window suggests, by name."""

    def all(self) -> tuple[ServerSuggestion, ...]:
        return SUGGESTIONS

    def with_transcripts(self) -> tuple[ServerSuggestion, ...]:
        return tuple(entry for entry in SUGGESTIONS if entry.has_transcripts)

    def suggestion(self, name: str) -> ServerSuggestion:
        suggestion = next((entry for entry in SUGGESTIONS if entry.name == name), None)
        if suggestion is None:
            raise Refusal(f"no suggested server is named {name}", "journal mcp suggested lists them")
        return suggestion
