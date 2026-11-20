<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Enums\ProfileChangeType;

/**
 * A profile an activation reached, with the revision number it appended and how it differs from the revision that was
 * active before.
 */
final readonly class ActivatedProfile
{
    /** @param list<SupervisorCoverage> $supervisorCoverage */
    public function __construct(
        public ProfileKey $key,
        public int $revision,
        public ProfileChangeType $change,
        public array $supervisorCoverage = [],
    ) {}
}
