<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\ProgramSourceType;

/**
 * Where a launch's program came from, and the profile and its revision when one took part; a main agent with an
 * explicit program has no profile.
 */
final readonly class SelectionSource
{
    public function __construct(
        public ProgramSourceType $programSource,
        public string|null $profileKey,
        public int|null $profileRevision,
    ) {}
}
