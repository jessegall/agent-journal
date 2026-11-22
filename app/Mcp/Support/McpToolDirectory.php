<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Mcp\Tools\JournalTool;
use App\Support\CodeFiles;
use App\Support\Psr4ClassNames;
use App\Support\Reflector;

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
        $code = CodeFiles::ofProcess();
        $names = Psr4ClassNames::fromComposer();
        $tools = [];

        foreach ($code->folder($code->projectPathOf("{$folder}/*.php")) as $entry) {
            if (! $entry->isFile()) {
                continue;
            }

            $class = $names->classOf($entry->fingerprint->realPath);

            if (! Reflector::factory()->isSubclassOf($class, JournalTool::class)
                || Reflector::of($class)->isAbstract()) {
                continue;
            }

            $tools[] = $class;
        }

        return $tools;
    }
}
