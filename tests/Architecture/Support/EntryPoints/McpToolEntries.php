<?php

declare(strict_types=1);

namespace Tests\Architecture\Support\EntryPoints;

use App\Mcp\Support\McpCatalogue;

/**
 * Every MCP tool of core and of the booted domains, each tested in the MCP folder of core or of its domain.
 */
final readonly class McpToolEntries
{
    public function __construct(private McpCatalogue $catalogue) {}

    /**
     * @return list<EntryPoint>
     */
    public function entries(): array
    {
        return array_map(
            fn (string $tool) => new EntryPoint(
                EntryType::McpTool,
                $tool,
                EntryPoint::folderOf($tool, EntryType::McpTool),
            ),
            $this->catalogue->toolClasses(),
        );
    }
}
