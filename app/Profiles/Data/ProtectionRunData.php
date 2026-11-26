<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use Spatie\LaravelData\Data;

/**
 * One recorded run that showed a boundary item hold for a driver's build on a platform of a host.
 */
final class ProtectionRunData extends Data
{
    public function __construct(
        public readonly string $key,
        public readonly string $item,
        public readonly string $run,
    ) {}
}
