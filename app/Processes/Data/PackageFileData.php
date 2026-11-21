<?php

declare(strict_types=1);

namespace App\Processes\Data;

use Spatie\LaravelData\Data;

/**
 * A composer.json or package.json, the scripts it names: each a line or a list of lines.
 */
final class PackageFileData extends Data
{
    /**
     * @param  array<string, string|list<string>>  $scripts
     */
    public function __construct(public readonly array $scripts = []) {}

    /**
     * The lines the named script runs, none when the file names no such script.
     *
     * @return list<string>
     */
    public function linesOf(string $name): array
    {
        if (! array_key_exists($name, $this->scripts)) {
            return [];
        }

        return array_map(strval(...), (array) $this->scripts[$name]);
    }
}
