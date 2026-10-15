from journal.features.mcp.suggestion import Suggestion

SUGGESTED = (
    Suggestion("linear", "Linear", "Issues, projects and cycles in Linear.", transport="http", url="https://mcp.linear.app/mcp", auth="oauth"),
    Suggestion("github", "GitHub", "Repositories, issues and pull requests.", command="npx", args=("-y", "@modelcontextprotocol/server-github"), key_var="GITHUB_PERSONAL_ACCESS_TOKEN", auth="key"),
    Suggestion("sentry", "Sentry", "Errors and traces from Sentry.", transport="http", url="https://mcp.sentry.dev/mcp", auth="oauth"),
    Suggestion("notion", "Notion", "Pages and databases in Notion.", transport="http", url="https://mcp.notion.com/mcp", auth="oauth"),
    Suggestion("slack", "Slack", "Channels and messages in Slack.", command="npx", args=("-y", "@modelcontextprotocol/server-slack"), key_var="SLACK_BOT_TOKEN", auth="key"),
    Suggestion("playwright", "Playwright", "A browser the agent can drive.", command="npx", args=("-y", "@playwright/mcp@latest", "--headless")),
    Suggestion("context7", "Context7", "Up-to-date library documentation.", transport="http", url="https://mcp.context7.com/mcp"),
    Suggestion("figma", "Figma", "Designs and components in Figma.", transport="http", url="https://mcp.figma.com/mcp", auth="oauth"),
)


class Catalogue:
    """The servers suggested on the integrations page, by name."""

    def all(self) -> tuple[Suggestion, ...]:
        return SUGGESTED

    def named(self, name: str) -> Suggestion:
        return next(s for s in SUGGESTED if s.name == name)
