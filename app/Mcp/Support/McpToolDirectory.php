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

            if (! is_subclass_of($class, JournalTool::class) || Reflector::of($class)->isAbstract()) {
                continue;
            }

            $tools[] = $class;
        }

        return $tools;
    }
}
