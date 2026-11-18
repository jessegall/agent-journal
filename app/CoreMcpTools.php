<?php

declare(strict_types=1);

namespace App;

use App\Mcp\Contracts\McpRegistration;
use App\Mcp\Resources\JournalResource;
use App\Mcp\Resources\OverviewResource;
use App\Mcp\Tools\AssigneesListTool;
use App\Mcp\Tools\AssignmentReadTool;
use App\Mcp\Tools\CapabilitiesReadTool;
use App\Mcp\Tools\JournalTool;
use App\Mcp\Tools\OverviewReadTool;

/**
 * Core's own MCP tools and resources, added to the catalogue before the domains'.
 */
final class CoreMcpTools
{
    /**
     * @return list<class-string<JournalTool>>
     */
    public static function tools(): array
    {
        return [OverviewReadTool::class, CapabilitiesReadTool::class, AssignmentReadTool::class, AssigneesListTool::class];
    }

    /**
     * @return list<class-string<JournalResource>>
     */
    public static function resources(): array
    {
        return [OverviewResource::class];
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
