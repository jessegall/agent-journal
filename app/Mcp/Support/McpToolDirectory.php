<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Autoload\Support\Psr4ClassNames;
use App\Mcp\Tools\JournalTool;
use ReflectionClass;
use Symfony\Component\Finder\Finder;

/**
 * Discovers concrete tools in a domain's MCP directory in filename order.
 */
final readonly class McpToolDirectory
{
    /**
     * @return list<class-string<JournalTool>>
     */
    public static function classesIn(string $folder): array
    {
        if (! is_dir($folder)) {
            return [];
        }

        $files = Finder::create()->files()->in($folder)->depth(0)->name('*.php')->sortByName();
        $names = Psr4ClassNames::fromComposer();
        $tools = [];

        foreach ($files as $file) {
            $class = $names->classOf((string) $file->getRealPath());

            if (! is_subclass_of($class, JournalTool::class) || new ReflectionClass($class)->isAbstract()) {
                continue;
            }

            $tools[] = $class;
        }

        return $tools;
    }
}
