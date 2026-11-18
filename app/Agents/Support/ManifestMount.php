<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * One host folder a helper container sees: where it comes from, where it appears and whether it may be written.
 */
final readonly class ManifestMount
{
    public function __construct(
        public string $source,
        public string $target,
        public bool $writable,
    ) {}
}
