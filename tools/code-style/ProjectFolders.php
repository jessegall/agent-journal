<?php

declare(strict_types=1);

namespace Tools\CodeStyle;

use SplFileInfo;

/**
 * The project folders a fixer applies to, as the check it replaced read them; the samples under tests/Fixtures keep
 * the faults they show unless a fixer names them.
 */
final readonly class ProjectFolders
{
    /**
     * @param  list<string>  $folders  relative to the project root
     */
    public function __construct(private array $folders) {}

    public function holds(SplFileInfo $file): bool
    {
        $root = dirname(__DIR__, 2).'/';
        $path = $file->getRealPath() ?: $file->getPathname();
        $relative = str_starts_with($path, $root) ? substr($path, strlen($root)) : $path;
        $isSample = str_starts_with($relative, 'tests/Fixtures/');

        return array_any(
            $this->folders,
            fn (string $folder) => str_starts_with($relative, "{$folder}/")
                && (! $isSample || str_starts_with($folder, 'tests/Fixtures')),
        );
    }
}
