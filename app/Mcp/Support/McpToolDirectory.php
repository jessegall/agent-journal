<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Autoload\Support\Psr4ClassNames;
use App\Files\Support\CodeFiles;
use App\Mcp\Tools\JournalTool;
use App\Reflection\Support\Reflector;

/**
 * Discovers concrete tools in a domain's MCP directory in filename order; a missing directory holds none.
 */
final readonly class McpToolDirectory
{
    /**
     * The packages whose MCP classes still sit flat in src/Mcp. Each leaves this list in the batch that moves it
     * to src/Mcp/Tools and src/Mcp/Resources (plan 62 phase 5), and the list and the flat reading go when it is empty.
     */
    public const array FLAT_ROOT_OWNERS = [
        'Access',
        'Chat',
        'Documents',
        'Helpers',
        'Memory',
        'Plans',
        'Reminders',
        'Rules',
        'Sequences',
        'Tasks',
    ];

    /**
     * The folder a package's MCP classes of one role are read from: src/Mcp/<role>, or src/Mcp while the package is
     * still a flat owner.
     */
    public static function rootOf(string $sourceFolder, string $packageName, string $role): string
    {
        if (in_array($packageName, self::FLAT_ROOT_OWNERS, true)) {
            return "{$sourceFolder}/Mcp";
        }

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
