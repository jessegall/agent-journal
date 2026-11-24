<?php

declare(strict_types=1);

namespace App\Data\Images;

use Spatie\LaravelData\Data;

/**
 * One package a lock file pins: its name, when the lock names it, and the version installed.
 */
final class LockedPackageData extends Data
{
    public function __construct(
        public readonly string $version = '',
        public readonly string $name = '',
    ) {}
}
