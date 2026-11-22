<?php

declare(strict_types=1);

namespace App\Hooks\Inputs;

/**
 * The files a native read, list or search tool names, as absolute paths with every . and .. resolved against the
 * driver's work folder, so an alias of a protected folder is seen as the folder itself.
 */
final readonly class ProtectedFileRead
{
    /**
     * @param  list<string>  $paths
     */
    public function __construct(public array $paths) {}

    /**
     * @param  list<string>  $namedPaths
     */
    public static function inFolder(string $workFolder, array $namedPaths): self
    {
        return new self(array_map(fn (string $path) => self::resolve($workFolder, $path), $namedPaths));
    }

    /**
     * The absolute path a tool's path names from the work folder, with . and .. resolved.
     */
    public static function resolve(string $workFolder, string $path): string
    {
        $full = str_starts_with($path, '/') ? $path : rtrim($workFolder, '/').'/'.$path;
        $parts = [];

        foreach (explode('/', $full) as $part) {
            match ($part) {
                '', '.' => null,
                '..' => array_pop($parts),
                default => $parts[] = $part,
            };
        }

        return '/'.implode('/', $parts);
    }

    /**
     * The folder a search pattern starts from: the part of it before its first wildcard, under the searched folder.
     */
    public static function patternFolder(string $searchFolder, string $pattern): string
    {
        $wildcard = strcspn($pattern, '*?[{');
        $fixed = substr($pattern, 0, $wildcard);
        $folder = str_contains($fixed, '/') ? substr($fixed, 0, (int) strrpos($fixed, '/')) : '';

        if (! str_starts_with($pattern, '/')) {
            return rtrim($searchFolder, '/').'/'.$folder;
        }

        return $folder === '' ? '/' : $folder;
    }
}
