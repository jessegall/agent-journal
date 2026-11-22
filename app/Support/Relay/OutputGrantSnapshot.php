<?php

declare(strict_types=1);

namespace App\Support\Relay;

use Spatie\LaravelData\Data;

/**
 * The output grants file the host writes for a start: its generation, the granted paths and the seal over both.
 */
final class OutputGrantSnapshot extends Data
{
    /**
     * @param  list<mixed>  $paths
     */
    public function __construct(
        public readonly int $generation,
        public readonly array $paths,
        public readonly string $seal,
    ) {}

    /**
     * The granted paths that are text.
     *
     * @return list<string>
     */
    public function textPaths(): array
    {
        return array_values(array_filter($this->paths, is_string(...)));
    }
}
