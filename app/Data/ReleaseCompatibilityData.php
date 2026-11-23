<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;

/**
 * The journal's answer to a relay before anything else: the journal-agent release it publishes, none while it
 * publishes none.
 */
final class ReleaseCompatibilityData extends Data
{
    public function __construct(
        public readonly string|null $release,
    ) {}
}
