<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Mcp\Tools\JournalTool;
use App\Support\FolderClasses;

/**
 * Discovers concrete tools in a domain's MCP directory in filename order; a missing directory holds none.
 */
final readonly class McpToolDirectory
{
    /**
     * The folder a package's MCP classes of one role, Tools or Resources, are read from.
     */
    public static function rootOf(string $sourceFolder, string $role): string
    {
        return "{$sourceFolder}/Mcp/{$role}";
    }

    /**
     * @return list<class-string<JournalTool>>
     */
    public static function classesIn(string $folder): array
    {
        return FolderClasses::in($folder, JournalTool::class);
    }
}
