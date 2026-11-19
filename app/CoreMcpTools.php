<?php

declare(strict_types=1);

namespace App;

use App\Autoload\Support\FolderClasses;
use App\Mcp\Contracts\McpRegistration;
use App\Mcp\Resources\JournalResource;
use App\Mcp\Tools\JournalTool;

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
        return [
            ...FolderClasses::in(__DIR__.'/Mcp/Tools', JournalTool::class),
            ...FolderClasses::in(__DIR__.'/*/Mcp', JournalTool::class),
        ];
    }

    /**
     * @return list<class-string<JournalResource>>
     */
    public static function resources(): array
    {
        return FolderClasses::in(__DIR__.'/Mcp/Resources', JournalResource::class);
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
