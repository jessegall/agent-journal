<?php

declare(strict_types=1);

namespace App;

use App\Mcp\Contracts\McpRegistration;
use App\Mcp\Resources\JournalResource;
use App\Mcp\Resources\OverviewResource;
use App\Mcp\Tools\CapabilitiesReadTool;
use App\Mcp\Tools\JournalTool;
use App\Mcp\Tools\OverviewReadTool;
use App\Mcp\Tools\SearchTool;
use App\Support\ProjectCode;

/**
 * Core's own MCP tools and resources, added to the catalogue before the domains'.
 */
final class CoreMcpTools
{
    /**
     * The tools an agent should read first, listed before every other tool.
     */
    private const array ORIENTATION_TOOLS = [
        OverviewReadTool::class,
        CapabilitiesReadTool::class,
        SearchTool::class,
    ];

    /**
     * The resource an agent should read first, listed before every other resource.
     */
    private const array ORIENTATION_RESOURCES = [OverviewResource::class];

    /**
     * @return list<class-string<JournalTool>>
     */
    public static function tools(): array
    {
        return self::orientationFirst(ProjectCode::in(__DIR__.'/Mcp/Tools', JournalTool::class), self::ORIENTATION_TOOLS);
    }

    /**
     * @return list<class-string<JournalResource>>
     */
    public static function resources(): array
    {
        $found = ProjectCode::in(__DIR__.'/Mcp/Resources', JournalResource::class);

        return self::orientationFirst($found, self::ORIENTATION_RESOURCES);
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

    /**
     * The classes found, the orientation ones first in their own order.
     *
     * @template T of object
     *
     * @param  list<class-string<T>>  $found
     * @param  list<class-string<T>>  $orientation
     * @return list<class-string<T>>
     */
    private static function orientationFirst(array $found, array $orientation): array
    {
        return [
            ...$orientation,
            ...array_values(array_diff($found, $orientation)),
        ];
    }
}
