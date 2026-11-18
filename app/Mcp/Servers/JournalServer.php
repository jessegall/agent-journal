<?php

declare(strict_types=1);

namespace App\Mcp\Servers;

use App\Mcp\Methods\ListToolsAndRecordReadiness;
use App\Mcp\Support\McpCatalogue;
use Laravel\Mcp\Server;
use Laravel\Mcp\Server\Attributes\Instructions;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Version;
use Laravel\Mcp\Server\Contracts\Transport;

/**
 * The journal's one MCP server: tools and resources only, both with a list that never changes during a connection,
 * taken from the catalogue Core and the domains fill. Its tools/list records the caller's tool discovery.
 */
#[Name('journal')]
#[Version('1.0.0')]
#[Instructions('Use overview_read first. Journal tools act as your launched agent and session. Use ToolSearch for the named task, plan, assignment, message, memory, rule, document or report operation you need. Follow returned next_action arguments exactly. Keep request_key when retrying a write and use operations_read when its outcome is unknown. Resource references are optional; use read tools if resources are unavailable. A refusal names permitted recovery; tool discovery grants no authority.')]
final class JournalServer extends Server
{
    public const string PATH = '/agent/mcp/v1';

    /**
     * Twenty tool definitions keep one tools/list page under 16 KiB, so a client may not ask for more.
     */
    public int $maxPaginationLength = 20;

    public int $defaultPaginationLength = 20;

    protected array $capabilities = [
        self::CAPABILITY_TOOLS => ['listChanged' => false],
        self::CAPABILITY_RESOURCES => ['listChanged' => false],
    ];

    public function __construct(Transport $transport, private readonly McpCatalogue $catalogue)
    {
        parent::__construct($transport);
    }

    protected function boot(): void
    {
        $this->tools = $this->catalogue->toolClasses();
        $this->resources = $this->catalogue->resourceClasses();
        $this->addMethod('tools/list', ListToolsAndRecordReadiness::class);
    }
}
