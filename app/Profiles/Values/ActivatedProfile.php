<?php

declare(strict_types=1);

namespace App\Profiles\Values;

/**
 * A profile an activation reached, with the revision number it appended.
 */
final readonly class ActivatedProfile
{
    public function __construct(
        public ProfileKey $key,
        public int $revision,
    ) {}
}
