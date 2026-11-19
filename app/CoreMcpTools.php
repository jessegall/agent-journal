<?php

declare(strict_types=1);

namespace App;

use App\Autoload\Support\FolderClasses;
use App\Mcp\Contracts\McpRegistration;
use App\Mcp\Resources\JournalResource;
use App\Mcp\Resources\OverviewResource;
use App\Mcp\Tools\CapabilitiesReadTool;
use App\Mcp\Tools\JournalTool;
use App\Mcp\Tools\OverviewReadTool;

/**
 * Core's own MCP tools and resources, added to the catalogue before the domains'.
 */
final class CoreMcpTools
{
    /**
     * The tools an agent should read first, listed before every other tool.
     */
    private const array ORIENTATION_TOOLS = [OverviewReadTool::class, CapabilitiesReadTool::class];

    /**
     * The resource an agent should read first, listed before every other resource.
     */
    private const array ORIENTATION_RESOURCES = [OverviewResource::class];

    /**
     * @return list<class-string<JournalTool>>
     */
    public static function tools(): array
    {
        $found = [
            ...FolderClasses::in(__DIR__.'/Mcp/Tools', JournalTool::class),
            ...FolderClasses::in(__DIR__.'/*/Mcp', JournalTool::class),
        ];

        return [...self::ORIENTATION_TOOLS, ...array_values(array_diff($found, self::ORIENTATION_TOOLS))];
    }

    /**
     * @return list<class-string<JournalResource>>
     */
    public static function resources(): array
    {
        $found = FolderClasses::in(__DIR__.'/Mcp/Resources', JournalResource::class);

        return [...self::ORIENTATION_RESOURCES, ...array_values(array_diff($found, self::ORIENTATION_RESOURCES))];
    }

    public static function registerIn(McpRegistration $registration): void
    {
        foreach (self::tools() as $tool) {
            $registration->registerTool($tool);
        }

        foreach (self::resources() as $resource) {
            $registration->registerResource($resource);
        }
    }
}
